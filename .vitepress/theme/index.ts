import { h } from 'vue'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import Theme from '@voidzero-dev/vitepress-theme/src/vite'
import './styles.css'

// components
import SvgImage from './components/SvgImage.vue'
// import WwAds from './components/WwAds.vue'
import './custom.css'
import YouTubeVideo from './components/YouTubeVideo.vue'
import NonInheritBadge from './components/NonInheritBadge.vue'
// import AsideSponsors from './components/AsideSponsors.vue'

export default {
  Layout() {
    return h((Theme as any).Layout, null, {
      // 'aside-ads-before': () => h(AsideSponsors),
      'aside-outline-before': () => h('div', {
        'class': 'wwads-cn wwads-vertical w-full mt-0! mb-4',
        'data-id': '354',
      }),
      'doc-after': () => h('div', {
        'class': 'wwads-cn wwads-horizontal w-full mt-4',
        'data-id': '354',
      }),
    })
  },
  enhanceApp(ctx: any) {
    const { app } = ctx

    app.component('SvgImage', SvgImage)
    app.component('YouTubeVideo', YouTubeVideo)
    app.component('NonInheritBadge', NonInheritBadge)
    app.use(TwoslashFloatingVue)

    Theme.enhanceApp(ctx)
  },
}
