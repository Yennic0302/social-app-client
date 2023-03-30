import { helpHttp } from "../helpers/helpHttp";
import {
  getFriendRequestRecieveRoute,
  getFriendRoute,
} from "../utils/APIRoutes";
import toastConfig from "../utils/toastConfig";

export const getFriends =
  (setLoading, toast, currentUser) => async (dispatch) => {
    setLoading(true);
    helpHttp()
      .get(`${getFriendRoute}/${currentUser._id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            setLoading(false);
            dispatch({ type: "SET_FRIENDS_OF_USER", payload: request.friends });
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

export const addFriend = (id, toast) => async (dispatch) => {
  try {
    helpHttp()
      .get(`${getFriendRequestRecieveRoute}/${id}`)
      .then((request) => {
        if (!request.error) {
          if (request.status) {
            dispatch({
              type: "ADD_FRIEND_USER",
              payload: request,
            });
            toast.success(
              `You have a friend request of ${request.username}`,
              toastConfig
            );
          }
        }
      });
  } catch (e) {
    console.log(e.message);
  }
};
