import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'
import dio from '@/common/dio/dio.js'
import util from '@/common/util.js'
import { config } from '@/common/lib/app.js'
import { ttReport, reportBrower } from '@/common/reports.js';

Vue.config.productionTip = false
Vue.prototype.$dio = dio;
Vue.prototype.$util = util
Vue.prototype.$config = config


// Vue.prototype.$ERURL = "http://192.168.0.118:8088/"
Vue.prototype.$ERURL = "https://www.zhuiyixinian.cn/go/"


App.mpType = 'app'

function showMsg(e) {
    uni.showToast({
        icon: "none",
        title: e
    })
}
Vue.prototype.$showMsg = showMsg
Vue.prototype.$ttReport = ttReport
Vue.prototype.$reportBrower = reportBrower

const app = new Vue({
    ...App,
    store
})
app.$mount()