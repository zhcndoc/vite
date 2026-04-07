<script setup>
import RiveAnimation from '@components/shared/RiveAnimation.vue'
import flexiblePluginAnimation from '@assets/vite/animations/640_x_300_flexible_plugin.riv'
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-nickel"
  >
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5 class="text-balance sm:text-pretty text-white">灵活的插件系统</h5>
      <p class="sm:max-w-[28rem] text-pretty">
        Vite 插件在 Rollup 设计良好的插件接口之上，扩展了少量 Vite 专属选项。
      </p>
      <RiveAnimation
        :desktop-src="flexiblePluginAnimation"
        :desktop-width="640"
        :desktop-height="300"
        canvas-class="w-[calc(100%_+_2.5rem)] mt-5 -mx-5"
      />
    </div>

    <div class="flex flex-col gap-3 border-r-0 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">完整类型化 API</h5>
        <p class="max-w-[26rem] text-pretty">旨在为上层构建提供基础。</p>
      </div>
      <div class="relative p-5 sm:p-10 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-4-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-typed-api.svg"
          width="454"
          height="252"
          inert
          loading="lazy"
          alt="类型化 API"
        />
      </div>
    </div>

    <div class="p-5 sm:p-10 flex flex-col gap-3 lg:border-b-0">
      <h5 class="text-white">一流的 SSR 支持</h5>
      <p class="sm:max-w-[28rem] text-pretty mb-12 sm:mb-16">
        自定义 SSR（Server-Side Rendering）或构建自己的 SSR 框架，从未如此简单。
      </p>
      <img
        src="@assets/vite/vite-ssr-support.png"
        width="1008"
        height="466"
        alt="SSR 支持"
        loading="lazy"
        class="w-full px-5"
      />
    </div>

    <div class="flex flex-col gap-3 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">持续的生态集成</h5>
        <p class="max-w-[25rem] text-pretty">
          我们的 CI 持续将 Vite
          的改动与下游项目进行测试，确保我们能在稳定性与信心兼备的前提下持续改进
          Vite。
        </p>
      </div>
      <div class="px-5 sm:px-10 flex justify-center">
        <img
          src="@assets/vite/vite-ci.svg"
          width="476"
          height="272"
          inert
          loading="lazy"
          alt="持续的生态集成"
        />
      </div>
    </div>
  </section>
</template>
