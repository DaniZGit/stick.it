<template>
  <div class="h-full flex flex-col">
    <!-- Packs -->
    <div class="p-4">
      <div v-if="loadingPacks">loading...</div>
      <div v-else class="grid grid-cols-2 gap-x-4 gap-y-4">
        <AppItemPack
          v-for="(pack, i) in packs"
          :key="pack.id"
          :pack="pack"
          :class="{ 'z-50': i == 0 }"
        ></AppItemPack>
      </div>
    </div>
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  // fetch packs on load
  const packs = ref<Array<ApiPack>>();
  const loadingPacks = ref(false);
  onMounted(async () => {
    loadingPacks.value = true;
    try {
      const response = await useApi<{
        packs: Array<ApiPack>;
      }>("/v1/shop/packs");

      if (response.packs) {
        packs.value = response.packs;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingPacks.value = false;
  });
</script>

<style></style>
