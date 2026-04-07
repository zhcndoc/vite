import { h } from 'vue'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import 'vitepress-plugin-graphviz/style.css'
import Theme from '@voidzero-dev/vitepress-theme/src/vite'
import './styles.css'

// components
import SvgImage from './components/SvgImage.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'
import NonInheritBadge from './components/NonInheritBadge.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import ScrimbaLink from './components/ScrimbaLink.vue'

export default {
  Layout() {
    return h((Theme as any).Layout, null, {
      'aside-ads-before': () => h(AsideSponsors),
      'aside-outline-before': () =>
        h('div', {
          class: 'wwads-cn wwads-vertical',
          style: 'margin-top: 0; margin-bottom: 1rem; max-width:200px;',
          'data-id': '354',
        }),
      'doc-after': () =>
        h('div', {
          class: 'wwads-cn wwads-horizontal',
          style: 'margin-top: 1rem; margin-bottom: 1rem; max-width:100%;',
          'data-id': '354',
        }),
    })
  },
  enhanceApp(ctx: any) {
    const { app } = ctx

    app.component('SvgImage', SvgImage)
    app.component('YouTubeVideo', YouTubeVideo)
    app.component('NonInheritBadge', NonInheritBadge)
    app.component('ScrimbaLink', ScrimbaLink)
    app.use(TwoslashFloatingVue)

    Theme.enhanceApp(ctx)
  },
}
