const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const axios = require("axios").default;

const app = express();
const pword = "coffee247";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

  const defaultItems = [item1, item2, item3];

  app.get("/", function (req, res) {
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
          itemsList = defaultItems;
        }
      }
    });
  });

  app.post("/", function (req, res) {
    const newItem = req.body.newItem;
    const id = req.body.id;
    const item = new Item();
    item.name = newItem;
    item._id = id;
    item.save();
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
