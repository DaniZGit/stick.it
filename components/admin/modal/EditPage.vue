<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Edit album"
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
            :url="props.page?.file?.url"
            :error="errors.file"
          ></CustomFileUpload>
        </div>

        <div class="px-4 flex gap-x-4 w-2/3 mx-auto">
          <AdminButton
            type="submit"
            class="self-center rounded-md w-1/2 py-1"
            color="blue"
          >
            Update
          </AdminButton>
          <AdminButton
            class="self-center rounded-md w-1/2 py-1"
            color="red"
            @click="onPageDelete"
          >
            Delete
          </AdminButton>
        </div>
      </VeeForm>
    </div>
    <CustomToast ref="toast"></CustomToast>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  import type CustomToast from "../CustomToast.vue";
  const { PageCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps<{
    page: ApiPage | null;
  }>();

  const emit = defineEmits<{
    edited: [page: ApiPage];
    deleted: [page: ApiPage];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm, setValues } =
    useForm({
      validationSchema: PageCreateSchema,
    });

  const [file] = defineField("file");

  // edit request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("file", values.file);
    body.append("sort_order", props.page?.sort_order.toString() ?? "0");

    console.log("editing page");

    // update page¸
    emit("pending", true);
    try {
      const response = await useApi<{ page: ApiPage }>(
        `/v1/pages/${props.page?.id}`,
        {
          method: "PUT",
          body: body,
        }
      );

      if (response.page) {
        emit("edited", response.page);
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

  // delete page
  const onPageDelete = async () => {
    emit("pending", true);
    try {
      const response = await useApi<{ page: ApiPage }>(
        `/v1/pages/${props.page?.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.page) {
        emit("deleted", response.page);

        // hide modal
        isVisible.value = false;
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
  };
</script>

<style></style>
