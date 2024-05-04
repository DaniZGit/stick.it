<template>
  <div
    class="flex flex-col items-center justify-center gap-y-6 border-b-2 bg-base-tertiary rounded-md py-8 px-8 hover:shadow-md"
  >
    <div class="w-full relative">
      <NuxtImg
        :src="useUrl(file?.url)"
        class="w-full h-full aspect-thumbnail object-cover object-center"
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
    <AdminModalDeleteAlbum
      v-model:visible="showDeleteModal"
      :id="id"
      :title="title"
      @deleted="onAlbumDeleted"
      @error="onAlbumDeleteError"
      @pending="onAlbumDeleting"
    ></AdminModalDeleteAlbum>
  </div>
</template>

<script lang="ts" setup>
  const { title } = defineProps<{
    id: ApiAlbum["id"];
    title: ApiAlbum["title"];
    created_at: ApiAlbum["created_at"];
    date_from: ApiAlbum["date_from"];
    date_to: ApiAlbum["date_to"];
    file: ApiAlbum["file"];
  }>();

  const emit = defineEmits(["deleted", "deleted-error", "deleting"]);

  // delete album modal
  const showDeleteModal = ref(false);

  const onAlbumDeleting = (status: boolean) => emit("deleting", status);
  const onAlbumDeleted = (id: string) => {
    emit("deleted", id);
  };

  const onAlbumDeleteError = (errorMessage: string) => {
    emit("deleted-error", errorMessage);
  };
</script>

<style></style>
