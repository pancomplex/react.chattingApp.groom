import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import firebase from "../../../firebase";
import { setCurrentChatRoom, setPrivateChatRoom } from "../../../redux/actions/chatRoom_action";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { FaRegSmileWink, FaPlus } from "react-icons/fa";

function ChatRooms() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chatRoomsRef, setChatRoomsRef] = useState(firebase.database().ref("chatRooms"));
  const [messagesRef, setMessagesRef] = useState(firebase.database().ref("messages"));
  const [chatRooms, setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  const [notifications, setNotifications] = useState([]);

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector((state) => state.chatRoom.currentChatRoom);

  const dispatch = useDispatch();

  useEffect(() => {
    addChatRoomsListeners();
  }, [chatRooms]);

  // componentWillUnmount() {
  //   this.state.chatRooms.off();
  // }

  // let chatRoomsArray = [];

  // chatRoomsRef.on("child_added", (DataSnapshot) => {
  //   chatRoomsArray.push(DataSnapshot.val());
  //   setChatRooms(chatRoomsArray);
  // });

  const addChatRoomsListeners = () => {
    let chatRoomsArray = [];
    chatRoomsRef.on("child_added", (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      // console.log("chatRoomsArray :", chatRoomsArray);
      setChatRooms(chatRoomsArray);
      addNotificationListener(DataSnapshot.key);
    });
  };

  const addNotificationListener = (chatRoomId) => {
    messagesRef.child(chatRoomId).on("value", (DataSnapshot) => {
      if (currentChatRoom) {
        handleNotification(chatRoomId, currentChatRoom.id, notifications, DataSnapshot);
      }
    });
  };

  const handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
    let index = notifications.findIndex((notification) => notification.id === chatRoomId);

    setNotifications();
  };

  useEffect(() => {
    setFirstChatRoom();
  }, [chatRooms]);

  const setFirstChatRoom = () => {
    const firstChatRoom = chatRooms[0];
    if (firstLoad && chatRooms.length > 0) {
      dispatch(setCurrentChatRoom(firstChatRoom));
      setActiveChatRoomId(firstChatRoom.id);
      setFirstLoad(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid(name, description)) {
      addChatRooms();
    }
  };

  const isFormValid = (name, description) => name && description;

  const addChatRooms = async () => {
    const key = chatRoomsRef.push().key;
    const user = currentUser;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      await chatRoomsRef.child(key).update(newChatRoom);
      setName("");
      setDescription("");
      setShow(false);
    } catch (error) {}
  };

  const renderChatRooms = (chatRooms) => {
    if (chatRooms.length > 0) {
      return chatRooms.map((room) => (
        <li
          key={room.id}
          onClick={() => changeChatRoom(room)}
          style={{
            backgroundColor: room.id === activeChatRoomId && "#ffffff45",
            cursor: "pointer",
          }}
        >
          # {room.name}
          <Badge style={{ float: "right", backgroundColor: "crimson" }} bg="danger">
            1
          </Badge>
        </li>
      ));
    }
  };

  const changeChatRoom = (room) => {
    setActiveChatRoomId(room.id);
    dispatch(setCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaRegSmileWink style={{ marginRight: 3 }} />
        CHAT ROOMS {""} ({chatRooms.length})
        <FaPlus
          style={{
            position: "absolute",
            right: 0,
            cursor: "pointer",
          }}
          onClick={handleShow}
        />
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>{renderChatRooms(chatRooms)}</ul>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a chat room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>방 이름</Form.Label>
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter a chat room name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>방 설명</Form.Label>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Enter a chat room description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChatRooms;
