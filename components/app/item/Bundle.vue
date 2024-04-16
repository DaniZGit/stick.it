<template>
  <div class="h-full w-full group" @click="showBuyModal = true">
    <div
      class="flex flex-col items-center text-center ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100 rounded-md"
      @click="showBuyModal = true"
    >
      <h3>{{ props.bundle.title }}</h3>
      <Icon
        name="i-akar-icons:coin"
        size="64"
        class="text-app-gold brightness-150"
      />
      <div class="flex flex-col">
        <span class="text-lg font-bold text-app-gold brightness-125">{{
          props.bundle.amount
        }}</span>
        <span class="text-xs text-app-gold"
          >+ {{ props.bundle.bonus }} bonus</span
        >
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
