<template>
  <div class="h-full flex flex-col">
    <!-- Packs -->
    <div class="flex flex-col gap-y-4 p-4">
      <h2
        class="text-3xl font-bold tracking-widest border-b-2 border-app-secondary"
      >
        Packs
      </h2>
      <div v-if="loadingPacks" class="grid grid-cols-2 gap-x-4 gap-y-4">
        <AppSkeletonPackItem v-for="n in [1, 2]" :key="n"></AppSkeletonPackItem>
      </div>
      <div v-else class="grid grid-cols-2 gap-x-4 gap-y-4">
        <AppItemPack
          v-for="(pack, i) in packs"
          :key="pack.id"
          :pack="pack"
          :class="{ 'z-50': i == 0 }"
        ></AppItemPack>
      </div>
    </div>

    <!-- Bundles -->
    <div class="flex flex-col gap-y-4 p-4">
      <h2
        class="text-3xl font-bold tracking-widest border-b-2 border-app-secondary"
      >
        Colector's Tokens
      </h2>
      <div v-if="loadingPacks" class="grid grid-cols-3 gap-x-4 gap-y-4">
        <AppSkeletonBundleItem
          v-for="n in [1, 2, 3, 4, 5, 6]"
          :key="n"
        ></AppSkeletonBundleItem>
      </div>
      <div v-else class="grid grid-cols-3 gap-x-4 gap-y-4">
        <AppItemBundle
          v-for="(bundle, i) in bundles"
          :key="bundle.id"
          :bundle="bundle"
        ></AppItemBundle>
      </div>
    </div>
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  onMounted(() => {
    fetchPacks();
    // fetchBundles();
    bundles.value = [
      {
        id: "12",
        title: "Bagiful",
        price: 4.99,
        amount: 150,
        bonus: 25,
      },
      {
        id: "123",
        title: "Plentiful",
        price: 10.99,
        amount: 450,
        bonus: 75,
      },
      {
        id: "1234",
        title: "Chestful",
        price: 54.99,
        amount: 1500,
        bonus: 350,
      },
    ];
  });

  // fetch packs
  const packs = ref<Array<ApiPack>>();
  const loadingPacks = ref(false);
  const fetchPacks = async () => {
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
  };

  // fetches bundles
  const bundles = ref<Array<ApiBundle>>([]);
  const loadingBundles = ref(false);
</script>

<style></style>
