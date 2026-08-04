---
layout: page
title: 认识团队
description: Vite 的开发由一个国际团队指导。
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from '@voidzero-dev/vitepress-theme'
import { core, advisors, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>认识团队</template>
    <template #lead>
      Vite 的开发由一个国际团队指导，其中部分成员
      选择在此展示。
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>顾问</template>
    <template #lead>
      顾问从生态系统的角度协助指导 Vite，分享他们的
      经验，以塑造环境 API 以及未来 API 的设计。
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="advisors" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>荣誉成员</template>
    <template #lead>
      在此我们致敬一些不再活跃但过去曾做出宝贵
      贡献的团队成员。
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
