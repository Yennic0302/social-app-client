export default (requestsFriends = [], action) => {
  switch (action.type) {
    case "SET_REQUEST_FRIENDS_OF_USER":
      return action.payload;
    case "UPDATE_REQUEST_FRIEND_USER":
      let newRequestsFriends = requestsFriends.filter(
        (request) => request._id !== action.payload
      );
      return newRequestsFriends;
    case "ADD_REQUEST_FRIEND_USER":
      return [...requestsFriends, action.payload];
    case "DEFAULT_REQUEST_FRIENDS_OF_USER":
      return requestsFriends;
    default:
      return requestsFriends;
  }
};
