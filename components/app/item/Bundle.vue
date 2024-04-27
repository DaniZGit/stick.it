<template>
  <div class="h-full w-full group" @click="showBuyModal = true">
    <div
      class="h-full flex flex-col justify-between items-center text-center rounded-md"
      @click="showBuyModal = true"
    >
      <h3>{{ props.bundle.title }}</h3>
      <div
        class="ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100 rounded-md"
      >
        <NuxtImg
          :src="useUrl(props.bundle.file?.url)"
          class="aspect-square rounded-t-md"
        ></NuxtImg>
        <div class="w-full flex flex-col">
          <span
            class="w-full font-semibold text-lg bg-app-tertiary rounded-b-full"
          >
            {{ props.bundle.price }} €
          </span>
          <div class="flex justify-center items-center gap-x-1">
            <span class="text-base font-bold text-app-gold brightness-150">{{
              props.bundle.tokens
            }}</span>
            <span class="text-xs text-app-gold brightness-125">
              ( + {{ props.bundle.bonus }} )
            </span>
          </div>
        </div>
      </div>
    </div>
    <AppModalShopBundleBuy
      v-model:visible="showBuyModal"
      :modal="true"
      :draggable="false"
      :bundle="props.bundle"
    ></AppModalShopBundleBuy>
  </div>
</template>

<script lang="ts" setup>
  const showBuyModal = ref(false);
  const props = defineProps<{
    bundle: ApiBundle;
  }>();
</script>
