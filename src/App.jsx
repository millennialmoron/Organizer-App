import React, { useState } from "react";
import axios from "axios";
import { Greeting } from "./components/Greeting";
import { NewToDo } from "./components/NewToDo";
import { ToDoItem } from "./components/ToDoItem";

const client = axios.create({ baseURL: "http://localhost:3000" });

function App() {
  const [items, setItems] = useState([]);

  async function getItems() {
    try {
      const response = await axios.get(client);
      setItems({ name: response.data.name });
    } catch (err) {
      console.log(err);
    }
  }

  getItems();

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
    await client.delete("/delete", { id: id });
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
            {items.map((todoItem, index) => (
              <ToDoItem
                key={index}
                id={index}
                text={todoItem}
                onChecked={deleteItem}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
