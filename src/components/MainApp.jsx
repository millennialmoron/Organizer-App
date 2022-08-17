import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Greeting } from "./Greeting";
import { NewToDo } from "./NewToDo";
import { ToDoItem } from "./ToDoItem";
import { Weather } from "./Weather";
import { Quotes } from "./Quotes";
import { Meme } from "./Meme";

export function MainApp(props) {
  const [items, setItems] = useState([
    {
      name: "",
      id: "",
    },
  ]);
  const [checkList, setCheckList] = useState(true);
  const [weather, setWeather] = useState({
    location: "",
    forecast: "",
    currentTemp: "",
    feltTemp: "",
    imgSrc: "",
  });
  const [checkWeather, setCheckWeather] = useState(true);
  const [inputText, setInputText] = useState("");
  const [quote, setQuote] = useState({
    quote: "",
    author: "",
  });
  const [checkQuote, setCheckQuote] = useState(true);
  const [memeURL, setMemeURL] = useState("");
  const [checkMeme, setCheckMeme] = useState(true);
  const [user, setUser] = useState("");
  let query = "New York City";
  const units = "metric";
  let temp = 0;
  let felt = 0;
  let descr = "";
  let imgURL = "";
  let apiKey = "";

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user");
      let sessionLogin = true;
      let sessionUser = response.data.data;
      if (sessionLogin) {
        setUser(sessionUser);
        sessionLogin = false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  getUser();

  const getLists = async () => {
    try {
      const response = await axios.get("http://localhost:8000/list");
      // console.log(response.data.data);
      if (checkList) {
        let savedList = response.data.data;
        // console.log(savedList);
        let userToDo = [];
        for (var i = 0; i < savedList.length; i++) {
          userToDo[i] = {
            name: savedList[i].name,
            id: savedList[i]._id,
          };
          // console.log(userToDo);
          setItems([...userToDo]);
          setCheckList(false);
        }
      }
      // console.log(items);
    } catch (err) {
      console.log(err);
    }
  };

  const getCity = async () => {
    try {
      const response = await axios.get("http://localhost:8000/weather/");
      // console.log(response.data.data);
      apiKey = response.data.data.apiKey;
      query = response.data.data.query;
      if (checkWeather) {
        // console.log(query);
        getWeather(query);
        // console.log("did it");
        setCheckWeather(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Possibly need a different quote generator as this one has too low of a daily request counter.
  const getQuote = async () => {
    try {
      const response = await axios.get("http://localhost:8000/quote");
      // console.log(response);
      let todaysQuote = response.data.data.quote;
      let todaysAuthor = response.data.data.author;
      if (checkQuote) {
        setQuote({
          quote: todaysQuote,
          author: todaysAuthor,
        });
        setCheckQuote(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMeme = async () => {
    try {
      const response = await axios.get("http://localhost:8000/meme");
      // console.log(response);
      let newURL = response.data.data;
      if (checkMeme) {
        setMemeURL(newURL);
        setCheckMeme(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function getWeather(city) {
    // getCity();
    // console.log(apiKey);
    // console.log(city);
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

      axios
        .post("http://localhost:8000/weather", { city: city })
        .then(function (response) {
          // console.log(response);
        })
        .catch(function (err) {
          console.log(err);
        });
      //this always shows one search result behind in the console, but the actual displayed information should be accurate now.
      // console.log(weather);
    });
  }

  if (user === "") {
    getUser();
  } else {
    getLists();
    getCity();
    getQuote();
    getMeme();
  }

  function handleClick() {
    getWeather(inputText);
    setInputText("");
  }

  function addItem(newItem) {
    let id = uuidv4();
    for (var i = 0; i < items.length; i++) {
      if (id === items[i].id) {
        id = uuidv4();
      }
    }
    let newNote = {
      name: newItem,
      id: id,
    };
    setItems((prevItems) => {
      return [...prevItems, newNote];
    });

    axios
      .post("http://localhost:8000/", { name: newItem, id: id })
      .then((response) => {
        // console.log(response);
      });
  }

  function deleteItem(id, count) {
    axios.post("http://localhost:8000/delete", { id: id }).then((response) => {
      // console.log(response);
    });
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== count;
      });
    });
  }

  return (
    <div>
      <div className="row align-items-center">
        <div className="col-md-4">
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
        <div className="col-md-4">
          <div className="titleBox">
            <Greeting name={user} />
          </div>
          <div className="box">
            <NewToDo onAdd={addItem} />
            <div>
              <ul>
                <ToDoItem items={items} onChecked={deleteItem} />
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="box">
            <Quotes quote={quote.quote} author={quote.author} />
          </div>
          <div className="box">
            <Meme imgSrc={memeURL} />
          </div>
        </div>
      </div>
    </div>
  );
}
