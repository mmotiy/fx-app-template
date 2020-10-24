<template>
	<view class="l-barrage">
		<block v-for="(item,index) in items" :key="index">
			<!-- #ifdef H5 -->
				<view v-if="item.display" class="aon"
				  :style="{top: `${item.top}%`,color: item.color}"
				>
				<!-- <image :src="item.text.src" style="width: 30rpx;height: 30rpx;margin-right: 10rpx;"></image> -->
					{{item.text}}
				</view>
			<!-- #endif -->
			
			<!-- #ifndef H5 -->
				<view v-if="item.display" class="aon" 
				  :style="{top: `${item.top}%`,color: item.color,
				  animation: `mymove ${Number(item.time)}s linear forwards`
				  }"
				>
					<!-- <image :src="item.text." style="width: 30rpx;height: 30rpx;padding-right: 10rpx;"></image> -->
					{{item.text}}
				</view>
			<!-- #endif -->
			
		</block>
	</view>
</template>

<script>
let cycle;

// 弹幕字体颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
	let color = Math.floor(Math.random() * 256).toString(16)
	color = color.length == 1 ? '0' + color : color
	rgb.push(color)
  }
  return '#' + rgb.join('')
}	

export default {
	name: 'l-barrage',
	props: {
		minTime: {
			type: Number,
			default: 13
		},
		maxTime: {
			type: Number,
			default: 15
		},
		minTop: {
			type: Number,
			default: 0
		},
		maxTop: {
			type: Number,
			default: 80
		}
	},
	data() {
		return {
			items: [],
		}
	},
	mounted() {
		console.log('danmu挂载');
	},
	methods: {
		add(text = '',time = Math.ceil(Math.floor(Math.random()*(this.maxTime-this.minTime+1)+this.minTime))) {
			this.items.push({
				text,
				time,
				top: Math.ceil(Math.random()*(this.maxTop-this.minTop)+this.minTop),
				// color: getRandomColor(),
				color: '#FFFFFF',
				display: 1,
			});
			// console.log(Math.ceil(Math.random()*(this.maxTop-this.minTop+1)+this.minTop) + 'rpx');
		},
		start(items = []) {
			this.items = [];
			cycle && (clearInterval(cycle));
			let i = 0,len = items.length;
			console.log(this.items);
			cycle = setInterval(()=> {
				let time = 20;
				// #ifndef H5
					time = Math.ceil(Math.floor(Math.random()*(this.maxTime-this.minTime+1)+this.minTime));
				// #endif
				
				if (i < len) {
					this.add(items[i],time);
					i++;
				}
				else {
					clearInterval(cycle);
					setTimeout(()=>{
						this.$emit("end",{});
					},time * 800)
				}
			}, 1000)
		}
	}
}	
	
</script>

<style>
.aon{
	/* background-color: #555555;
	opacity: 0.8;
	padding: 0 20rpx;
	border-radius: 20rpx; */
	position: absolute;
	white-space:nowrap;
	animation: mymove 5s linear forwards;
	animation-timing-function: linear;
	-webkit-animation-timing-function: linear;
	animation-fill-mode: forwards;
}
.l-barrage{
	height: 430rpx;
  z-index: 3;
  width: 100%;
	position: relative;
}

@keyframes mymove
{
from{left: 100%;}
  to{left: -200%;}
}

@-moz-keyframes mymove /* Firefox */
{
from{left: 100%;}
  to{left: -200%;}
}

@-webkit-keyframes mymove /* Safari and Chrome */
{
from{left: 100%;}
  to{left: -200%;}
}

@-o-keyframes mymove /* Opera */
{
from{left: 100%;}
  to{left: -200%;}
}
</style>
