import React, { useState } from "react";
import { Login } from "./components/Login";
import { MainApp } from "./components/MainApp";

export default function App() {
  //next step goals: (CURRENT) Get the two mongo db's to connect...(LATER) save most recently searched city in db so server can send it at the start each time

  const [checkLogin, setCheckLogin] = useState(false);

  function handleLogin(check) {
    setCheckLogin(check);
  }

  return (
    <div>{checkLogin ? <MainApp /> : <Login isLoggedIn={handleLogin} />}</div>
  );
}
