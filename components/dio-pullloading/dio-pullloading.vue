<template>
	<view>
		<view style="display: flex;flex-direction: row;justify-content: center;margin-bottom: 40rpx;">
			<!-- <view style=""></view> -->
			<view v-show="loading" class="preloader_1">
				<span :style="{backgroundColor:color}"></span>
				<span :style="{backgroundColor:color}"></span>
				<span :style="{backgroundColor:color}"></span>
				<span :style="{backgroundColor:color}"></span>
				<span :style="{backgroundColor:color}"></span>
			</view>
			<view v-show="!loading" style="margin-top: 20rpx;height: 30px;line-height: 30px;font-size: 36rpx;" :style="{color:color}">{{txt}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:true
			};
		},
		props:{
			txt:{
				default:"到底啦~"
			},
			color:{
				default:"#ff7858"
			}
		},
		methods:{
			open(){
				this.loading = true;
			},
			close(){
				this.loading = false;
			}
		}
		
	}
</script>

<style>
	.preloader_1 {
		width: 60px;
		height: 30px;
		position: relative;
	}
	
	.preloader_1 span {
		display: block;
		bottom: 0px;
		width: 9px;
		height: 5px;
		position: absolute;
		animation: preloader_1 1.5s infinite ease-in-out;
	}
	
	.preloader_1 span:nth-child(2) {
		left: 11px;
		animation-delay: 0.2s;
	}
	
	.preloader_1 span:nth-child(3) {
		left: 22px;
		animation-delay: 0.4s;
	}
	
	.preloader_1 span:nth-child(4) {
		left: 33px;
		animation-delay: 0.6s;
	}
	
	.preloader_1 span:nth-child(5) {
		left: 44px;
		animation-delay: 0.8s;
	}
	
	@keyframes preloader_1 {
		0% {
			height: 5px;
			transform: translateY(0px);
		}
	
		25% {
			height: 30px;
			transform: translateY(15px);
		}
	
		50% {
			height: 5px;
			transform: translateY(0px);
		}
	
		100% {
			height: 5px;
			transform: translateY(0px);
		}
	}
</style>
