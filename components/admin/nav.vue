<template>
  <div class="flex flex-col">
    <NuxtLink to="/dashboard" class="max-h-16 border-r-2">
      <NuxtImg
        src="https://placeholderlogo.com/img/placeholder-logo-1.png"
        class="h-full w-auto mx-auto"
      />
    </NuxtLink>
    <nav
      class="h-full flex flex-col justify-between gap-y-2 py-4 px-8 border-r-2"
    >
      <div class="flex flex-col gap-y-2">
        <div v-for="item in items" class="flex flex-col">
          <NuxtLink
            :to="item.to"
            class="flex justify-between items-center text-lg text-base-inactive p-4 hover:bg-base-tertiary rounded-md"
            active-class="!text-base-black bg-base-tertiary"
          >
            <div class="flex items-center gap-x-2">
              <Icon :name="item.icon" size="32" />
              <span>{{ item.label }}</span>
            </div>
            <span
              class="hover:bg-base-tertiary px-2"
              @click.prevent="item.expanded = !item.expanded"
            >
              <Icon
                v-if="item.items"
                :name="
                  item.expanded
                    ? 'i-ic:baseline-keyboard-arrow-down'
                    : 'i-ic:baseline-keyboard-arrow-right'
                "
              />
            </span>
          </NuxtLink>
          <div v-if="item.items && item.expanded" class="flex flex-col">
            <NuxtLink
              v-for="subItem in item.items"
              :to="subItem.to"
              class="flex justify-start items-center gap-x-2 text-md text-base-inactive p-4 pl-8 hover:bg-base-secondary rounded-md"
              active-class="!text-base-black bg-base-secondary"
            >
              <Icon :name="subItem.icon" size="24" />
              <span>{{ subItem.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <hr class="border-base-inactive" />
      </div>
      <div class="flex flex-col gap-y-2">
        <hr class="border-base-inactive" />

        <div v-for="item in endItems" class="flex flex-col">
          <NuxtLink
            :to="item.to"
            class="flex justify-between items-center text-lg text-base-inactive p-4 hover:bg-base-secondary rounded-md"
            active-class="!text-base-black bg-base-secondary"
          >
            <div class="flex items-center gap-x-2">
              <Icon :name="item.icon" size="32" />
              <span>{{ item.label }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
  const items = ref([
    {
      label: "Albums",
      icon: "i-ic:baseline-menu-book",
      to: "/dashboard/albums",
      items: [
        {
          label: "Rarities",
          icon: "i-simple-icons:civicrm",
          to: "/dashboard/rarities",
        },
      ],
    },
    {
      label: "Shop",
      icon: "i-ic:outline-storefront",
      to: "/dashboard/shop/bundles",
      items: [
        {
          label: "Bundles",
          icon: "i-ic:round-shopping-bag",
          to: "/dashboard/shop/bundles",
        },
        // {
        //   label: "Battle passes",
        //   icon: "i-ic:outline-view-carousel",
        //   to: "/dashboard/shop/battle-passes",
        // },
      ],
      expanded: false,
    },
    {
      label: "Users",
      icon: "i-ic:baseline-people-outline",
      to: "/dashboard/users/roles",
      items: [
        {
          label: "Roles",
          icon: "i-oui:app-users-roles",
          to: "/dashboard/users/roles",
        },
        {
          label: "Avatars",
          icon: "i-mdi:face-man-profile",
          to: "/dashboard/users/avatars",
        },
      ],
    },
  ]);

  const endItems = ref([
    {
      label: "Settings",
      icon: "i-mdi:settings",
      to: "/dashboard/settings",
    },
  ]);
</script>

<style></style>
