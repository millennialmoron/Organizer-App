const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const axios = require("axios").default;
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const assert = require("assert");
require("dotenv").config({ path: "./vars/.env" });

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
let sessionUser = "";
let sessionName = "";
let defaultItems = [];

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
    email: { type: String, required: true },
    name: { type: String },
    _id: { type: String },
  });

  const User = mongoose.model("User", userSchema);

  const itemsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: Number,
      required: true,
    },
    user: { type: String },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });

  const Item = mongoose.model("Item", itemsSchema);

  function findLists(sessionUser) {
    Item.find({ user: sessionUser }, function (err, itemsList) {
      if (err) {
        console.log(err);
      } else {
        if (itemsList.length === 0) {
          const item1 = new Item();
          item1.name = "Do laundry.";
          item1._id = 0;
          item1.user = sessionUser;

          const item2 = new Item();
          item2.name = "Clean the cutlery.";
          item2._id = 1;
          item2.user = sessionUser;

          const item3 = new Item();
          item3.name = "Dispose of remaining evidence.";
          item3._id = 2;
          item3.user = sessionUser;

          defaultItems = [item1, item2, item3];

          Item.insertMany(defaultItems, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("yes master.");
            }
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
    findLists(sessionUser);
    return res.send({ data: defaultItems });
  });

  app.get("/user", function (req, res) {
    return res.send({ data: sessionName });
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

  app.post("/", function (req, res) {
    const newItem = req.body.name;
    const id = req.body.id;
    const item = new Item();
    item.name = newItem;
    item._id = id;
    item.user = sessionUser;
    item.save();
    return "Success";
  });

  app.post("/user", function (req, res) {
    let userEmail = req.body.email;
    sessionUser = userEmail;
    let userName = req.body.name;
    sessionName = userName;
    let userID = req.body.id;
    let data = {
      email: userEmail,
      name: userName,
      _id: userID,
    };

    User.find({ email: userEmail }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else if (foundUser.length === 0) {
        var newUser = new User(data);
        newUser.save((err) => {
          if (err) {
            console.log(err);
          }
        });

        // Item.aggregate([
        //   {
        //     $lookup: {
        //       from: "user",
        //       localField: "user",
        //       foreignField: "user",
        //       as: "sessionUser",
        //     },
        //   },
        // ]).exec((err, result) => {
        //   if (err) {
        //     console.log(err);
        //   }
        //   if (result) {
        //     console.log(result);
        //   }
        // });

        return "Success";
      } else {
        console.log(foundUser);
      }
    });
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
