<template>
  <div class="h-full flex flex-col">
    <AdminHeader></AdminHeader>

    <div class="h-full overflow-y-auto">
      <div class="h-full m-4 p-4 bg-base-secondary rounded-md relative">
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
          <!-- Album details -->
          <VeeForm
            class="col-span-4 flex flex-col gap-y-4 p-2 bg-base-white rounded-md"
            @submit="onSubmit"
          >
            <div>
              <CustomFileUpload
                v-model:file="file"
                :error="errors.file"
                :url="useUrl(album?.file?.url)"
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
            <AdminButton type="submit" class="py-2 rounded-md">
              Update
            </AdminButton>
          </VeeForm>
          <div
            class="col-span-8 flex flex-col gap-y-2 p-2 bg-base-white rounded-md"
          >
            <!-- Pages -->
            <div>
              <div class="flex justify-between items-center p-2">
                <h2 class="font-bold">Pages</h2>
                <AdminButton
                  color="blue"
                  class="py-2 px-6 rounded-md"
                  @click="toggleCreatePageModal(null)"
                >
                  Create
                </AdminButton>
              </div>
              <div
                v-if="album && album.pages.length > 0"
                class="flex gap-x-4 overflow-x-auto px-2 py-4 bg-base-secondary"
                style="flex-wrap: nowrap !important"
              >
                <AdminItemPage
                  v-for="page in album.pages"
                  :key="page.id"
                  :page="page"
                  :albumId="album.id"
                  @create="toggleCreatePageModal"
                  @edit="toggleEditPageModal(page)"
                >
                </AdminItemPage>
              </div>

              <div
                v-else
                class="flex justify-center items-center min-h-[225px] bg-base-secondary"
              >
                <h3 class="text-lg">
                  No pages yet, try
                  <span
                    class="text-base-blue underline hover:cursor-pointer"
                    @click="toggleCreatePageModal(null)"
                    >creating</span
                  >
                  one
                </h3>
              </div>
            </div>

            <!-- Packs -->
            <div>
              <div class="flex justify-between items-center p-2">
                <h2 class="font-bold">Packs</h2>
                <AdminButton
                  color="blue"
                  class="py-2 px-6 rounded-md"
                  @click="showCreatePackModal = true"
                >
                  Create
                </AdminButton>
              </div>
              <div
                v-if="packs.length > 0"
                class="flex gap-x-4 overflow-x-auto px-2 py-4 bg-base-secondary"
                style="flex-wrap: nowrap !important"
              >
                <AdminItemPack
                  v-for="pack in packs"
                  :key="pack.id"
                  :pack="pack"
                  class="w-full sm:w-1/2 lg:w-1/4 2xl:w-1/6 flex-shrink-0 flex hover:cursor-pointer group"
                  @click="onPackClick(pack)"
                >
                </AdminItemPack>
              </div>
              <div
                v-else
                class="flex justify-center items-center min-h-[225px] bg-base-secondary"
              >
                <h3 class="text-lg">
                  No packs yet, try
                  <span
                    class="text-base-blue underline hover:cursor-pointer"
                    @click="showCreatePackModal = true"
                    >creating</span
                  >
                  one
                </h3>
              </div>
            </div>
          </div>
        </div>
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
    <!-- Page modals -->
    <ModalCreatePage
      :album-id="$route.params.id"
      :sort-order="pageOrder"
      v-model:visible="showCreatePageModal"
      @created="onPageCreated"
      @error="onPageCreateError"
      @pending="onPageCreating"
    />

    <ModalEditPage
      :page="selectedPage"
      v-model:visible="showEditPageModal"
      @edited="onPageEdited"
      @deleted="onPageDeleted"
      @error="onPageEditError"
      @pending="onPageEditing"
    />

    <!-- Pack modals -->
    <ModalCreatePack
      :album-id="$route.params.id"
      v-model:visible="showCreatePackModal"
      @created="onPackCreated"
      @error="onPackCreateError"
      @pending="onPackCreating"
    />

    <ModalEditPack
      :pack="selectedPack"
      v-model:visible="showEditPackModal"
      @edited="onPackEdited"
      @deleted="onPackDeleted"
      @error="onPackEditError"
      @pending="onPackEditing"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  import CustomFileUpload from "~/components/CustomFileUpload.vue";
  import type CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const { t } = useI18n();
  const route = useRoute();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  // fetch album on load
  const album = ref<ApiAlbum>();
  const pending = ref(true);
  onMounted(() => {
    fetchAlbum();
    fetchPacks();
  });

  const fetchAlbum = async () => {
    pending.value = true;
    try {
      const response = await useApi<{ album: ApiAlbum }>(
        `/v1/albums/${route.params.id}`
      );
      if (!response.album) {
        toast.value?.show("error", t("admin-response-mismatch"));
        return;
      }

      album.value = response.album;
      resetForm({
        values: {
          title: album.value?.title,
          dateFrom: new Date(Date.parse(album.value?.date_from ?? "")),
          dateTo: new Date(Date.parse(album.value?.date_to ?? "")),
          featured: album.value.featured ?? false,
        },
      });
      console.log(album.value);
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
      // router.push({ path: "/dashboard/albums" });
    }
    pending.value = false;
  };

  const packs = ref<Array<ApiPack>>([]);
  const loadingPacks = ref(false);
  const fetchPacks = async () => {
    console.log("fetchin packs");
    loadingPacks.value = true;
    try {
      const response = await useApi<{ packs: Array<ApiPack> }>(
        `/v1/albums/${route.params.id}/packs`
      );
      if (!response.packs) {
        toast.value?.show("error", t("admin-response-mismatch"));
        return;
      }

      packs.value = response.packs;
      console.log(packs.value);
    } catch (error) {
      console.log(error);
      toast.value?.show("error", t("unexpected-error"));
      // router.push({ path: "/dashboard/albums" });
    }
    loadingPacks.value = false;
  };

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
    if (!album.value) return;

    console.log(values);
    const body = new FormData();
    body.append("title", values.title);
    body.append("date_from", values.dateFrom.toISOString());
    body.append("date_to", values.dateTo?.toISOString() ?? "");
    body.append("featured", JSON.stringify(values.featured));
    body.append("file", values.file);
    body.append("file_id", album.value?.file?.id ?? "");

    updating.value = true;
    try {
      const response = await useApi<{ album: ApiAlbum }>(
        `/v1/albums/${route.params.id}`,
        {
          method: "PUT",
          body: body,
        }
      );
      if (!response.album) {
        toast.value?.show("error", t("admin-response-mismatch"));
        return;
      }

      // omit pages property, because PUT endpoint does not return all album data
      const { pages, ...rest } = response.album;
      album.value = { ...rest, pages: album.value.pages };

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

  // page create modal
  const showCreatePageModal = ref(false);
  const creating = ref(false);
  const pageOrder = ref(0);
  const toggleCreatePageModal = (order: number | null) => {
    if (order) {
      pageOrder.value = order;
    } else if (!album.value || !album.value.pages) {
      pageOrder.value = 0;
    } else {
      const lastNum = album.value.pages.slice(-1)[0];
      if (lastNum) {
        pageOrder.value = lastNum.sort_order + 1;
      }
    }

    showCreatePageModal.value = true;
  };

  const onPageCreating = (status: boolean) => {
    creating.value = status;
  };
  const onPageCreated = (createdPage: ApiPage) => {
    if (!album.value) return;

    album.value.pages?.push(createdPage);

    // reorder pages
    album.value.pages?.sort((a, b) => {
      return a.sort_order - b.sort_order;
    });

    toast.value?.show("success", t("admin-page-created"));
  };

  const onPageCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };

  // page edit modal
  const showEditPageModal = ref(false);
  const editing = ref(false);
  const selectedPage = ref<ApiPage | null>(null);
  const toggleEditPageModal = (page: ApiPage) => {
    selectedPage.value = page;
    showEditPageModal.value = true;
  };

  const onPageEditing = (status: boolean) => {
    editing.value = status;
  };

  const onPageEdited = (editedPage: ApiPage) => {
    if (!album.value) return;

    const index = album.value.pages.findIndex((p) => p.id == editedPage.id);

    if (index >= 0) {
      album.value.pages[index] = editedPage;
    }

    toast.value?.show("success", t("admin-page-edited"));
  };

  const onPageDeleted = (deletedPage: ApiPage) => {
    if (!album.value) return;

    const index = album.value.pages.findIndex((p) => p.id == deletedPage.id);

    if (index >= 0) {
      album.value.pages.splice(index, 1);
    }

    toast.value?.show("success", t("admin-page-deleted"));
  };

  const onPageEditError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };

  // pack create modal
  const showCreatePackModal = ref(false);
  const creatingPack = ref(false);
  const onPackCreating = (status: boolean) => {
    creatingPack.value = status;
  };
  const onPackCreated = (createdPack: ApiPack) => {
    packs.value.push(createdPack);
    toast.value?.show("success", t("admin-pack-created"));
  };

  const onPackCreateError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };

  // pack edit modal
  const showEditPackModal = ref(false);
  const editingPack = ref(false);
  const selectedPack = ref<ApiPack | null>(null);
  const onPackClick = (pack: ApiPack) => {
    selectedPack.value = pack;
    showEditPackModal.value = true;
  };

  const onPackEditing = (status: boolean) => {
    editingPack.value = status;
  };

  const onPackEdited = (editedPack: ApiPack) => {
    const index = packs.value.findIndex((p) => p.id == editedPack.id);
    console.log(index, editedPack);
    if (index >= 0) {
      packs.value[index] = editedPack;
    }

    toast.value?.show("success", t("admin-pack-edited"));
  };

  const onPackDeleted = (deletedPack: ApiPack) => {
    const index = packs.value.findIndex((p) => p.id == deletedPack.id);

    if (index >= 0) {
      packs.value.splice(index, 1);
    }

    toast.value?.show("success", t("admin-pack-deleted"));
  };

  const onPackEditError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };
</script>

<style></style>
