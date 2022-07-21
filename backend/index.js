const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const axios = require("axios").default;
const cors = require("cors");

const app = express();
const pword = "coffee247";
const apiKey = "87c090d2a5bd172a0fae59a5f09436e7";

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

  // function getWeather(city) {
  //   const url =
  //     "https://api.openweathermap.org/data/2.5/weather?q=" +
  //     city +
  //     "&appid=" +
  //     apiKey +
  //     "&units=" +
  //     units;

  //   https.get(url, function (response) {
  //     response.on("data", function (data) {
  //       const weatherData = JSON.parse(data);
  //       temp = Math.round(weatherData.main.temp);
  //       felt = Math.round(weatherData.main.feels_like);
  //       descr = weatherData.weather[0].description;
  //       var icon = weatherData.weather[0].icon;
  //       imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  //       console.log(descr);
  //     });
  //     weather = {
  //       location: city,
  //       forecast: descr,
  //       currentTemp: temp,
  //       feltTemp: felt,
  //       imgSrc: imgURL,
  //     };
  //   });
  // }

  app.get("/", function (req, res) {
    findLists();
    return res.send({ data: defaultItems });
  });

  app.get("/weather", function (req, res) {
    return res.send({ data: apiKey });
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

  // app.post("/weather", function (req, res) {
  //   query = req.body.query;
  //   getWeather(query);
  //   console.log(query + " and " + weather.currentTemp);
  //   return res.send({ data: weather });
  // });

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
