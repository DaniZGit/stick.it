<template>
  <div class="h-full grid grid-flow-row grid-rows-12 py-2">
    <h2 class="row-span-1 text-2xl font-semibold text-center">
      Featured Albums
    </h2>
    <div class="h-full row-span-7 px-4">
      <div
        v-if="fetchingAlbums && !albums.length"
        class="h-full flex justify-center items-center"
      >
        <Icon
          name="i-svg-spinners:6-dots-scale-middle"
          size="64"
          class="text-app-secondary"
        />
      </div>
      <div
        v-else-if="!albums.length"
        class="h-full flex justify-center items-center"
      >
        There are currently no featured albums
      </div>
      <div v-else class="h-full">
        <ClientOnly>
          <swiper-container
            ref="swiperRef"
            class="w-full h-full py-2 border-x-2 border-app-secondary"
            effect="coverflow"
            :coverflowEffect="{
              rotate: 40,
              stretch: 0,
              depth: 400,
              modifier: 1,
              slideShadows: true,
            }"
            slides-per-view="auto"
            :centered-slides="true"
            :grab-cursor="true"
            :pagination="false"
            :space-between="10"
            :autoplay="{
              delay: 7500,
            }"
            :loop="false"
          >
            <swiper-slide
              v-for="album in albums"
              :key="album.id"
              class="w-1/2 !h-auto aspect-thumbnail my-auto"
            >
              <NuxtImg
                :src="useUrl(album.file?.url)"
                class="h-full w-full"
              ></NuxtImg>
              <h4 class="text-center line-clamp-2">
                {{ album.title }}
              </h4>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>
    </div>
    <div
      class="row-span-4 flex flex-col justify-center items-center gap-y-2 p-4"
    >
      <h3 class="text-xl font-semibold">Explore</h3>
      <div class="w-full grid grid-rows-2 grid-cols-2 gap-2 grow">
        <NuxtLink v-for="item in navItems" :key="item.link" :to="item.link">
          <AppButton
            class="w-full h-full flex flex-col justify-center items-center"
          >
            <h4>{{ item.title }}</h4>
            <Icon :name="item.icon" size="auto" />
          </AppButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  setPageLayout("default");

  const albumsStore = useAlbumsStore();
  const swiperRef = ref(null);

  const navItems = [
    {
      link: "/auction",
      title: "Auction",
      icon: "i-mdi:court-hammer",
    },
    {
      link: "/shop",
      title: "Shop",
      icon: "i-mdi:storefront-outline",
    },
    {
      link: "/albums",
      title: "Albums",
      icon: "i-mdi:book-open-blank-variant-outline",
    },
    {
      link: "/profile",
      title: "Profile",
      icon: "i-mdi:user-circle-outline",
    },
  ];

  onMounted(() => {
    albums.value = albumsStore.featuredAlbums;

    fetchAlbums();
  });

  const albums = ref<Array<ApiAlbum>>([]);
  const fetchingAlbums = ref(false);
  const fetchAlbums = async () => {
    fetchingAlbums.value = true;
    try {
      const response = await useApi<{
        albums: Array<ApiAlbum>;
      }>(`/v1/albums/featured`);

      if (response.albums) {
        albums.value = response.albums;
        albumsStore.featuredAlbums = response.albums;
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    fetchingAlbums.value = false;
  };
</script>

<style></style>
