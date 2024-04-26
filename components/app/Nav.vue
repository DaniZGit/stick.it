<template>
  <nav
    class="bg-app-primary border-t-2 border-app-secondary flex flex-col justify-center"
  >
    <ul class="grid grid-cols-5 divide-x-2 divide-app-tertiary py-0">
      <li v-for="(item, i) in items">
        <NuxtLink
          :to="item.link"
          class="flex flex-col justify-center items-center text-app-tertiary group"
          active-class="!text-app-secondary"
        >
          <Icon
            :name="item.icon"
            size="32"
            class="group-[.router-link-exact-active]:-translate-y-1 duration-100"
          />
          <hr
            class="w-1/2 border-[1px] border-app-primary group-[.router-link-exact-active]:!border-app-secondary"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
  const items = [
    {
      link: "/auction",
      title: "Auction",
      icon: "i-mdi:court-hammer",
    },
    {
      link: "/shop",
      title: "Shop",
      icon: "i-mdi:storefront-outline",
    },
    {
      link: "/home",
      title: "Home",
      icon: "i-mdi:home",
    },
    {
      link: "/albums",
      title: "Albums",
      icon: "i-mdi:book-open-blank-variant-outline",
    },
    {
      link: "/settings",
      title: "Settings",
      icon: "i-mdi:settings-outline",
    },
  ];
</script>

<style></style>
