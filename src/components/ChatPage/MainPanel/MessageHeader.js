import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import { FaLock } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

function MessageHeader() {
  return (
    <div
      style={{
        width: "100%",
        height: "170px",
        border: " 0.2rem solid #ececec",
        borderRadius: "4px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              <FaLock />
              ChatRoomName
              <MdFavorite />
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <p>
              <Image src="" /> username
            </p>
          </div>
        </Row>
        <Row>
          <Col>
            <Accordion defaultActiveKey="0">
              {/* <Accordion.Item>
                <Accordion.Header>Accordion Item #1</Accordion.Header>
                <Accordion.Body>Lorem ipsum dolor sit amet,</Accordion.Body>
              </Accordion.Item> */}
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              {/* <Accordion.Item eventKey="1">
                <Accordion.Header>Accordion Item #2</Accordion.Header>
                <Accordion.Body>Lorem ipsum dolor sit amet, consectetur</Accordion.Body>
              </Accordion.Item> */}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
