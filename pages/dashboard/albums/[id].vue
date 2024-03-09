<template>
  <div class="flex flex-col gap-y-2 h-full">
    <AdminHeader></AdminHeader>

    <!-- Top Bar -->
    <div class="flex justify-between p-4">
      <div class="flex">
        <InputGroup>
          <AdminInputText placeholder="Search albums..." />
          <AdminButton
            class="border-2 border-l-0 border-base-inactive border-opacity-40 rounded-l-none p-2"
          >
            <Icon name="i-ic:round-search" size="16" />
          </AdminButton>
        </InputGroup>
      </div>
      <div>
        <AdminButton class="h-full px-8 text-md rounded-md" color="blue">
          Create
        </AdminButton>
      </div>
    </div>

    <div class="m-4 mt-0 p-4 h-full bg-base-secondary rounded-md relative">
      <div
        v-if="pending"
        class="absolute top-0 right-0 bottom-0 left-0 flex flex-col justify-center items-center gap-y-4 bg-black bg-opacity-20 text-base-white"
      >
        <h1 class="uppercase text-3xl">
          Fetching <span>{{ $route.params.title }}</span> album
        </h1>
        <Icon name="i-svg-spinners:blocks-scale" size="64" />
      </div>
      <div v-else class="h-full grid grid-cols-12 gap-x-4">
        <VeeForm
          class="col-span-4 flex flex-col gap-y-4 p-2 bg-base-white rounded-md"
          @submit="onSubmit"
        >
          <div>
            <!-- <NuxtImg
              :src="album?.file.url"
              placeholder="/images/image-placeholder.png"
              class="w-full"
            ></NuxtImg> -->
            <CustomFileUpload
              v-model:file="file"
              :error="errors.file"
              :url="album?.file.url"
            >
            </CustomFileUpload>
          </div>
          <div class="flex flex-col gap-y-4">
            <AdminInputText
              id="title"
              name="title"
              :label="$t('admin-album-create-title')"
              placeholder="Fifa 1991"
              v-model="title"
              icon="ic:outline-email"
              :error="errors.title"
            />

            <AdminCalendar
              id="date-from"
              name="date-from"
              :label="$t('admin-album-create-date-from')"
              placeholder="dd/mm/yyyy hh:mm"
              v-model="dateFrom"
              icon="i-mdi:date-range"
              :show-time="true"
              hour-format="24"
              date-format="dd/mm/yy"
              :error="errors.dateFrom"
            />

            <AdminCalendar
              id="date-to"
              name="date-to"
              :label="$t('admin-album-create-date-to')"
              placeholder="dd/mm/yyyy hh:mm"
              v-model="dateTo"
              icon="i-mdi:date-range"
              :show-time="true"
              hour-format="24"
              date-format="dd/mm/yy"
              :error="errors.dateTo"
            />

            <div>
              <label for="">{{ $t("admin-album-create-options") }}</label>
              <InputGroup class="flex gap-x-2">
                <AdminInputGroupAddon>
                  <Icon name="i-mdi:feature-highlight" />
                </AdminInputGroupAddon>
                <div class="flex items-center gap-x-2">
                  <label for="featured">Is Featured </label>
                  <AdminCheckbox
                    input-id="featured"
                    v-model="featured"
                    :binary="true"
                  />
                </div>
              </InputGroup>
            </div>
          </div>
          <AdminButton type="submit" class="py-2 rounded-md mt-auto">
            Update
          </AdminButton>
        </VeeForm>
        <div class="col-span-8 p-2 bg-base-white rounded-md"></div>
      </div>
    </div>
    <Loader
      v-if="false"
      class="flex flex-col justify-center items-center gap-y-4 text-base-white z-[9999]"
    >
      <h1 class="uppercase text-3xl">Updating album...</h1>
      <Icon name="i-svg-spinners:blocks-scale" size="64" />
    </Loader>
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  import CustomFileUpload from "~/components/CustomFileUpload.vue";
  import type CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const { $api } = useNuxtApp();
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  // fetch albums on load
  const album = ref<Album>();
  const pending = ref(true);
  onMounted(async () => {
    try {
      const id = route.params.id;
      album.value = await $api<Album>(`/v1/albums/${id}`);
      resetForm({
        values: {
          title: album.value?.title,
          dateFrom: new Date(Date.parse(album.value?.date_from ?? "")),
          dateTo: new Date(Date.parse(album.value?.date_to ?? "")),
          featured: album.value.featured,
        },
      });
      console.log(album.value);
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
      router.push({ path: "/dashboard/albums" });
    }

    pending.value = false;
  });

  // form stuff
  const { AlbumCreateSchema } = useFormSchema();
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: AlbumCreateSchema,
  });

  const [title] = defineField("title");
  const [dateFrom] = defineField("dateFrom");
  const [dateTo] = defineField("dateTo");
  const [featured] = defineField("featured");
  const [file] = defineField("file");

  const updating = ref(false);
  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    const body = new FormData();
    body.append("title", values.title);
    body.append("date_from", values.dateFrom.toISOString());
    body.append("date_to", values.dateTo?.toISOString() ?? "");
    body.append("featured", JSON.stringify(values.featured));
    body.append("file", values.file);
    body.append("file_id", album.value?.file.id ?? "");

    updating.value = true;
    try {
      const id = route.params.id;
      const updatedAlbum = await $api<Album>(`/v1/albums/${id}`, {
        method: "PUT",
        body: body,
      });

      album.value = updatedAlbum;
      toast.value?.show("success", t("admin-album-updated"));
    } catch (error) {
      const handledErrors = useHandleFormErrors(error as FetchError<ApiError>);

      if (handledErrors?.errors) {
        setErrors(handledErrors.errors);
      } else {
        toast.value?.show("error", t("unexpected-error"));
      }
    }
    updating.value = false;
  });
</script>

<style></style>
