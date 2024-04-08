<template>
  <div
    class="w-full sm:w-1/2 lg:w-1/4 2xl:w-1/6 flex-shrink-0 flex hover:cursor-pointer group"
  >
    <div class="">
      <div class="flex flex-col">
        <div class="text-center rounded-b-md text-sm font-semibold py-1">
          {{ pack.title }}
        </div>
        <NuxtImg
          :src="useUrl(pack.file?.url)"
          class="aspect-thumbnail w-full"
        ></NuxtImg>
        <div
          class="bg-base-tertiary flex items-center justify-center gap-x-1 py-1 group-hover:shadow-md"
        >
          <span class="text-base-blue font-bold">{{ pack.price }}</span>
          <Icon
            name="i-ic:outline-generating-tokens"
            size="24"
            class="text-orange-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    pack: ApiPack;
  }>();
</script>

<style></style>
