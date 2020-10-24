<script>
	import {
		config
	} from 'common/lib/app.js';
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import {
		loginmini,
		haveibind
	} from 'common/tt.mini.js';
	var logId, dt_ticket;
	export default {
		onLaunch: function(e) {
			this.updata()
			console.log("App launch 1.2.1", e)
			let systemInfo = uni.getSystemInfoSync();
			console.log(systemInfo.platform, systemInfo.appName)
			this.setState({
				system: systemInfo.platform,
				appname: systemInfo.appName,
				systemInfo: systemInfo
			})
			if (systemInfo.platform == 'ios') {
				var version1 = this.$util.compareVersion(systemInfo.version, '10.6.0');
			} else {
				var version1 = this.$util.compareVersion(systemInfo.version, '10.3.0');
			}
			console.log(version1)
			if (systemInfo.appName == 'Douyin' && version1) {
				console.log("可以看视频")
				this.setState({
					showvideoAd: true
				})
			} else {
				console.log("不可以看视频")
				this.setState({
					showvideoAd: false
				})
			}
			if (e.query) {
				if (e.query.pid) {
					config.ttp = e.query.pid;
					// this.usershandn(e.query.pid);
				}
				if (e.query.goodsId) config.normalGoodsId = e.query.goodsId;
				if (e.query.ttid) config.shareid = e.query.ttid;
				if (e.query.dt_ticket) dt_ticket = e.query.dt_ticket;
				if (e.query.dictKey) config.dictKey = e.query.dictKey;
				// threadId:抖军团userid,share2Id:推广者分享id,shareid:推广者分享id
				if (e.query.shareid) {
					config.share2id = e.query.shareid
					uni.setStorageSync('share2id', e.query.shareid);
					this.setState({
						'share2id': e.query.shareid
					});
				}
				if (e.query.threadId) {
					config.threadId = e.query.threadId;
					this.setState({
						'threadId': e.query.threadId
					});
					uni.setStorageSync('threadId', e.query.threadId);
					uni.showToast({
						title: '绑定成功，请拍视频推广',
						icon: 'none'
					})
				}
			}
			self = this;
			let share2id = uni.getStorageSync('share2id')
			if (share2id) {
				this.setState({
					'share2id': share2id
				});
				config.share2id = share2id
			}
			let threadId = uni.getStorageSync('threadId')
			if (threadId) {
				this.setState({
					showvideoAd: false
				})
				this.setState({
					'threadId': threadId
				});
				config.threadId = threadId
			}
			// if(dt_ticket){
			//    uni.$once('login-temp-ok', this.init);
			// }else{
			this.init();
			//uni.$once('login-temp-ok', this.reportBrower);
			// }
			if (e.query.relogin) {
				uni.clearStorageSync()
				uni.showToast({
					title: '清除成功'
				})
			}
		},
		methods: {
			...mapMutations(['setState']),
			async usershandn(pid) {
				let data = await this.$dio.dio('users/something-leap', {
					id: pid
				});
				if (data.data.data) {
					let douamry = data.data.data;
					this.setState({
						'douamry': douamry
					})
				}
			},
			updata() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log("onCheckForUpdate", res.hasUpdate);
					if (res.hasUpdate) {
						uni.showToast({
							title: "即将有更新请留意",
						});
					}
				});
				updateManager.onUpdateReady(() => {
					uni.showModal({
						title: "更新提示",
						content: "新版本已经准备好，是否立即使用？",
						success: function(res) {
							if (res.confirm) {
								// 调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							} else {
								uni.showToast({
									icon: "none",
									title: "小程序下一次「冷启动」时会使用新版本",
								});
							}
						},
					});
				});
				updateManager.onUpdateFailed(() => {
					uni.showToast({
						title: "更新失败，下次启动继续...",
					});
				});
			},
			init() {
				config.userInfo = uni.getStorageSync('userInfo');
				var currTime = new Date().getTime();
				if (config.userInfo && config.userInfo.overtime > currTime) {
					config.token = config.userInfo.token;
					config.userId = config.userInfo.id;
					this.setState({
						token: config.token,
						userId: config.userId,
						userInfo: config.userInfo,
						phone: config.userInfo.phone,
						wxnum: config.userInfo.wxnum
					});
					return;
				} else {
					uni.login({}).then(data => {
						console.log(data);
						try {
							loginmini(self, data[1].code, null);
						} catch (e) {
							console.error(e);
							//TODO handle the exception
							uni.showToast({
								title: '错误!请关闭小程序重新打开',
								icon: 'none'
							});
						}
					});
				}
			}
		},
		onShow: function() {
			console.log('App Show');
			let options = uni.getLaunchOptionsSync();
			if (options.query.pid) {
				this.usershandn(options.query.pid);
			}
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	button:after {
		border: none;
	}

	.flex_text_center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fixed_bottom {
		position: fixed;
		bottom: 0;
		bottom: constant(safe-area-inset-bottom);
		bottom: env(safe-area-inset-bottom);
	}

	.chat_head_size {
		width: 72rpx;
		border-radius: 50%;
		height: 72rpx;
		flex-shrink: 0;
	}

	@keyframes scaleForever {
		from {
			transform: scale(1, 1);
		}

		to {
			transform: scale(1.1, 1.1);
		}
	}

	.scaleClass {
		background-size: 100% 100%;
		font-size: 44rpx;
		color: #FFFFFF;
		justify-content: center;
		align-items: center;
		width: 572rpx;
		height: 123rpx;
		margin-top: 32rpx;
		margin-bottom: 20rpx;
		animation: scaleForever 1s infinite alternate;
	}
</style>
