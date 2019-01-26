<template>
    <div id="app">
        <transition name="fade">
            <div class="loading" v-if="loading || (!dataManager.isLoaded && dataManager.hasStarted)">
                <i class="fas fa-spinner fa-spin fa-fw"></i>
            </div>
            <div class="container setup-task" v-else-if="!isSignedIn"><div>
                <h1>Get started</h1>
                <p>CleanBird helps you review and clean up your old tweets. Sign in to your Twitter account to get started.</p>
                <a href="/auth/twitter" class="btn"><i class="fab fa-twitter fa-fw"></i> Sign in with Twitter</a>
            </div></div>
            <div class="container setup-task" v-else-if="!dataManager.hasStarted"><div>
                <h1>Your archive</h1>
                <p>
                    CleanBird works by sifting through the tweets in a Tweet archive, which contains everything you've tweeted.<br>
                    Don't have one? <a href="https://twitter.com/settings/account" target="_blank">Download one from Twitter here</a> by choosing <em>Your Tweet Archive: Request your archive</em>.<br>
                    <strong>Note:</strong> This is different from a Twitter archive, which contains all of your account data. A Tweet archive simply contains everything you've tweeted.<br><br>
                    <small>This file will be opened and scanned in your browser. It is never uploaded to any server.</small>
                </p>
                <input type="file" ref="file" @change="selectedFile" />
            </div></div>
            <div class="container setup-task" v-else-if="dataManager.userDetails.id != userID"><div>
                <h1>Oh no!</h1>
                <p>It seems that you provided a Tweet archive for a different account than the currently logged in one.</p>
                <a @click="dataManager.removeData()" href="javascript:void(0)" class="btn"><i class="fas fa-undo fa-fw"></i> Select Another Archive</a>
            </div></div>
            <archive-viewer v-else-if="dataManager.isLoaded"></archive-viewer>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ArchiveViewer from "./ArchiveViewer.vue";
import { DataManager } from "../util/DataManager";
import { TwitterAPI } from "../util/TwitterAPI";

@Component({
    components: { ArchiveViewer }
})
export default class Root extends Vue {
    dataManager = DataManager;
    loading = false;
    userID: string | null = null;

    created() {
        this.fetchUserDetails();
    }

    async fetchUserDetails() {
        this.loading = true;
        try {
            this.userID = await TwitterAPI.getTwitterUserID();
        } finally {
            this.loading = false;
        }
    }

    get isSignedIn() {
        return !!this.userID;
    }

    private selectedFile(e) {
        e.preventDefault();
        e.stopPropagation();
        const input = <HTMLInputElement>this.$refs.file;
        if (!input.files || !input.files[0]) return;
        if (input.files[0].type == "application/zip") {
            var reader = new FileReader();
            reader.readAsArrayBuffer(input.files[0]);
            reader.onloadend = () => this.loadArchive(reader.result);
        } else {
            window.alert("The provided file was not a ZIP archive. CleanBird only works with Tweet archives.")
        }
        input.value = input.defaultValue;
    }

    async loadArchive(data) {
        try {
            await this.dataManager.loadData(data);
        } catch (e) {
            console.error(e);
            window.alert("The provided file could not be read.");
            this.dataManager.removeData();
        }
    }
}
</script>
