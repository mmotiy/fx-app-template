import Vue from 'vue'
import dio from '@/common/dio/dio.js';

(function(){
	
	var url = "https://www.zhuiyixinian.cn/go/"
	// var url = "http://192.168.0.118:8088/"
	
	Vue.config.errorHandler = function (err, vm, info) {
		console.log("vue的错误捕获",err.toString(),err)
		console.log("vue的错误捕获path",vm.$scope.is)
		console.log("vue的错误捕获info",info)
		const entries = tt.performance.getEntries();
		console.log("性能",entries)
		console.log(dio)
		var options = tt.getLaunchOptionsSync();
		console.log("启动参数",options);
		var temp = {
			vueMsg:{
				msg:err.toString(),
				path:vm.$scope.is,
				info:info
			},
			entries:entries,
			config:dio.config,
			launchOptions:options
		}
		dio.post(url+"minierror/report",temp).then(r=>{
			console.log("wocao",r)
		})
		
	}
	
	uni.onError((msg)=>{
		var options = tt.getLaunchOptionsSync();
		console.log("启动参数",options);
		const entries = tt.performance.getEntries();
		console.log("性能",entries)
		var temp = {
			appMsg:msg,
			config:dio.config,
			entries:entries,
			launchOptions:options
		}
		
		console.log(temp)
		
		dio.post(url+ "minierror/report",temp).then(r=>{
			console.log("wocao",r)
		});
		console.log("全局错误",msg);
	})
})()

