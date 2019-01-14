import axios from "axios";

window.Grailbird = {
    data: {}
};

class _DataManager {
    public userDetails: any = null;
    public payloadDetails: any = null;
    public tweets: any = null;
    private blacklistIDs = new Set<string>();

    loadData() {
        this.loadScript("/data/js/user_details.js", () => this.userDetails = window.user_details);
        this.loadScript("/data/js/payload_details.js", () => this.payloadDetails = window.payload_details);
        axios.get("/data/blacklist.json").then(({data}) => {
            this.blacklistIDs = new Set(data.ids);
        }).catch((err) => console.error("Couldn't load blacklist:", err)).then(() => {
            this.loadScript("/data/js/tweet_index.js", () => {
                var index = window.tweet_index;
                var fileVariables: string[] = [];
                for (const file of index) {
                    fileVariables.push(file.var_name);
                    this.loadScript(file.file_name, () => {
                        // Wait until we've loaded all files!
                        if (Object.keys(window.Grailbird.data).length < index.length) return;
    
                        var tweets = [];
                        for (const varName of fileVariables.reverse()) {
                            tweets = tweets.concat(window.Grailbird.data[varName].filter(t => !this.blacklistIDs.has(t.id_str)).reverse());
                        }
                        this.tweets = tweets;
                    });
                }
            });
        });
    }

    private loadScript(filename: string, callback?: () => void) {
        var script = document.createElement("script");
        script.src = filename;
        if (callback) script.onload = callback;
        document.body.appendChild(script);
    }

    get isLoaded() {
        return this.userDetails && this.payloadDetails && this.tweets;
    }
}

export const DataManager = new _DataManager();