/*
		使用方法：
			引入 import video from '@/common/AD.js'
			在init()设定当前产品goodsId: video.ViodeAd.goodsId = data.data.data.value.goodsId
			调用广告 -> new video.ViodeAd(self.reward,'530jc32jto7p7p4ik5') 传入奖励回调self.reward,广告id(530jc32jto7p7p4ik5)  将拉起广告组件   没有广告直接查看    对多次点击做了限制
			
		传回调地址不支持加参数回调
		函数里面的this上下文 必须换成变量形成来使用时
		

*/
import {
		vid,
		consumption,
	} from '@/common/tt.mini.js';
class ViodeAd{
	colseCall = null;
	videoAd = null;
	videoClose = null;
	videoError = null;
	self = null;
	// goodsId = null;
	static isPlay = true;
	static goodsId = null;
	
	
    constructor(colseCall,adUnitId) {
		console.log("点击了广告")
		if(ViodeAd.isPlay){
			console.log("广告 初始化",ViodeAd.isPlay);
			// this.self = self;
			this.videoAd = tt.createRewardedVideoAd({
				adUnitId: adUnitId
			});
			ViodeAd.isPlay = false;
			this.colseCall = colseCall;
			this.videoClose = (res)=>{
				console.log('广告关闭')
				this.removeVideoAd();
				if(res.isEnded){
					colseCall()
					consumption()
					console.log('领取奖励')
				}
				
			}
			
			this.videoError = (err)=>{
				console.log("监听错误",err);
				this.removeVideoAd();
				
			}
			
			
			//捕捉错误
			this.videoAd.onError(this.videoError);
			//关闭视频的回调函数
			this.videoAd.onClose(this.videoClose);
			
			// 调起广告视频
			this.videoAd.show().then(() => {
				vid(ViodeAd.goodsId)
				console.log('广告显示成功');
			})
			.catch(err => {
				console.log('广告组件出现问题', err);
				colseCall()
				this.removeVideoAd();
			});
		}
		
    }
	
	removeVideoAd() {
		ViodeAd.isPlay = true;
		if (this.videoAd) {
			//捕捉错误
			this.videoAd.offError(this.videoError);
			//关闭视频的回调函数
			this.videoAd.offClose(this.videoClose);
			console.log('取消监听')
			this.videoAd = null;
		}
	}
}

export default {
  ViodeAd
};