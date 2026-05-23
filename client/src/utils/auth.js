export const getSession = () => JSON.parse(localStorage.getItem("session") || "null");

export const setSession = (session) => {
  localStorage.setItem("session", JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem("session");
  localStorage.removeItem("admin");
};
