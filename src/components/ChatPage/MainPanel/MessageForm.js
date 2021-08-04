import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { ProgressBar } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";
import mime from "mime-types";
import { set } from "react-hook-form";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref("messages");
  const inputOpenImageRef = useRef();
  const storageRef = firebase.storage().ref();
  const [percentage, setPercentage] = useState(0);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const createMessage = (fileUrl) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl != null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);
    try {
      await messagesRef.child(chatRoom.id).push().set(createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((pre) => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const filePath = `/message/public/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };

    setLoading(true);
    try {
      let uploadTask = storageRef.child(filePath).put(file, metadata);

      uploadTask.on(
        "state_changed",
        (UploadTaskSnapshot) => {
          const percentage = Math.round(
            (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
          );
          setPercentage(percentage);
        },
        (err) => {
          setLoading(false);
          console.error(err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL));
            setLoading(false);
          });
        }
      );
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control value={content} onChange={handleChange} as="textarea" rows={3} />
        </Form.Group>
      </Form>
      {percentage === 0 || percentage === 100 || (
        <ProgressBar
          variant="warning"
          label={`${percentage}%`}
          now={percentage}
          style={{ marginTop: "1rem" }}
        />
      )}
      <div>
        {errors.map((errorMsg) => (
          <p style={{ color: "red" }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            onClick={handleOpenImageRef}
            disabled={loading}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
      <input
        type="file"
        accept="image/jpeg, image/png"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default MessageForm;
