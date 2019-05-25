<template>
    <div class="tweet">
        <div class="header" v-if="tweet.retweeted_status">
            <span><i class="fas fa-retweet fa-fw"></i> Retweeted from:</span>
            <a :href="getUserURL(tweet.retweeted_status.user.screen_name)" target="_blank">
                <img :src="tweet.retweeted_status.user.profile_image_url_https" width="36" height="36" />
                <div class="user-info">
                    <span class="name">{{ tweet.retweeted_status.user.name }}</span>
                    <span class="handle">@{{ tweet.retweeted_status.user.screen_name }}</span>
                </div>
            </a>
        </div>
        <div class="header" v-if="tweet.in_reply_to_screen_name">
            <span><i class="fas fa-comment fa-fw"></i> In reply to <a :href="getUserURL(tweet.in_reply_to_screen_name)" target="_blank" class="link">{{ tweet.in_reply_to_screen_name }}</a></span>
        </div>
        <span class="text">{{ displayText }}</span>
        <div class="media" v-if="actualTweet.entities.media.length > 0">
            <a v-for="media of actualTweet.entities.media" :key="media.id" :href="media.expanded_url">
                <img :src="media.media_url_https" :alt="media.media_alt" />
            </a>
        </div>
        <div class="info">
            <span><a :href="url" class="link" target="_blank" ref="openLink" title="Open tweet in Twitter (O)">Open in Twitter <i class="fas fa-external-link-alt fa-fw"></i></a></span>
            <span><span v-if="tweet.retweeted_status"><strong>Original:</strong>&nbsp;{{ tweet.retweeted_status.created_at | date("MM/DD/YYYY, h:mm:ss A") }}<br><strong>Retweeted:</strong>&nbsp;</span>{{ tweet.created_at | date("MM/DD/YYYY, h:mm:ss A") }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TWITTER_BASE } from "../Constants";

@Component
export default class Tweet extends Vue {
    @Prop()
    tweet: object;

    openInTwitter() {
        this.$refs.openLink.click();
    }

    get actualTweet() {
        return this.tweet && this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet;
    }

    get displayText() {
        var text = this.actualTweet.text;
        for (var media of this.actualTweet.entities.media) text = text.replace(media.url, "");
        return text;
    }
 
    get url() {
        return `${this.getUserURL(this.tweet.user.screen_name)}/status/${this.tweet.id_str}`;
    }

    getUserURL(username: string) {
        return TWITTER_BASE + "/" + username;
    }
}
</script>