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
            </div>
        </div>
        <transition name="fade">
            <div class="tweet-ctn" v-if="!isDeleting">
                <div v-if="currentTweet">
                    <tweet :tweet="currentTweet" ref="currentTweet"></tweet>
                    <div class='actions'>
                        <a @click="deleteTweet" class="delete" href="javascript:void(0)" title="Delete (X)">
                            <i class="fas fa-trash"></i>
                        </a>
                        <a @click="advanceToNextTweet" href="javascript:void(0)" title="Next (N)">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
                <div v-else>No Tweets to Delete</div>
            </div>
        </transition>
        <transition name="fade">
            <div :class="{ 'delete-popper': true, disabled: isDeleting }" v-if="toDelete.size > 0" @click="deleteClicked">
                <i class="fas fa-trash fa-fw"></i>
                <div class="text">
                    <span class="title">{{ toDelete.size.toLocaleString() }} Tweet{{ toDelete.size == 1 ? "" : "s" }}</span>
                    <span class="subtitle" v-if="isDeleting">{{ toDelete.size == 1 ? "is" : "are" }} being deleted</span>
                    <span class="subtitle" v-else>to delete</span>
                </div>
                <i class="chevron fas fa-spinner fa-spin fa-fw" v-if="isDeleting"></i>
                <i class="chevron fas fa-chevron-right fa-fw" v-else></i>
            </div>
        </transition>
    </main>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ProgressBar from "./ProgressBar.vue"
import Tweet from "./Tweet.vue"
import { DataManager } from "../util/DataManager";
import { TwitterAPI } from "../util/TwitterAPI";

@Component({
    components: { ProgressBar, Tweet }
})
export default class ArchiveViewer extends Vue {
    dataManager = DataManager;
    index = 0;
    toDelete = new Set<string>();
    isDeleting = false;

    created() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown(e: KeyboardEvent) {
        switch (e.keyCode) {
        case 78: // N
        case 32: // Space
        case 39: // Right arrow
        case 40: // Down arrow
        case 13: // Enter
            this.advanceToNextTweet();
            break;
        case 88: // X
        case 68: // D
        case 46: // Delete
        case 8: // Backspace
            this.deleteTweet();
            break;
        case 79: // O
            this.$refs.currentTweet.openInTwitter();
            break;
        }
    }

    get currentTweet() {
        return this.dataManager.tweets[this.index];
    }

    deleteTweet() {
        this.toDelete.add(this.currentTweet.id_str);
        this.index++;
    }

    advanceToNextTweet() {
        this.index++;
    }

    async deleteClicked() {
        if (this.isDeleting || !window.confirm("Are you sure you want to delete these tweets? This cannot be undone.")) return;
        this.isDeleting = true;
        for (const id of this.toDelete) {
            if (await TwitterAPI.deleteTweet(id)) this.toDelete.delete(id);
        }
        if (this.toDelete.size > 0) window.alert("Some items could not be deleted. They have remained in the queue.");
        this.isDeleting = false;
    }
}
</script>
