<template>
	<view :class="{'yidong':argu.yidong,'fanhui':argu.fanhui}">
		<view class="UHead">
			<view class="status_bar" :style="{backgroundColor:argu.bgColor}">
			          <!-- 这里是状态栏 -->
			</view>
			<view class="UHead_" :style="{backgroundColor:argu.bgColor,color:argu.color}">
				<view class="left" v-if="haveBack.be">
					<image v-if="haveBack.black" class="left_icon" src="/static/left13@2x.png" mode="" @tap="back(haveBack.v)"></image>
					<image v-else class="left_icon" src="/static/left14@2x.png" mode="" @tap="back(haveBack.v)"></image>
				</view>
				{{argu.status || argu.name || ''}}
			</view>
		</view>
		<view class="status_bar" v-if="!argu.top">
			<!-- 这里是状态栏 -->
		</view>
		<view class="UHead_space" v-if="!argu.top">
			
		</view>
	</view>
	
</template>

<script>
	/*
		argu:{
			status/name:"xxx",  导航栏标题  不填默认为空
			top: true,   不需要前顶     false  需要前顶
			bgColor: 导航栏背景颜色
			color:导航栏字体颜色
		}
		haveBack：{   返回按钮
			be:  flase ,   不需要返回按钮
			black：flase , 返回按钮图标颜色为白色   true-黑色
			v:返回需要回传的数据
		}
	*/
	export default {
		data() {
			return {
				bg:'red'
			};
		},
		props:{
			argu:{},
			haveBack:{
				
			}
		},
		methods:{
			back:function(e){
                console.log(e)
				this.$emit('back',e);
			}
		}
	}
</script>

<style scoped>
	.status_bar {
	    height: var(--status-bar-height);
	    width: 100%;
		background-color: #EFEFEF;
	}
	.UHead{
		position: fixed;
		z-index: 10;
		top: 0;
		width: 100%;
	}
	.UHead_{
		position: relative;
		height: 80rpx;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		color: #000000;
		font-weight: 500;
		background-color:#EFEFEF;
	}
	.UHead_space{
		height: 80rpx;
	}
	
	.left{
		
	}
	.left_icon{
		position: absolute;
		top: 20rpx;
		left: 40rpx;
		width: 21rpx;
		height: 36rpx;
		padding-right: 10px;
	}
	.bright{
		opacity: 0;
	}
	@keyframes tran{
		from{
			transform: translateY(0px);
		}
		to{
			transform: translateY(-80px);
		}
	}
	.yidong{
		animation: tran 0.5s;
		animation-fill-mode: forwards;
	}
	@keyframes back{
		from{
			transform: translateY(-80px);
		}
		to{
			transform: translateY(0px);
		}
	}
	.fanhui{
		animation: back 0.5s;
		animation-fill-mode: forwards;
	}
</style>
