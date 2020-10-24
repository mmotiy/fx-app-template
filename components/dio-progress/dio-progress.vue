<template>
	<view>
		<view class="" style="align-items: center;width: 100%;margin-top: 26rpx;">
			<view class="progress_bar">
				<view class="progress" :style="{width:progressWidth+'%'}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.progress_bar {
		/* 进度条的槽 */
		width: 646rpx;
		/* 设置进度条的高度 */
		height: 23rpx;
		/*进度条外层div的背景色，进度未达到的地方的颜色 */
		/* background-color: ; */
		border: 2px solid #FFFFFF;
		border-radius: 12rpx;
	}
	
	.progress {
		/* 进度部分 */
		/* 利用继承父元素宽度的百分比控制进度 */
		/* width: 10%; */
		transition: width 1s;
		height: 100%;
		/* 内层背景色即进度达到的颜色 */
		background-color: #FFFFFF;
		border-radius: 3rpx;
	}
</style>
