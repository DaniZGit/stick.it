<template>
  <div class="h-full grid grid-rows-12 grid-flow-row">
    <AdminHeader class="row-span-1"></AdminHeader>

    <div class="h-full row-span-11 grid grid-rows-12">
      <!-- Top Bar -->
      <div class="row-span-1 flex justify-between p-4">
        <div class="h-full flex">
          <AdminInputText
            class="h-full !rounded-r-none py-auto"
            placeholder="Search albums..."
          />
          <AdminButton
            class="border-2 border-l-0 border-base-inactive border-opacity-40 rounded-l-none p-2"
          >
            <Icon name="i-ic:round-search" size="16" />
          </AdminButton>
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

      <div class="row-span-11 h-full p-4 bg-base-secondary rounded-md relative">
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
              @deleting="onAlbumDeleting"
            ></AdminItemAlbum>
          </NuxtLink>
        </div>
        <!-- Create modal -->
        <ModalCreateAlbum
          v-model:visible="showCreateModal"
          @created="onAlbumCreate"
          @error="onAlbumCreateError"
          @pending="onAlbumCreating"
        />

        <Loader
          v-if="creating || deleting"
          class="flex flex-col justify-center items-center gap-y-4 text-base-white z-[9999]"
        >
          <h1 v-if="creating" class="uppercase text-3xl">
            {{ $t("admin-album-creating") }}
          </h1>
          <h1 v-else class="uppercase text-3xl">
            {{ $t("admin-album-deleting") }}
          </h1>
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

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const albums = ref<Array<ApiAlbum>>([]);

  // fetch albums on load
  const pending = ref(true);
  onMounted(async () => {
    try {
      const response = await useApi<{
        albums: Array<ApiAlbum>;
      }>("/v1/albums", {
        params: {
          limit: 12,
        },
      });

      if (response.albums) {
        albums.value = response.albums;
      } else {
        toast.value?.show("error", t("admin-mismatched-response"));
      }
      console.log(albums.value);
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }

    pending.value = false;
  });

  // album create modal
  const showCreateModal = ref(false);
  const creating = ref(false);
  const onAlbumCreating = (status: boolean) => (creating.value = status);
  const onAlbumCreate = (createdAlbum: ApiAlbum) => {
    albums.value.push(createdAlbum);
    toast.value?.show("success", t("admin-album-created"));
  };

  const onAlbumCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };

  // delete album modal
  const deleting = ref(false);
  const onAlbumDeleting = (status: boolean) => (deleting.value = status);
  const onAlbumDelete = (deletedAlbumId: string) => {
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
