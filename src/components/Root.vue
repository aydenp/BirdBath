<template>
    <div id="app">
        <archive-viewer v-if="dataManager.isLoaded"></archive-viewer>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ArchiveViewer from "./ArchiveViewer.vue";
import { DataManager } from "../util/DataManager";

@Component({
    components: { ArchiveViewer }
})
export default class Root extends Vue {
    dataManager = DataManager;
}
</script>
