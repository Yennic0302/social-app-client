import React from "react";
import {
  BsFillPersonLinesFill,
  BsChatDotsFill,
  BsSearch,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logut from "./Logut";

const NavVar = ({ navVarRef }) => {
  const currentUser = useSelector((state) => state.currentUser);
  const navigate = useNavigate();

  return (
    <>
      {currentUser && (
        <Container ref={navVarRef}>
          <div className="options-container">
            <nav className="btn-options">
              <button
                className="btn-profile"
                onClick={() => navigate(`/profile-user`)}
              >
                <img src={currentUser.avatarImage} alt={currentUser.usera} />
              </button>
              <button onClick={() => navigate("./chat")}>
                {<BsChatDotsFill />}
              </button>
              <button onClick={() => navigate("./friend-requests")}>
                {<BsFillPersonLinesFill />}
              </button>
              <button onClick={() => navigate("./search-contact")}>
                {<BsSearch />}
              </button>
              <Logut />
            </nav>
          </div>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: relative;
  bottom: 0;
  width: 100%;
  height: 100%;
  .options-container {
    display: flex;
    width: 100%;
    align-items: center;
    transition: all 0.5s;
    h3 {
      color: white;
    }
    .btn-options {
      width: 100%;
      display: flex;
      background-color: var(--bg-color-primary);
      align-items: center;
      justify-content: space-around;
      button {
        color: var(--second-color);
        margin: 0.8rem 0rem;
        font-size: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:hover {
          color: var(--primary-color);
        }
      }

      .btn-profile {
        height: 2rem;
        width: 2rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  @media screen and (min-width: 720px) {
    .options-container {
      margin: 0.2rem;
      display: flex;
      align-items: center;
      padding: 1rem;
      transition: all 0.5s;
      .btn-options {
        display: flex;
        background-color: var(--bg-color-primary);
        padding: 1.5rem;
        margin: 1.5rem 0;
        border-radius: 1rem;
        flex-direction: column;
        align-items: center;
        gap: 0 1rem;
      }
    }
  }
`;

export default NavVar;
