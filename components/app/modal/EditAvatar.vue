<template>
  <AppDialog
    v-model:visible="isVisible"
    :modal="true"
    :draggable="false"
    header="Choose avatar"
    :loading="fetchingAvatars || savingAvatar"
    @show="onShow"
  >
    <div class="h-full w-full flex flex-col justify-between p-2">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="avatar in avatars"
          :key="avatar.id"
          @click="selectedAvatar = avatar"
        >
          <div class="flex flex-col gap-y-1 text-center text-app-secondary">
            <NuxtImg
              :src="useUrl(avatar.file?.url)"
              class="aspect-square rounded-full transition-all"
              :class="{
                'ring-4 ring-app-tertiary': selectedAvatar?.id == avatar.id,
              }"
            ></NuxtImg>
            <span class="font-medium">{{ avatar.title }}</span>
          </div>
        </div>
      </div>
      <AppButton
        :disabled="userStore.user.avatar_id == selectedAvatar?.id"
        @click="onSave"
      >
        Save
      </AppButton>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const isVisible = defineModel("visible", { type: Boolean });

  // const emit = defineEmits<{
  //   update: [avatar: ApiAvatar];
  // }>();

  const onShow = () => {
    selectedAvatar.value = userStore.user.avatar;
    fetchAvatars();
  };

  const userStore = useUserStore();
  const selectedAvatar = ref<ApiAvatar | null>(null);
  const avatars = ref<Array<ApiAvatar>>([]);
  const fetchingAvatars = ref(false);
  const fetchAvatars = async () => {
    fetchingAvatars.value = true;
    try {
      const response = await useApi<{
        avatars: Array<ApiAvatar>;
      }>("/v1/avatars", {
        params: {
          limit: 99,
        },
      });

      if (response.avatars) {
        avatars.value = response.avatars;
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    fetchingAvatars.value = false;
  };

  const savingAvatar = ref(false);
  const onSave = async () => {
    if (!selectedAvatar.value) return;

    savingAvatar.value = true;
    try {
      const response = await useApi<{
        user: ApiUser;
      }>(`/v1/users/${userStore.user.id}`, {
        method: "PUT",
        body: {
          avatar_id: selectedAvatar.value.id,
        },
      });

      if (response.user) {
        userStore.user = response.user;
        isVisible.value = false;
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    savingAvatar.value = false;
  };
</script>

<style></style>
