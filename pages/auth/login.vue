<template>
  <div class="h-dvh flex flex-col justify-center items-center gap-y-16">
    <div>
      <h1 class="text-4xl font-bold uppercase">Login</h1>
    </div>
    <VeeForm
      class="w-full flex flex-col gap-4"
      method="post"
      @submit="onSubmit"
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
          Login
        </Button>
        <span>
          No account yet?
          <NuxtLink to="/auth/register" class="underline"
            >Register here
          </NuxtLink>
        </span>
      </div>
    </VeeForm>

    <CustomToast ref="toast"></CustomToast>
  </div>
</template>

<script setup lang="ts">
  import { FetchError } from "ofetch";
  import type CustomToast from "~/components/CustomToast.vue";

  setPageLayout("guest");

  const { t } = useI18n();
  const route = useRoute();
  const userStore = useUserStore();

  const toast = ref<InstanceType<typeof CustomToast> | null>(null);

  onMounted(() => {
    if (userStore.isLoggedIn()) {
      navigateTo({ path: "/home" }, { redirectCode: 301 });
    }
  });

  // form stuff
  const { LoginSchema } = useFormSchema();
  const { defineField, handleSubmit, errors, isSubmitting, setErrors } =
    useForm({
      validationSchema: LoginSchema,
    });

  const [email] = defineField("email");
  const [password] = defineField("password");

  // login request
  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await useApi<{ user: ApiUser }>("/v1/login", {
        method: "POST",
        body: values,
      });

      // store user
      if (response.user) {
        userStore.setUser(response.user);
      }

      const next = route.query.next as string;
      if (next) {
        // redirect to whatever the next parameter is set to - /login?next=/path
        return navigateTo({ path: next }, { redirectCode: 301 });
      }

      // redirect to homepage
      navigateTo({ path: "/home" }, { redirectCode: 301 });
    } catch (error) {
      if (error instanceof FetchError && error.statusCode == 401) {
        // check if Unauthorized - wrong email || pass
        toast.value?.show("error", t("login-invalid-credentials")); //LOGIN_INVALID_CREDENTIALS);
        return;
      }

      const handledErrors = useHandleFormErrors(error as FetchError<ApiError>);

      if (handledErrors?.errors) {
        setErrors(handledErrors.errors);
      } else {
        toast.value?.show("error", t("login-invalid-credentials")); //LOGIN_INVALID_CREDENTIALS);
      }
    }
  });
</script>

<style></style>
