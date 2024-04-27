<template>
  <div>
    <DataTable
      :value="items"
      dataKey="id"
      v-model:selection="selectedProducts"
      :rows="rows"
      :class="attrs.class"
      :pt="preset"
    >
      <Column
        selectionMode="multiple"
        style="width: 3rem"
        :pt="columnPreset"
        :pt-options="{ mergeProps: true }"
      >
        <template #rowcheckboxicon="{ checked }">
          <Icon v-show="checked" name="i-mdi:check" class="text-base-white" />
        </template>
        <template #headercheckboxicon="{ checked }">
          <Icon v-show="checked" name="i-mdi:check" class="text-base-white" />
        </template>
      </Column>
      <Column
        v-for="column in columns"
        :field="column.field"
        :header="column.label"
        :sortable="column.sortable"
        :pt="columnPreset"
        :pt-options="{ mergeProps: true }"
      ></Column>
      <Column :pt="columnPreset" class="text-right" header-class="items-end">
        <template #body="slotProps">
          <div class="flex justify-end gap-x-2">
            <AdminButton @click="emit('edit', slotProps.data)">
              <Icon name="i-mdi:square-edit-outline" size="24" />
            </AdminButton>
            <AdminButton @click="emit('delete', slotProps.data)">
              <Icon name="i-mdi:trash-can-outline" size="24" />
            </AdminButton>
          </div>
        </template>
      </Column>
    </DataTable>
    <AdminPaginator
      :rows="rows"
      :total-records="totalRecords"
      @page="emit('page', $event)"
      class="mt-4"
    ></AdminPaginator>
  </div>
</template>

<script lang="ts" setup>
  import type { ColumnPassThroughOptions } from "primevue/column";
  import type { DataTablePassThroughOptions } from "primevue/datatable";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const selectedProducts = defineModel("selected", {
    type: Array<any>,
  });

  defineProps({
    items: Array<any>,
    columns: Array<any>,
    rows: {
      type: Number,
      default: 10,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    paginator: Boolean,
  });

  const emit = defineEmits<{
    edit: [item: any];
    delete: [item: any];
    page: [page: any];
  }>();

  const preset: DataTablePassThroughOptions = {
    bodyRow: "bg-base-secondary",
    paginator: "!bg-base-secondary",
  };

  const columnPreset: ColumnPassThroughOptions = {
    root: "!bg-base-secondary",
    headerCell: "!bg-base-tertiary",
    headerContent: ({ context }) => ({
      class: [
        "text-base-black font-bold",
        {
          "text-base-blue": context.sorted,
        },
      ],
    }),
    rowCheckbox: ({ context }) => ({
      box: [
        "container flex justify-center items-center rounded ring-2 ring-base-black",
        {
          "bg-base-blue": context.checked,
          "bg-base-white": !context.checked,
        },
      ],
    }),
    headerCheckbox: ({ context }) => ({
      box: [
        "container flex justify-center items-center rounded ring-2 ring-base-black hover:cursor-pointer",
        {
          "bg-base-blue": context.checked,
          "bg-base-white": !context.checked,
        },
      ],
    }),
  };
</script>
