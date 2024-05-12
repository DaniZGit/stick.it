<template>
  <div class="w-full h-full flex flex-col px-4 pt-2">
    <h2 class="text-left font-semibold text-xl border-b-2 pb-2">
      {{ userStore.user.username }}
    </h2>
    <div class="flex flex-col gap-y-2 overflow-y-auto no-scrollbar py-4">
      <div
        v-for="(option, i) in options"
        :key="i"
        class="grid grid-cols-12 border-2 border-app-tertiary hover:border-app-secondary hover:cursor-pointer rounded-md py-2 group duration-300"
        @click="option.action"
      >
        <Icon :name="option.icon" size="28" class="col-span-2 m-auto" />
        <div class="col-span-8 flex flex-col my-auto">
          <h3 class="font-medium">{{ option.title }}</h3>
          <span class="text-sm">{{ option.description }}</span>
        </div>

        <div class="col-span-2 flex items-center justify-center px-2">
          <Icon
            name="i-mdi:keyboard-arrow-right"
            size="28"
            class="group-hover:translate-x-1 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
  const router = useRouter();

  const options = ref([
    {
      icon: "i-mdi:user-circle-outline",
      title: "Profile",
      description: "View your profile",
      action: () => router.push("/profile"),
    },
    {
      icon: "i-mdi:logout",
      title: "Logout",
      description: "Logout from the app",
      action: () => router.push("/auth/logout"),
    },
  ]);
</script>

<style></style>
