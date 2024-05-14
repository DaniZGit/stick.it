<template>
  <div class="w-full h-full">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="products.concat(products).concat(products).concat(products)"
      data-key="id"
      :sticky-header="true"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
      :pt="tablePreset"
      :pt-options="{ mergeProps: true }"
      class="!max-w-full"
    >
      <Column
        field="image"
        header="Sticker"
        class="!w-1/6 !max-w-1/6"
        :pt="columnPreset"
      >
        <template #body="slotProps">
          <NuxtImg
            :src="useUrl(undefined)"
            class="w-2/3 h-auto aspect-thumbnail mx-auto"
          />
        </template>
      </Column>
      <Column field="name" :pt="columnPreset">
        <template #body="slotProps">
          {{ slotProps.data.title }}
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
        <template #body="slotProps"> {{ slotProps.data.rarity }} </template>
      </Column>
      <Column
        field="price"
        :sortable="true"
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-akar-icons:coin" size="16" class="mx-auto" />
        </template>
        <template #body="slotProps"> {{ slotProps.data.bid }} </template>
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
        <template #body="slotProps"> {{ slotProps.data.time }} </template>
      </Column>
      <Column expander :pt="columnPreset" />

      <template #expansion="slotProps">
        <div
          class="flex flex-col gap-y-3 text-app-secondary p-3"
          :class="{
            'border-b-[1px] border-app-tertiary':
              slotProps.index < products.length - 1,
          }"
        >
          <div
            class="flex flex-col border-2 border-app-tertiary rounded-md p-3"
          >
            <h2 class="border-b-2 border-app-tertiary text-lg font-semibold">
              Last bidders
            </h2>
            <div class="grid grid-cols-3 gap-x-2 pt-4">
              <div
                v-for="i in [1, 2, 3]"
                :key="i"
                class="flex flex-col justify-center items-center p-2 border-2 border-app-primary rounded-md"
                :class="{ 'border-app-secondary': i == 3 }"
              >
                <span class="text-sm">James</span>
                <NuxtImg
                  :src="useUrl(undefined)"
                  class="w-1/2 aspect-square rounded-full shrink"
                ></NuxtImg>
                <div class="flex items-center gap-x-1">
                  <span>{{ slotProps.data.bid + i }}</span>
                  <Icon name="i-akar-icons:coin" size="14" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center items-center gap-y-1">
            <div class="flex gap-x-1">
              <span>Time left:</span>
              <span class="font-bold">{{ slotProps.data.time }}</span>
            </div>
            <AppButton class="w-1/2 py-1">
              <div class="flex gap-x-1 font-bold text-lg">
                <span>BID</span>
                <div class="flex items-center gap-x-1">
                  <span>{{ slotProps.data.bid + 4 }}</span>
                  <Icon name="i-akar-icons:coin" size="22" />
                </div>
              </div>
            </AppButton>
            <div class="flex gap-x-2 text-xs">
              <span>Current Amount: </span>
              <div class="flex items-center gap-x-1 font-bold">
                <span>{{ 355 }}</span>
                <Icon name="i-akar-icons:coin" size="14" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="text-center">
              <span
                class="text-xs underline underline-offset-2"
                @click="
                  products[slotProps.index].showDetail =
                    !products[slotProps.index].showDetail
                "
              >
                {{ slotProps.data.showDetail ? "Hide" : "Show" }} sticker
                details
              </span>
            </div>
            <div v-if="slotProps.data.showDetail" class="gap-x-3">
              <div class="flex flex-col gap-y-1">
                <h2
                  class="text-center text-lg font-bold border-b-2 border-app-tertiary uppercase"
                >
                  sticker description
                </h2>
                <div class="flex flex-col">
                  <div>
                    <span class="font-bold">Title: </span>
                    <span>{{ slotProps.data.title }}</span>
                  </div>
                  <div>
                    <span class="font-bold">Album: </span>
                    <span> Fifa 1991 </span>
                  </div>
                  <div>
                    <span class="font-bold">Rarity: </span>
                    <span>{{ slotProps.data.rarity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup lang="ts">
  import type { ColumnPassThroughOptions } from "primevue/column";
  import type {
    DataTablePassThroughOptions,
    DataTableRowCollapseEvent,
    DataTableRowExpandEvent,
  } from "primevue/datatable";
  import { useToast } from "primevue/usetoast";

  const products = ref([
    {
      id: 0,
      title: "first",
      rarity: "R",
      bid: 100,
      time: "12:34",
      showDetail: false,
    },
    {
      id: 1,
      title: "second",
      rarity: "U",
      bid: 60,
      time: "06:34",
      showDetail: false,
    },
  ]);
  const expandedRows = ref({}); // { 0: true, 1: true }
  const toast = useToast();

  const onRowExpand = (event: DataTableRowExpandEvent) => {
    // toast.add({
    //   severity: "info",
    //   summary: "Product Expanded",
    //   detail: event.data.name,
    //   life: 3000,
    // });
    console.log(event);
    const id = event.data.id;
    const index = products.value.findIndex((p) => p.id == id);
    if (index >= 0) {
      expandedRows.value = { [index]: true };
    }
  };
  const onRowCollapse = (event: DataTableRowCollapseEvent) => {
    // toast.add({
    //   severity: "success",
    //   summary: "Product Collapsed",
    //   detail: event.data.name,
    //   life: 3000,
    // });
  };

  const tablePreset: DataTablePassThroughOptions = {
    table: "!relative",
    bodyRow: ({ context, state }) => ({
      class: [
        "!bg-app-primary !text-app-secondary",
        {
          "!bg-app-tertiary": expandedRows.value[context.index],
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
