import React from "react";
import Toast from "react-bootstrap/Toast";
import moment from "moment";

function Message(message, user) {
  console.log("message rendering", message, user);
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();

  const isImage = (message) => {
    console.log("isImage");
    return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
  };

  const isMessageMine = (message, user) => {
    console.log("isMine");
    return message.user.id === user.uid;
  };

  return (
    <div>
      <Toast>
        <Toast.Header>
          <img src={message.user.image} className="rounded me-2" alt={message.user.name} />
          <strong className="me-auto">{message.user.name}</strong>
          <small style={{ fontSize: "10px", color: "gray" }}>
            {timeFromNow(message.timestamp)}
          </small>
        </Toast.Header>
        <Toast.Body style={{ backgroundColor: isMessageMine(message, user) && "#ececec" }}>
          {isImage(message) ? (
            <img style={{ maxWidth: "300px" }} alt="이미지" src={message.image} />
          ) : (
            <p>{message.content}</p>
          )}
        </Toast.Body>
      </Toast>
    </div>
  );
}

export default Message;
