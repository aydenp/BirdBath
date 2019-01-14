const express = require("express");
const path = require("path");
const fs = require("fs");
const Twitter = require('twitter');

const app = express();
const client = new Twitter(require("./Config"));

const blacklistPath = path.join(__dirname, "..", "data", "blacklist.json");
var blacklist = new Set();
try {
    blacklist = new Set(require(blacklistPath).ids);
} catch (e) {};

const addToBlacklist = (id) => {
    blacklist.add(id);
    fs.writeFileSync(blacklistPath, JSON.stringify({ ids: Array.from(blacklist) }))
}

app.delete("/tweets/:id", (req, res) => {
    client.post('statuses/destroy/' + req.params.id, (error, tweets, response) => {
        if (error) console.error("Could not delete tweet:", error);
        else addToBlacklist(req.params.id);
        res.json({ success: !error });
    });
});

app.use("/data", express.static(path.join(__dirname, "..", "data")));
app.use(express.static(path.join(__dirname, "..", "dist")));

app.listen(8080, "127.0.0.1", () => console.log('Available at http://localhost:8080!'));