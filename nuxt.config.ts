import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // app configuration stuff
  alias: {
    "@constants": "./constants",
  },
  ssr: false,
  spaLoadingTemplate: true,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL ?? "http://127.0.0.1:8000",
      apiWebsocketUrl: process.env.API_WS_URL ?? "ws://127.0.0.1:8000",
    },
  },
  // modules stuff
  modules: [
    // this installs @nuxtjs/tailwindcss, @nuxtjs/color-mode and nuxt-icon modules
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "nuxt-primevue",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "nuxt-swiper",
    [
      "@/modules/spa-loading-template/module",
      {
        delay: 0,
      },
    ],
  ],
  devtools: { enabled: true },
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "last" }],
  },
  primevue: {
    options: {
      unstyled: true,
    },
    importPT: {
      from: path.resolve(__dirname, "./presets/wind/"),
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  veeValidate: {
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: [
      {
        code: "en",
        file: "en.json",
      },
    ],
    defaultLocale: "en",
    langDir: "lang",
    lazy: true,
  },
});
