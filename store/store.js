import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const app = require('@/common/lib/app.js');
const util = require('@/common/util.js');

const store = new Vuex.Store({
	state: {
		userId:null,
		token:null,
		threadId:null,
		indexPath:'/pages/pretend_index/pretend_index',
        messageTitle:'你适合做领导吗?',
		showvideoAd:false, //是否观看视频
		cantest:null,
		douamry:'',
		userInfo:{
            osVersion:'iphone'
        },
        head_below_data: {
        	totalBrowser:'--',
        	totalCommission:'--',
        	totalUsers:'--'
        },
        serviceId:'',
        myorder:{
            userFormInfos:{
                formItems:[]
            }
        },
        goodsSimpleInfo: {
            serviceMethod: [],
            advisory: true
        },
        historyId:'',
        second:1,
        goodsMode:{
            navigationBarTitleText:'',
            AD:{off:1},
            resultbg:'https://create.adota.cn/rname_icon.png'
        }
	},
	mutations: {
		setState(state,param){
			for(let v in param){
			   state[v] = param[v]
			}
		}
	},
	actions: {
		
	},
	getters:{
		
	}
})

export default store
