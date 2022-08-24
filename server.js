const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const https = require("https");
const axios = require("axios").default;
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config({ path: "./vars/.env" });
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
let query = "";
let cityData = {
  apiKey: apiKey,
  query: query,
};

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/public")));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());

async function main() {
  const uri =
    "mongodb+srv://coolbeans21:" +
    pword +
    "@decluttercluster.uemvy.mongodb.net/?retryWrites=true&w=majority";

  await mongoose.connect(uri, { useNewUrlParser: true }, () => {
    console.log("workin");
  });

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String },
    _id: { type: String },
  });

  const User = mongoose.model("User", userSchema);

  const citySchema = new mongoose.Schema({
    city: { type: String, required: true },
    user: { type: String, required: true },
  });

  const City = mongoose.model("City", citySchema);

  const itemsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    user: { type: String },
  });

  const Item = mongoose.model("Item", itemsSchema);

  app.get("/user", function (req, res) {
    console.log("from the get: " + sessionUser);
    return res.send({ data: sessionName });
  });

  //figure out why the posts aren't even making it here!

  app.post("/user", function (req, res) {
    console.log("caught it: " + req.body);
    let userEmail = req.body.email;
    sessionUser = userEmail;
    console.log("Posting: " + sessionUser);
    let userName = req.body.name;
    sessionName = userName;
    let userID = req.body.id;
    let data = {
      email: userEmail,
      name: userName,
      _id: userID,
    };

    User.find({ email: userEmail }, function (err, foundUser) {
      console.log("FOUND IT! " + foundUser);
      if (err) {
        console.log(err);
      } else if (foundUser.length === 0) {
        var newUser = new User(data);
        newUser.save((err) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        findLists(sessionUser);
        getCity(sessionUser);
        getQuote();
      }
      return "Success";
    });
  });

  function findLists(sessionUser) {
    console.log("running lists..." + sessionUser);
    Item.find({ user: sessionUser }, function (err, itemsList) {
      if (err) {
        console.log(err);
      } else {
        if (itemsList.length === 0) {
          const item1 = new Item();
          item1.name = "Add new notes above.";
          item1._id = uuidv4();
          item1.user = sessionUser;

          const item2 = new Item();
          item2.name = "Click an item to delete it.";
          item2._id = uuidv4();
          item2.user = sessionUser;

          const item3 = new Item();
          item3.name = "Customize your list to fit you.";
          item3._id = uuidv4();
          item3.user = sessionUser;

          for (var i = 0; i < itemsList.length; i++) {
            if (item1._id === itemsList[i]._id) {
              item1._id = uuidv4();
            } else if (item2._id === itemsList[i]._id) {
              item2._id = uuidv4();
            } else if (item3._id === itemsList[i]._id) {
              item3._id = uuidv4();
            } else if (item1._id === item2._id || item1._id === item3._id) {
              item1._id = uuidv4();
            } else if (item2._id === item3._id) {
              item2._id = uuidv4();
            }
          }

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
        return defaultItems;

        console.log(defaultItems);
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
        console.log(quote);
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

  function getCity(sessionUser) {
    City.find({ user: sessionUser }, function (err, userCity) {
      if (err) {
        console.log(err);
      } else if (userCity.length === 0) {
        let newCity = new City();
        newCity.city = "New York";
        newCity.user = sessionUser;
        newCity.save();
        query = "New York";
        console.log(userCity[0].city);
      } else {
        query = userCity[0].city;
        console.log(userCity[0].city);
      }
      cityData = {
        apiKey: apiKey,
        query: query,
      };
    });

    return cityData;
  }

  app.get("/static/js/main.76ca0154.js", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "static/js/main.76ca0154.js"));
  });

  app.get("/list", function (req, res) {
    res.send({ data: defaultItems });
  });

  app.get("/weather", function (req, res) {
    getCity(sessionUser);
    res.send({ data: cityData });
  });

  app.get("/quote", function (req, res) {
    res.send({ data: quote });
  });

  app.get("/meme", function (req, res) {
    if (memeYet) {
      getMeme();
      memeYet = false;
    }
    res.send({ data: memeURL });
  });

  app.post("/weather", function (req, res) {
    let userCity = req.body.city;
    // console.log(sessionUser);
    City.findOneAndUpdate(
      { user: sessionUser },
      { $set: { city: userCity, user: sessionUser } },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
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

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
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
}

main().catch((err) => console.log(err));

app.listen(process.env.PORT || 8000, function () {
  console.log("what up bitches?");
});
