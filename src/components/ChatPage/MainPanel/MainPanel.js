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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (chatRoom) {
      addMessagesListeners(chatRoom.id);
    }
  }, [chatRoom]);

  const addMessagesListeners = (chatRoomId) => {
    let messagesArray = [];
    messagesRef.child(chatRoomId).on("child_added", (dataSnapshot) => {
      messagesArray.push(dataSnapshot.val());
      setMessages(messagesArray);
      setMessagesLoading(false);
    });
  };

  const handleSearchMessages = () => {
    const chatRoomMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setSearchLoading(false);
  };

  const HandleSearchChange = (event) => {
    setSearchLoading(true);
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    handleSearchMessages();
  }, [searchTerm]);

  const renderMessages = (messages) => {
    if (messages.length > 0) {
      return messages.map((message) => (
        <Message key={message.timestamp} message={message} user={user} />
      ));
    }
  };

  return (
    <div>
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader handleSearchChange={HandleSearchChange} />

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
          {searchTerm ? renderMessages(searchResults) : renderMessages(messages)}
        </div>

        <MessageForm />
      </div>
    </div>
  );
}

export default MainPanel;
