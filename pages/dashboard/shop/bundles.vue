<template>
  <div class="h-full grid grid-rows-12 grid-flow-row">
    <AdminHeader class="row-span-1"></AdminHeader>

    <div class="h-full row-span-11">
      <!-- Top Bar -->
      <div class="flex justify-between p-4">
        <div class="flex">
          <InputGroup>
            <AdminInputText
              class="!rounded-r-none"
              placeholder="Search albums..."
            />
            <AdminButton
              class="border-2 border-l-0 border-base-inactive border-opacity-40 rounded-l-none p-2"
            >
              <Icon name="i-ic:round-search" size="16" />
            </AdminButton>
          </InputGroup>
        </div>
        <div>
          <AdminButton
            class="h-full px-8 text-md rounded-md"
            color="blue"
            @click="showCreateModal = true"
          >
            Create
          </AdminButton>
        </div>
      </div>

      <AdminDataTable
        :items="bundles"
        :columns="columns"
        :rows="limit"
        :total-records="totalRecords"
        :paginator="true"
        @page="(pageState: PageState) => fetchBundles(pageState.page)"
        @edit="onEditBundleClick"
        @delete="onDeleteBundleClick"
      >
      </AdminDataTable>
    </div>
    <AdminModalCreateBundle
      v-model:visible="showCreateModal"
      @created="onBundleCreated"
      @error="onBundleCreateError"
      @pending="onBundleCreating"
    />
    <AdminModalEditBundle
      v-model:visible="showEditModal"
      :bundle="selectedBundle"
      @edited="onBundleEdited"
      @error="onBundleEditError"
      @pending="onBundleEditing"
    />
    <AdminModalDeleteBundle
      v-model:visible="showDeleteModal"
      :bundle="selectedBundle"
      @deleted="onBundleDeleted"
      @error="onBundleDeleteError"
      @pending="onBundleDeleting"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { PageState } from "primevue/paginator";
  import { onMounted } from "vue";
  import type CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const bundles = ref<Array<ApiBundle>>([]);
  const columns = [
    {
      field: "title",
      label: t("admin-role-column-title"),
      sortable: true,
    },
    {
      field: "price",
      label: t("admin-role-column-price"),
      sortable: true,
    },
    {
      field: "tokens",
      label: t("admin-role-column-tokens"),
      sortable: true,
    },
    {
      field: "bonus",
      label: t("admin-role-column-bonus"),
      sortable: true,
    },
  ];

  const limit = ref(10);
  const totalRecords = ref(0);
  onMounted(async () => {
    fetchBundles();
  });

  const fetchBundles = async (page: number = 0) => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        bundles: Array<ApiBundle>;
      }>(`v1/bundles?limit=${limit.value}&page=${page}`);

      if (!response.bundles) {
        toast.value?.show("error", t("unexpected-error"));
        return;
      }

      if (response.metadata) {
        totalRecords.value = response.metadata.total_records;
      }

      bundles.value = response.bundles;
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  };

  // Create modal
  const showCreateModal = ref(false);
  const creating = ref(false);
  const onBundleCreating = (status: boolean) => (creating.value = status);
  const onBundleCreated = (createdBundle: ApiBundle) => {
    bundles.value.push(createdBundle);
    toast.value?.show("success", t("admin-rarity-created"));
  };

  const onBundleCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };

  // Edit modal
  const selectedBundle = ref<ApiBundle | null>(null);
  const showEditModal = ref(false);
  const editing = ref(false);
  const onEditBundleClick = (bundle: ApiBundle) => {
    selectedBundle.value = bundle;
    showEditModal.value = true;
  };

  const onBundleEditing = (status: boolean) => (editing.value = status);
  const onBundleEdited = (bundle: ApiBundle) => {
    const index = bundles.value.findIndex((b) => b.id == bundle.id);
    if (index >= 0) {
      bundles.value[index] = bundle;
    }
  };
  const onBundleEditError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };

  // Delete modal
  const showDeleteModal = ref(false);
  const deleting = ref(false);
  const onDeleteBundleClick = (bundle: ApiBundle) => {
    selectedBundle.value = bundle;
    showDeleteModal.value = true;
  };

  const onBundleDeleting = (status: boolean) => {
    deleting.value = status;
  };
  const onBundleDeleted = (bundle: ApiBundle) => {
    const index = bundles.value.findIndex((b) => b.id == bundle.id);
    if (index >= 0) {
      bundles.value.splice(index, 1);
    }
  };
  const onBundleDeleteError = (errorMessage: string) => {
    toast.value?.show("error", errorMessage);
  };
</script>

<style></style>
