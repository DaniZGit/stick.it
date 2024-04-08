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

        <AdminAutoComplete
          v-model="createdRarities"
          :items="rarities"
          id="rarities"
          name="rarities"
          placeholder="Pick a rarity"
          :label="$t('admin-sticker-create-rarity')"
          class="text-left"
          icon="i-mdi:radio-button-checked"
          @complete="emit('fieldChange', values)"
          @select="onRaritySelect"
          @edit="onRarityEditClick"
          @remove="onRarityRemoveClick"
        >
        </AdminAutoComplete>

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
    <ModalCreateRaritySticker
      v-model:visible="showCreateModal"
      :sticker="selectedSticker"
      :rarity-id="selectedRarity?.id"
      @created="onRarityCreate"
      @error="onRarityCreateError"
      @pending="(state: boolean) => rarityCreating = state"
      @cancel="onRarityCreateCancel"
    >
    </ModalCreateRaritySticker>

    <ModalEditRaritySticker
      v-model:visible="showEditModal"
      :sticker="getSelectedRaritySticker"
      @edited="onRarityEdit"
      @error="onRarityEditError"
      @pending="(state: boolean) => rarityEditing = state"
    >
    </ModalEditRaritySticker>

    <ModalDeleteStickerRarity
      v-model:visible="showDeleteModal"
      :sticker="getSelectedRaritySticker"
      @deleted="onRarityDelete"
      @error="onRarityDeleteError"
      @pending="(state: boolean) => rarityDeleting = state"
    >
    </ModalDeleteStickerRarity>
    <CustomToast ref="toast"></CustomToast>
  </VeeForm>
</template>

<script lang="ts" setup>
  import type CustomToast from "~/components/CustomToast.vue";

  const { StickerUpdateSchema } = useFormSchema();
  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

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
    selectedSticker: ApiSticker | null;
  }>();

  // load rarities
  const rarities = ref<Array<ApiRarity>>([]);
  const createdRarities = ref<Array<ApiRarity>>([]);
  onMounted(async () => {
    fetchRarities();
  });

  // loads all available rarities
  const fetchRarities = async () => {
    console.log("fetching rarities");
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
  };

  // loads sticker created rarities
  const rarityStickers = ref<Array<ApiSticker>>([]);
  const fetchStickerRarities = async () => {
    if (!props.selectedSticker) return;

    console.log("fetching sticker rarities");
    try {
      const response = await useApi<{
        stickers: Array<ApiSticker>;
      }>(`v1/stickers/${props.selectedSticker.id}/rarities`);

      if (!response.stickers) {
        emit("error", t("unexpected-error"));
        return;
      }

      rarityStickers.value = response.stickers;
      createdRarities.value = response.stickers
        .filter((s) => s.rarity)
        .map((s) => s.rarity) as Array<ApiRarity>;
    } catch (error) {
      emit("error", t("unexpected-error"));
    }
  };

  const updateWidth = () => {
    if (!height.value || !denominator.value || !numerator.value) return;

    width.value = (height.value / denominator.value) * numerator.value;
    emit("transformChange", values as UpdateStickerForm);
  };

  const updateHeight = () => {
    if (!width.value || !denominator.value || !numerator.value) return;

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
  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    emit("submit", values);
  });

  const resetValues = (
    values: Partial<UpdateStickerForm> | undefined = undefined
  ) => {
    console.log("values", values);
    if (values) {
      setValues(values);
    } else if (rarities.value.length) {
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

  // rarity create modal
  const showCreateModal = ref(false);
  const selectedRarity = ref<ApiRarity | null>(null);
  const rarityCreating = ref(false);
  const onRaritySelect = (e: { event: any; value: ApiRarity }) => {
    console.log("rarity", e);
    selectedRarity.value = e.value;
    showCreateModal.value = true;
  };

  const onRarityCreate = (sticker: ApiSticker) => {
    console.log("created rarity", sticker);
    rarityStickers.value.push(sticker);
    toast.value?.show("success", t("admin-sticker-rarity-created"));
  };

  const onRarityCreateCancel = () => {
    createdRarities.value.pop();
  };

  const onRarityCreateError = (errorMessage: string) => {
    createdRarities.value.pop();
    toast.value?.show("error", errorMessage);
  };

  // rarity edit modal
  const showEditModal = ref(false);
  const rarityEditing = ref(false);
  const onRarityEditClick = (rarity: ApiRarity) => {
    console.log(rarity);
    showEditModal.value = true;
    selectedRarity.value = rarity;
  };

  const onRarityEdit = (sticker: ApiSticker) => {
    console.log("edited sticker", sticker);
    const index = rarityStickers.value.findIndex((s) => s.id == sticker.id);

    if (index >= 0) {
      rarityStickers.value[index] = sticker;
    }

    console.log("index", index, rarityStickers.value);
  };

  const onRarityEditError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };

  // rarity delete modal
  const showDeleteModal = ref(false);
  const rarityDeleting = ref(false);
  const onRarityRemoveClick = (rarity: ApiSticker) => {
    console.log("deleting rarity sticker", rarity);
    showDeleteModal.value = true;
    selectedRarity.value = rarity;
  };

  const onRarityDelete = (deletedSticker: ApiSticker) => {
    console.log("dleteed");
    /* delete rarity sticker */
    let ind = rarityStickers.value.findIndex((sticker) => {
      return sticker.id == deletedSticker.id;
    });
    // sticker was not found
    if (ind < 0) return;
    rarityStickers.value.splice(ind, 1);

    /* delete rarity */
    ind = createdRarities.value.findIndex((rarity) => {
      return rarity.id == deletedSticker.rarity_id;
    });
    // rarity was not found
    if (ind < 0) return;
    createdRarities.value.splice(ind, 1);

    // display success message
    toast.value?.show("success", t("admin-sticker-rarity-deleted"));
  };

  const onRarityDeleteError = (errorMessage: string) => {
    console.log("err");
    toast.value?.show("error", errorMessage);
  };

  const getSelectedRaritySticker = computed(() => {
    console.log(rarityStickers.value);
    console.log(selectedRarity.value);
    return rarityStickers.value.find(
      (s) => s.rarity?.id == selectedRarity.value?.id
    );
  });

  watch(
    () => props.selectedSticker?.id,
    (newId, oldId) => {
      if (newId) {
        // load selected sticker rarities
        fetchStickerRarities();
      }
    }
  );
</script>

<style></style>
