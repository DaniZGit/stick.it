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
          @change="emit('fieldChange', values)"
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
          @change="emit('fieldChange', values)"
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
          @change="emit('fieldChange', values)"
        />

        <div class="flex flex-col">
          <div class="grid grid-cols-2 gap-x-2">
            <AdminInputNumber
              id="width"
              name="width"
              :label="$t('admin-sticker-create-width')"
              placeholder="245px"
              v-model="width"
              show-buttons
              :min="1"
              icon="i-material-symbols:width"
              @change="updateHeight"
            />

            <AdminInputNumber
              id="height"
              name="height"
              :label="$t('admin-sticker-create-height')"
              placeholder="245px"
              v-model="height"
              :min="1"
              show-buttons
              icon="i-material-symbols:height"
              @change="updateWidth"
            />
          </div>
          <AdminInlineMessage
            severity="error"
            class="h-0 transition-[height] ease-out duration-100"
            :class="{
              'h-[14px]': errors.width || errors.height,
            }"
          >
            {{ errors.width ? errors.width : errors.height }}
          </AdminInlineMessage>
        </div>

        <div class="flex flex-col">
          <div class="grid grid-cols-2 gap-x-2">
            <AdminInputNumber
              id="numerator"
              name="numerator"
              placeholder="3"
              icon="i-material-symbols:width"
              v-model="numerator"
              :min="1"
              :max="100"
              show-buttons
              @change="updateHeight"
            />

            <AdminInputNumber
              id="denominator "
              name="denominator "
              placeholder="4"
              icon="i-material-symbols:height"
              v-model="denominator"
              :min="1"
              :max="100"
              show-buttons
              @change="updateWidth"
            />
          </div>
          <AdminInlineMessage
            severity="error"
            class="h-0 transition-[height] ease-out duration-100"
            :class="{
              'h-[14px]': errors.numerator || errors.denominator,
            }"
          >
            {{ errors.numerator ? errors.numerator : errors.denominator }}
          </AdminInlineMessage>
        </div>

        <AdminInputNumber
          id="rotation"
          name="rotation"
          :label="$t('admin-sticker-create-rotation')"
          placeholder="245px"
          icon="i-material-symbols:width"
          v-model="rotation"
          show-buttons
          @change="emit('transformChange', values as UpdateStickerForm)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-2 pb-4">
      <AdminButton
        type="submit"
        class="self-center rounded-md w-full py-1 px-2"
        color="blue"
      >
        Update
      </AdminButton>
      <AdminButton
        type="button"
        class="self-center rounded-md w-full py-1 px-2"
        color="red"
        @click="emit('delete')"
      >
        Delete
      </AdminButton>
    </div>
  </VeeForm>
</template>

<script lang="ts" setup>
  const { StickerUpdateSchema } = useFormSchema();
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
    submit: [values: UpdateStickerForm];
    delete: [];
    transformChange: [values: UpdateStickerForm];
    fieldChange: [values: any];
    error: [message: String];
  }>();

  const props = defineProps<{
    url: string | undefined;
  }>();

  // load rarities
  const rarities = ref<Array<ApiRarity>>([]);
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

      // reset form values
      resetValues();
    } catch (error) {
      emit("error", t("unexpected-error"));
    }
  });

  const updateWidth = () => {
    width.value = (height.value / denominator.value) * numerator.value;
    emit("transformChange", values as UpdateStickerForm);
  };

  const updateHeight = () => {
    height.value = (width.value / numerator.value) * denominator.value;
    emit("transformChange", values as UpdateStickerForm);
  };

  // form stuff
  const {
    defineField,
    handleSubmit,
    errors,
    setErrors,
    setFieldValue,
    setValues,
    values,
  } = useForm({
    validationSchema: StickerUpdateSchema,
  });

  const [title] = defineField("title");
  const [type] = defineField("type");
  const [width] = defineField("width");
  const [height] = defineField("height");
  const [numerator] = defineField("numerator");
  const [denominator] = defineField("denominator");
  const [rotation] = defineField("rotation");
  const [rarity] = defineField("rarity");
  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    emit("submit", values);
  });

  const resetValues = (
    values: Partial<UpdateStickerForm> | undefined = undefined
  ) => {
    if (values) {
      setValues(values);
    } else if (rarities.value.length) {
      setFieldValue("rarity", rarities.value[0].id);
      setFieldValue("type", "image");
      setFieldValue("width", 12);
      setFieldValue("height", 16);
      setFieldValue("numerator", 3);
      setFieldValue("denominator", 4);
      setFieldValue("rotation", 0);
    }
  };

  defineExpose({
    setErrors,
    resetValues,
  });
</script>

<style></style>
