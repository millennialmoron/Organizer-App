const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const axios = require("axios").default;
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
require("dotenv").config();

const app = express();
const pword = process.env.MONGO_PWORD;
const apiKey = process.env.WEATHER_API;
const quoteAPI = process.env.QUOTE_API;
let quote = {
  quote: "",
  author: "",
};
const memeAPI = process.env.MEME_API;
let memeURL = "";
let memeYet = true;
let sessionName = "";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://coolbeans21:" +
      pword +
      "@decluttercluster.uemvy.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );

  const userSchema = new mongoose.Schema({
    email: String,
    googleID: String,
  });

  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);

  const User = new mongoose.model("User", userSchema);

  const itemsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });

  const Item = mongoose.model("Item", itemsSchema);

  const item1 = new Item();
  item1.name = "Do laundry.";
  item1._id = 0;

  const item2 = new Item();
  item2.name = "Clean the cutlery.";
  item2._id = 1;

  const item3 = new Item();
  item3.name = "Dispose of remaining evidence.";
  item3._id = 2;

  let defaultItems = [item1, item2, item3];

  passport.use(User.createStrategy());

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/main",
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log(profile);

        User.findOrCreate({ googleID: profile.id }, function (err, user) {
          sessionName = user.email;
          return cb(err, user);
        });
      }
    )
  );

  function findLists() {
    Item.findOne({ googleID: sessionName }, function (err, itemsList) {
      if (err) {
        console.log(err);
      } else {
        if (itemsList.length === 0) {
          Item.insertMany(defaultItems, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("yes master.");
            }
            Item.find()
              .populate("user")
              .exec(function (err, item) {
                if (err) return err;
                console.log("The user assigned: " + Item.user.googleID);
              });
          });
        }
        defaultItems = itemsList;

        // console.log(defaultItems);
      }
    });
  }

  function getQuote() {
    const quoteURL = "https://zenquotes.io/api/today/" + quoteAPI;
    https.get(quoteURL, function (response) {
      response.on("data", function (data) {
        const quoteData = JSON.parse(data);
        quote = {
          quote: quoteData[0].q,
          author: quoteData[0].a,
        };
        // console.log(quote);
      });
    });
  }

  function getMeme() {
    const url = "https://api.humorapi.com/memes/random?api-key=" + memeAPI;
    https.get(url, function (response) {
      response.on("data", function (data) {
        const memeData = JSON.parse(data);
        memeURL = memeData.url;
      });
    });
    return memeURL;
  }

  app.get("/", function (req, res) {
    res.render("login");
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  app.get(
    "/auth/google/main",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
      // Successful authentication, redirect to secrets.
      res.redirect("/main");
    }
  );

  app.get("/main", function (req, res) {
    findLists();
    return res.send({ data: defaultItems });
  });

  app.get("/weather", function (req, res) {
    return res.send({ data: apiKey });
  });

  app.get("/quote", function (req, res) {
    getQuote();
    return res.send({ data: quote });
  });

  app.get("/meme", function (req, res) {
    if (memeYet) {
      getMeme();
      memeYet = false;
    }
    return res.send({ data: memeURL });
  });

  app.post("/main", function (req, res) {
    const newItem = req.body.name;
    const id = req.body.id;
    const item = new Item();
    item.name = newItem;
    item._id = id;
    item.save();
    return "Success";
  });

  app.post("/delete", function (req, res) {
    const checkedItemId = req.body.id;
    Item.deleteOne({ _id: checkedItemId }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted");
      }
    });
  });
}

app.listen(8000, function () {
  console.log("what up bitches?");
});
