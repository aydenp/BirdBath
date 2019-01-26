const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const Twitter = require('twitter');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');

const Config = require("./Config");
const app = express();

// - Auth and Cookie Setup

app.use(cookieSession({
    name: 'cleanbird-session',
    secret: Config.cookieSecret
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new TwitterStrategy({
    consumerKey: Config.consumerKey,
    consumerSecret: Config.consumerSecret,
    callbackURL: Config.publicURL + "/auth/twitter/callback"
}, (token, tokenSecret, profile, cb) => {
    return cb(null, { token, tokenSecret, id: profile.id });
}));

// - Routes

app.delete("/tweets/:id", (req, res) => {
    if (!req.user || !req.user.token || !req.user.tokenSecret) return res.sendStatus(401);
    const client = new Twitter({
        consumer_key: Config.consumerKey,
        consumer_secret: Config.consumerSecret,
        access_token_key: req.user.token,
        access_token_secret: req.user.tokenSecret
    });
    client.post('statuses/destroy/' + req.params.id, (error, tweets, response) => {
        if (error) console.error("Could not delete tweet:", error);
        res.json({ success: !error });
    });
});

app.get("/auth", (req, res) => {
    if (!req.user || !req.user.id || !req.user.token || !req.user.tokenSecret) return res.json({ authenticated: false });
    return res.json({ authenticated: true, id: req.user.id });
});
app.get("/auth/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => res.redirect('/'));

app.use("/data", express.static(path.join(__dirname, "..", "data")));
app.use(express.static(path.join(__dirname, "..", "dist")));

// - Start Server

app.listen(Config.port, () => console.log(`Available at http://localhost:${Config.port}!`));