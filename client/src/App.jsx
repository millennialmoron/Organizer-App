import React, { useState } from "react";
import { Login } from "./components/Login";
import { MainApp } from "./components/MainApp";

//start fresh by commenting out logic and just pulling up main

export default function App(props) {
  // const [checkLogin, setCheckLogin] = useState(false);

  // function handleLogin(check) {
  //   setCheckLogin(check);
  //}

  return (
    <div>
      {" "}
      <h1>Hello! I am working!</h1>{" "}
    </div>
  );
}

// {checkLogin ? <MainApp /> : <Login isLoggedIn={handleLogin} />}
