<template>
  <div></div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
  const router = useRouter();

  onMounted(() => {
    userStore.logout();
    router.push("/auth/login");
  });
</script>

<style></style>
