<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Create Bundle"
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

        <div class="flex flex-col w-5/6 gap-y-4 mx-auto">
          <AdminInputText
            id="title"
            name="title"
            :label="$t('admin-album-create-title')"
            placeholder="Base pack"
            v-model="title"
            icon="ic:outline-email"
            :error="errors.title"
          />

          <AdminInputNumber
            id="price"
            name="price"
            :label="$t('admin-pack-create-price')"
            placeholder="160"
            icon="i-material-symbols:height"
            v-model="price"
            :min="0"
            show-buttons
            :error="errors.price"
          />

          <AdminInputNumber
            id="tokens"
            name="tokens"
            :label="$t('admin-pack-create-tokens')"
            placeholder="5"
            icon="i-material-symbols:height"
            v-model="tokens"
            :min="1"
            show-buttons
            :error="errors.tokens"
          />

          <AdminInputNumber
            id="bonus"
            name="bonus"
            :label="$t('admin-pack-create-bonus')"
            placeholder="5"
            icon="i-material-symbols:height"
            v-model="bonus"
            :min="0"
            show-buttons
            :error="errors.bonus"
          />
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
  const { BundleCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const emit = defineEmits<{
    created: [bundle: ApiBundle];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: BundleCreateSchema,
    initialValues: {
      price: 0,
      bonus: 0,
    },
  });

  const [title] = defineField("title");
  const [price] = defineField("price");
  const [tokens] = defineField("tokens");
  const [bonus] = defineField("bonus");
  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("price", values.price.toString());
    body.append("tokens", values.tokens.toString());
    body.append("bonus", values.bonus.toString());
    body.append("file", values.file);

    console.log(values);

    emit("pending", true);
    try {
      const response = await useApi<{ bundle: ApiBundle }>("/v1/bundles", {
        method: "POST",
        body: body,
      });

      // hide modal
      isVisible.value = false;

      if (response.bundle) {
        emit("created", response.bundle);
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
