const getToken = () => {
  return localStorage.getItem("token");
};

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser") || "{}");
};

const setCurrentUser = (userObj: Record<string, any>) => {
  localStorage.setItem("currentUser", JSON.stringify(userObj));
};

const removeCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

const removeToken = () => {
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