import { useState } from "react";
import { Greeting } from "./components/Greeting";
import { NewToDo } from "./components/NewToDo";
import { ToDoItem } from "./components/ToDoItem";

function App() {
  const [items, setItems] = useState([]);

  function addItem(newItem) {
    setItems((prevItems) => {
      return [...prevItems, newItem];
    });
  }

  function deleteItem(id) {
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
