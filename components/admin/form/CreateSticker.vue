<template>
  <VeeForm class="flex flex-col gap-8 py-4" method="post" @submit="onSubmit">
    <div class="flex flex-col gap-y-2 transition-all duration-200">
      <CustomFileUpload
        v-model:file="file"
        :error="errors.file"
        :url="props.url"
      ></CustomFileUpload>

      <div class="w-full flex flex-col gap-y-4 mx-auto">
        <AdminInputText
          id="title"
          name="title"
          :label="$t('admin-sticker-create-title')"
          placeholder="Lion"
          v-model="title"
          icon="i-mdi:card-text-outline"
          :error="errors.title"
        />

        <AdminSelectButton
          v-model="type"
          :options="types"
          option-label="title"
          option-value="value"
          :id="type"
          :name="type"
          :label="$t('admin-sticker-create-type')"
          class="text-left"
          icon="i-mdi:radio-button-checked"
          :error="errors.type"
        />
      </div>
    </div>

    <slot name="actions">
      <AdminButton
        type="submit"
        class="self-center rounded-md w-full py-1 px-2"
      >
        Create
      </AdminButton>
    </slot>
  </VeeForm>
</template>

<script lang="ts" setup>
  const { StickerCreateSchema } = useFormSchema();
  const { t } = useI18n();

  const types = <Array<{ title: string; value: ApiStickerType }>>[
    {
      title: t("admin-sticker-type-image"),
      value: "image",
    },
    {
      title: t("admin-sticker-type-gif"),
      value: "gif",
    },
    {
      title: t("admin-sticker-type-audio"),
      value: "audio",
    },
  ];

  const emit = defineEmits<{
    submit: [values: CreateStickerForm];
    error: [message: String];
  }>();

  const props = defineProps<{
    url: string | undefined;
  }>();

  // form stuff
  const {
    defineField,
    handleSubmit,
    errors,
    setErrors,
    resetForm,
    setFieldValue,
    setValues,
  } = useForm({
    validationSchema: StickerCreateSchema,
    initialValues: {
      type: "image",
    },
  });

  const [title] = defineField("title");
  const [type] = defineField("type");
  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    emit("submit", values);
  });

  const resetValues = (values: CreateStickerForm | undefined = undefined) => {
    resetForm();

    if (values) {
      setValues(values);
    } else {
      setFieldValue("type", "image");
    }
  };

  defineExpose({
    setErrors,
    resetValues,
  });
</script>

<style></style>
