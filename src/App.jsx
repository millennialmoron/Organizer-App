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
  // const [isDone, setDone] = useState(false);
  //next goal: add in weather api structure in backend and component and work towards functionality.

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
      if (checkWeather) {
        setWeather({
          location: response.data.data.location,
          forecast: response.data.data.forecast,
          currentTemp: response.data.data.currentTemp,
          feltTemp: response.data.data.feltTemp,
          imgSrc: response.data.data.imgSrc,
        });
        setCheckWeather(false);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {});

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
            location={weather.location}
            forecast={weather.forecast}
            currentTemp={weather.currentTemp}
            feltTemp={weather.feltTemp}
            imgSrc={weather.imgSrc}
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
