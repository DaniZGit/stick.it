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
              placeholder="Search avatars..."
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
        :items="avatars"
        :columns="columns"
        :rows="limit"
        :total-records="avatarsCount"
        :paginator="true"
        header-title="Avatars"
        @page="(pageState: PageState) => fetchAvatars(pageState.page)"
        @create="onCreateClick"
        @edit="onEditClick"
        @delete="onDeleteClick"
      >
      </AdminDataTable>
    </div>

    <AdminModalCreateAvatar
      v-model:visible="showCreateModal"
      @created="onAvatarCreated"
      @error="onError"
    />
    <AdminModalEditAvatar
      v-model:visible="showEditModal"
      :avatar="selectedAvatar"
      @edited="onAvatarEdited"
      @error="onError"
    />
    <AdminModalDeleteAvatar
      v-model:visible="showDeleteModal"
      :avatar="selectedAvatar"
      @deleted="onAvatarDeleted"
      @error="onError"
    />

    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script lang="ts" setup>
  import type { PageState } from "primevue/paginator";
  import type CustomToast from "~/components/CustomToast.vue";

  definePageMeta({
    auth: true,
    adminAuth: true,
    layout: "dashboard",
  });

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  const columns = [
    {
      field: "title",
      label: t("admin-avatar-column-title"),
      sortable: true,
    },
  ];

  const limit = ref(10);
  const avatarsCount = ref(0);
  const avatars = ref<Array<ApiAvatar>>([]);
  onMounted(async () => {
    fetchAvatars();
  });

  const fetchAvatars = async (page: number = 0) => {
    try {
      const response = await useApi<{
        metadata: ApiMetadata;
        avatars: Array<ApiAvatar>;
      }>(`v1/avatars?limit=${limit.value}&page=${page}`);

      if (response.avatars) {
        avatars.value = response.avatars;
      }

      if (response.metadata) {
        avatarsCount.value = response.metadata.total_records;
      }
    } catch (error) {
      toast.value?.show("error", t("unexpected-error"));
    }
  };

  const selectedAvatar = ref<ApiAvatar | null>(null);
  const showCreateModal = ref(false);
  const showEditModal = ref(false);
  const showDeleteModal = ref(false);
  const onCreateClick = () => {
    showCreateModal.value = true;
  };

  const onEditClick = (avatar: ApiAvatar) => {
    selectedAvatar.value = avatar;
    showEditModal.value = true;
  };

  const onDeleteClick = (avatar: ApiAvatar) => {
    selectedAvatar.value = avatar;
    showDeleteModal.value = true;
  };

  const onAvatarCreated = (avatar: ApiAvatar) => {
    avatars.value.push(avatar);
  };

  const onAvatarDeleted = (avatar: ApiAvatar) => {
    const index = avatars.value.findIndex((a) => a.id == avatar.id);

    if (index != undefined && index >= 0) {
      avatars.value.splice(index, 1);
    }
  };

  const onAvatarEdited = (avatar: ApiAvatar) => {
    const index = avatars.value.findIndex((a) => a.id == avatar.id);

    if (index != undefined && index >= 0) {
      avatars.value[index] = avatar;
    }
  };

  const onError = () => {
    toast.value?.show("error", t("unexpected-error"));
  };
</script>

<style></style>
