<template>
  <div>
    <h1>home</h1>
    <div>
      {{ userStore.getUser() }}
      {{ data }}
    </div>
    <button @click="execute">click</button>
  </div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
  const { data, execute } = useFetch(
    "https://jsonplaceholder.typicode.com/todos",
    {
      $fetch: useNuxtApp().$api,
      immediate: false,
    }
  );
</script>

<style></style>
