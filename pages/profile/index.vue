<template>
  <div class="flex flex-col items-center gap-y-4 px-4 py-2">
    <h2 class="text-2xl font-semibold">{{ userStore.user.username }}</h2>
    <div>
      <div
        class="w-1/3 h-auto mx-auto aspect-square rounded-full relative"
        @click="onEditAvatar"
      >
        <NuxtImg
          :src="useUrl(userStore.user.avatar?.file?.url)"
          class="w-[250px] h-auto aspect-square rounded-full transition-all"
          :class="{
            'ring-4 !ring-app-tertiary': editingAvatar,
          }"
        ></NuxtImg>
        <Icon
          name="i-mdi:square-edit-outline"
          size="20"
          class="absolute -top-2.5 -right-2.5 text-app-secondary"
        />
      </div>
    </div>
    <div class="text-center w-full">
      <div class="pb-1 w-full">
        <p v-if="!editDescription" class="whitespace-pre-line">
          {{ userDescription() }}
        </p>
        <textarea
          v-else
          v-model="description"
          name="description"
          class="w-full bg-app-primary border-2 border-app-secondary outline-none p-2 text-center"
        ></textarea>
      </div>
      <div class="flex justify-center gap-x-2">
        <AppIconButton
          @click="onEditDescription"
          :disabled="editingDescription"
        >
          <Icon
            :name="
              editingDescription
                ? 'i-svg-spinners:6-dots-scale-middle'
                : !editDescription
                ? 'i-mdi:square-edit-outline'
                : 'i-mdi:check-circle-outline'
            "
            size="22"
            class="text-app-secondary"
          />
        </AppIconButton>
        <AppIconButton
          @click="onEditCancel"
          :disabled="editingDescription"
          :class="{ hidden: !editDescription || editingDescription }"
        >
          <Icon
            name="i-mdi:close-circle-outline"
            size="22"
            class="text-app-secondary"
          />
        </AppIconButton>
      </div>
    </div>
    <div class="flex flex-col text-center gap-y-2">
      <div>
        <h2
          class="inline-block text-lg font-semibold border-t-2 border-app-secondary px-4 uppercase"
        >
          Progress
        </h2>
      </div>
      <div class="grid grid-cols-2">
        <div class="flex flex-col items-center">
          <span>Albums completed</span>
          <span class="font-bold">0</span>
        </div>
        <div class="flex flex-col items-center">
          <span>Packs opened</span>
          <span class="font-bold">0</span>
        </div>
        <div class="flex flex-col items-center">
          <span>Stickers found</span>
          <span class="font-bold">0</span>
        </div>
        <div class="flex flex-col items-center">
          <span>Stickers sticked</span>
          <span class="font-bold">0</span>
        </div>
      </div>
    </div>

    <AppModalEditAvatar
      v-model:visible="showEditModal"
      @hide="onEditAvatarClose"
    ></AppModalEditAvatar>
  </div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();

  const editDescription = ref(false);
  const description = ref<string | null>("");

  onMounted(() => {
    description.value = userStore.user.description;
  });

  const userDescription = () => {
    if (!userStore.user.description) return "User has no description";
    return userStore.user.description;
  };

  const showEditModal = ref(false);
  const editingAvatar = ref(false);
  const onEditAvatar = () => {
    showEditModal.value = true;
    editingAvatar.value = true;
  };

  const onEditAvatarClose = () => {
    editingAvatar.value = false;
  };

  const editingDescription = ref(false);
  const onEditDescription = async () => {
    if (
      editDescription.value == false ||
      description.value == userStore.user.description
    ) {
      editDescription.value = !editDescription.value;
      return;
    }

    editingDescription.value = true;
    try {
      const response = await useApi<{
        user: ApiUser;
      }>(`/v1/users/${userStore.user.id}`, {
        method: "PUT",
        body: {
          description: description.value,
          avatar_id: userStore.user.avatar_id,
        },
      });

      if (response.user) {
        userStore.user = response.user;
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    editDescription.value = false;
    editingDescription.value = false;
  };

  const onEditCancel = () => {
    editDescription.value = false;
    description.value = userStore.user.description;
  };
</script>

<style></style>
