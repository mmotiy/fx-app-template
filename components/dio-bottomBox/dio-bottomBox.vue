<template>
	<view>
		<view style="margin-bottom: 60rpx;">
			<view class="qiejiao" style="margin-top: 60rpx;"></view>
			<view style="color: #071D5F;font-size: 48rpx;padding: 10rpx 0 30rpx 0;text-align: center;background-color: #FFFFFF;font-weight: 500;">更多好玩推荐</view>
			<view :style="value.style" class="dio_bbox">
				<dio-bannerbox dictKey="BB_BOX_BOTTOM_BANNER" :myStyle="value.extendData"></dio-bannerbox>
			</view>
			<view class="qiejiao" style="transform: rotate(180deg);"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		components: {
			bannerBox
		}
	}
</script>

<style scoped>
	.dio_bbox{
		background-color: #FFF;
	}
	.qiejiao {
		width: 100%;
		height: 50rpx;
		background-color: #ffffff;
		background: linear-gradient(-135deg, transparent 20rpx, #ffffff 0);
	}
</style>
