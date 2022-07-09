import React, { useState } from "react";
import axios from "axios";
import { Greeting } from "./components/Greeting";
import { NewToDo } from "./components/NewToDo";
import { ToDoItem } from "./components/ToDoItem";

export default function App() {
  const [items, setItems] = useState([]);
  const [isDone, setDone] = useState(false);
  //next goal: add a state for the <li> to see if true/false if/else setup can rerender the list until complete!

  axios
    .get("http://localhost:8000")
    .then(function (response) {
      let savedList = response.data.data;
      let userToDo = savedList.map((note) => {
        return note.name;
      });
      setItems([...userToDo]);
    })
    .catch(function (err) {
      console.log(err);
    });

  function addItem(newItem) {
    let index = 0;
    if (items.length == null) {
      index = 0;
    } else {
      index = items.length - 1;
    }
    axios.post("/", { name: newItem, id: index }).then((response) => {
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
            {[items].map((item, index) => (
              <ToDoItem
                key={index}
                id={index}
                text={item}
                onChecked={deleteItem}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
