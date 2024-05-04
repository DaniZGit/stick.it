<template>
  <AdminDialog
    v-model:visible="isVisible"
    header="Create album"
    :modal="true"
    :draggable="false"
    @hide="resetForm"
  >
    <div class="flex flex-col gap-4">
      <VeeForm
        class="flex flex-col gap-4 py-4"
        method="post"
        @submit="onSubmit"
      >
        <div
          class="flex flex-col gap-y-2 text-center transition-all duration-200"
        >
          <CustomFileUpload
            v-model:file="file"
            :error="errors.file"
          ></CustomFileUpload>
        </div>

        <div class="flex flex-col w-5/6 gap-y-4 mx-auto">
          <AdminInputText
            id="title"
            name="title"
            :label="$t('admin-album-create-title')"
            placeholder="Fifa 1991"
            v-model="title"
            icon="ic:outline-email"
            :error="errors.title"
          />

          <AdminCalendar
            id="date-from"
            name="date-from"
            :label="$t('admin-album-create-date-from')"
            placeholder="dd/mm/yyyy hh:mm"
            v-model="dateFrom"
            icon="i-mdi:date-range"
            :show-time="true"
            hour-format="24"
            date-format="dd/mm/yy"
            :error="errors.dateFrom"
          />

          <AdminCalendar
            id="date-to"
            name="date-to"
            :label="$t('admin-album-create-date-to')"
            placeholder="dd/mm/yyyy hh:mm"
            v-model="dateTo"
            icon="i-mdi:date-range"
            :show-time="true"
            hour-format="24"
            date-format="dd/mm/yy"
            :error="errors.dateTo"
          />

          <div>
            <div class="grid grid-cols-2 gap-x-2">
              <AdminInputNumber
                id="pageNumerator"
                name="pageNumerator"
                label="Aspect ratio"
                placeholder="3"
                icon="i-material-symbols:width"
                v-model="pageNumerator"
                :min="1"
                :max="100"
                max-fraction-digits="0"
                show-buttons
              />

              <AdminInputNumber
                id="pageDenominator "
                name="pageDenominator "
                label="&nbsp"
                placeholder="4"
                icon="i-material-symbols:height"
                v-model="pageDenominator"
                :min="1"
                :max="100"
                max-fraction-digits="0"
                show-buttons
              />
              <AdminInlineMessage
                severity="error"
                class="h-0 transition-[height] ease-out duration-100"
                :class="{
                  'h-[14px]': errors.pageNumerator || errors.pageDenominator,
                }"
              >
                {{
                  errors.pageNumerator
                    ? errors.pageNumerator
                    : errors.pageDenominator
                }}
              </AdminInlineMessage>
            </div>
          </div>

          <div>
            <label for="">{{ $t("admin-album-create-options") }}</label>
            <InputGroup class="flex gap-x-2">
              <AdminInputGroupAddon>
                <Icon name="i-mdi:feature-highlight" />
              </AdminInputGroupAddon>
              <div class="flex items-center gap-x-2">
                <label for="featured">Is Featured </label>
                <AdminCheckbox
                  input-id="featured"
                  v-model="featured"
                  :binary="true"
                />
              </div>
            </InputGroup>
          </div>
        </div>

        <AdminButton type="submit" class="self-center rounded-md w-1/2">
          Create
        </AdminButton>
      </VeeForm>
    </div>
  </AdminDialog>
</template>

<script lang="ts" setup>
  import type { FetchError } from "ofetch";
  const { AlbumCreateSchema } = useFormSchema();

  const { t } = useI18n();
  const isVisible = defineModel("visible", { type: Boolean });
  const emit = defineEmits<{
    created: [album: ApiAlbum];
    error: [message: string];
    pending: [value: boolean];
  }>();

  // form stuff
  const day = 1 * 24 * 60 * 60 * 1000; // * 1000 is because of thousands
  const { defineField, handleSubmit, errors, setErrors, resetForm } = useForm({
    validationSchema: AlbumCreateSchema,
    initialValues: {
      dateFrom: new Date(useTimestamp().value),
      dateTo: new Date(useTimestamp({ offset: 7 * day }).value),
    },
  });

  const [title] = defineField("title");
  const [dateFrom] = defineField("dateFrom");
  const [dateTo] = defineField("dateTo");
  const [featured] = defineField("featured");
  const [pageNumerator] = defineField("pageNumerator");
  const [pageDenominator] = defineField("pageDenominator");
  const [file] = defineField("file");

  // create request
  const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("date_from", values.dateFrom.toISOString());
    body.append("date_to", values.dateTo?.toISOString() ?? "");
    body.append("featured", JSON.stringify(values.featured));
    body.append("page_numerator", values.pageNumerator.toString());
    body.append("page_denominator", values.pageDenominator.toString());
    body.append("file", values.file);

    console.log(values);

    emit("pending", true);

    try {
      const response = await useApi<{ album: ApiAlbum }>("/v1/albums", {
        method: "POST",
        body: body,
      });

      // hide modal
      isVisible.value = false;

      if (response.album) {
        emit("created", response.album);
      } else {
        emit("error", t("admin-mismatched-response"));
      }
    } catch (error) {
      const handledErrors = useHandleFormErrors(error as FetchError<ApiError>);

      if (handledErrors?.errors) {
        setErrors(handledErrors.errors);
      } else if (handledErrors?.error) {
        emit("error", handledErrors.error);
      } else {
        emit("error", t("unexpected-error"));
      }
    }

    emit("pending", false);
  });
</script>

<style></style>
