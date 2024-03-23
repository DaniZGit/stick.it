<template>
  <Paginator
    :rows="rows"
    :total-records="totalRecords"
    :pt="preset"
    :pt-options="{ mergeProps: true }"
    :class="attrs.class"
    @page="emit('page', $event)"
  ></Paginator>
</template>

<script lang="ts" setup>
  import type { PaginatorPassThroughOptions } from "primevue/paginator";
  import { number } from "zod";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    page: [page: any];
  }>();

  defineProps({
    rows: Number,
    totalRecords: Number,
  });

  const preset: PaginatorPassThroughOptions = {
    root: "!bg-base-tertiary !border-t-0 ",
    firstPageButton: "!text-base-black bg-base-tertiary hover:brightness-90",
    previousPageButton: "!text-base-black bg-base-tertiary hover:brightness-90",
    lastPageButton: "!text-base-black bg-base-tertiary hover:brightness-90",
    nextPageButton: "!text-base-black bg-base-tertiary hover:brightness-90",
    pageButton: ({ context }) => ({
      class: [
        "!text-base-black border-2 !border-base-tertiary bg-base-tertiary hover:brightness-90",
        {
          "bg-base-tertiary !brightness-90 border-b-2 !border-b-base-blue":
            context.active,
        },
      ],
    }),
  };
</script>
