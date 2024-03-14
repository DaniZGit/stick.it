<template>
  <div>pages</div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: "dashboard",
  });

  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    const albumId = route.params.id;

    if (albumId) {
      router.push({ path: `/dashboard/albums/${albumId}` });
    } else {
      router.push({ path: `/dashboard/albums/` });
    }
  });
</script>

<style></style>
