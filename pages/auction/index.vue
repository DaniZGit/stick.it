<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12 relative">
    <div
      class="row-span-1 flex items-center gap-x-4 border-b-2 border-app-secondary overflow-x-scroll px-2"
    >
      <div class="grow overflow-x-auto no-scrollbar">
        <AppSelectButton
          v-model="selectedAlbum"
          :options="albums"
          optionLabel="title"
          @change="onAlbumSelect"
          class="mx-auto"
        ></AppSelectButton>
      </div>
      <AppButton class="!py-1 px-8" @click="showAuctionCreateModal = true"
        >Create</AppButton
      >
    </div>
    <div class="row-span-11">
      <AppAuctionTable></AppAuctionTable>
    </div>
    <AppModalCreateAuctionOffer
      v-model:visible="showAuctionCreateModal"
    ></AppModalCreateAuctionOffer>
  </div>
</template>

<script setup lang="ts">
  const selectedAlbum = ref<ApiAlbum | null>(null);
  const albums = ref<Array<ApiAlbum>>([
    {
      id: "ad",
      title: "Album 1",
    },
    {
      id: "ad",
      title: "Album 2",
    },
    {
      id: "ad",
      title: "Album 3",
    },
    {
      id: "ad",
      title: "Album 4",
    },
  ]);

  const showAuctionCreateModal = ref(true);

  const onAlbumSelect = (e) => {
    console.log(e);
  };
</script>
