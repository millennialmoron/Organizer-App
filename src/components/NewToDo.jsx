import { useState } from "react";
import { ToDoInput } from "./ToDoInput";

export function NewToDo(props) {
  const [inputText, setInputText] = useState("");

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function submitItem(event) {
    props.onAdd(inputText);
    setInputText("");
    event.preventDefault();
  }

  return (
    <div className="container">
      <div className="heading">
        <h3>To-Do List</h3>
      </div>
      <ToDoInput
        whenChanged={handleChange}
        whenClicked={submitItem}
        inputValue={inputText}
      />
    </div>
  );
}
