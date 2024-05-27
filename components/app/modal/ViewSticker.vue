<template>
  <AppDialog v-model:visible="isVisible" :modal="true" :draggable="false">
    <div class="h-full w-full flex flex-col">
      <div class="w-full aspect-thumbnail p-2 rounded-md">
        <NuxtImg
          :src="useUrl(props.sticker?.file?.url)"
          class="w-full h-full aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
        ></NuxtImg>
      </div>
      <div
        class="flex flex-col gap-y-2 bg-app-tertiary text-app-secondary rounded-md p-2"
      >
        <div class="flex flex-col items-center">
          <span class="text-center font-bold text-xl">{{
            props.sticker?.title
          }}</span>
          <span class="text-xs">
            (
            {{ props.sticker?.rarity?.title ?? "base" }}
            )
          </span>
        </div>
        <span
          >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo
          ratione vel aut excepturi perspiciatis. Eligendi accusantium odit
          tempore harum earum voluptate obcaecati corporis, unde illo, suscipit
          esse asperiores. Assumenda, labore!</span
        >
      </div>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps({
    sticker: Object as PropType<ApiSticker>,
  });
</script>

<style></style>
