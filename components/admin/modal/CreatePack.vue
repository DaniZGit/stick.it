<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Create album"
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
  const { PackCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps<{
    albumId: string;
  }>();

  const emit = defineEmits<{
    created: [album: ApiPack];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: PackCreateSchema,
    initialValues: {
      price: 0,
    },
  });

  const [title] = defineField("title");
  const [price] = defineField("price");
  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("price", values.price.toString());
    body.append("album_id", props.albumId);
    body.append("file", values.file);

    console.log(values);

    emit("pending", true);
    try {
      const response = await useApi<{ pack: ApiPack }>("/v1/packs", {
        method: "POST",
        body: body,
      });

      // hide modal
      isVisible.value = false;

      if (response.pack) {
        emit("created", response.pack);
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
