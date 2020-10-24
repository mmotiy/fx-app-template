<template>
    <view class="page_bg">
		<view class="more_bottom">
			<view style="display: flex;align-items: center;justify-content: center; margin-bottom: -12rpx;margin-top: 30rpx;">
				<!-- <image style="width: 29rpx; height: 34rpx;" src="../../static/xb.png"></image> -->
				<!-- <view style="margin: 0 16rpx;color: #664100;font-size: 36rpx;text-align: center;font-weight: 500;z-index: 5;">更多好玩测试</view> -->
				<!-- <image style="width: 29rpx; height: 34rpx;" src="../../static/xb1.png"></image> -->
			</view>
			<view v-if="!item.isDel" @click="jumpMini(item)" v-for="(item, index) of items" :key="index" class="goods">
				<image lazy-load="true" :src="item.image" mode="aspectFill" style="width: 226rpx;height: 180rpx;flex-shrink: 0;border-radius: 10rpx 0 0 10rpx;"></image>
				<view style="flex-grow: 1;display: flex;flex-direction: column;font-size: 28rpx;justify-content: center;margin-left: 20rpx;">
					<view style="text-align: left;font-size: 36rpx;color: #3A3A3A;">{{ item.name || '---' }}</view>
					<view style="margin-top: 22rpx;display: flex;align-items: center;flex-direction: row;">
						<view style="color: #767676;line-height: 22rpx;font-size: 24rpx;">{{item.manyPeople}}人测过</view>
						<view class="lijiceshi" style="margin-left: 30rpx;">立即测试</view>
					</view>
				</view>
			</view>
		</view>
		<image style="width: 710rpx;height: 33rpx;" src="/static/more_bottom1.png"></image>
		<view style="height: 120rpx;"></view>
    </view>
</template>

<script>
import {config} from '@/common/lib/app.js'
export default {
    data() {
        return {
            items:[],
            tMyStyle:{
                titleColor: '#3E89A8',fontColor: '#3CC7FF'
            },
			totalPage:0
        };
    },
    props: {
        dictKey:null,
        myStyle: {
            type: String,
            default: "background-color: #FFFFFF;padding: 0 0 40rpx 0;"
        }
    },
	// onLoad() {
	// 	setTimeout(function(times){
	// 		this.pageData(times);
	// 		times++
	// 	},1000)
	// },
    mounted: function() {
        console.log('bannerBox mounted');
			console.log(config.dictKey);
        if(this.myStyle){
            this.tMyStyle = this.myStyle
        }
		this.loadMoreTest(0);
    },
    methods: {
        async loadMoreTest(page){
			//使用字典配置当前广告位
			// console.log("loadMoreTest")
			///bottom-banner/page
			if (page<=this.totalPage){
				this.$dio.dio('bottom-banner/page',{dictKey:this.dictKey,p:page,s:10}).then((data,index)=>{
					if(data.data.status === 200){
						if(page!=0){
								this.items = this.items.concat(data.data.data.content);
						} else{
							this.items = data.data.data.content
							this.totalPage = data.data.data.totalPages;
						}
						console.log(this.items);
						config.bottom_banner = this.items
					}
				})
			}
			
        },
		// pageData(time) {
		// 	this.items = this.value1.subList(0,1)
		// },
        jumpMini(item){
			console.log(item.path);
			console.log('bannerbox的item.path');
            item.path = item.path.replace("\$pid",config.ttp)
            if(item.type === 'mini'){
                uni.navigateToMiniProgram({
                    appId:item.appId,
                    path:item.path,
                    envVersion:item.envVersion,
                    fail:console.error
                })
                
            }else if(item.type === 'inner'){
                uni.navigateTo({
                    url:item.path
                })
            }else if(item.type === 'h5'){
                uni.navigateTo({
                    url:item.path
                })
            }else if(item.type === 'reLaunch'){
                uni.reLaunch({
                    url:item.path
                })
            }
        }
    }
};
</script>

<style>
	.page_bg{
		margin-top: -5rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 710rpx;
	}
	.more_top{
		width: 710rpx;
		height: 203rpx;
		background: url('http://create.adota.cn/more_top.png') no-repeat;
		background-size: 100% 100%;
	}
	.moretest_font{
		color: #FF6602;
		font-size: 48rpx;
		padding: 30rpx 0 10rpx 0;
		text-align: center;
		font-weight: 500;
	}
	.more_bottom{
		margin-top: -80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 710rpx;
		background: url('http://create.adota.cn/more_bottom3.png') no-repeat;
		background-size: 100% 100%;
	}
	
	.lijiceshi{
		flex-shrink: 0;
		width: 200rpx;
		height: 44rpx;
		font-size: 28rpx;
		background-color: #FF6642;
		text-align: center;
		line-height: 44rpx;
		color: #FFFFFF;
		border-radius: 26rpx;
	}
	.goods{
		display: flex;
		flex-direction: row;
		width: 650rpx;
		height: 180rpx;
		box-shadow:0px 3px 12px rgba(0,0,0,0.12);
		border-radius: 10rpx;
		margin-top: 40rpx;
		/* margin-top: 40rpx; */
	}
</style>
