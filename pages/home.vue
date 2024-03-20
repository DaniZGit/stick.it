<template>
  <div>
    <h1>home</h1>
    <div>
      {{ userStore.user }}
      <div class="p-16 flex flex-col">
        <NuxtLink to="/dashboard">DASHBOARD</NuxtLink>
        <NuxtLink to="/auth/login">LOGIN</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
</script>

<style></style>
