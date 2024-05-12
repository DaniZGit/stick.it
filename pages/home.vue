<template>
  <div>
    <h1>home</h1>
    <div>
      <span class="break-all">
        {{ userStore.user.token }}
      </span>
      <div class="p-16 flex flex-col">
        <NuxtLink to="/dashboard">DASHBOARD</NuxtLink>
        <NuxtLink to="/auth/login">LOGIN</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  setPageLayout("default");

  const userStore = useUserStore();
</script>

<style></style>
