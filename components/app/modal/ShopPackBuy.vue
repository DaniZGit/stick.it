<template>
  <AppDialog
    v-model:visible="isVisible"
    :header="props.pack.title"
    :modal="true"
    :draggable="false"
    :loading="buyingPacks"
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
          <AppButton
            class="w-full text-base"
            color="tertiary"
            @click="onBuy(1)"
            :disabled="buyingPacks"
          >
            <span class="text-base"> Buy 1x </span>
          </AppButton>
          <div class="flex items-center gap-x-1 text-app-gold brightness-150">
            <span class="text-xs font-bold tracking-wider">{{
              props.pack?.price
            }}</span>
            <Icon name="i-ic:outline-generating-tokens" size="16" />
          </div>
        </div>
        <div class="flex flex-col justify-center items-center gap-y-1">
          <AppButton
            class="w-full"
            color="primary"
            @click="onBuy(5)"
            :disabled="buyingPacks"
          >
            <span class="text-base"> Buy 5x </span>
          </AppButton>
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
  const toast = useToast();
  const isVisible = defineModel("visible", { type: Boolean });
  const userStore = useUserStore();

  const props = defineProps({
    pack: {
      type: Object as PropType<ApiPack>,
      required: true,
    },
  });

  const buyingPacks = ref(false);
  const onBuy = async (amount: number) => {
    buyingPacks.value = true;
    try {
      const response = await useApi<{
        user_pack: ApiUserPack;
      }>("/v1/transactions/pack", {
        method: "POST",
        body: {
          pack_id: props.pack.id,
          amount: amount,
        },
      });

      if (response.user_pack) {
        userStore.user.tokens -= props.pack.price * amount;
        toast.add({
          severity: "buy",
          detail: `${amount} ${amount > 1 ? "Packs" : "Pack"} bought`,
          life: 3000,
          group: "buy_group",
        });
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    buyingPacks.value = false;
  };

  const onBuy5x = () => {};
</script>

<style></style>
