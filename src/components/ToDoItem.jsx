export function ToDoItem(props) {
  return props.items.map((item, index) => (
    <li
      key={index}
      onClick={() => {
        props.onChecked(index);
      }}
    >
      {item}
    </li>
  ));
}
