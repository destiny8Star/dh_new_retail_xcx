import Vue from 'vue'
import App from './App'
import tips from './utils/Tips.js'         //弹框提示
import commonObj from './utils/common.js'         //全局的一些值
import http from './luch-request/index.js'//配置接口
import goodsList from './components/goods/goods-list.vue'//引入商品列表组件
import configs from './config.js' //全局配置常量
import store from './store/index.js' //引入vuex

Vue.component('goodsList',goodsList)//全局注册商品列表组件

Vue.config.productionTip = false

Vue.http = http;
Vue.prototype.$http = http;
Vue.tips = tips
Vue.prototype.$cObj = commonObj
Vue.prototype.$tips = tips;
Vue.prototype.$configs = configs;
Vue.prototype.$store = store


App.mpType = 'app'

const app = new Vue({
	//挂载
	store,
    ...App
})
app.$mount()
