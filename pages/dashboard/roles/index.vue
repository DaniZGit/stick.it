<template>
  <div class="h-full flex flex-col">
    <AdminHeader></AdminHeader>

    <div class="h-full overflow-y-auto">
      <!-- Top Bar -->
      <AdminDataTable
        :items="roles"
        :columns="columns"
        :rows="limit"
        :total-records="rolesCount"
        :paginator="true"
        @page="(pageState: PageState) => fetchRoles(pageState.page)"
      >
      </AdminDataTable>
    </div>
    <CustomToast ref="toast"></CustomToast>
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

  const roles = ref<Array<ApiRole>>([]);
  const columns = [
    {
      field: "title",
      label: t("admin-role-column-title"),
      sortable: true,
    },
  ];

  const limit = ref(10);
  const rolesCount = ref(0);
  onMounted(async () => {
    fetchRoles();
  });

  const fetchRoles = async (page: number = 0) => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        roles: Array<ApiRole>;
      }>(`v1/roles?limit=${limit.value}&page=${page}`);

      if (!response.roles) {
        toast.value?.show("error", t("unexpected-error"));
        return;
      }

      if (response.metadata) {
        rolesCount.value = response.metadata.total_records;
      }

      roles.value = response.roles;
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  };
</script>

<style></style>
