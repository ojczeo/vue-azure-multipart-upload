// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueAzureUploader from '../plugin.js'
import Axios from 'axios'

Vue.config.productionTip = false
Vue.$http = Axios
Vue.use(VueAzureUploader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
