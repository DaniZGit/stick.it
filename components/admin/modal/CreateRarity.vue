<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Create rarity"
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
  const { RarityCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const emit = defineEmits<{
    created: [album: ApiRarity];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const day = 1 * 24 * 60 * 60 * 1000; // * 1000 is because of thousands
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: RarityCreateSchema,
  });

  const [title] = defineField("title");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    emit("pending", true);

    try {
      const response = await useApi<{ rarity: ApiRarity }>("/v1/rarities", {
        method: "POST",
        body: values,
      });

      // hide modal
      isVisible.value = false;

      if (response.rarity) {
        emit("created", response.rarity);
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
