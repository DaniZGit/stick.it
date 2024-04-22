<template>
  <AppDialog
    v-model:visible="isVisible"
    header=""
    :modal="true"
    :draggable="false"
    :loading="props.loading"
    @hide="emit('close')"
  >
    <div class="h-full w-full flex flex-nowrap p-2">
      <div
        class="w-full h-full grid grid-cols-2 aspect-thumbnail relative border-2 overflow-hidden"
        :class="{
          'body-container': !props.loading,
        }"
      >
        <div class="left-container h-full relative z-[5]">
          <NuxtImg
            :src="useUrl(props.userPack?.pack.file?.url)"
            height="400"
            width="200"
            class="w-full h-full object-cover object-left"
            :class="{
              'left-image': !props.loading,
            }"
          ></NuxtImg>
        </div>
        <div class="right-container h-full relative z-[5]">
          <NuxtImg
            :src="useUrl(props.userPack?.pack.file?.url)"
            height="400"
            width="200"
            class="w-full h-full object-cover object-right"
            :class="{
              'right-image': !props.loading,
            }"
          ></NuxtImg>
        </div>

        <div
          v-if="props.userStickers?.length"
          class="container absolute w-full h-full"
        >
          <div
            class="w-full grid grid-cols-2 auto-rows-max gap-x-4 gap-y-4 p-2"
          >
            <div
              v-for="userSticker in props.userStickers"
              class="flex flex-col"
            >
              <NuxtImg :src="useUrl(userSticker.sticker.file?.url)"></NuxtImg>
            </div>
          </div>
        </div>
        <div
          v-else
          class="absolute w-full h-full flex flex-col justify-center items-center gap-y-2 text-center text-xl text-app-secondary font-bold p-4"
        >
          <Icon name="i-mdi:emoji-robot-confused-outline" size="64" />
          <span> Looks like something went wrong </span>
        </div>
        <div
          class="absolute"
          :class="{
            zip: !props.loading,
          }"
        />
      </div>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  import { boolean } from "zod";

  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps({
    userPack: Object as PropType<ApiUserPack>,
    userStickers: Array as PropType<Array<ApiUserSticker>>,
    loading: {
      type: boolean,
      default: true,
    },
  });

  const emit = defineEmits(["close"]);
</script>

<style>
  :root {
    --zip-pull-duration: 0.75s;
    --image-pull-duration: 1s;
    --image-pull-delay: 0.75s;
    --iteration-count: 1;

    --stripe-color: #ffffff;
  }

  .body-container {
    animation-name: allow-body-scroll;
    animation-delay: calc(
      var(--zip-pull-duration) + var(--image-pull-duration)
    );
    animation-duration: 0ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  /* .container {
    position: absolute;
    width: 100%;
    height: 100%;

    --stripes: repeating-linear-gradient(
      90deg,
      var(--stripe-color) 0%,
      var(--stripe-color) 7%,
      transparent 10%,
      transparent 12%,
      var(--stripe-color) 16%
    );

    --rainbow: repeating-linear-gradient(
      90deg,
      #ffffff 10%,
      #c2aeae 15%,
      #746b6b 20%,
      #f7d6d6 25%,
      #e0dede 30%
    );

    --rainbow: repeating-linear-gradient(
      90deg,
      #5bd80e 10%,
      #cdb413 15%,
      #a17614 20%,
      #ffd902 25%,
      #d0cd08 30%
    );

    background-image: var(--stripes), var(--rainbow);
    background-size: 150%, 200%;
    background-position: 50% 50%, 50% 50%;

    filter: blur(20px) invert(100%);
    mask-image: radial-gradient(circle at 50% 100%, black 35%, transparent 75%);

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: var(--stripes), var(--rainbow);
      background-size: 200%, 100%;
      animation: shiny-bg 15s linear infinite;
      background-attachment: fixed;
      mix-blend-mode: difference;
    }
  } */

  .zip {
    position: absolute;
    top: 0;
    left: 50%;
    height: 0%;
    width: 1px;
    z-index: 10;
    transform: translateX(calc(-50%));

    animation-name: zip-pull;
    animation-duration: var(--zip-pull-duration);
    animation-iteration-count: var(--iteration-count);
    animation-fill-mode: forwards;
  }

  .zip:before {
    position: absolute;
    bottom: -20px;
    content: "";
    width: 20px;
    height: 20px;
    background-color: black;
    clip-path: polygon(0 0, 50% 100%, 100% 0);
    transform: translateX(calc(-50% - 1.5px));
  }

  .left-image {
    transform-origin: bottom left;
    animation-name: left-image-full-pull-animation;
    animation-duration: var(--image-pull-duration);
    animation-iteration-count: var(--iteration-count);
    animation-delay: var(--image-pull-delay);
    animation-fill-mode: forwards;
  }

  .right-image {
    transform-origin: bottom right;
    animation-name: right-image-full-pull-animation;
    animation-duration: var(--image-pull-duration);
    animation-iteration-count: var(--iteration-count);
    animation-delay: var(--image-pull-delay);
    animation-fill-mode: forwards;
  }

  @keyframes left-image-pull-animation {
    0% {
      border-radius: 0% 0% 0% 0%;
      border-right: 3px dashed black;
    }

    100% {
      border-radius: 0% 100% 0% 0%;
      border-right: 3px dashed black;
      transform: rotate(-15deg) translateY(10%);
    }
  }

  @keyframes right-image-pull-animation {
    0% {
      border-radius: 0% 0% 0% 0%;
      border-left: 3px dashed black;
    }

    100% {
      border-radius: 100% 0% 0% 0%;
      border-left: 3px dashed black;
      transform: rotate(15deg) translateY(10%);
    }
  }

  @keyframes left-image-full-pull-animation {
    0% {
      border-radius: 0% 0% 0% 0%;
      border-right: 3px dashed black;
    }

    60% {
      border-radius: 0% 100% 0% 0%;
      border-right: 3px dashed black;
      transform: rotate(-15deg) translateY(10%);
    }

    80% {
      border-radius: 0% 100% 0% 0%;
      border-right: 3px dashed black;
      transform: rotate(-10deg) translateY(5%);
    }

    99% {
      border-radius: 0% 100% 0% 0%;
      border-right: 3px dashed black;
      transform: rotate(-15deg) translateY(200%);
    }

    100% {
      display: none;
    }
  }

  @keyframes right-image-full-pull-animation {
    0% {
      border-radius: 0% 0% 0% 0%;
      border-left: 3px dashed black;
    }

    60% {
      border-radius: 100% 0% 0% 0%;
      border-left: 3px dashed black;
      transform: rotate(15deg) translateY(10%);
    }

    80% {
      border-radius: 100% 0% 0% 0%;
      border-left: 3px dashed black;
      transform: rotate(10deg) translateY(5%);
    }

    99% {
      border-radius: 100% 0% 0% 0%;
      border-left: 3px dashed black;
      transform: rotate(15deg) translateY(200%);
    }

    100% {
      display: none;
    }
  }

  @keyframes zip-pull {
    0% {
      height: 0%;
      border-left: 3px dashed black;
    }

    99% {
      height: 110%;
      border-left: 3px dashed black;
    }
    100% {
      height: 110%;
      border: none;
      display: none;
    }
  }

  @keyframes shiny-bg {
    from {
      background-position: 50% 50%, 50% 50%;
    }
    to {
      background-position: 350% 50%, 350% 50%;
    }
  }

  @keyframes bg-scale {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(10);
    }
  }

  @keyframes allow-body-scroll {
    0%,
    100% {
      overflow-y: auto;
    }
  }
</style>
