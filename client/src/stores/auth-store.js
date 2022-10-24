import create from "zustand";
import { apiInstance } from "../api/instance";

let interval = 0;

export const authStore = create((set, get) => ({
  /**
   * @type {{firstName: string, lastName: string, email: string} | null}
   */
  user: null,

  /**
   * @type {string | null}
   */
  token: null,

  /**
   * @type {number}
   */
  interval: null,

  /**
   *
   * @param {{firstName: string, lastName: string, email: string}} user
   * @param {string} token
   * @returns
   */
  setUserAndToken: (user, token) => {
    console.log(user, token);

    // after 15 minutes, send request to /refresh-token to get a new token
    interval = setInterval(() => {
      apiInstance
        .post("/auth/refresh-token")
        .then((res) => {
          console.log(res);
          set(() => ({ token: res.data.token }));
        })
        .catch((err) => {
          console.log(err);
        });
    }, 15 * 60 * 1000);

    return set(() => ({ user: user, token: token }));
  },

  async logoutUser() {
    const response = await apiInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${get().token}`,
        },
      }
    );
    console.log(response);
    clearInterval(interval);
    return set(() => ({ user: null, token: null }));
  },
}));
