<script setup>
// these components live in @voidzero-dev/vitepress-theme
import Hero from './Hero.vue'
import ViteFeatureGrid1 from './FeatureGrid1.vue'
import ViteFeatureGrid2 from './FeatureGrid2.vue'
import ViteFrameworks from './Frameworks.vue'
import ViteCommunity from './Community.vue'
import TrustedBy from '@components/oss/TrustedBy.vue'
import HeadingSection from '@components/oss/HeadingSection.vue'
import Sponsors from '@components/oss/Sponsors.vue'
import Spacer from '@components/shared/Spacer.vue'
import Footer from '@components/oss/Footer.vue'
import { useSponsor } from '../composables/sponsor'

const { data: sponsors } = useSponsor()
</script>

<template>
  <Hero />
  <TrustedBy
    :logos="['openai', 'shopify', 'stripe', 'linear', 'clickup', 'wiz']"
  />
  <HeadingSection
    heading="重新定义开发体验"
    subheading="Vite 让 Web 开发再次变得愉快"
  />
  <ViteFeatureGrid1 />
  <HeadingSection heading="共享的构建基础" />
  <ViteFeatureGrid2 />
  <HeadingSection heading="为你喜爱的框架和工具提供动力" />
  <ViteFrameworks />
  <ViteCommunity />
  <Sponsors :sponsors="sponsors" />
  <Spacer />
  <Footer
    heading="从 Vite 开始构建"
    subheading="准备好迎接一个终于能跟上你思维速度的开发环境。"
    button-text="开始使用"
    button-link="/guide/"
  />
</template>
