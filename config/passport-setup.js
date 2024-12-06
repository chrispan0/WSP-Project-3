var GoogleStrategy = require("passport-google-oauth20");
var GitHubStrategy = require("passport-github2").Strategy;
var passport = require("passport");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.Github_Client_ID,
      clientSecret: process.env.Github_Client_Secret,
      callbackURL: "https://wsp-p3.chrispanetta.com/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/login?loggedin=true");
  }
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_Secret,
      callbackURL: "https://wsp-p3.chrispanetta.com/oauth2/redirect/google",
      scope: ["profile"],
      state: true,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      db.get(
        "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
        ["https://accounts.google.com", profile.id],
        function (err, cred) {
          if (err) {
            return cb(err);
          }

          if (!cred) {
            // The account at Google has not logged in to this app before.  Create a
            // new user record and associate it with the Google account.
            db.run(
              "INSERT INTO users (name) VALUES (?)",
              [profile.displayName],
              function (err) {
                if (err) {
                  return cb(err);
                }

                var id = this.lastID;
                db.run(
                  "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
                  [id, "https://accounts.google.com", profile.id],
                  function (err) {
                    if (err) {
                      return cb(err);
                    }

                    var user = {
                      id: id,
                      name: profile.displayName,
                    };
                    return cb(null, user);
                  }
                );
              }
            );
          } else {
            // The account at Google has previously logged in to the app.  Get the
            // user record associated with the Google account and log the user in.
            db.get(
              "SELECT * FROM users WHERE id = ?",
              [cred.user_id],
              function (err, user) {
                if (err) {
                  return cb(err);
                }
                if (!user) {
                  return cb(null, false);
                }
                return cb(null, user);
              }
            );
          }
        }
      );
    }
  )
);
