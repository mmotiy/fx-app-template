<template>
    <view>
        <view
            id="_drag_button"
            class="drag"
            :style="'left: ' + left + 'px; top:' + top + 'px;'"
            @touchstart="touchstart"
            @touchmove.stop.prevent="touchmove"
            @touchend="touchend"
            @click.stop.prevent="click"
            :class="{ transition: isDock && !isMove }"
        >
            <!-- <text>{{ text }}</text> -->
            <view style="border-radius: 40rpx;width: 80rpx;min-height: 80rpx;background: #ffa130;box-shadow: 0 0 10rpx #f56f00;flex-direction: column;" class="flex_text_center">
               <!-- <image  @click="showOrHide" src="../../static/menu.svg" mode="aspectFill" style="width: 40rpx;height: 40rpx;padding: 20rpx;"></image> -->
							 <image src="/static/order.svg" mode="aspectFill" style="width: 40rpx;height: 40rpx;"></image>
                <view :animation="menuAnimation" style="height: 0;width: 80rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;overflow: hidden;">
                   <view style="display: flex;flex-direction: column;align-items: center;">
                       <text>订单</text>
                   </view >
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'drag-button',
    props: {
        isDock: {
            type: Boolean,
            default: false
        },
        existTabBar: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            top: -100,
            left: -10,
            width: 0,
            height: 0,
            offsetWidth: 0,
            offsetHeight: 0,
            windowWidth: 0,
            windowHeight: 0,
            menuAnimation:{},
            drag_init:false,
            isMove: true,
            edge: 10,
            text: '按钮',
            menuState: false,
            content: [{ iconPath: '/static/logo.png', text: '选项一' }, { iconPath: '/static/logo.png', text: '选项二' }]
        };
    },
    mounted() {
        const sys = uni.getSystemInfoSync();

        this.windowWidth = sys.windowWidth;
        this.windowHeight = sys.windowHeight;

        // #ifdef APP-PLUS
        this.existTabBar && (this.windowHeight -= 50);
        // #endif
        if (sys.windowTop) {
            this.windowHeight += sys.windowTop;
        }
        console.log(sys);

        const query = uni.createSelectorQuery().in(this);
        query
            .select('#_drag_button')
            .boundingClientRect(data => {
                this.width = data.width;
                this.height = data.height;
                this.offsetWidth = data.width / 2;
                this.offsetHeight = data.height / 2;
                // this.left = this.windowWidth - this.width - this.edge;
                this.left = this.edge;
                this.top = this.windowHeight - this.height - this.edge;
            })
            .exec();
            this.drag_init=true
    },
    methods: {
        click() {
            this.$emit('btnClick');
        },
        touchstart(e) {
            this.$emit('btnTouchstart');
        },
        showOrHide(){
          this.menuState = !this.menuState;
          let animation = uni.createAnimation({
              duration:300
          })
          this.animation = animation
          if(this.menuState){
              animation.height(100).step()
          }else{
              animation.height(0).step()
          }
          this.menuAnimation = animation.export()
        },
        touchmove(e) {
            // 单指触摸
            if (e.touches.length !== 1) {
                return false;
            }

            this.isMove = true;

            this.left = e.touches[0].clientX - this.offsetWidth;

            let clientY = e.touches[0].clientY - this.offsetHeight;
            // #ifdef H5
            clientY += this.height;
            // #endif
            let edgeBottom = this.windowHeight - this.height - this.edge;

            // 上下触及边界
            if (clientY < this.edge) {
                this.top = this.edge;
            } else if (clientY > edgeBottom) {
                this.top = edgeBottom;
            } else {
                this.top = clientY;
            }
        },
        touchend(e) {
            if (this.isDock) {
                let edgeRigth = this.windowWidth - this.width - this.edge;

                if (this.left < this.windowWidth / 2 - this.offsetWidth) {
                    this.left = this.edge;
                } else {
                    this.left = edgeRigth;
                }
            }

            this.isMove = false;

            this.$emit('btnTouchend');
        }
    }
};
</script>

<style lang="scss">
.drag {
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: rgba(0, 0, 0, 0.5);
    // box-shadow: 0 0 6upx rgba(0, 0, 0, 0.4);
    color: $uni-text-color-inverse;
    width: 80upx;
    height: 80upx;
    border-radius: 50%;
    font-size: $uni-font-size-sm;
    position: fixed;
    z-index: 999999;

    &.transition {
        transition: left 0.3s ease, top 0.3s ease;
    }
}
</style>
