import styled from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { helpHttp } from "../helpers/helpHttp";
import { requestFriendRoute, searchUserRoute } from "../utils/APIRoutes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsArrowLeftCircle } from "react-icons/bs";
import Loader from "../assets/loader.gif";
import toastConfig from "../utils/toastConfig";
import UserCardContact from "../components/UserCardContact";
import { useNavigate } from "react-router-dom";

const SearchContact = ({ handleVisibleSearch, socket }) => {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const navigate = useNavigate();

  const searchUser = async (e) => {
    setLoading(true);
    helpHttp()
      .get(`${searchUserRoute}/${currentUser._id}?search=${e.target.value}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setSearch(request.resultSearch);
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(request.msg, toastConfig);
          }
        } else {
          setLoading(false);
          toast.error(request.statusText, toastConfig);
        }
      });
  };

  const sendRequestfriend = (user) => {
    let { _id, username, avatarImage, email } = currentUser;
    helpHttp()
      .post(`${requestFriendRoute}/${user._id}`, {
        headers: { "content-type": "application/json" },
        body: { _id, username, avatarImage, email },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            socket.current.emit("send-request-friend", {
              id: user._id,
              requestFriend: _id,
            });

            toast.success(request.msg, toastConfig);
          } else {
            toast.error(request.msg, toastConfig);
          }
        } else {
          toast.error(request.statusText, toastConfig);
        }
      });
  };

  return (
    <>
      <Container>
        <div className="input-search-container">
          <button onClick={() => navigate("/home")}>
            {<BsArrowLeftCircle />}
          </button>
          <input
            type="text"
            id="search-contact"
            onChange={searchUser}
            placeholder="Type a user"
            autoFocus
            autoComplete="off"
          />
        </div>
        <div className="results-search">
          <h3>results:</h3>
          {loading && (
            <div className="loader">
              <img src={Loader} alt="loader" />
            </div>
          )}
          {search.map((data) => (
            <UserCardContact
              key={data.user._id}
              sendRequestfriend={sendRequestfriend}
              data={data}
            />
          ))}
        </div>
      </Container>
      <ToastContainer />
    </>
  );
};

export default SearchContact;

const Container = styled.div`
  position: absolute;
  background-color: var(--bg-color-second);
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 10% 90%;
  animation: show 0.5s ease-in-out;
  z-index: 900;

  .input-search-container {
    width: 100%;
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 12% 88%;

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

    input {
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: transparent;
      outline: none;
      color: #fff;
      border-bottom: thin solid var(--second-color);
      transition: all 0.5s;
      z-index: 800;

      &::placeholder {
        color: #fff;
      }
      &:focus {
        border-bottom: thin solid var(--primary-color);
      }
    }
  }
  .results-search {
    color: white;
    width: 100%;
    background-color: var(--bg-color-second);
    padding: 0.5rem 1rem;
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
  }

  @keyframes show {
    0% {
      width: 80%;
    }
    100% {
      width: 100%;
    }
  }
`;
