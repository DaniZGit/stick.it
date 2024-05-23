<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Update Avatar"
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
            :url="props.avatar?.file?.url"
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
        </div>

        <AdminButton
          type="submit"
          class="self-center rounded-md w-1/2 py-1"
          color="blue"
        >
          Update
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  const { AvatarCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps<{
    avatar: ApiAvatar | null;
  }>();

  const emit = defineEmits<{
    edited: [avatar: ApiAvatar];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, resetForm, setValues } =
    useForm({
      validationSchema: AvatarCreateSchema,
    });

  const [title] = defineField("title");
  const [file] = defineField("file");

  watch(isVisible, (newVisible, oldVisible) => {
    if (newVisible == true) {
      setValues({
        title: props.avatar?.title,
      });
    }
  });

  // create request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("file_id", props.avatar?.file_id?.toString() ?? "");
    body.append("file", values.file);

    console.log(values);

    emit("pending", true);
    try {
      const response = await useApi<{ avatar: ApiAvatar }>(
        `/v1/avatars/${props.avatar?.id}`,
        {
          method: "PUT",
          body: body,
        }
      );

      // hide modal
      isVisible.value = false;

      if (response.avatar) {
        emit("edited", response.avatar);
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
