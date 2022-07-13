import React, { useState } from "react";
import axios from "axios";
import { Greeting } from "./components/Greeting";
import { NewToDo } from "./components/NewToDo";
import { ToDoItem } from "./components/ToDoItem";

export default function App() {
  const [items, setItems] = useState([]);
  // const [isDone, setDone] = useState(false);
  //next goal: get the addItem/post and deleteItem/post functions operational

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

  function addItem(newItem) {
    let index = 0;
    if (items.length == null) {
      index = 0;
    } else {
      index = items.length - 1;
    }
    console.log(newItem);
    axios
      .post("http://localhost:8000", { name: newItem, id: index })
      .then((response) => {
        console.log(response);
      });
    setItems((prevItems) => {
      return [...prevItems, newItem];
    });
  }

  async function deleteItem(id) {
    await axios.delete("/delete", { id: id });
    alert("item deleted!");
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
      <div className="box">
        <NewToDo onAdd={addItem} />
        <div>
          <ul>
            <ToDoItem items={items} onChecked={deleteItem} />
          </ul>
        </div>
      </div>
    </div>
  );
}
