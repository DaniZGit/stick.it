<template>
  <div class="w-full h-full relative">
    <div class="h-full overflow-y-auto">
      <AppAuctionTable></AppAuctionTable>
    </div>
    <div class="absolute bottom-0 left-0 right-0 flex justify-end p-2">
      <AppIconButton class="!rounded-full !p-2 !ring-1">
        <Icon name="i-mdi:court-hammer" size="22" class="" />
      </AppIconButton>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
