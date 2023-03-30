import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getAllMessageRoute, sendMessageRoute } from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import { helpHttp } from "../helpers/helpHttp";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../assets/loader.gif";
import toastConfig from "../utils/toastConfig";
import { setDefaultChat } from "../actions/currentChat";
import { createChatOrUpdate, readMessage } from "../actions/chatsUser";
import { setCurrentUser } from "../actions/currentUser";
import { useNavigate } from "react-router-dom";

const ChatContainer = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const currentUser = useSelector((state) => state.currentUser);
  const currentChat = useSelector((state) => state.currentChat);
  const chatsOfCurrentUser = useSelector((state) => state.chatsOfCurrentUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current.children.length === 4) {
      containerRef.current.children[3].style.position = "absolute";
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    helpHttp()
      .post(getAllMessageRoute, {
        headers: { "content-type": "application/json" },
        body: {
          from: currentUser._id,
          to: currentChat.userId,
        },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setMessages(request.messages);
            setLoading(false);
          } else {
            toast.error(request.msg);
            setLoading(false);
          }
        } else {
          toast.error(request.statusText);
          setLoading(false);
        }
      });
  }, [currentChat]);

  const handleSendMsg = (msg) => {
    helpHttp()
      .post(sendMessageRoute, {
        headers: {
          "content-type": "application/json",
        },
        body: {
          from: currentUser._id,
          to: currentChat.userId,
          message: msg,
        },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch(
              createChatOrUpdate(
                msg,
                chatsOfCurrentUser,
                socket,
                currentUser,
                currentChat
              )
            );

            socket.current.emit("send-msg", {
              to: currentChat.userId,
              from: currentUser._id,
              message: msg,
            });
            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: msg });
            setMessages(msgs);
          } else {
            toast.error(request.msg, toastConfig);
          }
        } else {
          toast.error(request.statusText, toastConfig);
        }
      });
  };

  useEffect(() => {
    if (currentChat.view == false) {
      dispatch(readMessage(currentUser, currentChat, currentChat.lastMessage));
    }
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({ fromSelf: false, message: data.message, data });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (arrivalMessage) {
      if (arrivalMessage.data.from === currentChat.userId) {
        setMessages((prev) => [...prev, arrivalMessage]);
        dispatch(readMessage(currentUser, currentChat, arrivalMessage.message));
      }
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      <Container ref={containerRef}>
        <div className="chat-header">
          <button
            onClick={() => {
              dispatch(setCurrentUser(navigate, null));
              dispatch(setDefaultChat());
            }}
          >
            {<BsArrowLeftCircle />}
          </button>
          <div className="user-details">
            <div className="avatar">
              <img src={currentChat.avatarImage} alt="avatar" />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>
        <div className="chat-messages">
          {loading && (
            <div className="loader">
              <img src={Loader} alt="loader" />
            </div>
          )}
          {messages.map((msg, index) => (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${msg.fromSelf ? "sended" : "recieved"}`}
              >
                <p className="content">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
        <ToastContainer />
      </Container>
    </>
  );
};

export default ChatContainer;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  background-color: var(--bg-color-second);
  z-index: 400;

  @media screen and (min-width: 720px) {
    position: relative;
    top: 0;
    left: 0;
    height: 92vh;
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 0 1rem;
    padding: 0 0.5rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        width: 3rem;
        background-color: var(--bg-color-second);
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }

    button {
      color: var(--second-color);
      font-size: 1.4rem;
      display: flex;
      padding: 0.5rem 0;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.5s;
      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    .loader {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 3rem;
      }
    }

    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 1rem;
        font-weight: 500;
        color: #111;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: var(--primary-color);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: var(--second-color);
      }
    }
  }
`;
