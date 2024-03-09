<template>
  <div
    class="flex flex-col items-center justify-center gap-y-6 border-b-2 bg-base-tertiary rounded-md py-8 px-8 hover:shadow-md"
  >
    <div class="w-full relative">
      <NuxtImg
        :src="useUrl(file.url)"
        class="w-full h-full"
        style="aspect-ratio: 6/7"
      />

      <div
        class="absolute top-0 right-0 mr-2 mt-2 p-1 flex gap-x-2 text-base-black bg-base-tertiary rounded-md border-2"
      >
        <AdminButton class="p-1 xl:p-2">
          <Icon name="i-mdi:square-edit-outline" size="24" />
        </AdminButton>
        <AdminButton class="p-1 xl:p-2" @click.prevent="showDeleteModal = true">
          <Icon name="i-mdi:trash-can-outline" size="24" />
        </AdminButton>
      </div>
    </div>
    <div class="w-full flex flex-col text-left">
      <span class="text-lg font-bold">{{ title }}</span>
      <span class="text-sm"
        >{{ useDateFormat(date_from, "DD. MMM. YYYY").value }} -
        {{ useDateFormat(date_to, "DD. MMM. YYYY").value }}
      </span>
    </div>

    <!-- MODALS -->
    <ModalDeleteAlbum
      v-model:visible="showDeleteModal"
      :id="id"
      :title="title"
      @deleted="onAlbumDeleted"
      @error="onAlbumDeleteError"
      @deleting="onAlbumDeleting"
    ></ModalDeleteAlbum>

    <!-- Delete modal loader -->
    <Loader
      v-if="deleting"
      class="flex flex-col justify-center items-center gap-y-4 text-base-white z-[9999]"
    >
      <h1 class="uppercase text-3xl">
        Deleting album <span class="font-bold">{{ title }}</span>
      </h1>
      <Icon name="i-svg-spinners:blocks-scale" size="64" />
    </Loader>
  </div>
</template>

<script lang="ts" setup>
  const deleting = ref(false);

  const { title } = defineProps<{
    id: Album["id"];
    title: Album["title"];
    created_at: Album["created_at"];
    date_from: Album["date_from"];
    date_to: Album["date_to"];
    file: Album["file"];
  }>();

  const emit = defineEmits(["deleted", "deleted-error", "deleting"]);

  // delete album modal
  const showDeleteModal = ref(false);

  const onAlbumDeleting = () => (deleting.value = true);
  const onAlbumDeleted = (id: string) => {
    deleting.value = false;
    emit("deleted", id);
  };

  const onAlbumDeleteError = (errorMessage: string) => {
    deleting.value = false;
    emit("deleted-error", errorMessage);
  };
</script>

<style></style>
