<template>
  <div class="h-full flex flex-col">
    <AdminHeader></AdminHeader>

    <div class="h-full grid grid-cols-12 bg-base-tertiary p-4 relative">
      <div class="h-full col-span-9 flex justify-center gap-x-2">
        <div class="relative aspect-thumbnail bg-base-white">
          <AdminEditorPage
            :items="stickers"
            @select="onSelect"
          ></AdminEditorPage>
        </div>
        <div class="h-full flex flex-col justify-between">
          <div class="flex flex-col gap-y-2">
            <div v-for="option in options" class="bg-base-white rounded-md">
              <Icon
                :name="option.icon"
                size="42"
                class="border-2 border-transparent rounded-md hover:border-black hover:cursor-pointer"
                @click="showCreateStickerModal = true"
              />
            </div>
          </div>
          <div>
            <div class="bg-base-white rounded-md">
              <Icon
                name="i-mdi:cancel-box-outline"
                size="42"
                class="border-2 border-transparent rounded-md hover:border-red-700 hover:cursor-pointer hover:text-red-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="h-full col-span-3 p-4 flex flex-col items-center bg-white">
        <h2 class="text-xl font-bold">Stickers</h2>
        <div class="h-full flex flex-col justify-center gap-y-8">
          <div v-for="option in options" class="flex flex-col items-center">
            <div class="p-2 border-2 border-base-tertiary rounded-full">
              <Icon :name="option.icon" size="42" />
            </div>
            <span class="text-sm">{{ option.description }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Create modal -->
    <ModalCreateSticker
      :page-id="$route.params.pageId"
      v-model:visible="showCreateStickerModal"
      @created="onStickerCreated"
      @error="onStickerCreateError"
      @pending="onStickerCreating"
    />
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import type CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const route = useRoute();
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const options = [
    {
      icon: "i-fluent:sticker-add-20-filled",
      description: t("admin-sticker-add-option"),
    },
    {
      icon: "i-mdi:file-gif-box",
      description: t("admin-sticker-add-gif-option"),
    },
    {
      icon: "i-mage:sound-waves",
      description: t("admin-sticker-add-audio-option"),
    },
    {
      icon: "i-fluent:sticker-20-filled",
      description: t("admin-sticker-remove-option"),
    },
  ];

  const stickers = ref<Array<ApiSticker>>([]);
  onMounted(async () => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        stickers: Array<ApiSticker>;
      }>(`v1/pages/${route.params.pageId}/stickers`);

      if (!response.stickers) {
        toast.value?.show("error", t("unexpected-error"));
        return;
      }

      stickers.value = response.stickers;
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  });

  const onSelect = (targets: Array<any>) => {
    if (targets.length != 1) return;

    console.log(targets[0]);
  };

  // sticker create modal
  const showCreateStickerModal = ref(false);
  const creating = ref(false);
  const onStickerCreating = (status: boolean) => {
    creating.value = status;
  };

  const onStickerCreated = (createdSticker: ApiSticker) => {
    if (!stickers.value) return;

    stickers.value.push(createdSticker);

    toast.value?.show("success", t("admin-sticker-created"));
  };

  const onStickerCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };
</script>

<style></style>
