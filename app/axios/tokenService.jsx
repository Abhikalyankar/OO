const hasLocalStorage = typeof localStorage !== "undefined" && localStorage !== null;

const getToken = () => {
  if (!hasLocalStorage) return null;
  return localStorage.getItem("token");
};

const setToken = (token) => {
  if (!hasLocalStorage) return;
  localStorage.setItem("token", token);
};

const getCurrentUser = () => {
  if (!hasLocalStorage) return {};
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch (e) {
    return {};
  }
};

const setCurrentUser = (userObj) => {
  if (!hasLocalStorage) return;
  localStorage.setItem("currentUser", JSON.stringify(userObj));
};

const removeCurrentUser = () => {
  if (!hasLocalStorage) return;
  localStorage.removeItem("currentUser");
};

const removeToken = () => {
  if (!hasLocalStorage) return;
  localStorage.removeItem("token");
};

const TokenService = {
  getToken,
  setToken,
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  removeToken,
};

export default TokenService;
