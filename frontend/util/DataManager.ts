import JSZip from "jszip";

window.Grailbird = {
    data: {}
};

class _DataManager {
    private unzipper = new JSZip();
    hasStarted = false;

    // Loaded Data
    public userDetails: any = null;
    public payloadDetails: any = null;
    public tweets: any = null;

    private injectedScripts: HTMLScriptElement[] = [];

    async loadData(data) {
        this.hasStarted = true;
        const zip = await this.unzipper.loadAsync(data);

        this.loadArchiveScript(zip, "data/js/user_details.js", () => this.userDetails = window.user_details);
        this.loadArchiveScript(zip, "data/js/payload_details.js", () => this.payloadDetails = window.payload_details);
        this.loadArchiveScript(zip, "data/js/tweet_index.js", () => {
            var index = window.tweet_index;
            var fileVariables: string[] = [];
            for (const file of index) {
                fileVariables.push(file.var_name);
                this.loadArchiveScript(zip, file.file_name, () => {
                    // Wait until we've loaded all files!
                    if (Object.keys(window.Grailbird.data).length < index.length) return;

                    var tweets = [];
                    for (const varName of fileVariables.reverse()) {
                        tweets = tweets.concat(window.Grailbird.data[varName].reverse());
                    }
                    this.tweets = tweets;
                });
            }
        });
    }

    removeData() {
        this.injectedScripts.forEach(s => s.remove());
        this.injectedScripts = [];
        this.userDetails = null;
        this.payloadDetails = null;
        this.tweets = null;
        this.hasStarted = false;
    }

    private loadArchiveScript(zip, filename: string, callback?: () => void) {
        zip.file(filename).async("string").then((source) => {
            var script = document.createElement("script");
            script.src = "data:text/javascript;base64," + btoa(source);
            if (callback) script.onload = callback;
            document.body.appendChild(script);
            this.injectedScripts.push(script);
        });
    }

    get isLoaded() {
        return this.userDetails && this.payloadDetails && this.tweets;
    }
}

export const DataManager = new _DataManager();