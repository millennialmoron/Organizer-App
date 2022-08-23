import React, { useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export function Login(props) {
  let loggedIn = false;

  function handleCallbackResponse(response) {
    //console.log("Encoded JWT ID token: " + response.credential);
    const userObject = jwt_decode(response.credential);
    const userEmail = userObject.email;
    const userName = userObject.name;
    const id = userObject.jti;
    saveUser(userEmail, userName, id);
    document.getElementById("signInDiv").hidden = true;
    loggedIn = true;
    props.isLoggedIn(loggedIn);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "1094993871261-a0p2bbbe2t55215167an6eoll754ealg.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  function saveUser(email, name, id) {
    let userEmail = email;
    let userName = name;
    let userID = id;
    axios
      .post("/user", {
        email: userEmail,
        name: userName,
        id: userID,
      })
      .then(function (response) {
        console.log(response);
      });
  }

  return (
    <div className="login">
      <div className="box text-center align-items-center">
        <h2>Please Login using Google to Continue.</h2>
        <div id="signInDiv"></div>
      </div>
    </div>
  );
}
