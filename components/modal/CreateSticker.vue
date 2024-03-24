<template>
  <AdminDialog
    v-model:visible="isVisible"
    :header="`Create sticker`"
    :modal="true"
    :draggable="false"
    @hide="form?.resetValues"
  >
    <div class="flex flex-col gap-4 px-16">
      <AdminFormSticker
        :url="undefined"
        @submit="onSubmit"
        @error="emit('error', t('unexpected-error'))"
      ></AdminFormSticker>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { AdminFormSticker } from "#build/components";
  import type { FetchError } from "ofetch";

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const form = ref<InstanceType<typeof AdminFormSticker> | null>(null);

  const props = defineProps<{
    pageId: string;
  }>();

  const emit = defineEmits<{
    created: [page: ApiSticker];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // create request
  const onSubmit = async (values: StickerForm) => {
    const body = new FormData();
    body.append("page_id", props.pageId);
    body.append("title", values.title);
    body.append("type", values.type);
    body.append("top", "0.0");
    body.append("left", "0.0");
    body.append("rarity_id", values.rarity);
    body.append("file", values.file);

    emit("pending", true);

    try {
      const response = await useApi<{ sticker: ApiSticker }>(`/v1/stickers`, {
        method: "POST",
        body: body,
      });

      // hide modal
      isVisible.value = false;

      if (response.sticker) {
        emit("created", response.sticker);
      } else {
        emit("error", t("admin-mismatched-response"));
      }
    } catch (error) {
      const handledErrors = useHandleFormErrors(error as FetchError<ApiError>);

      if (handledErrors?.errors) {
        form.value?.setErrors(handledErrors.errors);
      } else if (handledErrors?.error) {
        emit("error", handledErrors.error);
      } else {
        emit("error", t("unexpected-error"));
      }
    }

    emit("pending", false);
  };
</script>

<style></style>
