export function ToDoInput(props) {
  return (
    <div className="form">
      <input
        onChange={props.whenChanged}
        type="text"
        value={props.inputValue}
        placeholder="Add New Item"
      />
      <button className="btn" onClick={props.whenClicked}>
        ⨮
      </button>
    </div>
  );
}
