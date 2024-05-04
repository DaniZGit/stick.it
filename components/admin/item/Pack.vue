<template>
  <div class="w-full sm:w-1/2 lg:w-1/4 2xl:w-1/6 flex-shrink-0 flex group">
    <div class="">
      <div class="flex flex-col gap-y-2 relative">
        <NuxtImg
          :src="useUrl(pack.file?.url)"
          class="aspect-thumbnail w-full rounded-md object-cover object-center"
        ></NuxtImg>
        <AdminButton
          class="absolute top-2 right-2 p-1 flex justify-center items-center gap-x-2"
          @click.prevent="emit('edit')"
        >
          <Icon name="i-mdi:square-edit-outline" size="20" />
        </AdminButton>
        <div
          class="bg-base-tertiary flex items-center justify-center gap-x-1 py-1 group-hover:shadow-md"
        >
          <span class="text-base-black font-semibold">{{ pack.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    pack: ApiPack;
  }>();

  const emit = defineEmits<{
    edit: [];
  }>();
</script>

<style></style>
