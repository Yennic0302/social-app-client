import { helpHttp } from "../helpers/helpHttp";
import {
  acceptFriendRoute,
  declineFriendRoute,
  getFriendRequestRecieveRoute,
  getRequestFriendRoute,
} from "../utils/APIRoutes";
import toastConfig from "../utils/toastConfig";

export const getFriendRequests =
  (setLoading, toast, currentUser) => async (dispatch) => {
    try {
      setLoading(true);
      helpHttp()
        .get(`${getRequestFriendRoute}/${currentUser._id}`)
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              setLoading(false);
              dispatch({
                type: "SET_REQUEST_FRIENDS_OF_USER",
                payload: request.requestFriends,
              });
            } else {
              setLoading(false);
              toast.error(request.msg, toastConfig);
            }
          } else {
            setLoading(false);
            toast.error(request.statusText, toastConfig);
          }
        });
    } catch (e) {
      console.log(e.message);
    }
  };

export const addFriendRequest = (id, toast) => async (dispatch) => {
  try {
    helpHttp()
      .get(`${getFriendRequestRecieveRoute}/${id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch({
              type: "ADD_REQUEST_FRIEND_USER",
              payload: request.friendRequest,
            });
            toast.success(
              `You have a friend request of ${request.friendRequest.username}`,
              toastConfig
            );
          }
        }
      });
  } catch (e) {
    console.log(e.message);
  }
};

export const acceptFriendRequest =
  (data, currentUser, toast, socket) => async (dispatch) => {
    if (data) {
      helpHttp()
        .post(`${acceptFriendRoute}/${currentUser._id}`, {
          headers: {
            "content-type": "application/json",
          },
          body: data,
        })
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              socket.current.emit("acceted-friend", {
                id: data._id,
                idFriend: request.userToFriend,
              });
              dispatch({
                type: "UPDATE_REQUEST_FRIEND_USER",
                payload: data._id,
              });
              dispatch({
                type: "ADD_FRIEND_USER",
                payload: data,
              });
              toast.success(request.msg, toastConfig);
            } else {
              toast.error(request.msg, toastConfig);
            }
          } else {
            toast.error(request.statusText, toastConfig);
          }
        });
    }
  };

export const declineFriendRequest =
  (data, currentUser, toast) => async (dispatch) => {
    if (data) {
      let idTo = currentUser._id;
      helpHttp()
        .post(`${declineFriendRoute}/${currentUser._id}`, {
          headers: {
            "content-type": "application/json",
          },
          body: { ...data, idTo },
        })
        .then((request) => {
          if (!request.error) {
            if (request.status) {
              dispatch({
                type: "UPDATE_REQUEST_FRIEND_USER",
                payload: data._id,
              });
              toast.success(request.msg, toastConfig);
            } else {
              toast.success(request.msg, toastConfig);
            }
          } else {
            toast.error(request.statusText, toastConfig);
          }
        });
    }
  };
