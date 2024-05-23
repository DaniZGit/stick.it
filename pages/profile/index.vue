<template>
  <div class="flex flex-col items-center gap-y-4 px-4 py-2">
    <h2 class="text-2xl font-semibold">{{ userStore.user.username }}</h2>
    <div>
      <div class="w-1/3 h-auto mx-auto aspect-square rounded-full">
        <NuxtImg
          :src="useUrl(userStore.user.avatar?.file?.url)"
          class="w-[250px] h-auto aspect-square rounded-full transition-all"
          :class="{
            'ring-4 !ring-app-tertiary': editingAvatar,
          }"
          @click="onEditAvatar"
        ></NuxtImg>
      </div>
    </div>
    <div class="text-center">
      <div class="pb-1">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus
        dolore saepe nisi similique dolorem sunt aliquid dignissimos, blanditiis
        distinctio natus ad voluptatum inventore mollitia beatae rem numquam
        vero id asperiores
      </div>
      <AppIconButton>
        <Icon
          name="i-mdi:square-edit-outline"
          size="22"
          class="text-app-secondary"
        />
      </AppIconButton>
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

  const showEditModal = ref(false);
  const editingAvatar = ref(false);
  const onEditAvatar = () => {
    showEditModal.value = true;
    editingAvatar.value = true;
  };

  const onEditAvatarClose = () => {
    editingAvatar.value = false;
  };
</script>

<style></style>
