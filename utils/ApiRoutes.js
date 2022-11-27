export const host = "https://chat-siris-v2-server.vercel.app";

export const registerRoutes = `${host}/api/auth/register`;
export const loginRoutes = `${host}/api/auth/login`;
export const createChannelRoutes = `${host}/api/auth/createChannel`;
export const getAllChannelsRoutes = `${host}/api/auth/getAllChannels`;
export const sendMessageRoutes = `${host}/api/auth/sendMessage`;
export const getMessageRoutes = `${host}/api/auth/getMessages`;
export const addUserToChannel = `${host}/api/auth/addUserToChannel`;
export const addChannelToUser = `${host}/api/auth/addChannelToUser`;
export const fetchUserRoom = `${host}/api/auth/fetchUserRoom`;
export const updateUser = `${host}/api/auth/updateUser`;
export const updateBackground = `${host}/api/auth/deleteBackground`;
export const updateName = `${host}/api/auth/updateName`;
export const updateAvatarImage = `${host}/api/auth/updateAvatar`;
export const findChannelRoute = `${host}/api/auth/findChannelRoute`;
export const deleteMessageRoute =  `${host}/api/auth/deleteMessage`;