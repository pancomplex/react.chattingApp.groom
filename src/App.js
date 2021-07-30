import React, { useEffect } from "react";
import { useHistory, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import firebase from "./firebase";
import { setUser, clearUser } from "./redux/actions/user_action";

import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

function App() {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user)); // 동기실행으로 리덕스에 올라간 뒤에 페이지를 넘기려면?
        history.push("/");
      } else {
        history.push("/login");
        dispatch(clearUser());
      }
    });
  }, []);

  if (isLoading) {
    return (
      <h1
        style={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0e101c",
          color: "#fff",
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
          fontWeight: "100",
        }}
      >
        ... loading
      </h1>
    );
  }

  return (
    <Switch>
      <Route exact path="/" component={ChatPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
    </Switch>
  );
}

export default App;
