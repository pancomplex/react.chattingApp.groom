import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";

import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";

function MainPanel() {
  const [messages, setMessages] = useState([]);
  const [messagesRef, setMessagesRef] = useState(firebase.database().ref("messages"));
  const [messagesLoading, setMessagesLoading] = useState(true);

  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  console.log(`selector check.. chatRoom : ${chatRoom}, user : ${user}`);

  // if (chatRoom) {
  //   console.log(chatRoom.id);
  // }

  useEffect(() => {
    console.log("useEffect, chatRoom : ", chatRoom);
    if (chatRoom) {
      addMessagesListeners(chatRoom.id);
    }
  }, []);

  const addMessagesListeners = (chatRoomId) => {
    console.log("listening");
    let messagesArray = [];
    messagesRef.child(chatRoomId).on("child_added", (dataSnapshot) => {
      messagesArray.push(dataSnapshot.val());
      setMessages(messagesArray);
      setMessagesLoading(false);
    });
  };

  const renderMessages = (messages) => {
    console.log("render message, input messages : ", messages);

    messages.length > 0 &&
      messages.map((message) => <Message key={message.timestamp} message={message} user={user} />);
  };
  return (
    <div>
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader />

        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {renderMessages(messages)}
        </div>

        <MessageForm />
      </div>
    </div>
  );
}

export default MainPanel;
