<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Delete album"
    :modal="true"
    :draggable="false"
    @hide="input = ''"
  >
    <div class="flex flex-col gap-4 p-4">
      <div class="gap-y-2">
        <span>
          Are you sure you want to delete
          <span class="font-bold">{{ title }}</span> Album?
        </span>
      </div>
      <VeeForm
        class="flex flex-col items-center gap-4"
        method="post"
        @submit="onSubmit"
      >
        <AdminInputText
          id="input"
          name="input"
          placeholder="write 'delete' to proceed"
          v-model="input"
          class="rounded-md text-center"
        />

        <AdminButton
          type="submit"
          :disabled="input != 'delete'"
          class="flex px-8 rounded-md"
        >
          Delete
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const { id, title } = defineProps<{
    id: string;
    title: string;
  }>();

  const emit = defineEmits<{
    deleted: [id: string];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const { defineField, handleSubmit } = useForm();
  const [input] = defineField("input");

  // delete request
  const { $api } = useNuxtApp();
  const onSubmit = handleSubmit(async (values) => {
    emit("pending", true);

    try {
      await $api<User>(`/v1/albums/${id}`, {
        method: "DELETE",
      });

      // hide modal
      isVisible.value = false;

      // emit deleted event
      emit("deleted", id);
    } catch (error) {
      // hide modal
      isVisible.value = false;

      // emit error event
      emit("error", t("unexpected-error"));
    }

    emit("pending", false);
  });
</script>

<style></style>
