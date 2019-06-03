<template>
    <main @keydown.88="deleteTweet" @keydown.78="advanceToNextTweet">
        <div class="account-bar">
            <div class="item">
                <span class="name">Tweet Archive</span>
                <span class="subtitle">Created {{ dataManager.payloadDetails.created_at | date("MM/DD/YYYY") }}</span>
            </div>
            <div class="bar-ctn">
                <progress-bar :value="index" :max="dataManager.tweets.length"></progress-bar>
            </div>
            <div class="item right">
                <span class="name">{{ dataManager.userDetails.full_name }}</span>
                <span class="subtitle">@{{ dataManager.userDetails.screen_name }}</span>
                <a href="/auth/sign-out">Sign out</a>
            </div>
        </div>
        <transition name="fade">
            <div class="tweet-ctn" v-if="!isDeleting">
                <div v-if="currentTweet">
                    <tweet :tweet="currentTweet" ref="currentTweet"></tweet>
                    <div class='actions'>
                        <a @click="returnToPreviousTweet" href="javascript:void(0)" title="Previous (Z)" v-if="index > 0">
                            <i class="fas fa-arrow-left"></i>
                        </a>
                        <a @click="deleteTweet" class="delete" href="javascript:void(0)" title="Delete (X)">
                            <i class="fas fa-trash"></i>
                        </a>
                        <a @click="advanceToNextTweet" href="javascript:void(0)" title="Next (N)">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                    <div class="key-tip" v-if="!hasUsedKeys && index < 5"><strong>Tip:</strong> Type <strong>X</strong> to quickly queue a tweet for deletion, and <strong>N</strong> to advance to the next tweet.</div>
                </div>
                <div v-else>No Tweets to Delete</div>
            </div>
        </transition>
        <transition name="fade">
            <div :class="{ 'delete-popper': true, disabled: isDeleting }" v-if="queueSize > 0" @click="deleteClicked">
                <i class="fas fa-trash fa-fw"></i>
                <div class="text">
                    <span class="title">{{ queueSize.toLocaleString() }} Tweet{{ queueSize == 1 ? "" : "s" }}</span>
                    <span class="subtitle" v-if="isDeleting">{{ queueSize == 1 ? "is" : "are" }} being deleted</span>
                    <span class="subtitle" v-else>to delete</span>
                </div>
                <i class="chevron fas fa-spinner fa-spin fa-fw" v-if="isDeleting"></i>
                <i class="chevron fas fa-chevron-right fa-fw" v-else></i>
            </div>
        </transition>
    </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ProgressBar from "./ProgressBar.vue"
import Tweet from "./Tweet.vue"
import { DataManager } from "../util/DataManager";
import { TwitterAPI } from "../util/TwitterAPI";
import { AppState } from "../stores";

@Component({
    components: { ProgressBar, Tweet }
})
export default class ArchiveViewer extends Vue {
    dataManager = DataManager;
    index = 0;
    isDeleting = false;
    hasUsedKeys = false;

    created() {
        window.addEventListener("keydown", this.handleKeyDown);
        AppState.dispatch("setupWithAccount", DataManager.userDetails);
        const restoreTweetID = AppState.getters.lastLoadedTweetID;
        if (restoreTweetID) {
            const index = DataManager.tweets.findIndex((t) => t.id_str == restoreTweetID);
            if (index >= 0) this.index = index;
        }
    }

    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    @Watch("index")
    onTweetChange() {
        AppState.commit("recordView", this.currentTweet.id_str);
        console.log(this.currentTweet);
    }

    handleKeyDown(e: KeyboardEvent) {
        switch (e.keyCode) {
        case 78: // N
        case 32: // Space
        case 39: // Right arrow
        case 40: // Down arrow
        case 13: // Enter
            this.hasUsedKeys = true;
            this.advanceToNextTweet();
            break;
        case 88: // X
        case 68: // D
        case 46: // Delete
        case 8: // Backspace
            this.hasUsedKeys = true;
            this.deleteTweet();
            break;
        case 90: // Z
        case 37: // Left arrow
        case 38: // Up arrow
            this.hasUsedKeys = true;
            this.returnToPreviousTweet();
            break;
        case 79: // O
            this.hasUsedKeys = true;
            this.$refs.currentTweet.openInTwitter();
            break;
        }
    }

    get currentTweet() {
        return this.dataManager.tweets[this.index];
    }

    deleteTweet() {
        AppState.commit("queue", this.currentTweet.id_str);
        this.index++;
    }

    advanceToNextTweet() {
        this.index++;
    }

    returnToPreviousTweet() {
        if (this.index <= 0) return;
        this.index--;
        AppState.commit("dequeue", this.currentTweet.id_str);
    }

    async deleteClicked() {
        if (this.isDeleting || !window.confirm("Are you sure you want to delete these tweets? This cannot be undone.")) return;
        this.isDeleting = true;
        for (const id of AppState.getters.deletionQueue) {
            try {
                if (await TwitterAPI.deleteTweet(id)) AppState.commit("dequeue", id);
            } catch (e) {
                console.error("Could not delete tweet!", e);
            }
        }
        if (this.queueSize > 0) window.alert("Some items could not be deleted. They remain in the queue.");
        this.isDeleting = false;
    }

    get queueSize() {
        return AppState.getters.deletionQueueCount;
    }
}
</script>
