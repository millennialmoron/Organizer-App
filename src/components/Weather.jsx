export function Weather(props) {
  return (
    <div className="box">
      <h3>Today's Weather:</h3>
      <p>
        The weather today in <em> {props.location} </em> is forecast to be:
        {props.forecast}.
      </p>
      <p>The temperature is currently {props.currentTemp} Celsius,</p>
      <p>and it feels like {props.feltTemp} Celsius.</p>
      <img src={props.imgSrc} alt="today's weather" />
      <div className="form">
        <p>Get your local weather for today!</p>
        <label htmlFor="cityInput">Input your city:</label>
        <input
          onChange={props.whenChanged}
          id="cityInput"
          type="text"
          name="cityName"
          className="form-control form-control-lg"
          placeholder="City Name"
          value={props.inputValue}
        />
        <button className="btn" onClick={props.whenClicked}>
          ➜
        </button>
      </div>
    </div>
  );
}
