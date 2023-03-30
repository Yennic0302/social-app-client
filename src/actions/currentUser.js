export const setCurrentUser = (navigate, currentChat) => async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("yen-app-user"));
    if (!user) navigate("/login");
    else
      dispatch({ type: "SET_CURRENT_USER", payload: { ...user, currentChat } });
  } catch (e) {
    console.log(e.message);
  }
};
