<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Testimonial {
  name: string
  handle: string
  avatar: string
  comment: string[]
}

const testimonials: Testimonial[] = [
  {
    name: 'Ryan Carniato',
    handle: '@RyanCarniato',
    avatar:
      'https://pbs.twimg.com/profile_images/1810837163447308292/8Piov0f6_400x400.jpg',
    comment: [
      `我很喜欢 Vite 所带来的可能性。在构建 SolidStart 的过程中，我们发现它与其说是一个元框架，不如说是一套共生的 Vite 插件系统。虽然它是围绕 SolidJS 构建的，但它应当能够从最简单的模板扩展到更有主见的脚手架。我们正在 Vite 之上构建一个生态系统。`,
    ],
  },
  {
    name: 'Rich Harris',
    handle: '@Rich_Harris',
    avatar:
      'https://pbs.twimg.com/profile_images/557940120184041473/bFyXy8Pu_400x400.jpeg',
    comment: [
      `现在的 Vite 基本上就是 JavaScript 的联合国。我会作为 Sveltelandia 的代表出席。`,
    ],
  },
  {
    name: 'David East',
    handle: '@_davideast',
    avatar:
      'https://pbs.twimg.com/profile_images/1691627325794725888/voQFcYjY_400x400.jpg',
    comment: ['每次使用 Vite，我都会感受到纯粹而毫无保留的喜悦。'],
  },
  {
    name: 'Mark Dalgleish',
    handle: '@markdalgleish',
    avatar:
      'https://pbs.twimg.com/profile_images/754886061872979968/BzaOWhs1_400x400.jpg',
    comment: [
      `它也是一个用来构建框架的绝佳平台，因为它提供了可插拔的开发环境。`,
      `社区也同样出色。`,
    ],
  },
  {
    name: 'Jason Miller',
    handle: '@_developit',
    avatar:
      'https://pbs.twimg.com/profile_images/1374778373239681025/Sc9ehtAr_400x400.jpg',
    comment: [
      `每次我以为自己已经触到了 Vite 能做到的边界时，事实证明我总是错的。`,
    ],
  },
  {
    name: 'David Cramer',
    handle: '@zeeg',
    avatar:
      'https://pbs.twimg.com/profile_images/1911613315765133312/HVkULegC_400x400.jpg',
    comment: ['Vite 改变了整个行业的游戏规则。'],
  },
  {
    name: 'Dion Almaer',
    handle: '@dalmaer',
    avatar:
      'https://pbs.twimg.com/profile_images/3380865881/f73b3687ff39b795db05fcaf35972270_400x400.jpeg',
    comment: [
      '看到这么多优秀框架在 Vite 之上协同合作，我感到非常兴奋。会有很多人从中受益。❤️ 致 Vite 团队。',
    ],
  },
  {
    name: 'Christoph Nakazawa',
    handle: '@cpojer',
    avatar:
      'https://pbs.twimg.com/profile_images/1910252462126313472/gXgT-jxL_400x400.jpg',
    comment: ['Vite 将改变整个（JavaScript）世界。'],
  },
  {
    name: 'Nikolaj',
    handle: '@lopugit',
    avatar: 'https://avatars.githubusercontent.com/u/13629190?v=4',
    comment: ['哇，哇，哇，哇，哇，哇，Vite 是……Vite 是……哇 🤤🤯🙏'],
  },
]
</script>

<template>
  <div class="wrapper wrapper--ticks border-t pt-14 sm:pt-30 px-5 sm:px-10">
    <div
      class="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-20 text-center sm:text-left"
    >
      <div class="flex flex-col gap-3">
        <h3 class="text-white max-w-xl text-balance">深受社区喜爱</h3>
        <p class="max-w-md text-white/70 text-balance">
          别只听我们说，来看看 Vite 社区成员怎么说。
        </p>
      </div>
      <div
        class="flex gap-8 sm:gap-12 items-start justify-center sm:justify-start sm:pr-20"
      >
        <!-- GitHub Stars -->
        <div class="flex flex-col gap-3">
          <h2 class="text-white">80k+</h2>
          <p class="text-grey flex items-center gap-2">
            <Icon icon="simple-icons:github" width="20px" height="20px" />
            GitHub 星标
          </p>
        </div>

        <!-- NPM Downloads -->
        <div class="flex flex-col gap-3">
          <h2 class="text-white">80m+</h2>
          <p class="text-grey">每周 NPM 下载量</p>
        </div>
      </div>
    </div>
    <div
      class="pt-14 sm:pt-30 h-[50rem] overflow-clip [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
    >
      <!-- Masonry Grid -->
      <div class="columns-1 sm:columns-2 lg:columns-3 gap-5">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="break-inside-avoid mb-5"
        >
          <div
            class="testimonial-card relative overflow-clip isolate rounded-lg p-6 sm:px-8 sm:py-10 flex flex-col gap-6 before:content-[''] before:absolute before:inset-0 before:opacity-0 before:z-0 before:pointer-events-none before:transition-opacity before:duration-100 before:ease-in-out after:content-[''] after:absolute after:inset-px after:z-[1] after:rounded-lg after:bg-slate after:border after:border-nickel after:transition-[border-color,background] after:duration-100 after:ease-in-out hover:before:opacity-100 hover:after:border-transparent"
          >
            <!-- Comment -->
            <div class="relative z-[2] flex flex-col gap-4">
              <p
                v-for="(paragraph, pIndex) in testimonial.comment"
                :key="pIndex"
                class="text-white/70 leading-relaxed text-sm sm:text-base"
              >
                {{ paragraph }}
              </p>
            </div>

            <!-- Author -->
            <div class="relative z-[2] flex items-center gap-5 mt-auto">
              <!-- Avatar -->
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="w-12 h-12 rounded-sm object-cover flex-shrink-0"
                loading="lazy"
              />

              <!-- Author info -->
              <div class="flex flex-col">
                <span class="text-grey text-sm font-mono">{{
                  testimonial.name
                }}</span>
                <span class="text-biege text-sm font-mono">{{
                  testimonial.handle
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Background image and animation for ::before pseudo-element */
.testimonial-card::before {
  background-image: url('@assets/vite/vite-featurepanel-4-background.jpg');
  background-size: 150% 150%;
  background-position: center;
  animation: move-background 16s ease-in-out infinite;
}

/* Randomize animation timing for organic feel */
.testimonial-card:nth-child(2)::before {
  animation-duration: 18s;
  animation-delay: -3s;
}

.testimonial-card:nth-child(3)::before {
  animation-duration: 14s;
  animation-delay: -7s;
}

.testimonial-card:nth-child(4)::before {
  animation-duration: 20s;
  animation-delay: -5s;
}

.testimonial-card:nth-child(5)::before {
  animation-duration: 15s;
  animation-delay: -9s;
}

.testimonial-card:nth-child(6)::before {
  animation-duration: 19s;
  animation-delay: -2s;
}

.testimonial-card:nth-child(7)::before {
  animation-duration: 17s;
  animation-delay: -11s;
}

.testimonial-card:nth-child(8)::before {
  animation-duration: 16s;
  animation-delay: -6s;
}
</style>
