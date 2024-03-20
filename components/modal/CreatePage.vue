<template>
  <AdminDialog
    v-model:visible="isVisible"
    :header="`Create page #${props.sortOrder}`"
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
        <div
          class="flex flex-col gap-y-2 text-center transition-all duration-200"
        >
          <CustomFileUpload
            v-model:file="file"
            :error="errors.file"
          ></CustomFileUpload>
        </div>

        <AdminButton type="submit" class="self-center rounded-md w-1/2">
          Create {{ sortOrder }} {{ albumId }}
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  const { PageCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const props = defineProps<{
    albumId: string;
    sortOrder: number;
  }>();

  const emit = defineEmits<{
    created: [page: ApiPage];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: PageCreateSchema,
  });

  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("sort_order", props.sortOrder.toString());
    body.append("album_id", props.albumId);
    body.append("file", values.file);

    console.log(values);
    console.log(props.sortOrder, props.albumId);

    emit("pending", true);

    try {
      const response = await useApi<{ page: ApiPage }>(`/v1/pages`, {
        method: "POST",
        body: body,
      });

      // hide modal
      isVisible.value = false;

      if (response.page) {
        emit("created", response.page);
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
