<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Create Sticker Rarity"
    :modal="true"
    :draggable="false"
    @hide="resetForm"
    @close="emit('cancel')"
  >
    <div class="flex flex-col gap-4">
      <VeeForm
        class="flex flex-col gap-4 py-4"
        method="post"
        @submit="onSubmit"
      >
        <div
          class="flex flex-col gap-y-2 text-center transition-all duration-200"
        >
          <CustomFileUpload
            v-model:file="file"
            :error="errors.file"
          ></CustomFileUpload>
        </div>

        <AdminButton type="submit" class="self-center rounded-md w-1/2">
          Create
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { VeeForm } from "#build/components";
  import type { FetchError } from "ofetch";
  const { StickerRarityCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps<{
    sticker: ApiSticker | undefined;
    rarityId: string | undefined;
  }>();

  const emit = defineEmits<{
    created: [sticker: ApiSticker];
    error: [message: string];
    pending: [value: boolean];
    cancel: [];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: StickerRarityCreateSchema,
  });

  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values: CreateStickerRarityForm) => {
    if (!props.sticker || !props.sticker.page_id) return;

    const body = new FormData();
    body.append("page_id", props.sticker.page_id);
    body.append("title", props.sticker.title);
    body.append("type", props.sticker.type);
    body.append("top", JSON.stringify(props.sticker.top));
    body.append("left", JSON.stringify(props.sticker.left));
    body.append("width", JSON.stringify(props.sticker.width));
    body.append("height", JSON.stringify(props.sticker.height));
    body.append("numerator", JSON.stringify(props.sticker.numerator));
    body.append("denominator", JSON.stringify(props.sticker.denominator));
    body.append("rotation", JSON.stringify(props.sticker.rotation));
    body.append("file", values.file);
    if (props.rarityId) body.append("rarity_id", props.rarityId);
    body.append("sticker_id", props.sticker.id);

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
        setErrors(handledErrors.errors);
      } else if (handledErrors?.error) {
        emit("error", handledErrors.error);
      } else {
        emit("error", t("unexpected-error"));
      }
    }

    emit("pending", false);
  });
</script>

<style></style>
