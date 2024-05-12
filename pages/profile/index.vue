<template>
  <div>{{ userStore.user.username }}'s profile</div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
</script>

<style></style>
