<template>
  <div class="h-full w-full group" @click="showBuyModal = true">
    <div class="relative" @click="showBuyModal = true">
      <NuxtImg
        :src="useUrl(props.pack.file?.url)"
        class="aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
      ></NuxtImg>
      <div
        class="absolute top-0 right-0 bottom-0 left-0 flex flex-col justify-end"
      >
        <div
          class="text-sm bg-black bg-opacity-50 rounded-b-md text-app-secondary"
        >
          <div class="flex justify-center items-center px-1 py-1">
            <div class="flex items-center gap-x-1 text-app-gold brightness-150">
              <span class="text-lg font-bold">{{ props.pack.price }}</span>
              <Icon name="i-ic:outline-generating-tokens" size="28" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center overflow-x-hidden">
      <div
        ref="titleRef"
        class="inline-block text-nowrap"
        :class="{
          'overflow-animation': isOverflown(),
        }"
      >
        {{ props.pack.title }}
      </div>
    </div>
    <AppModalShopPackBuy
      v-model:visible="showBuyModal"
      :modal="true"
      :draggable="false"
      :pack="props.pack"
    ></AppModalShopPackBuy>
  </div>
</template>

<script lang="ts" setup>
  const titleRef = ref<HTMLElement | null>(null);
  const showBuyModal = ref(false);
  const props = defineProps<{
    pack: ApiPack;
  }>();

  const isOverflown = () => {
    if (!titleRef.value) return false;
    return isElementOverflown(titleRef.value);
  };
</script>

<style scoped>
  .overflow-animation {
    -webkit-animation: moving 10s infinite linear;
    animation: moving 10s infinite linear;
  }

  @keyframes moving {
    0%,
    40% {
      transform: translateX(0px);
    }
    85%,
    100% {
      transform: translateX(-50%);
    }
  }
</style>
