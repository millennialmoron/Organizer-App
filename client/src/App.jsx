import React, { useState } from "react";
import { Login } from "./components/Login";
import { MainApp } from "./components/MainApp";

export default function App(props) {
  const [checkLogin, setCheckLogin] = useState(false);

  function handleLogin(check) {
    setCheckLogin(check);
  }

  //everything is working. next: publish app through heroku. also open db for public web use?...

  return (
    <div>{checkLogin ? <MainApp /> : <Login isLoggedIn={handleLogin} />}</div>
  );
}
