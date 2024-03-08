<template>
  <div class="h-dvh flex flex-col justify-center items-center gap-y-16">
    <div>
      <h1 class="text-4xl font-bold uppercase">Register</h1>
    </div>
    <VeeForm class="w-1/5 flex flex-col gap-4" method="post" @submit="onSubmit">
      <InputGroup>
        <InputGroupAddon>
          <Icon name="mdi:user-outline" />
        </InputGroupAddon>
        <InputText name="username" placeholder="Username" v-model="username" />
      </InputGroup>
      <InlineMessage
        v-if="errors.username"
        icon="none"
        severity="error"
        :pt="{
          root: {
            class: 'justify-end',
          },
          text: {
            class: 'text-xs',
          },
        }"
        >{{ errors.username }}</InlineMessage
      >

      <InputGroup>
        <InputGroupAddon>
          <Icon name="ic:outline-email" />
        </InputGroupAddon>
        <InputText
          type="email"
          name="email"
          placeholder="Email"
          v-model="email"
        />
      </InputGroup>
      <InlineMessage
        v-if="errors.email"
        icon="none"
        severity="error"
        :pt="{
          root: {
            class: 'justify-end',
          },
          text: {
            class: 'text-xs',
          },
        }"
        >{{ errors.email }}</InlineMessage
      >

      <InputGroup>
        <InputGroupAddon>
          <Icon name="mdi:password-off-outline" />
        </InputGroupAddon>
        <Password
          type="email"
          name="password"
          placeholder="Password"
          v-model="password"
          :toggle-mask="true"
          :feedback="false"
        />
      </InputGroup>
      <InlineMessage
        v-if="errors.password"
        icon="none"
        severity="error"
        :pt="{
          root: {
            class: 'justify-end',
          },
          text: {
            class: 'text-xs',
          },
        }"
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
  import type CustomToast from "~/components/CustomToast.vue";

  const { t } = useI18n();
  const userStore = useUserStore();
  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

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
  const { $api } = useNuxtApp();
  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await $api<User>("/v1/register", {
        method: "POST",
        body: values,
      });

      userStore.setUser(data);

      // redirect to homepage
      navigateTo({ path: "/home" }, { redirectCode: 301 });
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
</script>

<style></style>
