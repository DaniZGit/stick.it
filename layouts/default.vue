<template>
  <div class="h-screen h-dvh w-screen grid grid-rows-12 grid-flow-row">
    <AppHeader class="row-span-1"></AppHeader>
    <div
      class="row-span-10 bg-app-primary text-app-secondary overflow-y-auto no-scrollbar overflow-hidden"
    >
      <slot />
    </div>
    <AppNav class="row-span-1"></AppNav>
  </div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();

  onMounted(() => {
    if (userStore.isLoggedIn()) {
      fetchUser();
    }
  });

  const fetchingUser = ref(false);
  const fetchUser = async () => {
    fetchingUser.value = true;
    try {
      const response = await useApi<{
        user: ApiUser;
      }>(`/v1/users/${userStore.user.id}`);

      if (response.user) {
        userStore.setUser(response.user);
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    fetchingUser.value = false;
  };
</script>

<style>
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.2s;
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translate(50%, 0);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translate(-50%, 0);
  }
  .slide-right-enter-from {
    opacity: 0;
    transform: translate(-50%, 0);
  }
  .slide-right-leave-to {
    opacity: 0;
    transform: translate(50%, 0);
  }
</style>
