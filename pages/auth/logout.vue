<template>
  <div></div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
  const router = useRouter();
  setPageLayout("guest");

  onMounted(() => {
    userStore.logout();
    router.push("/auth/login");
  });
</script>

<style></style>
