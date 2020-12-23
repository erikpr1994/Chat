import storage from "./localstorage.js";
import fetchRequest from "./fetch.js";

const baseURL = "http://localhost:3000/";

window.addEventListener("load", (e) => {
  e.preventDefault();
  document.getElementById("login").addEventListener("click", login);
  document.getElementById("register").addEventListener("click", register);
});

const login = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const url = new URL(`${baseURL}login`);

  const params = { email, password };

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const result = await fetch(url);

  if (result.status === 200) {
    const { id } = await result.json();
    storage.saveLoggedUserId(id);
    storage.saveLooggedUserEmail(email);
    await fetchRequest.getUserData(email);
    window.location.replace(`${baseURL}main.html`);
  } else {
    alert("Usuario o email incorrecto");
  }
};

const register = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  const url = new URL(`${baseURL}register`);

  const result = await fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  });

  if (result.status === 201) {
    const res = await result.json();
    storage.saveLoggedUserId(res);
    storage.saveLooggedUserEmail(email);
    await fetchRequest.getUserData(email);
    window.location.replace(`${baseURL}main.html`);
  } else {
    alert("El usuario ya existe");
  }
};
