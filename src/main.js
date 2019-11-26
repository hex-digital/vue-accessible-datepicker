import Vue from 'vue'
import VueAccessibleDatepicker from './VueAccessibleDatepicker.vue'

Vue.use(VueAccessibleDatepicker);

Vue.config.productionTip = false

new Vue({
  render: h => h(VueAccessibleDatepicker),
}).$mount('#app')
