<template>
  <AdminDialog
    v-model:visible="isVisible"
    :header="`Create sticker`"
    :modal="true"
    :draggable="false"
    @hide="resetForm"
  >
    <div class="flex flex-col gap-4">
      <VeeForm
        class="flex flex-col gap-4 py-4"
        method="post"
        @submit="onSubmit"
      >
        <div class="flex flex-col gap-y-2 transition-all duration-200">
          <CustomFileUpload
            v-model:file="file"
            :error="errors.file"
          ></CustomFileUpload>

          <div class="flex flex-col w-5/6 gap-y-4 mx-auto">
            <AdminInputText
              id="title"
              name="title"
              :label="$t('admin-album-create-title')"
              placeholder="Fifa 1991"
              v-model="title"
              icon="ic:outline-email"
              :error="errors.title"
            />

            <SelectButton
              v-model="type"
              :options="['image', 'gif', 'audio']"
              aria-labelledby="basic"
              class="text-left"
            />
          </div>
        </div>

        <AdminButton type="submit" class="self-center rounded-md w-1/2">
          Create
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  const { StickerCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const props = defineProps<{
    pageId: string;
  }>();

  const emit = defineEmits<{
    created: [page: ApiSticker];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: StickerCreateSchema,
    initialValues: {
      type: "image",
    },
  });

  const [file] = defineField("file");
  const [title] = defineField("title");
  const [type] = defineField("type");

  // create request
  const { $api } = useNuxtApp();
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("page_id", props.pageId);
    body.append("file", values.file);

    console.log(values);
    console.log(props.pageId);

    emit("pending", true);

    try {
      const response = await $api<{ sticker: ApiSticker }>(`/v1/stickers`, {
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
