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

        <AdminButton :disabled="input != 'delete'" class="flex px-8 rounded-md">
          Delete
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });

  const { title } = defineProps<{
    title: string;
  }>();

  const emit = defineEmits(["deleted", "deleting", "error"]);

  // form stuff
  const { defineField, handleSubmit } = useForm();
  const [input] = defineField("input");

  // delete request
  const { $api } = useNuxtApp();
  const onSubmit = handleSubmit(async (values) => {
    emit("deleting");

    try {
      await $api<User>(`/v1/albums/${title}`, {
        method: "DELETE",
      });

      // hide modal
      isVisible.value = false;

      // emit deleted event
      emit("deleted", title);
    } catch (error) {
      // hide modal
      isVisible.value = false;

      // emit error event
      emit("error", t("unexpected-error"));
    }
  });
</script>

<style></style>
