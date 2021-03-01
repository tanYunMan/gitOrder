import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import './main.css'

//点击图片，图片放大
import Viewer from 'v-viewer';
import './../static/css/viewer.css';
Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

// 使用 vue-meta
import Meta from "vue-meta";
Vue.use(Meta);

import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

import utils from '@/utils/public'
Vue.mixin(utils)

const whiteList = ['/', '/login', '/qqLoginReturnPlatform', '/qqBindLogin'] // no redirect whitelist


router.beforeEach(async(to, from, next) => {
  console.log(whiteList.indexOf(to.path))
  if (!sessionStorage.token && whiteList.indexOf(to.path) === -1) {
    console.log('进来了')
    next({
      path: '/'
    })
  }else {
    console.log('没进来')
    next()
  }
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
