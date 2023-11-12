const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;
const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy(
    {
        clientID: "44495439503-6fnl179s1fjn5t0f3i4rvasf63ob8qdh.apps.googleusercontent.com",
        clientSecret: "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",
        // preprod
        //callbackURL: "http://localhost:3000/google/callback"
        // prod
        callbackURL: "https://procesos-bnruumvxca-ew.a.run.app/google/callback"
    },

    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(new GoogleOneTapStrategy(
    {
        clientID: "44495439503-6fnl179s1fjn5t0f3i4rvasf63ob8qdh.apps.googleusercontent.com",
        clientSecret: "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",
        verifyCsrfToken: false
    },

    function (profile, done) {
        return done(null, profile);
    }
));

passport.use(new GitHubStrategy({
    // preprod
    // clientID: ${{ secrets.GH_CLIENT_ID }},
    // clientSecret: "f4900d7c820410d215125e901dcda923ff51a254",
    // callbackURL: "http://localhost:3000/github/callback"
    // prod
    clientID: ${{ secrets.GH_CLIENT_ID }},
    clientSecret: ${{ secrets.GH_SECRET }},
    callbackURL: "https://procesos-bnruumvxca-ew.a.run.app/github/callback"
},

    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
