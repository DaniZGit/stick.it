<template>
  <div class="h-dvh flex flex-col justify-center items-center gap-y-16">
    <div>
      <h1 class="text-4xl font-bold uppercase">Register</h1>
    </div>
    <VeeForm class="w-5/6 flex flex-col gap-4" method="post" @submit="onSubmit">
      <InputGroup
        class="hover:ring-2 ring-app-secondary bg-app-primary ring-offset-4 ring-offset-app-primary rounded-md transition-all"
      >
        <InputGroupAddon
          :pt="inputGroupAddonPreset"
          :pt-options="{ mergeProps: true }"
        >
          <Icon name="mdi:user-outline" />
        </InputGroupAddon>
        <InputText
          name="username"
          placeholder="Username"
          v-model="username"
          :pt="inputTextPreset"
          :pt-options="{ mergeProps: true }"
        />
      </InputGroup>
      <InlineMessage
        v-if="errors.username"
        icon="none"
        severity="error"
        :pt="inlineMessagePreset"
        >{{ errors.username }}</InlineMessage
      >

      <InputGroup
        class="hover:ring-2 ring-app-secondary bg-app-primary ring-offset-4 ring-offset-app-primary rounded-md transition-all"
      >
        <InputGroupAddon
          :pt="inputGroupAddonPreset"
          :pt-options="{ mergeProps: true }"
        >
          <Icon name="ic:outline-email" />
        </InputGroupAddon>
        <InputText
          type="email"
          name="email"
          placeholder="Email"
          v-model="email"
          :pt="inputTextPreset"
          :pt-options="{ mergeProps: true }"
        />
      </InputGroup>
      <InlineMessage
        v-if="errors.email"
        icon="none"
        severity="error"
        :pt="inlineMessagePreset"
        >{{ errors.email }}</InlineMessage
      >

      <InputGroup
        class="hover:ring-2 ring-app-secondary bg-app-primary ring-offset-4 ring-offset-app-primary rounded-md transition-all"
      >
        <InputGroupAddon
          :pt="inputGroupAddonPreset"
          :pt-options="{ mergeProps: true }"
        >
          <Icon name="mdi:password-off-outline" />
        </InputGroupAddon>
        <InputText
          type="password"
          name="password"
          placeholder="Password"
          v-model="password"
          :pt="inputTextPreset"
          :pt-options="{ mergeProps: true }"
        />
      </InputGroup>
      <InlineMessage
        v-if="errors.password"
        icon="none"
        severity="error"
        :pt="inlineMessagePreset"
        >{{ errors.password }}</InlineMessage
      >

      <div class="flex flex-col items-center gap-y-2">
        <Button
          type="submit"
          class="self-center px-16"
          :disabled="isSubmitting"
        >
          Register
        </Button>
        <span>
          Already have an account?
          <NuxtLink to="/auth/login" class="underline"> Login here </NuxtLink>
        </span>
      </div>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
  import { FetchError } from "ofetch";
  import type { InlineMessagePassThroughOptions } from "primevue/inlinemessage";
  import type { InputGroupAddonPassThroughOptions } from "primevue/inputgroupaddon";
  import type { InputTextPassThroughOptions } from "primevue/inputtext";
  import type CustomToast from "~/components/CustomToast.vue";

  setPageLayout("guest");

  const { t } = useI18n();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);
  const userStore = useUserStore();

  onMounted(() => {
    if (userStore.isLoggedIn()) {
      navigateTo({ path: "/home" }, { redirectCode: 301 });
    }
  });

  // form stuff
  const { RegisterSchema } = useFormSchema();
  const { defineField, handleSubmit, errors, isSubmitting, setErrors } =
    useForm({
      validationSchema: RegisterSchema,
    });

  const [username] = defineField("username");
  const [email] = defineField("email");
  const [password] = defineField("password");

  // register request
  const onSubmit = handleSubmit(async (values) => {
    try {
      await useApi("/v1/register", {
        method: "POST",
        body: values,
      });

      // redirect to confirmation page
      navigateTo({ path: "/auth/confirmation" }, { redirectCode: 301 });
    } catch (error) {
      const handledErrors = useHandleFormErrors(error as FetchError<ApiError>);

      if (handledErrors?.errors) {
        setErrors(handledErrors.errors);
      } else if (handledErrors?.error) {
        toast.value?.show("error", handledErrors.error);
      } else {
        toast.value?.show("error", t("unexpected-error"));
      }
    }
  });

  const inputTextPreset = ref<InputTextPassThroughOptions>({
    root: "!w-full  !bg-app-primary !border-0 !ring-2 !ring-app-secondary rounded-l-none !placeholder-app-tertiary",
  });
  const inputGroupAddonPreset = ref<InputGroupAddonPassThroughOptions>({
    root: "!bg-app-primary !text-app-secondary !border-0 ring-2 !ring-app-secondary !p-0 !m-0",
  });
  const inlineMessagePreset = ref<InlineMessagePassThroughOptions>({
    root: "",
    text: "text-xs text-app-severity-error font-medium",
  });
</script>

<style></style>
