export default (initialState = null, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return action.payload;
    default:
      return initialState;
  }
};
