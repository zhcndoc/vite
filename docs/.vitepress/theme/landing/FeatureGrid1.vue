<script setup>
import RiveAnimation from '@components/shared/RiveAnimation.vue'
import viteAnimation from '@assets/vite/animations/563_x_420_rich_features.riv'
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-nickel"
  >
    <div class="flex flex-col gap-3 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-balance sm:text-pretty text-white">
          即时启动开发服务器
        </h5>
        <p class="sm:max-w-[28rem] text-pretty">
          基于原生 ESM 按需提供源文件，并带来极速的依赖预构建。
        </p>
      </div>
      <div class="relative p-10 sm:p-15 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-1-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-featurepanel-1-terminal.svg"
          width="493"
          height="230"
          alt="终端"
          inert
          loading="lazy"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3 justify-between border-r-0">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">极速 HMR</h5>
        <p class="max-w-[26rem] text-pretty">
          保存后立即反映变更，无论应用规模多大。
        </p>
      </div>
      <div class="flex justify-end">
        <img
          src="@assets/vite/vite-featurepanel-2-terminal.png"
          width="1126"
          height="734"
          class="md:max-w-[80%]"
          inert
          loading="lazy"
          alt="极速热模块替换"
        />
      </div>
    </div>

    <div class="p-5 sm:p-10 pb-0 sm:pb-0 flex flex-col gap-3 lg:border-b-0">
      <h5 class="text-white">开箱即用的丰富功能</h5>
      <p class="sm:max-w-[28rem] text-pretty">
        TypeScript、JSX、CSS、Worker、WebAssembly……更多能力，只需一个插件即可获得。
      </p>
      <RiveAnimation
        :desktop-src="viteAnimation"
        :mobile-src="viteAnimation"
        :desktop-width="563"
        :desktop-height="300"
        :mobile-width="563"
        :mobile-height="420"
        canvas-class="w-full"
      />
    </div>

    <div class="flex flex-col gap-3 justify-between border-r-0 border-b-0">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">优化构建</h5>
        <p class="max-w-[25rem] text-pretty">
          高级 Tree-shaking、内置压缩，以及由 Rolldown 提供的细粒度分块控制。
        </p>
      </div>
      <div class="relative p-10 sm:p-15 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-4-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-featurepanel-4-terminal.svg"
          width="436"
          height="209"
          inert
          loading="lazy"
          alt="优化构建"
        />
      </div>
    </div>
  </section>
</template>
