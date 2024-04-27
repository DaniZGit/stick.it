<template>
  <AppDialog
    v-model:visible="isVisible"
    :header="props.bundle.title"
    :modal="true"
    :draggable="false"
    :loading="buyingBundle"
  >
    <div class="h-full w-full flex flex-col justify-between items-center">
      <div
        class="w-full flex flex-col items-center justify-center p-2 rounded-md"
      >
        <NuxtImg
          :src="useUrl(props.bundle.file?.url)"
          class="w-1/2 aspect-square rounded-md"
        ></NuxtImg>
        <div>
          <div class="flex justify-center items-center gap-x-1">
            <span class="text-lg font-bold text-app-gold brightness-150">{{
              props.bundle.tokens
            }}</span>
            <span class="text-base text-app-gold brightness-125">
              ( + {{ props.bundle.bonus }} )
            </span>
          </div>
        </div>
      </div>
      <div
        class="w-full flex flex-col items-center gap-y-2 p-2 text-app-secondary"
      >
        <AppButton
          class="w-full flex gap-x-1"
          color="tertiary"
          @click="onBuy"
          :disabled="buyingBundle"
        >
          <span class="text-lg">Buy for </span>
          <span class="text-lg text-app-gold font-bold brightness-150">
            {{ props.bundle.price }}€
          </span>
        </AppButton>
      </div>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const userStore = useUserStore();

  const props = defineProps({
    bundle: {
      type: Object as PropType<ApiBundle>,
      required: true,
    },
  });

  const buyingBundle = ref(false);
  const onBuy = async () => {
    buyingBundle.value = true;
    try {
      const response = await useApi<{
        user: ApiUser;
      }>("/v1/transactions/bundle", {
        method: "POST",
        body: {
          bundle_id: props.bundle.id,
        },
      });

      if (response.user) {
        userStore.user.tokens = response.user.tokens;
        console.log("bought pack:", response.user);
      }

      isVisible.value = false;
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    buyingBundle.value = false;
  };
</script>

<style></style>
