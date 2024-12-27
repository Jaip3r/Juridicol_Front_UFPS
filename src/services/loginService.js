import axios from "./axios";

export function loginUser(credentials) {
    return axios
      .post("/auth/login", JSON.stringify(credentials),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        return {
          accessToken: response.data.data
        }
      });
}