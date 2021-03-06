import React, { useState } from "react";
import axios from "axios";
import { Greeting } from "./components/Greeting";
import { NewToDo } from "./components/NewToDo";
import { ToDoItem } from "./components/ToDoItem";
import { Weather } from "./components/Weather";

export default function App() {
  const [items, setItems] = useState([]);
  const [weather, setWeather] = useState({
    location: "",
    forecast: "",
    currentTemp: "",
    feltTemp: "",
    imgSrc: "",
  });
  const [checkWeather, setCheckWeather] = useState(true);
  const [inputText, setInputText] = useState("");
  let query = "New York City";
  const units = "metric";
  let temp = 0;
  let felt = 0;
  let descr = "";
  let imgURL = "";
  let apiKey = "";

  //next step goals: (CURRENT) get quote display showing... (LATER) save most recently searched city in db so server can send it at the start each time

  axios
    .get("http://localhost:8000")
    .then(function (response) {
      if (items.length === 0) {
        let savedList = response.data.data;
        let userToDo = savedList.map((note) => {
          return note.name;
        });
        setItems([...userToDo]);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {});

  axios
    .get("http://localhost:8000/weather")
    .then(function (response) {
      apiKey = response.data.data;
      if (checkWeather) {
        getWeather(query);
        console.log("did it");
        setCheckWeather(false);
      }
    })
    .catch(function (err) {
      console.log(err);
    });

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function getWeather(city) {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=" +
      units;

    fetch(url).then(async (response) => {
      const weatherData = await response.json();
      if (!response.ok) {
        const error = weatherData && weatherData.message;
        return Promise.reject(error);
      }

      temp = Math.round(weatherData.main.temp);
      felt = Math.round(weatherData.main.feels_like);
      descr = weatherData.weather[0].description;
      var icon = weatherData.weather[0].icon;
      imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      setWeather({
        location: city,
        forecast: descr,
        currentTemp: temp,
        feltTemp: felt,
        imgSrc: imgURL,
      });
      //this always shows one search result behind in the console, but the actual displayed information should be accurate now.
      console.log(weather);
    });
  }

  function handleClick() {
    getWeather(inputText);
    setInputText("");
  }

  function addItem(newItem) {
    setItems((prevItems) => {
      return [...prevItems, newItem];
    });
    let index = items.length;
    axios
      .post("http://localhost:8000", { name: newItem, id: index })
      .then((response) => {
        console.log(response);
      });
  }

  function deleteItem(id) {
    axios.post("http://localhost:8000/delete", { id: id }).then((response) => {
      console.log(response);
    });
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <div className="box">
        <Greeting />
      </div>
      <div className="row align-items-center">
        <div className="col-md-4 box">
          <Weather
            whenChanged={handleChange}
            whenClicked={handleClick}
            location={weather.location}
            forecast={weather.forecast}
            currentTemp={weather.currentTemp}
            feltTemp={weather.feltTemp}
            imgSrc={weather.imgSrc}
            inputValue={inputText}
          />
        </div>
        <div className="col-md-4 box">
          <NewToDo onAdd={addItem} />
          <div>
            <ul>
              <ToDoItem items={items} onChecked={deleteItem} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
