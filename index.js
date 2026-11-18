const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT || 3003);
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  `http://localhost:${port}/callback`;

const hasPlaceholderCredentials =
  clientID === "your-google-client-id" ||
  clientSecret === "your-google-client-secret";

if (!clientID || !clientSecret || hasPlaceholderCredentials) {
  throw new Error(
    "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Copy .env.example to .env and add your Google OAuth credentials.",
  );
}

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    (accessToken, refreshToken, profile, next) => {
      console.log(accessToken, profile);
      next(null, profile);
    },
  ),
);

app.get("/", (req, res) => {
  res.send(`<a href="/login">Login with google</a>`);
});

app.get("/login", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    res.send(`Hi ${req.user.displayName}`);
  },
);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});