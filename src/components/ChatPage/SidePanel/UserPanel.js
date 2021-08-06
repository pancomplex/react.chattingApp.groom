import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../../firebase";
import mime from "mime-types";
import { setPhotoURL } from "../../../redux/actions/user_action";

import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { IoIosChatboxes } from "react-icons/io";

function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const inputOpenImageRef = useRef();
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.lookup(file.name) };

    try {
      let uploadTaskSnapshot = await firebase
        .storage()
        .ref()
        .child(`user_image/${user.uid}`)
        .put(file, metadata);

      let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
      await firebase.auth().currentUser.updateProfile({ photoURL: downloadURL });
      dispatch(setPhotoURL(downloadURL));

      await firebase.database().ref("users").child(user.uid).update({ image: downloadURL });
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      <h3 style={{ color: "white" }}>
        <IoIosChatboxes />
      </h3>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={user && user.photoURL}
          style={{
            width: "30px",
            height: "30px",
            marginTop: "3px",
          }}
          roundedCircle
        />

        <Dropdown>
          <Dropdown.Toggle
            style={{
              background: "transparent",
              border: "0px",
            }}
            id="dropdown-basic"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImageRef}>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

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

export default UserPanel;
