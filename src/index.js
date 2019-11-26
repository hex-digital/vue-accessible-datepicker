import App from './App.vue'

const install = Vue => {
  Vue.component('vue-accessible-datepicker', App)
};

export default install;

export { App };
