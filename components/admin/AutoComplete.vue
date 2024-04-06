<template>
  <div class="w-full relative transition-[height] duration-1000">
    <label v-if="label" :for="id">{{ label }}</label>
    <InputGroup>
      <AdminInputGroupAddon v-if="icon" class="rounded-l-md">
        <Icon :name="icon" />
      </AdminInputGroupAddon>
      <AutoComplete
        :id="id"
        :name="name"
        :placeholder="placeholder"
        v-model="model"
        :suggestions="suggestions"
        option-label="title"
        multiple
        :dropdown="true"
        dropdown-mode="current"
        :pt="preset"
        :pt-options="{ mergeProps: true }"
        :class="attrs.class"
        @complete="onSearch"
        @item-select="emit('select', $event)"
      >
        <template #chip="{ value }">
          <span v-if="value.rarity">
            {{ value.rarity.title }}
          </span>
        </template>
        <template #removetokenicon="{ index }">
          <div class="flex gap-x-1">
            <Icon
              name="i-mdi:pencil-box-outline"
              size="20"
              class="hover:cursor-pointer text-base-black"
              @click="emit('edit', items[index])"
            />
            <Icon
              name="i-mdi:close-circle-outline"
              size="20"
              class="hover:cursor-pointer text-base-black"
              @click="emit('remove', items[index])"
            />
          </div>
        </template>
      </AutoComplete>
    </InputGroup>
    <AdminInlineMessage
      severity="error"
      class="h-0 transition-[height] ease-out duration-100"
      :class="{
        'h-[14px]': error,
      }"
    >
      {{ error }}
    </AdminInlineMessage>
  </div>
</template>

<script lang="ts" setup>
  import type { AutoCompletePassThroughOptions } from "primevue/autocomplete";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    complete: [e: any];
    select: [e: any];
    edit: [item: any];
    remove: [item: any];
  }>();

  const model = defineModel({ type: Array<ApiSticker> });
  const suggestions = ref<Array<any>>([]);
  const props = defineProps({
    id: String,
    name: String,
    label: String,
    placeholder: String,
    icon: String,
    items: {
      type: Array<ApiRarity>,
      default: [],
    },
    error: String,
  });

  const onSearch = (event: any) => {
    if (!props.items || !model.value) return;

    console.log("suggesting", props.items);
    suggestions.value = props.items.filter((item) => {
      const includesQuery = item.title
        .toLowerCase()
        .includes(event.query.toLowerCase());
      const itemExists = model.value?.find((i) => i.id == item.id);

      return includesQuery && !itemExists;
    });
  };

  const preset: AutoCompletePassThroughOptions = {
    root: "!bg-base-tertiary",
    container:
      "!bg-base-tertiary !ring-0 border-2 focus:border-base-black rounded-r-none duration-300",
    input:
      "!text-base-black !focus:brightness-90 focus:outline-0 rounded-r-md duration-300",
    token: "!bg-base-secondary !text-base-blue font-bold gap-x-2 brightness-90",
    dropdownButton: {
      root: "!bg-base-white rounded-l-none !ring-0 !focus:ring-0",
    },
    panel: "!bg-base-tertiary !ring-0",
    itemGroup: "!hover:brightness-90",
    item: "!bg-base-tertiary !text-base-black hover:brightness-90 hover:!text-base-blue !font-bold hover:!font-bold",
    emptyMessage: "!text-base-black",
  };
</script>

<style></style>
