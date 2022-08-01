// import { useState } from "react";

export function Greeting() {
  //   const [timeOfDay, setTimeOfDay] = useState("");
  let timeOfDay = "";
  const today = new Date();
  const currentTime = today.getHours();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const day = today.toLocaleDateString("en-us", options);

  function getGreeting() {
    if (currentTime >= 4 && currentTime < 12) {
      timeOfDay = "Morning";
    } else if (currentTime >= 12 && currentTime < 17) {
      timeOfDay = "Afternoon";
    } else {
      timeOfDay = "Evening";
    }
  }

  getGreeting();

  return (
    <div>
      <h2 className="greeting">Good {timeOfDay}!</h2>
      <h1 className="date">{day}</h1>
    </div>
  );
}
