<template>
  <AppDialog
    v-model:visible="isVisible"
    :header="props.pack.title"
    :modal="true"
    :draggable="false"
  >
    <div class="h-full w-full flex flex-col justify-between">
      <div class="w-full aspect-thumbnail bg-app-tertiary p-2 rounded-md">
        <NuxtImg
          :src="useUrl(props.pack.file?.url)"
          class="w-full h-full aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
        ></NuxtImg>
      </div>
      <div class="grid grid-cols-2 gap-x-4 p-2 text-app-secondary">
        <div class="flex flex-col justify-center items-center gap-y-1">
          <AppButton class="w-full" color="tertiary">Buy 1x</AppButton>
          <div class="flex items-center gap-x-1 text-app-gold brightness-150">
            <span class="text-xs font-bold tracking-wider">{{
              props.pack?.price
            }}</span>
            <Icon name="i-ic:outline-generating-tokens" size="16" />
          </div>
        </div>
        <div class="flex flex-col justify-center items-center gap-y-1">
          <AppButton class="w-full" color="tertiary">Buy 5x</AppButton>
          <div class="flex items-center gap-x-1 text-app-gold brightness-150">
            <span class="text-xs font-bold tracking-wider">
              {{ 5 * props.pack.price }}
            </span>
            <Icon name="i-ic:outline-generating-tokens" size="16" />
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps({
    pack: {
      type: Object as PropType<ApiPack>,
      required: true,
    },
  });

  const emit = defineEmits<{
    created: [album: ApiAlbum];
    error: [message: string];
    pending: [value: boolean];
  }>();
</script>

<style></style>
