export function ToDoInput(props) {
  return (
    <div className="form">
      <input
        onChange={props.whenChanged}
        type="text"
        value={props.inputValue}
      />
      <button onClick={props.whenClicked}>
        <span>Add</span>
      </button>
    </div>
  );
}
