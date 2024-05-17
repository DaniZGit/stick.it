<template>
  <div class="w-full h-full">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="props.items"
      data-key="id"
      :paginator="false"
      :scrollable="true"
      scroll-height="flex"
      :virtualScrollerOptions="{
        lazy: true,
        onLazyLoad: (e) => console.log('on lazy load', e),
        itemSize: 46,
        delay: 200,
        showLoader: true,
        loading: false,
        numToleratedItems: 10,
      }"
      @row-expand="onRowExpand"
      :pt="tablePreset"
      :pt-options="{ mergeProps: true }"
      class="!max-w-full !max-h-full"
    >
      <Column
        field="image"
        header="Sticker"
        class="!w-1/6 !max-w-1/6"
        :pt="columnPreset"
      >
        <template #body="{ data }">
          <NuxtImg
            :src="useUrl(data.user_sticker.sticker.file.url)"
            class="w-2/3 h-auto aspect-thumbnail mx-auto object-cover"
          />
        </template>
      </Column>
      <Column field="name" :pt="columnPreset">
        <template #body="{ data }">
          {{ data.user_sticker.sticker.title }}
        </template>
      </Column>
      <Column
        field="rarity"
        :sortable="true"
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-mdi:christmas-star-outline" size="18" class="mx-auto" />
        </template>
        <template #body="{ data }">
          {{ data.user_sticker.sticker.rarity?.title ?? "null" }}
        </template>
      </Column>
      <Column
        field="starting_bid"
        :sortable="true"
        sor
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-akar-icons:coin" size="16" class="mx-auto" />
        </template>
        <template #body="{ data }">
          {{ getLatestBid(data) }}
        </template>
      </Column>
      <Column
        field="time"
        :sortable="true"
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-mdi:timer-outline" size="18" class="mx-auto" />
        </template>
        <template #body="{ data }">
          {{ formattedTime(new Date(data.created_at)) }}
        </template>
      </Column>
      <Column expander :pt="columnPreset" />

      <template #expansion="{ data, index }">
        <AppItemAuctionOffer
          :auction-offer="data"
          @bid="emit('bid', $event)"
        ></AppItemAuctionOffer>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup lang="ts">
  import type { ColumnPassThroughOptions } from "primevue/column";
  import type { DataTablePassThroughOptions } from "primevue/datatable";

  const expandedRows = ref<Record<string, boolean>>({}); // { 0: true, 1: true }

  const props = defineProps({
    items: Array<ApiAuctionOffer>,
  });

  const emit = defineEmits<{
    bid: [auctionBid: ApiAuctionBid];
  }>();

  const getLatestBid = (auctionOffer: ApiAuctionOffer) => {
    return auctionOffer.latest_bid
      ? auctionOffer.latest_bid
      : auctionOffer.starting_bid;
  };

  const onRowExpand = (event: { data: ApiAuctionOffer }) => {
    const id = event.data.id;
    expandedRows.value = { [id]: true };
  };

  const formattedTime = (date: Date) => {
    const hours = date.getUTCHours();
    const minutes = date.getMinutes();
    const seconds = date.getUTCSeconds();

    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  };

  const tablePreset: DataTablePassThroughOptions = {
    table: "!relative",
    bodyRow: ({ context, state }) => ({
      class: [
        "!bg-app-primary !text-app-secondary",
        {
          "!bg-app-tertiary":
            expandedRows.value && expandedRows.value[context.index],
        },
      ],
    }),
    rowExpansion: "!bg-app-primary roundedd-b-lg",
    rowExpansionCell: "!rounded-b-lg",
    header: "!sticky !top-0",
    headerRow: "!sticky !top-0",
  };

  const columnPreset: ColumnPassThroughOptions = {
    headerContent: "!sticky !top-0",
    bodyCell: "!border-app-tertiary",
    headerCell: "!bg-app-primary !text-app-secondary !border-app-tertiary",
  };
</script>
