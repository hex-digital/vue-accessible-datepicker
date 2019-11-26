import Vue from 'vue'
import App from './App.vue'

Vue.use(App);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
