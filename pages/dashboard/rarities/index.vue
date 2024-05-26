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
        :items="rarities"
        :columns="columns"
        :rows="limit"
        :total-records="totalRecords"
        :paginator="true"
        @page="(pageState: PageState) => fetchRarities(pageState.page)"
      >
      </AdminDataTable>
    </div>
    <AdminModalCreateRarity
      v-model:visible="showCreateModal"
      @created="onRarityCreate"
      @error="onRarityCreateError"
      @pending="onRarityCreating"
    />
    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import type { PageState } from "primevue/paginator";
  import { onMounted } from "vue";
  import type CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    auth: true,
    adminAuth: true,
    layout: "dashboard",
  });

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const rarities = ref<Array<ApiRarity>>([]);
  const columns = [
    {
      field: "title",
      label: t("admin-role-column-title"),
      sortable: true,
    },
  ];

  const limit = ref(10);
  const totalRecords = ref(0);
  onMounted(async () => {
    fetchRarities();
  });

  const fetchRarities = async (page: number = 0) => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        rarities: Array<ApiRarity>;
      }>(`v1/rarities?limit=${limit.value}&page=${page}`);

      if (!response.rarities) {
        toast.value?.show("error", t("unexpected-error"));
        return;
      }

      if (response.metadata) {
        totalRecords.value = response.metadata.total_records;
      }

      rarities.value = response.rarities;
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  };

  // Create modal
  const showCreateModal = ref(false);
  const creating = ref(false);
  const onRarityCreating = (status: boolean) => (creating.value = status);
  const onRarityCreate = (createdRarity: ApiRarity) => {
    rarities.value.push(createdRarity);
    toast.value?.show("success", t("admin-rarity-created"));
  };

  const onRarityCreateError = (errorMessage: string) => {
    // display error message
    toast.value?.show("error", errorMessage);
  };
</script>

<style></style>
