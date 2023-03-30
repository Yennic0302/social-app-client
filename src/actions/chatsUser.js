import { helpHttp } from "../helpers/helpHttp";
import {
  createChat,
  getChats,
  readChat,
  updateChat,
  updateChatRecieveMessageRoute,
} from "../utils/APIRoutes";
import toastConfig from "../utils/toastConfig";

export const getChatsOfCurrentUser =
  (setLoading, toast, currentUser) => async (dispatch) => {
    setLoading(true);
    helpHttp()
      .get(`${getChats}/${currentUser._id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setLoading(false);
            dispatch({ type: "SET_CHATS_OF_USER", payload: request.chats });
          } else {
            toast.error(request.statusText, toastConfig);
            setLoading(false);
          }
        } else {
          setLoading(false);

          toast.error(request.statusText, toastConfig);
        }
      });
  };

export const readMessage =
  (currentUser, currentChat, lastMessage) => async (dispatch) => {
    helpHttp()
      .put(`${readChat}/${currentUser._id}`, {
        headers: { "Content-Type": "application/json" },
        body: { userId: currentChat.userId, lastMessage },
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch({
              type: "READ_CHAT",
              payload: { userId: currentChat.userId, lastMessage },
            });
          }
        }
      });
  };

export const updateChatRecieveMessage =
  (data, currentUser) => async (dispatch) => {
    helpHttp()
      .put(`${updateChatRecieveMessageRoute}/${currentUser._id}`, {
        headers: { "Content-Type": "application/json" },
        body: data,
      })
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch({
              type: "UPDATE_CHAT_RECEIVED_MESSAGE",
              payload: data,
            });
          }
        }
      });
  };

const createNewChat = (msg, socket, currentUser, currentChat, dispatch) => {
  helpHttp()
    .post(`${createChat}/${currentUser._id}`, {
      headers: { "Content-type": "application/json" },
      body: {
        ...currentChat,
        lastMessage: msg,
      },
    })
    .then((request) => {
      if (!request.error) {
        if (request.status) {
          socket.current.emit("create-chat", request.createChatReceiver);
          dispatch({
            type: "ADD_CHAT_USER",
            payload: request.createChatSender,
          });
        } else {
          console.error(request.msg);
        }
      } else {
        console.error(request.statusText);
      }
    });
};

const updateChatSendMsg = (msg, socket, currentUser, currentChat, dispatch) => {
  helpHttp()
    .put(`${updateChat}/${currentUser._id}`, {
      headers: { "Content-type": "application/json" },
      body: {
        ...currentChat,
        lastMessage: msg,
      },
    })
    .then((request) => {
      if (!request.error) {
        if (request.status) {
          socket.current.emit("update-chat", {
            chatFromUser: currentUser._id,
            userId: currentChat.userId,
            lastMessage: msg,
          });
          dispatch({
            type: "UPDATE_CHAT_SEND_MESSAGE",
            payload: {
              userId: currentChat.userId,
              lastMessage: msg,
            },
          });
        } else {
          console.error(request.msg);
        }
      } else {
        console.error(request.statusText);
      }
    });
};

export const createChatOrUpdate =
  (msg, chatsOfCurrentUser, socket, currentUser, currentChat) =>
  async (dispatch) => {
    const findChat = chatsOfCurrentUser.find(
      (chat) => chat.userId == currentChat.userId
    );

    if (!findChat)
      createNewChat(msg, socket, currentUser, currentChat, dispatch);
    else updateChatSendMsg(msg, socket, currentUser, currentChat, dispatch);
  };
