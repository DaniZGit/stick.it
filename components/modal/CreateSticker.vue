<template>
  <AdminDialog
    v-model:visible="isVisible"
    :header="`Create sticker`"
    :modal="true"
    :draggable="false"
    @hide="setDefaults"
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
              :label="$t('admin-sticker-create-title')"
              placeholder="Lion"
              v-model="title"
              icon="i-mdi:card-text-outline"
              :error="errors.title"
            />

            <AdminSelectButton
              v-model="rarity"
              :options="rarities"
              option-label="title"
              option-value="id"
              :id="rarity"
              :name="rarity"
              :label="$t('admin-sticker-create-rarity')"
              class="text-left"
              icon="i-mdi:radio-button-checked"
              :error="errors.rarity"
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

  const rarities = ref<Array<ApiRarity>>([]);
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

  // load rarities
  onMounted(async () => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        rarities: Array<ApiRarity>;
      }>(`v1/rarities`);

      if (!response.rarities) {
        emit("error", t("unexpected-error"));
        return;
      }

      rarities.value = response.rarities;

      // populate form with default values
      setDefaults();
    } catch (error) {
      emit("error", t("unexpected-error"));
    }
  });

  // form stuff
  const {
    defineField,
    handleSubmit,
    errors,
    setErrors,
    resetForm,
    setFieldValue,
  } = useForm({
    validationSchema: StickerCreateSchema,
    initialValues: {
      type: types[0].value,
    },
  });

  const [file] = defineField("file");
  const [title] = defineField("title");
  const [type] = defineField("type");
  const [rarity] = defineField("rarity");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("page_id", props.pageId);
    body.append("title", values.title);
    body.append("type", values.type);
    body.append("top", "0.0");
    body.append("left", "0.0");
    body.append("rarity_id", values.rarity);
    body.append("file", values.file);

    console.log(values);
    console.log(props.pageId);

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

  const setDefaults = () => {
    resetForm();

    if (rarities.value.length) {
      setFieldValue("rarity", rarities.value[0].id);
    }
  };
</script>

<style></style>
