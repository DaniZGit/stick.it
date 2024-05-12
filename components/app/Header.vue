<template>
  <div
    class="bg-app-primary border-b-2 border-app-secondary flex justify-between"
  >
    <div class="flex items-center gap-x-2 p-2">
      <NuxtImg
        :src="useUrl(undefined)"
        class="h-full w-auto aspect-square rounded-full"
      ></NuxtImg>
      <div class="flex flex-col text-app-secondary">
        <h3 class="text-md font-semibold">
          {{ userStore.user.username }}
        </h3>
        <div class="flex items-center gap-x-1">
          <span class="text-sm">{{ userStore.user.tokens }}</span>
          <Icon
            name="i-akar-icons:coin"
            size="16"
            class="text-app-gold brightness-150"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-end text-app-secondary p-2">
      <div class="flex">
        <span
          v-if="
            timeTillNextFreebie > 0 && userStore.user.available_free_packs < 2
          "
          class="text-sm"
          >Free pack in {{ timeFormatted }}</span
        >
        <span
          v-else
          class="text-base animate-wiggle text-app-gold brightness-200"
          @click="onPackOpen"
          >Open now</span
        >
      </div>
      <div
        class="flex items-center gap-x-1"
        :class="{
          'animate-wiggle text-app-gold brightness-150':
            userStore.user.available_free_packs > 0,
        }"
        @click="onPackOpen"
      >
        <span class="text-sm">{{ userStore.user.available_free_packs }}/2</span>
        <Icon name="i-mingcute:red-packet-line" size="16" />
      </div>
    </div>

    <!-- Pack modals -->
    <AppModalFreePackClaim
      v-model:visible="showFreePackClaimModal"
      @claimed="onFreePackClaimed"
    />
  </div>
</template>

<script lang="ts" setup>
  const showFreePackClaimModal = ref(false);
  const userStore = useUserStore();

  const timeTillFreePackInSeconds = 12 * 60 * 60; // 12h
  const timeTillNextFreebie = ref<number>(0);
  onMounted(() => {
    timeTillNextFreebie.value = calculateTimeTillNextFreebie();

    const freebieTimer = setInterval(() => {
      if (userStore.user.available_free_packs >= 2) return;

      timeTillNextFreebie.value--;
      if (timeTillNextFreebie.value <= 0) {
        userStore.user.available_free_packs++;
        userStore.user.last_free_pack_obtain_date = new Date(
          new Date(userStore.user.last_free_pack_obtain_date).getTime() +
            timeTillFreePackInSeconds * 1000
        ).toISOString();

        timeTillNextFreebie.value = calculateTimeTillNextFreebie();
      }
    }, 1000);

    onUnmounted(() => {
      clearInterval(freebieTimer);
    });
  });

  const calculateTimeTillNextFreebie = () => {
    return (
      timeTillFreePackInSeconds -
      (new Date().getTime() - // the difference between today and the last time we obtained a free pack
        new Date(userStore.user.last_free_pack_obtain_date).getTime()) /
        1000
    );
  };

  const timeFormatted = computed(() => {
    const dateObj = new Date(timeTillNextFreebie.value * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getUTCSeconds();

    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  });

  const onPackOpen = () => {
    if (userStore.user.available_free_packs <= 0) return;
    console.log("Opening pack");
    showFreePackClaimModal.value = true;
  };

  const onFreePackClaimed = (data: {
    user: ApiUser;
    user_pack: ApiUserPack;
  }) => {
    userStore.user.available_free_packs = data.user.available_free_packs;
    userStore.user.last_free_pack_obtain_date =
      data.user.last_free_pack_obtain_date;

    // start the free pack counter again
    timeTillNextFreebie.value = calculateTimeTillNextFreebie();
  };
</script>

<style></style>
