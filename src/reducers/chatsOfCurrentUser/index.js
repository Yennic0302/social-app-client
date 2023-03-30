export default (chats = [], action) => {
  switch (action.type) {
    case "SET_CHATS_OF_USER":
      return action.payload;
    case "ADD_CHAT_USER":
      return [...chats, action.payload];
    case "ADD_CHAT_USER_RECEIVED":
      return [...chats, action.payload];
    case "UPDATE_CHAT_SEND_MESSAGE": {
      const chatUpdate = chats.find(
        (chat) => chat.userId == action.payload.userId
      );
      const filterChats = chats.filter(
        (chat) => chat.userId !== action.payload.userId
      );
      filterChats.unshift({
        ...chatUpdate,
        lastMessage: action.payload.lastMessage,
      });
      return filterChats;
    }

    case "UPDATE_CHAT_RECEIVED_MESSAGE": {
      const chatUpdate = chats.find(
        (chat) => chat.userId === action.payload.chatFromUser
      );

      const filterChats = chats.filter(
        (chat) => chat.userId !== action.payload.chatFromUser
      );

      filterChats.unshift({
        ...chatUpdate,
        lastMessage: action.payload.lastMessage,
        view: false,
        messagesPending: chatUpdate.messagesPending + 1,
      });

      return filterChats;
    }

    case "READ_CHAT": {
      const chatUpdate = chats.find(
        (chat) => chat.userId === action.payload.userId
      );

      const filterChats = chats.filter(
        (chat) => chat.userId !== action.payload.userId
      );

      filterChats.unshift({
        ...chatUpdate,
        view: true,
        messagesPending: 0,
        lastMessage: action.payload.lastMessage,
      });

      return filterChats;
    }
    default:
      return chats;
  }
};
