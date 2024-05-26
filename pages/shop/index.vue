<template>
  <div class="h-full flex flex-col">
    <!-- Packs -->
    <div class="flex flex-col gap-y-4 p-4">
      <h2
        class="text-3xl font-bold tracking-widest border-b-2 border-app-secondary"
      >
        Packs
      </h2>
      <div
        v-if="loadingPacks && !packs?.length"
        class="grid grid-cols-2 gap-x-4 gap-y-4"
      >
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
      <div
        v-if="loadingBundles && !bundles?.length"
        class="grid grid-cols-3 gap-x-4 gap-y-4"
      >
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
          @click="onBundleClick(bundle)"
        ></AppItemBundle>
      </div>
    </div>

    <!-- buy bundle modal -->
    <AppModalShopBundleBuy
      v-model:visible="showBuyBundleModal"
      :modal="true"
      :draggable="false"
      :bundle="selectedBundle"
    ></AppModalShopBundleBuy>

    <!-- Toasties -->
    <AppToast position="top-center" :closable="true" group="buy_group" />
    <!-- Progress bar -->
    <div class="fixed bottom-0 left-0 right-0 h-[2px]">
      <AppSyncBar v-model="dataSyncProgress"></AppSyncBar>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";
  import { useShopStore } from "~/stores/shop";

  definePageMeta({ auth: true });
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);
  const shopStore = useShopStore();

  const dataSyncProgress = ref(0);
  onMounted(() => {
    packs.value = shopStore.packs;
    bundles.value = shopStore.bundles;

    fetchPacks();
    fetchBundles();

    // need to add a timeout, otherwise we don't get the transition effect
    setTimeout(() => {
      dataSyncProgress.value += 50;
    }, 1);
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
        shopStore.packs = response.packs;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingPacks.value = false;

    dataSyncProgress.value += 25;
  };

  // fetches bundles
  const bundles = ref<Array<ApiBundle>>([]);
  const loadingBundles = ref(false);
  const fetchBundles = async () => {
    loadingBundles.value = true;
    try {
      const response = await useApi<{
        bundles: Array<ApiBundle>;
      }>("/v1/shop/bundles");

      if (response.bundles) {
        bundles.value = response.bundles;
        shopStore.bundles = response.bundles;
      }
    } catch (error) {
      toast.value?.show("error", t("user-unexpected-error"));
    }
    loadingBundles.value = false;

    dataSyncProgress.value += 25;
  };

  const showBuyBundleModal = ref(false);
  const selectedBundle = ref<ApiBundle | null>(null);
  const onBundleClick = (bundle: ApiBundle) => {
    selectedBundle.value = bundle;
    showBuyBundleModal.value = true;
  };
</script>

<style></style>
