<template>
	<view>
        <button v-if="threadId" @longtap="copyThreadId"  class="share_button"  open-type="share"  data-channel="video">
            <image style="width: 24.3rpx;height: 27.78rpx;flex-shrink: 0;" src="/static/Dou.png" class="rotate-animation"></image>
            <text style="padding-left: 4rpx;color: #FFFFFF;">拍视频</text>
        </button>
	</view>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import {config} from '@/common/lib/app.js'
	export default {
		data() {
			return {
				
			};
		},
		mounted() {
			if(this.threadId ){
				console.log('可以推广lalal');
			}
		},
        computed:{
            ...mapState(['threadId'])
        },
        methods: {
			...mapMutations(['setState']),
            copyThreadId(){
              console.log('copy threadId:'+config.threadId)
              uni.setClipboardData({
                  data:config.threadId,
                  success:function(){
                      uni.showToast({
                          title:'复制推广位成功!'
                      })
                  },
                  fail:function(){
                      uni.showToast({
                          title:'复制失败!'
                      })
                  }
              })  
            }
        },
	}
</script>

<style>
.share_button{
	z-index: 8;
      white-space: nowrap;
      font-size: 24rpx;
      color: #ffffff;
      line-height: 42rpx;
      margin: 0;
      border: none;
      background-color: #000000;
      border-radius: 180rpx 0px 0px 180rpx;
      opacity: 0.8;
      width: 120rpx;
      height: 42rpx;
      position: fixed;
      top: 250rpx;
      right: 0rpx;
      display: flex;
      align-items: center;
      padding:0 6rpx 0 14rpx;
  }
.rotate-animation{
    animation: rnimation 0.3s linear infinite alternate;
}
@keyframes rnimation{
    from{
        transform: rotate(330deg);
    }
    to{
        transform: rotate(370deg);
    }
}
</style>
