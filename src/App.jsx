import React, { useState } from "react";
import { Login } from "./components/Login";
import { MainApp } from "./components/MainApp";

export default function App(props) {
  const [checkLogin, setCheckLogin] = useState(false);

  function handleLogin(check) {
    setCheckLogin(check);
  }

  return (
    <div>{checkLogin ? <MainApp /> : <Login isLoggedIn={handleLogin} />}</div>
  );
}
