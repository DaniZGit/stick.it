<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Edit pack"
    :modal="true"
    :draggable="false"
    @hide="emit('close')"
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
            :url="props.pack?.file?.url"
            :error="errors.file"
          ></CustomFileUpload>
        </div>

        <div class="flex flex-col w-5/6 gap-y-4 mx-auto">
          <AdminInputText
            id="title"
            name="title"
            :label="$t('admin-pack-edit-title')"
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
            id="amount"
            name="amount"
            :label="$t('admin-pack-create-amount')"
            placeholder="5"
            icon="i-material-symbols:height"
            v-model="amount"
            :min="0"
            show-buttons
            :error="errors.amount"
          />

          <div class="flex flex-col gap-y-2">
            <div class="flex gap-x-2 items-center">
              <label for="">Drop chances</label>
              <div class="flex items-center gap-x-1">
                <AdminDropdown
                  id="packRarity"
                  name="packRarity"
                  :label="$t('admin-pack-create-price')"
                  placeholder="Add a rarity"
                  icon="i-material-symbols:height"
                  v-model="selectedPackRarityId"
                  :options="getAvailableRarities"
                  option-label="title"
                  option-value="id"
                  :error="errors.price"
                >
                </AdminDropdown>
                <AdminButton
                  class="py-0 px-1.5"
                  @click="onPackRarityAdd"
                  :disabled="!selectedPackRarityId"
                  >+</AdminButton
                >
              </div>
            </div>
            <div v-if="packRarities.length" class="flex flex-col gap-y-2">
              <div
                v-for="(packRarity, i) in packRarities"
                :key="packRarity.id"
                class="grid grid-cols-12 gap-x-2"
              >
                <span class="col-span-2 flex items-center">{{
                  getPackRarityTitle(packRarity)
                }}</span>
                <div
                  class="col-span-2 border-r-2 border-base-black border-opacity-25"
                >
                  <AdminInputNumber
                    placeholder="0"
                    v-model="packRarity.drop_chance"
                    :min="0"
                    :max="calculateMaxDropChance(packRarity)"
                    :max-fraction-digits="4"
                    :step="0.01"
                    show-buttons
                    :error="errors.price"
                  />
                </div>
                <div class="col-span-2 flex items-center gap-x-2">
                  <AdminButton
                    class="!border-0 w-1/3 aspect-square"
                    @click="onPackRarityDelete(packRarity)"
                  >
                    <Icon name="i-mdi:trash-can-outline" size="24" />
                  </AdminButton>
                </div>
              </div>
            </div>
          </div>
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
            @click="onPackDelete"
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
  const { PackCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps<{
    pack: ApiPack | null;
  }>();

  const emit = defineEmits<{
    edited: [pack: ApiPack];
    deleted: [pack: ApiPack];
    error: [message: string];
    pending: [value: boolean];
    close: [];
  }>();

  onMounted(() => {
    fetchRarities();
  });

  // loads all available rarities
  const rarities = ref<Array<ApiRarity>>([]);
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

      // add base rarity
      rarities.value.push({
        id: "null",
        title: "Base",
      });
      // add other rarities
      rarities.value.push(...response.rarities);
    } catch (error) {
      emit("error", t("unexpected-error"));
    }
  };

  // form stuff
  const { defineField, handleSubmit, errors, setErrors, setValues } = useForm({
    validationSchema: PackCreateSchema,
  });

  const [title] = defineField("title");
  const [price] = defineField("price");
  const [amount] = defineField("amount");
  const [file] = defineField("file");
  const selectedPackRarityId = ref<string>("");

  // edit request
  const onSubmit = handleSubmit((values) => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("price", values.price.toString());
    body.append("amount", values.amount.toString());
    body.append("file", values.file);
    body.append("file_id", props.pack?.file_id?.toString() ?? "");

    console.log("editing pack");

    // update pack
    updatePack(body);
    // update all pack rarities
    packRarities.value.forEach((pr) => {
      updatePackRarity(pr);
    });
  });

  const updatePack = async (body: FormData) => {
    try {
      const response = await useApi<{ pack: ApiPack }>(
        `/v1/packs/${props.pack?.id}`,
        {
          method: "PUT",
          body: body,
        }
      );

      if (response.pack) {
        emit("edited", response.pack);
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
  };

  watch(isVisible, (newVisible, oldVisible) => {
    console.log(newVisible, oldVisible, props.pack);
    if (newVisible == true) {
      setValues({
        title: props.pack?.title,
        price: props.pack?.price,
      });

      // fetch pack rarities
      console.log("watcher fetching");
      fetchPackRarities();
    }
  });

  watch(
    () => props.pack,
    (newPack, oldPack) => {
      if (newPack) {
        setValues({
          title: newPack.title,
          price: newPack.price,
          amount: newPack.amount,
        });
      }
    }
  );

  // delete pack
  const onPackDelete = async () => {
    try {
      const response = await useApi<{ pack: ApiPack }>(
        `/v1/packs/${props.pack?.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.pack) {
        emit("deleted", response.pack);

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
  };

  const packRarities = ref<Array<ApiPackRarity>>([]);
  const fetchPackRarities = async () => {
    try {
      const response = await useApi<{ pack_rarities: Array<ApiPackRarity> }>(
        `/v1/packs/${props.pack?.id}/rarities`
      );

      if (response.pack_rarities) {
        packRarities.value = response.pack_rarities;
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
  };

  const getAvailableRarities = computed(() => {
    return rarities.value.filter((r) => {
      return (
        packRarities.value.find(
          (pr) => r.id == pr.rarity_id || (r.id == "null" && !pr.rarity_id)
        ) == undefined
      );
    });
  });

  const calculateMaxDropChance = (packRarity: ApiPackRarity) => {
    let maxDropChance = 0;
    packRarities.value.forEach((pr) => {
      if (pr.id != packRarity.id) maxDropChance += pr.drop_chance;
    });

    return 1 - maxDropChance;
  };

  const getPackRarityTitle = (packRarity: ApiPackRarity) => {
    const rarity = rarities.value.find(
      (r) =>
        r.id == packRarity.rarity_id ||
        (r.id == "null" && !packRarity.rarity_id)
    );

    return rarity?.title ?? "Unknown";
  };

  // create pack rarity
  const onPackRarityAdd = async () => {
    try {
      const response = await useApi<{ pack_rarity: ApiPackRarity }>(
        `/v1/pack-rarities`,
        {
          method: "POST",
          body: {
            pack_id: props.pack?.id,
            rarity_id:
              selectedPackRarityId.value == "null"
                ? null
                : selectedPackRarityId.value,
            drop_chance: 0,
          },
        }
      );

      if (response.pack_rarity) {
        packRarities.value.push(response.pack_rarity);
      }

      toast.value?.show("success", t("admin-pack-rarity-created"));
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

    selectedPackRarityId.value = "";
  };

  // update pack rarity
  const updatePackRarity = async (packRarity: ApiPackRarity) => {
    try {
      const response = await useApi<{ pack_rarity: ApiPackRarity }>(
        `/v1/pack-rarities/${packRarity.id}`,
        {
          method: "PUT",
          body: {
            drop_chance: packRarity.drop_chance,
          },
        }
      );

      if (response.pack_rarity) {
        const index = packRarities.value.findIndex(
          (pr) => pr.id == response.pack_rarity.id
        );
        if (index >= 0) {
          packRarities.value[index] = response.pack_rarity;
        }
      }

      toast.value?.show("success", t("admin-pack-rarity-updated"));
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
  };

  // delete pack rarity
  const onPackRarityDelete = async (packRarity: ApiPackRarity) => {
    try {
      const response = await useApi<{ pack_rarity: ApiPackRarity }>(
        `/v1/pack-rarities/${packRarity.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.pack_rarity) {
        const index = packRarities.value.findIndex(
          (pr) => pr.id == response.pack_rarity.id
        );
        if (index >= 0) {
          packRarities.value.splice(index, 1);
        }
      }

      toast.value?.show("success", t("admin-pack-rarity-deleted"));
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
  };
</script>

<style></style>
