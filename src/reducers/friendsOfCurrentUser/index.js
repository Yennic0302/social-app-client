export default (friends = [], action) => {
  switch (action.type) {
    case "SET_FRIENDS_OF_USER":
      return action.payload;
    case "ADD_FRIEND_USER":
      return [...friends, action.payload];
    default:
      return friends;
  }
};
