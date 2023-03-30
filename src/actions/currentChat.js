export const setCurrentChat = (chat) => async (dispatch) => {
  try {
    let currentChat = { ...chat, userId: chat._id };
    dispatch({ type: "SET_CURRENT_CHAT", payload: currentChat });
  } catch (e) {
    console.log(e.message);
  }
};

export const setDefaultChat = () => async (dispatch) => {
  try {
    dispatch({ type: "DEFAULT_CURRENT_CHAT" });
  } catch (e) {
    console.log(e.message);
  }
};
