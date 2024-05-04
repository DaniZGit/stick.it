<template>
  <AppDialog
    v-model:visible="isVisible"
    :header="props.bundle?.title"
    :modal="true"
    :draggable="false"
    :loading="validatingElements || confirmingStripePayment || buyingBundle"
    @show="onDialogShow"
  >
    <form
      class="h-full flex flex-col justify-between items-center"
      @submit.prevent="onSubmit"
    >
      <div
        class="w-full flex flex-col items-center justify-center gap-y-2 p-2 rounded-md"
      >
        <NuxtImg
          :src="useUrl(props.bundle?.file?.url)"
          class="w-1/2 aspect-square rounded-md"
        ></NuxtImg>
        <div>
          <div class="flex justify-center items-center gap-x-1 text-app-gold">
            <span class="text-lg font-bold brightness-150">{{
              props.bundle?.tokens
            }}</span>
            <span class="text-base brightness-125">
              ( + {{ props.bundle?.bonus }} )
            </span>
            <Icon
              name="i-akar-icons:coin"
              size="18"
              class="brightness-150 mt-0.5"
            />
          </div>
        </div>
        <div id="payment-element" class="text-app-secondary"></div>
      </div>
      <div id="payment-request-button"></div>
      <div
        class="w-full flex flex-col items-center gap-y-2 p-2 text-app-secondary"
      >
        <AppButton
          class="w-full flex gap-x-1"
          color="tertiary"
          type="submit"
          :disabled="
            fetchingPublishableKey ||
            loadingStripe ||
            validatingElements ||
            creatingPaymentIntent ||
            confirmingStripePayment ||
            buyingBundle ||
            !inputIsValid
          "
        >
          <div v-if="buyingBundle">
            <span class="text-lg">Adding tokens...</span>
          </div>
          <div v-else-if="validatingElements || creatingPaymentIntent">
            <span class="text-lg">Validating fields...</span>
          </div>
          <div v-else-if="confirmingStripePayment">
            <span class="text-lg">Confirming payment...</span>
          </div>
          <div v-else>
            <span class="text-lg">Buy for </span>
            <span class="text-lg text-app-gold font-bold brightness-150">
              {{ props.bundle?.price }}$
            </span>
          </div>
        </AppButton>
      </div>
    </form>
  </AppDialog>
</template>

<script lang="ts" setup>
  import {
    loadStripe,
    type Stripe,
    type StripeElements,
    type StripeError,
    type StripePaymentElementChangeEvent,
  } from "@stripe/stripe-js";

  const isVisible = defineModel("visible", { type: Boolean });
  const userStore = useUserStore();
  const toast = useToast();

  const props = defineProps({
    bundle: {
      type: Object as PropType<ApiBundle | null>,
      required: true,
    },
  });

  const publishableKey = ref("");
  const fetchingPublishableKey = ref(false);
  onMounted(async () => {
    // fetch publishable key
    fetchingPublishableKey.value = true;
    try {
      const response = await useApi<{
        publishable_key: string;
      }>("/v1/transactions/config");

      if (response.publishable_key) {
        publishableKey.value = response.publishable_key;
      }
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
      return;
    }
    fetchingPublishableKey.value = false;

    // load stripe
    stripe.value = await loadStripe(publishableKey.value);
  });

  const stripe = ref<Stripe | null>();
  const elements = ref<StripeElements | null>();
  const loadingStripe = ref(false);
  const inputIsValid = ref(true);
  // every time we open the dialog we fetch payment intent and load stripe elements
  const onDialogShow = async () => {
    loadingStripe.value = true;

    // in case we opened the dialog before the stripe could load
    if (!stripe.value) {
      stripe.value = await loadStripe(publishableKey.value);
    }

    // create payment intent and get client_secret from backend API
    const clientSecret = await createPaymentIntent();
    if (!clientSecret) return;

    // elements appearance
    const appearance = {
      variables: {
        fontFamily: "Sohne, system-ui, sans-serif",
        fontWeightNormal: "500",
        borderRadius: "8px",
        colorBackground: "#0A2540",
        colorPrimary: "#EFC078",
        accessibleColorOnColorPrimary: "#1A1B25",
        colorText: "white",
        colorTextSecondary: "white",
        colorTextPlaceholder: "#ABB2BF",
        tabIconColor: "white",
        logoColor: "dark",
      },
      rules: {
        ".Input": {
          backgroundColor: "#212D63",
          border: "1px solid var(--colorPrimary)",
        },
      },
    };

    // create stripe elements
    elements.value = stripe.value?.elements({
      clientSecret: clientSecret,
      appearance,
    });
    if (!elements.value) return;

    // create payment element and load it to DOM
    const paymentElement = elements.value.create("payment");
    paymentElement.mount("#payment-element");

    paymentElement.on("ready", () => {
      loadingStripe.value = false;
    });

    paymentElement.on("change", (e: StripePaymentElementChangeEvent) => {
      inputIsValid.value = e.complete;
    });
  };

  const confirmingStripePayment = ref(false);
  const onSubmit = async (e: Event) => {
    if (!stripe.value || !elements.value) return;

    // validate elements input
    const validationObj = await validateElements();
    if (validationObj?.error) return;

    // confirm payment on stripe
    confirmingStripePayment.value = true;
    const { error } = await stripe.value?.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });
    confirmingStripePayment.value = false;

    // check for stripe errors
    if (error) {
      console.log("error", error);
      return;
    }

    // send an API request to buy bundle
    buyBundle();
  };

  const validatingElements = ref(false);
  const validateElements = (): Promise<
    { error?: StripeError | undefined } | undefined
  > => {
    return new Promise(async (resolve) => {
      if (!elements.value) return Promise.resolve(undefined);

      validatingElements.value = true;
      const res = await elements.value.submit();
      validatingElements.value = false;

      resolve(res);
    });
  };

  const creatingPaymentIntent = ref(false);
  const createPaymentIntent = (): Promise<string> => {
    return new Promise(async (resolve) => {
      creatingPaymentIntent.value = true;
      let clientSecret = "";

      try {
        const response = await useApi<{
          client_secret: string;
        }>("/v1/transactions/create-payment-intent", {
          method: "POST",
          body: {
            bundle_id: props.bundle?.id,
          },
        });

        clientSecret = response.client_secret;
      } catch (error) {
        // toast.value?.show("error", t("user-unexpected-error"));
      }

      creatingPaymentIntent.value = false;
      resolve(clientSecret);
    });
  };

  const buyingBundle = ref(false);
  const buyBundle = async () => {
    buyingBundle.value = true;
    try {
      const response = await useApi<{
        tokens: number;
      }>("/v1/transactions/bundle", {
        method: "POST",
        body: {
          bundle_id: props.bundle?.id,
        },
      });

      if (response.tokens) {
        userStore.user.tokens = response.tokens;

        toast.add({
          severity: "buy",
          detail: `Bundle bought`,
          life: 3000,
          group: "buy_group",
        });
      }

      isVisible.value = false;
    } catch (error) {
      // toast.value?.show("error", t("user-unexpected-error"));
    }
    buyingBundle.value = false;
  };
</script>

<style></style>
