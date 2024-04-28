<template>
  <div class="h-full w-full group">
    <div
      class="h-full flex flex-col justify-between items-center text-center rounded-md"
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
          <div class="flex justify-center items-center gap-x-1 text-app-gold">
            <span class="text-base font-bold brightness-150">{{
              props.bundle.tokens
            }}</span>
            <span class="text-xs brightness-125">
              ( + {{ props.bundle.bonus }} )
            </span>
            <Icon
              name="i-akar-icons:coin"
              size="14"
              class="brightness-150 mt-0.5"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    bundle: ApiBundle;
  }>();
</script>
