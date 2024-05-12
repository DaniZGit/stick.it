<template>
  <div
    v-if="!$route.query.t"
    class="w-full h-full flex flex-col items-center justify-center text-center gap-y-4 p-4"
  >
    <h2 class="text-2xl font-bold">Check your email for cofirmation mail</h2>
    <Icon name="i-mdi:email-alert-outline" size="64" />
  </div>
  <div v-else class="w-full h-full flex justify-center p-4">
    <div
      v-if="confirmingMail"
      class="flex flex-col justify-center items-center text-center gap-y-4"
    >
      <h2 class="text-2xl font-bold">Confirming email...</h2>
      <Icon name="i-svg-spinners:6-dots-scale-middle" size="64" />
    </div>
    <div
      v-else
      class="flex flex-col justify-center items-center text-center gap-y-4"
    >
      <h2 class="text-2xl font-bold">Email has been confirmed<br /></h2>
      <Icon name="i-line-md:check-all" size="64" />
      <h2 class="text-xl font-bold">redirecting to home page...<br /></h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
  setPageLayout("guest");

  const userStore = useUserStore();
  const route = useRoute();

  onMounted(() => {
    if (userStore.isLoggedIn()) {
      navigateTo({ path: "/home" }, { redirectCode: 301 });
      return;
    }

    if (route.query.t) {
      confirmUserMail();
    }
  });

  const emailIsConfirmed = ref(false);
  const confirmingMail = ref(false);
  const confirmUserMail = async () => {
    confirmingMail.value = true;
    try {
      const response = await useApi<{ user: ApiUser }>("/v1/confirmation", {
        method: "PUT",
        body: {
          token: route.query.t,
        },
      });

      if (response.user) {
        userStore.setUser(response.user);

        setTimeout(() => {
          // redirect to home page
          navigateTo({ path: "/home" }, { redirectCode: 301 });
        }, 3000);
      }

      emailIsConfirmed.value = true;
    } catch (error) {
      console.log("error", error);
    }
    confirmingMail.value = false;
  };
</script>

<style></style>
