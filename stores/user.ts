import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User>({
      id: "",
      username: "",
      email: "",
      token: "",
      tokens: 0,
      created_at: "",
    });

    const getUser = () => {
      return user;
    };

    const getToken = () => {
      return user.value.token;
    };

    const setUser = (data: User) => {
      user.value = data;
    };

    const logout = () => {
      user.value = <User>{
        id: "",
        username: "",
        email: "",
        token: "",
        created_at: "",
      };
    };

    const isLoggedIn = () => {
      return user.value.token && user.value.token.length > 0;
    };

    return { user, getUser, getToken, setUser, logout, isLoggedIn };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
