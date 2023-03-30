export default (initialState = null, action) => {
  switch (action.type) {
    case "SET_CURRENT_CHAT":
      return action.payload;
    case "DEFAULT_CURRENT_CHAT":
      return null;
    default:
      return initialState;
  }
};
