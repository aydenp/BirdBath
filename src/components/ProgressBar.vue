<template>
    <div class="bar-inner">
        <div class="bar">
            <div class="active" :style="{ width: barWidth }"></div>
        </div>
        <div class="text">
            <span>{{ value.toLocaleString() }}</span>
            <span>{{ max.toLocaleString() }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ProgressBar extends Vue {
    @Prop()
    value: number;

    @Prop()
    max: number;

    get barWidth() {
        return `${this.value / this.max * 100}%`;
    }
}
</script>

<style lang="scss">
.bar-inner {
    .bar {
        display: block;
        background: rgba(255, 255, 255, 0.1);
        position: relative;

        &, .active {
            height: 6px;
            border-radius: 3px;
        }

        .active {
            width: 50%;
            background: #fff;
        }
    }

    .text {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        margin-top: 6px;
        font-weight: 600;

        span:last-child {
            font-weight: 400;
            color: rgba(255, 255, 255, 0.4);
            float: right;
            text-align: right;
        }
    }
}
</style>
