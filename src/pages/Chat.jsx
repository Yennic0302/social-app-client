import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import UserFriends from "../components/UserFriends";
import { toast, ToastContainer } from "react-toastify";
import ChatContainer from "../components/ChatContainer";
import Modal from "../components/Modal";
import Loader from "../assets/loader.gif";
import ChatsUser from "../components/ChatsUser";
import { addFriendRequest } from "../actions/requestFriends";
import { addFriend, getFriends } from "../actions/friendsUser";
import {
  getChatsOfCurrentUser,
  updateChatRecieveMessage,
} from "../actions/chatsUser";
import toastConfig from "../utils/toastConfig";
import { BsChatRightTextFill } from "react-icons/bs";

export default function Chat({ socket }) {
  const [visibleFriends, setVisibleFriends] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const currentChat = useSelector((state) => state.currentChat);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUpdateChat = (data) => {
    if (currentUser.currentChat !== data.chatFromUser) {
      dispatch(updateChatRecieveMessage(data, currentUser));
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("received-create-chat", (data) => {
        dispatch({ type: "ADD_CHAT_USER_RECEIVED", payload: data });
      });

      socket.current.on("received-update-chat", (data) => {
        handleUpdateChat(data);
      });

      socket.current.on("request-recieve", (idOfRequestFriend) => {
        dispatch(addFriendRequest(idOfRequestFriend, toast, toastConfig));
      });

      socket.current.on("request-accept", (idFriend) => {
        dispatch(addFriend(idFriend, toast, toastConfig));
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (currentUser) {
      dispatch(getChatsOfCurrentUser(setLoading, toast, currentUser));
      dispatch(getFriends(setLoading, toast, currentUser));
    }
  }, [currentUser]);

  return (
    <>
      {loading && (
        <Modal>
          <img src={Loader} alt="" />
        </Modal>
      )}
      <Container>
        <div className="container">
          {visibleFriends && (
            <UserFriends setVisibleFriends={setVisibleFriends} />
          )}
          <button
            className="btn-show-friend"
            onClick={() => setVisibleFriends(true)}
          >
            {<BsChatRightTextFill />}
          </button>
          <ChatsUser />
        </div>
        {currentChat ? <ChatContainer socket={socket} /> : null}
        {!currentChat && (
          <div className="welcome">
            {currentUser && (
              <h1>
                Welcome <span>{currentUser.username} ...</span>
              </h1>
            )}
          </div>
        )}
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: auto;
  display: grid;
  background-color: var(--bg-color-second);

  .welcome {
    display: none;
  }

  @media screen and (min-width: 720px) {
    grid-template-columns: 35% 65%;
    .welcome {
      display: flex;
      justify-content: center;
      align-items: center;
      h1 {
        color: white;
        font-size: 3.5rem;
        span {
          color: var(--second-color);
        }
      }
    }
  }
  @media screen and (min-width: 1024px) {
    grid-template-columns: 25% 75%;
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-second);
    display: grid;
  }

  .request-friend-container {
    position: relative;
  }

  .btn-show-friend {
    position: absolute;
    height: 2.8rem;
    width: 2.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    border-radius: 50%;
    padding: 0.4rem;
    color: var(--second-color);
    background-color: var(--bg-color-primary);
    bottom: 0;
    right: 0;
    cursor: pointer;
    border: none;
    margin: 2rem;
    transition: all 0.5s;
    &:hover {
      color: var(--primary-color);
    }
  }

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
`;
