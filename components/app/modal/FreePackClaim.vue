<template>
  <AppDialog
    v-model:visible="isVisible"
    :modal="true"
    header="Choose a pack to claim"
    :draggable="false"
    :loading="buyingPacks"
    @show="fetchPacks"
  >
    <div v-if="loadingPacks" class="w-full h-full">
      <AppSkeletonFreePackItem />
    </div>
    <div v-else class="h-full w-full flex flex-col justify-between py-2">
      <ClientOnly>
        <div class="w-full overflow-x-auto no-scrollbar flex">
          <AppSelectButton
            v-model="selectedAlbum"
            :options="albums"
            optionLabel="title"
            @change="onAlbumSelect"
            class="mx-auto"
          ></AppSelectButton>
        </div>
        <div class="flex flex-col gap-y-2">
          <swiper-container
            ref="swiperRef"
            class="w-full"
            :slides-per-view="1"
            :grab-cursor="true"
            :initial-slide="0"
            :pagination="true"
          >
            <swiper-slide
              v-for="pack in packs"
              :key="pack.id"
              class="flex flex-col justify-between px-2"
            >
              <h2 class="text-center text-lg font-semibold text-app-secondary">
                {{ pack.title }}
              </h2>
              <div class="w-full flex justify-center">
                <NuxtImg
                  :src="useUrl(pack.file?.url)"
                  class="aspect-thumbnail w-5/6 h-auto"
                ></NuxtImg>
              </div>
            </swiper-slide>
          </swiper-container>

          <div class="px-16 pb-2 grid grid-cols-2 gap-x-4 z-[5]">
            <AppButton @click="swiper.prev()">
              <Icon name="i-mdi:arrow-left-bold-outline" size="16" />
            </AppButton>
            <AppButton @click="swiper.next()">
              <Icon name="i-mdi:arrow-right-bold-outline" size="16" />
            </AppButton>
          </div>
        </div>

        <div class="flex justify-center">
          <AppButton color="tertiary" @click="onPackClaim" class="px-6">
            <span>Claim</span>
          </AppButton>
        </div>
      </ClientOnly>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
  const toast = useToast();
  const isVisible = defineModel("visible", { type: Boolean });
  const swiperRef = ref(null);
  const swiper = useSwiper(swiperRef);

  const emit = defineEmits<{
    claimed: [
      {
        user: ApiUser;
        user_pack: ApiUserPack;
      }
    ];
  }>();

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
        packs.value.forEach((p) => {
          if (!albums.value.some((a) => a.id == p.album_id)) {
            albums.value.push(p.album);
          }
        });
      }
    } catch (error) {
      console.log("err");
    }
    loadingPacks.value = false;
  };

  const buyingPacks = ref(false);
  const onClaimFreePack = async (amount: number) => {
    buyingPacks.value = true;
    try {
      const response = await useApi<{
        user_pack: ApiUserPack;
      }>("/v1/transactions/pack", {
        method: "POST",
        body: {
          amount: amount,
        },
      });

      if (response.user_pack) {
        console.log("bought pack:", response.user_pack);
        toast.add({
          detail: `${amount} ${amount > 1 ? "Packs" : "Pack"} bought`,
          life: 3000,
          group: "buy_group",
        });
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    buyingPacks.value = false;
  };

  const albums = ref<Array<ApiAlbum>>([]);
  const selectedAlbum = ref<ApiAlbum | null>(null);
  const onAlbumSelect = (e: any) => {
    if (!selectedAlbum.value) return;

    const index = packs.value?.findIndex(
      (p) => p.album_id == selectedAlbum.value?.id
    );
    if (index != undefined && index >= 0) {
      swiper.to(index);
    }
  };

  const claimingFreePack = ref(false);
  const onPackClaim = async () => {
    if (!swiper.instance.value?.activeIndex || !packs.value) return;

    claimingFreePack.value = true;
    const selectedPack = packs.value[swiper.instance.value?.activeIndex];
    try {
      const response = await useApi<{
        user: ApiUser;
        user_pack: ApiUserPack;
      }>(`/v1/users/${userStore.user.id}/free-pack`, {
        method: "POST",
        body: {
          pack_id: selectedPack.id,
        },
      });

      if (response.user) {
        toast.add({
          severity: "buy",
          detail: `Claimed ${selectedPack.title} pack`,
          life: 3000,
          group: "free_pack_group",
        });

        emit("claimed", {
          user: response.user,
          user_pack: response.user_pack,
        });
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }

    claimingFreePack.value = false;
    isVisible.value = false;
  };
</script>

<style></style>
