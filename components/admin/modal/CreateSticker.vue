<template>
  <AdminDialog
    v-model:visible="isVisible"
    :header="`Create sticker`"
    :modal="true"
    :draggable="false"
    @hide="form?.resetValues"
  >
    <div class="flex flex-col gap-4 px-16">
      <AdminFormCreateSticker
        :url="undefined"
        @submit="onSubmit"
        @error="emit('error', t('unexpected-error'))"
      ></AdminFormCreateSticker>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { AdminFormCreateSticker } from "#build/components";
  import type { FetchError } from "ofetch";

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const form = ref<InstanceType<typeof AdminFormCreateSticker> | null>(null);

  const props = defineProps<{
    pageId: string;
  }>();

  const emit = defineEmits<{
    created: [page: ApiSticker];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // create request
  const onSubmit = async (values: CreateStickerForm) => {
    const body = new FormData();
    body.append("page_id", props.pageId);
    body.append("title", values.title);
    body.append("type", values.type);
    body.append("top", "0.0");
    body.append("left", "0.0");
    body.append("width", JSON.stringify(25.73));
    body.append("height", JSON.stringify(27.02));
    body.append("numerator", JSON.stringify(5));
    body.append("denominator", JSON.stringify(7));
    body.append("rotation", "0.0");
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
