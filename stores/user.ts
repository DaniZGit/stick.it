import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<ApiUser>({
      id: "",
      username: "",
      email: "",
      description: null,
      token: "",
      tokens: 0,
      created_at: "",
      available_free_packs: 0,
      last_free_pack_obtain_date: "",
      role_id: null,
      avatar: null,
      avatar_id: "",
    });

    const getUser = () => {
      return user;
    };

    const getToken = () => {
      return user.value.token;
    };

    const setUser = (data: ApiUser) => {
      user.value = data;
    };

    const logout = () => {
      user.value = <ApiUser>{
        id: "",
        username: "",
        email: "",
        description: null,
        token: "",
        tokens: 0,
        created_at: "",
        available_free_packs: 0,
        last_free_pack_obtain_date: "",
        avatar: null,
        avatar_id: "",
        role_id: null,
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
