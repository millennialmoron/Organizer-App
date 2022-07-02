import React, { useState } from "react";
import axios from "axios";
import { Greeting } from "./components/Greeting";
import { NewToDo } from "./components/NewToDo";
import { ToDoItem } from "./components/ToDoItem";

const client = axios.create({ baseURL: "http://localhost:8000" });

function App() {
  const [items, setItems] = useState([]);

  React.useEffect(() => {
    async function getItems() {
      const response = await client.get("/");
      console.log(response.data);
    }
    getItems();
  }, []);

  function addItem(newItem) {
    let index = 0;
    if (items.length == null) {
      index = 0;
    } else {
      index = items.length - 1;
    }
    axios.post("/", { name: newItem, id: index }).then((response) => {
      console.log(response.data);
    });
    setItems((prevItems) => {
      return [...prevItems, newItem];
    });
  }

  async function deleteItem(id) {
    await client.delete("/", { id: id });
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
