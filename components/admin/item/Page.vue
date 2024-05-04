<template>
  <div
    class="w-full sm:w-1/2 lg:w-1/4 2xl:w-1/6 flex-shrink-0 flex py-2 relative"
  >
    <NuxtLink :to="`/dashboard/albums/${props.albumId}/pages/${page.id}`">
      <div class="flex flex-col relative hover:shadow-md">
        <NuxtImg
          :src="useUrl(props.page.file.url)"
          class="aspect-thumbnail w-full rounded-md object-cover object-center"
        ></NuxtImg>
        <AdminButton
          class="absolute top-2 right-2 p-1 flex justify-center items-center gap-x-2"
          @click.prevent="emit('edit')"
        >
          <Icon name="i-mdi:square-edit-outline" size="20" />
        </AdminButton>
      </div>
    </NuxtLink>
    <!-- the 'add between' line -->
    <div
      class="absolute top-0 bottom-0 -right-4 flex flex-col items-center opacity-0 hover:opacity-100 hover:cursor-pointer py-2 duration-150"
      @click="emit('create', props.page.sort_order + 1)"
    >
      <hr class="border-2 border-base-blue rounded-full grow" />
      <Icon name="i-mdi:add-circle" class="text-base-blue" size="16" />
      <hr class="border-2 border-base-blue rounded-full grow" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    albumId: string;
    page: ApiPage;
  }>();

  const emit = defineEmits<{
    create: [value: number];
    edit: [];
  }>();
</script>

<style></style>
