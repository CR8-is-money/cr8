import Vue from 'vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'
import * as filters from './filters'
import store from './store/store'
import App from './App.vue'
import Actions from './components/Actions/Actions-main.vue'
import FAQ from './components/FAQ.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

// registers global filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Actions
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    }
  ]
})

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
  store
}).$mount('#app')
