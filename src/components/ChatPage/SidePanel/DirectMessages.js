import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";

import { FaRegSmile } from "react-icons/fa";

function DirectMessages() {
  const [users, setUsers] = useState([]);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    addUsersListeners(currentUser.uid);
  }, [currentUser]);

  const addUsersListeners = (currentUserId) => {
    let usersArray = [];
    usersRef.on("child_added", (DataSnapshot) => {
      if (currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline";
        usersArray.push(user);
      }
      setUsers(usersArray);
    });
  };

  const renderDirectMessages = (users) =>
    users.length > 0 && users.map((user) => <li key={user.uid}># {user.name}</li>);

  return (
    <div>
      <span
        style={{
          display: "flex",
          alignItems: "cneter",
        }}
      >
        <FaRegSmile style={{ marginRight: 3 }} />
        DIRECT MESSAGES({users.length})
      </span>
      <ul style={{ listStyle: "none", padding: "0" }}>{renderDirectMessages(users)}</ul>
    </div>
  );
}

export default DirectMessages;
