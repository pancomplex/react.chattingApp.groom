import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../../firebase";
import { setCurrentChatRoom, setPrivateChatRoom } from "../../../redux/actions/chatRoom_action";

import { FaRegSmile } from "react-icons/fa";

function DirectMessages() {
  const [users, setUsers] = useState([]);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
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

  const renderDirectMessages = (users) => {
    console.log();
    if (users.length > 0) {
      return users.map((user) => (
        <li
          key={user.uid}
          onClick={() => {
            changeChatRoom(user);
          }}
          style={{ cursor: "pointer" }}
        >
          # {user.name}
        </li>
      ));
    }
  };

  const changeChatRoom = (user) => {
    const chatRoomId = getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    dispatch(setCurrentChatRoom(chatRoomData));
    dispatch(setPrivateChatRoom(true));
  };

  const getChatRoomId = (userId) => {
    const currentUserId = currentUser.uid;
    return userId > currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  };

  return (
    <div>
      <span
        style={{
          display: "flex",
          alignItems: "center",
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
