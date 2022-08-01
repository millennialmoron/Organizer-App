const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const axios = require("axios").default;
const cors = require("cors");

const app = express();
const pword = "coffee247";
const apiKey = "87c090d2a5bd172a0fae59a5f09436e7";
const quoteAPI = "1e6a5c98439a8134acb203979ad63b33aa3257bd";
let quote = {
  quote: "",
  author: "",
};
const memeAPI = "2ba5034682c441f1bb5c25caaa40f8ef";
let memeURL = "";
let memeYet = true;

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

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

  const itemsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: Number,
      required: true,
    },
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

  function findLists() {
    Item.find({}, function (err, itemsList) {
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

  app.post("/", function (req, res) {
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
