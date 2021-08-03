import React from "react";

import { useSelector } from "react-redux";

import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";

// import './ChatPage.css'

function ChatPage() {
  const currentChatRoom = useSelector((state) => state.currentChatRoom);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel />
      </div>
      <div style={{ width: "100%" }}>
        <MainPanel key={currentChatRoom && currentChatRoom.id} />
      </div>
    </div>
  );
}

export default ChatPage;
