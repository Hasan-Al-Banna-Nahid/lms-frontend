import Cookies from "js-cookie";

/**
 * Utility to set authentication token in secure cookies
 * @param token - JWT Token string
 */
export const setAuthToken = (token: string) => {
  Cookies.set("access_token", token, {
    expires: 7, // Token valid for 7 days
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "strict", // Protect against CSRF
  });
};

/**
 * Utility to clear authentication data
 */
export const logoutUser = () => {
  Cookies.remove("access_token");
};
