import storage from "./localstorage.js";

const baseURL = "http://localhost:3000/";

const getUserData = async (email) => {
  const url = new URL(`${baseURL}getData`);
  const params = { email };

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  const result = await fetch(url);
  const data = await result.json();

  storage.saveData({ friends: data.friends, chats: data.chats });
};

export default { getUserData };
