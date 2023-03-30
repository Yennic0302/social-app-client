import React, { useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NavVar from "../components/NavVar";
import { setCurrentUser } from "../actions/currentUser";
import { host } from "../utils/APIRoutes";
import { io } from "socket.io-client";
import Chat from "./Chat";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFriendRequests } from "../actions/requestFriends";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import Loader from "../assets/loader.gif";
import styled from "styled-components";
import SearchContact from "./SearchContact";
import RequestFriend from "./FriendRequests";
import Home from "./Home";
import Profile from "./Profile";
import ProfileUser from "./ProfileUser";
import NavMain from "../components/NavMain";

const Main = () => {
  const socket = useRef();
  const currentUser = useSelector((state) => state.currentUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const containerRef = useRef();
  const bodyAppRef = useRef();

  let mq = matchMedia("(max-width: 720px)");

  useEffect(() => {
    if (mq.matches) {
      if (
        location.pathname === "/chat" &&
        bodyAppRef.current.children.length === 2
      ) {
        if (bodyAppRef.current.children[0].children.length == 3) {
          bodyAppRef.current.children[0].children[2].style.display = "none";
          bodyAppRef.current.children[0].style.gridTemplateRows = "100%";
        }
      }
      if (
        location.pathname === "/home" &&
        bodyAppRef.current.children.length === 2
      ) {
        if (bodyAppRef.current.children[0].children.length == 2) {
          bodyAppRef.current.children[0].children[1].style.display = "block";
          bodyAppRef.current.children[0].style.gridTemplateRows = "90% 10%";
        }
      }
    } else {
      if (bodyAppRef.current.children.length === 2) {
        if (bodyAppRef.current.children[1].children.length === 3) {
          bodyAppRef.current.children[1].children[2].style.display = "none";
        }
      }
    }
  }, [mq]);

  useEffect(() => {
    dispatch(setCurrentUser(navigate));
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) return;
      else navigate("/set-avatar");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      dispatch(getFriendRequests(setLoading, toast, currentUser));
    }
  }, [currentUser]);

  return (
    <Container ref={containerRef}>
      {loading && (
        <Modal>
          <img src={Loader} alt="" />
        </Modal>
      )}
      <NavMain />
      <div className="app-body" ref={bodyAppRef}>
        <div className="reverse">
          <Routes>
            <Route>
              <Route path="/home" element={<Home />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/profile-user" element={<ProfileUser />} />
              <Route path="/chat/*" element={<Chat socket={socket} />}></Route>
              <Route
                path="/search-contact"
                element={<SearchContact socket={socket} />}
              ></Route>
              <Route
                path="/friend-requests"
                element={<RequestFriend socket={socket} />}
              ></Route>
            </Route>
          </Routes>
          <NavVar />
        </div>
        <div className="no-reverse">
          <NavVar />
          <Routes>
            <Route>
              <Route path="/home" element={<Home />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/profile-user" element={<ProfileUser />} />
              <Route path="/chat/*" element={<Chat socket={socket} />}></Route>
              <Route
                path="/search-contact"
                element={<SearchContact socket={socket} />}
              ></Route>
              <Route
                path="/friend-requests"
                element={<RequestFriend socket={socket} />}
              ></Route>
            </Route>
          </Routes>
        </div>
      </div>
    </Container>
  );
};

export default Main;

const Container = styled.div`
  height: 100vh;
  display: grid;
  margin: auto;
  grid-template-rows: 8% 92%;

  .app-body {
    height: 100%;
    .reverse {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: 90% 10%;
    }
    .no-reverse {
      width: 100%;
      height: 100%;
      display: none;
      grid-template-columns: 8% 98%;
    }
  }

  @media screen and (min-width: 720px) {
    height: 95vh;
    width: 100%;
  }

  @media screen and (min-width: 720px) {
    .app-body {
      .no-reverse {
        display: grid;
      }
      .reverse {
        display: none;
      }
    }
  }
`;
