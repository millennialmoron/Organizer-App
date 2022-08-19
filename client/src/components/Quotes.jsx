export function Quotes(props) {
  return (
    <div>
      <h4>{props.quote}</h4>
      <em>
        <p>-- {props.author}</p>
      </em>
    </div>
  );
}
