const url = require("url");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const MemoryStore = require("memorystore")(session);
module.exports = {
  setup: async(app,urls,client) => {
    passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  let domain;
  let callbackUrl;

  try {
    const domainUrl = new URL(urls.domain);
    domain = {
      host: domainUrl.hostname,
      protocol: domainUrl.protocol,
    };
  } catch (e) {
    console.log(e);
    throw new Error("Invalid Site Domain/Url Was Provided!");
  }
    callbackUrl = `${domain.protocol}//${domain.host}${urls.callback}`;

  passport.use(
    new Strategy(
      {
        clientID: client.id,
        clientSecret: client.secret,
        callbackURL: callbackUrl,
        scope: client.scopes,
        prompt: 'none'
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      },
    ),
  );

  app.use(
    session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret:
				"#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.domain = urls.domain.split("//")[1];

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.get(
    urls.login,
    (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    },
    passport.authenticate("discord"),{scope:scopes,prompt:'none'}
  );

  app.get(
    urls.callback,
    passport.authenticate("discord", { failureRedirect: "/" }),(
      req,
      res,
    ) => {
      if (req.session.backURL) {
        const backURL = req.session.backURL;
        req.session.backURL = null;
        res.redirect(backURL);
      } else {
        res.redirect("/");
      }
    },
  );

  app.get(urls.logout, function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });
  },
  checkAuth:(req, res, next, login) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect(login);
  }
}
