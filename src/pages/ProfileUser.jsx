import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "../components/Modal";
import Loader from "../assets/loader.gif";
import { useDispatch, useSelector } from "react-redux";
import NewPost from "../components/newPost";

const ProfileUser = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser);
  const [isOpenNewPost, setIsOpenNewPost] = useState(false);

  return (
    <>
      {loading && (
        <Modal>
          <img src={Loader} alt="" />
        </Modal>
      )}
      {isOpenNewPost && (
        <Modal>
          <NewPost setIsOpenNewPost={setIsOpenNewPost} />
        </Modal>
      )}
      {currentUser && (
        <Container>
          <div className="container-user-info">
            <div>
              <div className="profile-picture-container">
                <img src={currentUser.avatarImage} alt="avatar profile" />
              </div>
              <div className="nav-user-info">
                <h2 className="username">{currentUser.username}</h2>
                <button onClick={() => setIsOpenNewPost(!isOpenNewPost)}>
                  +
                </button>
              </div>
            </div>
            <div className="user-info">
              <div className="description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
                non itaque temporibus nam autem neque ipsum eum rerum debitis ea
                repellat mollitia quaerat, nihil sed labore odio explicabo
                quisquam eius.
              </div>
            </div>
          </div>
          <div></div>
        </Container>
      )}
    </>
  );
};

export default ProfileUser;

const Container = styled.div`
  position: relative;
  max-width: 1370px;
  margin: auto;
  height: 100%;
  top: 0;
  left: 0;
  color: #fff;

  .container-user-info {
    border-bottom: 1px solid #555;
    max-width: 970px;
    margin: auto;
    display: flex;

    .profile-picture-container {
      border-radius: 50%;
      height: 8rem;
      margin: 2rem;
      overflow: hidden;
      display: flex;
      justify-content: center;
      width: 8rem;
      background-color: var(--bg-color-second);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user-info {
      width: 80%;
      margin: auto;
      padding: 2rem;
      position: relative;

      .nav-user-info {
        display: flex;

        .username {
          position: relative;
          margin: 0 0.5rem;
        }

        button {
          background: var(--second-color);
          min-width: 2rem;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          color: #fff;
          font-weight: 700;
          border-radius: 0.5rem;
          cursor: pointer;
          max-width: fit-content;
          margin: 0 0.3rem;
        }

        button:hover {
          background: var(--primary-color);
        }
      }
      .description {
        width: 75%;
        padding: 1rem;
      }
    }
  }
`;
