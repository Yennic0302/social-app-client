import { combineReducers } from "redux";
import currentUser from "./currentUser";
import currentChat from "./currentChat/index";
import requestFriendsOfCurrentUser from "./requestFriendsOfCurrentUser";
import friendsOfCurrentUser from "./friendsOfCurrentUser";
import chatsOfCurrentUser from "./chatsOfCurrentUser";

export default combineReducers({
  currentUser,
  friendsOfCurrentUser,
  requestFriendsOfCurrentUser,
  currentChat,
  chatsOfCurrentUser,
});
