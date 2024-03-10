<template>
  <div class="flex flex-col h-full">
    <AdminHeader></AdminHeader>

    <div class="h-full overflow-y-auto">
      <!-- Top Bar -->
      <div class="flex justify-between p-4">
        <div class="flex">
          <InputGroup>
            <AdminInputText placeholder="Search albums..." />
            <AdminButton
              class="border-2 border-l-0 border-base-inactive border-opacity-40 rounded-l-none p-2"
            >
              <Icon name="i-ic:round-search" size="16" />
            </AdminButton>
          </InputGroup>
        </div>
        <div>
          <AdminButton
            class="h-full px-8 text-md rounded-md"
            color="blue"
            @click="showCreateModal = true"
          >
            Create
          </AdminButton>
        </div>
      </div>

      <div class="m-4 mt-0 p-4 h-full bg-base-secondary rounded-md relative">
        <div
          v-if="pending"
          class="absolute top-0 right-0 bottom-0 left-0 flex flex-col justify-center items-center gap-y-4 bg-black bg-opacity-20 text-base-white"
        >
          <h1 class="uppercase text-3xl">Fetching albums</h1>
          <Icon name="i-svg-spinners:blocks-scale" size="64" />
        </div>
        <div
          v-else-if="albums.length <= 0"
          class="flex justify-center items-center h-full"
        >
          <h2 class="text-3xl text-base-black">
            No albums yet, try
            <a
              class="text-base-blue underline hover:cursor-pointer hover:brightness-50"
              @click.prevent="showCreateModal = true"
            >
              creating</a
            >
            one
          </h2>
        </div>
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-12 px-8 rounded-md bg-base-secondary"
        >
          <NuxtLink
            v-for="album in albums"
            :to="`/dashboard/albums/${album.id}`"
          >
            <AdminItemAlbum
              v-bind="album"
              @deleted="onAlbumDelete"
              @deleted-error="onAlbumDeleteError"
            ></AdminItemAlbum>
          </NuxtLink>
        </div>
        <!-- Create modal -->
        <ModalCreateAlbum
          v-model:visible="showCreateModal"
          @created="onAlbumCreate"
          @creating="onAlbumCreating"
          @error="onAlbumCreateError"
          @pending="(pending: boolean) => (creating = pending)"
        />

        <Loader
          v-if="creating"
          class="flex flex-col justify-center items-center gap-y-4 text-base-white z-[9999]"
        >
          <h1 class="uppercase text-3xl">Creating album...</h1>
          <Icon name="i-svg-spinners:blocks-scale" size="64" />
        </Loader>
        <CustomToast ref="toast"></CustomToast>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const { $api } = useNuxtApp();
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const albums = ref<Array<Album>>([]);

  // fetch albums on load
  const pending = ref(true);
  onMounted(async () => {
    try {
      albums.value = await $api<Array<Album>>("/v1/albums", {
        params: {
          limit: 12,
        },
      });
      console.log(albums.value);
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }

    pending.value = false;
  });

  // album create modal
  const showCreateModal = ref(false);
  const creating = ref(false);
  const onAlbumCreating = () => (creating.value = true);
  const onAlbumCreate = (createdAlbum: Album) => {
    albums.value.push(createdAlbum);
    toast.value?.show("success", t("admin-album-created"));
  };

  const onAlbumCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };

  // delete album modal
  const onAlbumDelete = (deletedAlbumId: string) => {
    console.log(deletedAlbumId);

    console.log(albums.value);

    const ind = albums.value.findIndex((album) => {
      return album.id == deletedAlbumId;
    });

    // album was not found
    if (ind < 0) return;

    albums.value.splice(ind, 1);

    // display success message
    toast.value?.show("success", t("admin-album-deleted"));
  };

  const onAlbumDeleteError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };
</script>

<style></style>
