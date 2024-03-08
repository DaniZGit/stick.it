<template>
  <FileUpload
    name="file"
    :multiple="false"
    :fileLimit="1"
    accept="image/*"
    @select="onFileUpload($event)"
    @clear="onFileClear"
    :pt="preset"
  >
    <template #header="{ chooseCallback, clearCallback, files }">
      <div
        class="w-full flex flex-col justify-center gap-y-6 items-center rounded-md relative"
      >
        <div class="flex flex-col justify-center items-center gap-y-2">
          <div class="flex flex-col items-center">
            <h1 class="text-xl">Thumbnail image</h1>
          </div>
          <div
            @click="!files.length ? chooseCallback() : clearCallback()"
            class="flex flex-col gap-y-2 hover:cursor-pointer hover:brightness-90 duration-200"
          >
            <NuxtImg
              v-if="files.length"
              role="presentation"
              :src="files[0].objectURL"
              width="250"
              class="border-2"
            />
            <NuxtImg
              v-else
              role="presentation"
              :src="'/images/upload-placeholder.jpg'"
              width="250"
              class="border-2"
            />
            <AdminProgressBar :value="progress" :showValue="false" />
          </div>
          <div v-if="files.length" class="flex flex-col items-center">
            <span class="font-semibold">{{ files[0].name }}</span>
            <div>{{ formatSize(files[0].size) }}</div>
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
        </div>

        <div>
          <AdminButton
            v-if="files.length <= 0"
            @click="chooseCallback"
            class="rounded-md px-4 py-1"
            color="blue"
          >
            Upload
          </AdminButton>
          <AdminButton
            v-else
            @click="clearCallback"
            class="rounded-md px-4 py-1"
            color="blue"
            >Clear</AdminButton
          >
        </div>
      </div>
    </template>
    <template #content>
      <!-- We add this line, so that the PrimeVue content doesn't display -->
      <span></span>
    </template>
  </FileUpload>
</template>

<script lang="ts" setup>
  import type {
    FileUploadPassThroughOptions,
    FileUploadSelectEvent,
  } from "primevue/fileupload";

  defineOptions({
    inheritAttrs: false,
  });

  defineProps({
    error: String,
  });

  const file = defineModel("file", { type: File });
  const progress = ref(0);

  const onFileUpload = (event: FileUploadSelectEvent) => {
    const _file = event.files[0];
    file.value = _file;

    progress.value = 100;
  };

  const onFileClear = () => {
    progress.value = 0;
    file.value = undefined;
  };

  const formatSize = (bytes: number) => {
    const k = 1024;
    const dm = 3;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  };

  const preset: FileUploadPassThroughOptions = {
    root: "w-full bg-base-white",
    content: "py-0",
    details: "bg-base-white",
    buttonbar: "bg-base-white",
  };
</script>

<style></style>
