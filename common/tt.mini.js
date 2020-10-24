import {
  config
} from '@/common/lib/app.js'
import dio from '@/common/dio/dio.js'
import util from '@/common/util.js'
var appid = config.appId
/* 获取用户的授权信息 */
function loginmininormal(self, {
  encryptedData,
  signature,
  iv,
  inviteCode
}) {
  dio.post('users/login/tt', {
    encryptedData,
    iv,
    inviteCode
  }).then(data => {
    console.log(data)
    let userInfo = data.data.data
    let status = data.data.status
    if (status !== 200) {
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
      return;
    }
    let {
      token,
      id
    } = data.data.data
    config.token = token
    config.userId = id
    config.userInfo = data.data.data
    uni.setStorageSync('token', token)
    uni.setStorageSync('userid', id)
    uni.setStorageSync('userInfo', data.data.data)
    self.setState({
      token: token,
      userId: id,
      userInfo: config.userInfo,
      phone: config.userInfo.phone,
      wxnum: config.userInfo.wxnum
    })
    uni.$emit('loginmininormal-ok', data.data)
  }).catch(err => {
    console.error(err)
    uni.showToast({
      title: '登陆失败',
      icon: 'none'
    })
  })
}

/* 临时标记用户 */
function loginmini(self, code, inviteCode) {
  dio.dio('users/login/tt/temp', {
      code,
      inviteCode,
      appid,
      tempUser: true
    })
    .then(data => {
      if (data.data.status === 200) {
        //初始化用户信息 写入本地
        let {
          token,
          id
        } = data.data.data
        config.token = token
        config.userId = id
        config.userInfo = data.data.data
        uni.setStorageSync('token', token)
        uni.setStorageSync('userid', id)
        uni.setStorageSync('userInfo', data.data.data)
        self.setState({
          token: token,
          userId: id,
          userInfo: config.userInfo,
          phone: config.userInfo.phone,
          wxnum: config.userInfo.wxnum
        })
        uni.$emit('login-temp-ok', data.data)
		getsysteminfo()
      }
    })
    .catch(err => {
      console.error(err)
      uni.showToast({
        title: '初始化失败',
        icon: 'none'
      })
    });
}

function getsysteminfo(){
	console.log('getsysteminfo');
	uni.getSystemInfo({
		success(res) {
			dio.post('brand',res).then(data=>{
				if(data.data.status === 200 ){
					console.log('getsysteminfo:',res);
				}
			})
		}
	})
}

async function checkOrder(self, tradeNo, num, success) {
  if (num > 6) {
    uni.hideLoading();
    uni.showToast({
      title: '查询支付结果超时',
      icon: 'none'
    });
    return;
  }
  if (!num) {
    uni.showLoading({
      title: '加载中'
    });
  }
  dio.dio('pay/check-trade', {
      tradeNo: tradeNo
    })
    .then(async data => {
      if (data.data.status === 200 || data.data.status === 403) {
        console.log('checkOrder');
        console.log(data.data.data);
        if (data.data.data) {
          let code = data.data.data
          success({
            tradeNo,
            code
          })
          uni.hideLoading()
          return;
        } else if (data.data.status === 403) {
          uni.hideLoading();
          return;
        }
      } else if (data.data.status === 402) {
        console.log('订单生成失败~');
        uni.hideLoading();
        return;
      } else {
        await util.sleep(1000);
        if (num) {
          checkOrder(self, tradeNo, ++num, success);
        } else {
          checkOrder(self, tradeNo, 1, success);
        }
      }
    })
    .catch(err => {
      console.error(err);
      uni.hideLoading();
    });
}

function loggerShare(){
    let pages = getCurrentPages()
    let path = pages[pages.length-1].is
	if (!config.threadId) {
		config.threadId = uni.getStorageSync('threadId')
	}
	if (!config.share2id) {
		config.share2id = uni.getStorageSync('share2id')
	}
    dio.dio(`reports/${config.appId}/share-logger`,{path:path,pid:config.threadId,ttid:config.share2id})
}

async function payOneType(type, requestCode, callback, erroback) {
  //测试数据

  try {
    let requestInfo = await dio.dio(`pay/requestInfo`, JSON.parse(JSON.stringify({
      requestCode: requestCode,
      ttp: config.ttp || config.threadId,
      shareid: config.shareid
    })));
    if (!requestInfo.data.data) {
      return new Promise((resovle, reject) => reject('requestInfo no data'));
    }
    let aliparam = requestInfo.data.data.appletParams
    console.log(requestInfo)
    aliparam = JSON.parse(aliparam);
    console.log(aliparam);
    let aliparamv1 = JSON.parse(aliparam['1.0']);
    let aliparamv2 = JSON.parse(aliparam['2.0']);
    console.log(aliparamv1);
    console.log(aliparamv2);

    let nonceStr = util.roundStr(16);
    let [error, payment] = await uni.requestPayment({
      provider: 'toutiao',
      orderInfo: aliparamv2,
      service: 1,
      getOrderStatus(res) {
        let {
          out_order_no
        } = res;
        console.log(res)
        /**
         * @param {Object} resolve
         * @param {Object} reject0：支付成功
         *   1：支付超时
         *   2：支付失败
         *   3：支付关闭
         *   9：订单状态未知
         */
        return new Promise(function(resolve, reject) {
          // 商户前端根据 out_order_no 请求商户后端，查询当前订单的支付状态
          dio.dio("pay/check-out-trade", {
            outTradeNo: out_order_no
          }).then(data => {
            if (data.data.data === 1) {
              resolve(0)
            } else {
              resolve(2)
            }
          }).catch(err => reject)
        });
      }
    });
    console.log(payment)
    let {
      code
    } = payment
    payment.tradeNo = requestInfo.data.data.tradeNo;
    if (callback) {
      callback(payment)
      return;
    } else {
      return [null, payment];
    }
    if (error) {
      if (erroback) {
        erroback(error)
      } else {
        return [error, payment];
      }
      console.error(error);
      return;
    }
  } catch (e) {
    //TODO handle the exception
    console.error(e);
    if (erroback) {
      erroback(e)
    } else {
      return [e, null]
    }

  }
}

/**
 * 判断当前用户是否存在推广ID
 */
async function haveibind(self) {
  let rs = await dio.dio("users/haveibind")
  if (rs.data.status === 200 && rs.data.data) {
    uni.setStorageSync('threadId', rs.data.data)
    config.threadId = rs.data.data
    if (self) {
      self.setState({
        threadId: config.threadId
      })
    }
    return rs.data.data;
  } else {
    let threadId = uni.getStorageSync('threadId')
    if (threadId) {
      config.threadId = threadId
      self.setState({
        threadId: config.threadId
      })
    }
  }
  return;
}

function shareParam(shareOption) {
	if (!config.threadId) {
		config.threadId = uni.getStorageSync('threadId')
	}
	if(!config.share2id){
		config.share2id = uni.getStorageSync('share2id')
	}
	let path = `${config.dynamicShareParam.shareUrl}?pid=${config.threadId}&dictKey=${config.dictKey}&ttid=${config.share2id || config.userId }`
	console.log(path)
	return {
		channel: shareOption.channel,
		title: config.dynamicShareParam.title,
		imageUrl: config.dynamicShareParam.imageUrl,
		path: path,
		templateId:config.dynamicShareParam.templateId,
		extra: {
			videoTopics: config.dynamicShareParam.topics // 只有抖音支持该属性
		}
	}
}

async function ttantidirt(...words) {
  let rs = await dio.dio('xingming/ttAntidirtSimple', {
    ttAntidirt: words.join(",")
  },{isNot:false})
  if(!rs.data){
    return false;
   }
  if (rs.data.status === 200) {
    if (rs.data.data) {
      uni.showToast({
        title: '因相关法律和要求,相关结果不予展示',
        icon: 'none'
      })
      return false;
    }
    return true;
  } else {
    uni.showToast({
      title: '请重新尝试~',
      icon: 'none'
    })
    return false;
  }
}

function vid(id){
	console.log(config.pid);
	dio.dio('video/vid',{goodsId:id,shareid:config.shareid,pid:config.ttp}).then(r=>{
		if(r.data){
			let {status,message,data} = r.data;
			if(status == 200){
				config.vid = data;
			}
		}
	});
}
function consumption(){
	dio.dio('video/consumption',{encryption:config.vid}).then(r=>{
		config.vid = null;
	});
}

async function ttantidirtimage(images){
	console.log(images);
	let rs = await dio.post('xingming/ttAntidirtSimple-image', 
		images
	)
	if (rs.data.status === 200) {
	  if (rs.data.data) {
	    uni.showToast({
	      title: '因相关法律和要求,相关结果不予展示',
	      icon: 'none'
	    })
	    return false;
	  }
	  return true;
	} else {
	  uni.showToast({
	    title: '请重新尝试~',
	    icon: 'none'
	  })
	  return false;
	}
}


module.exports = {
  loginmini: loginmini,
  loginmininormal: loginmininormal,
  payOneType: payOneType,
  checkOrder: checkOrder,
  haveibind: haveibind,
  loggerShare: loggerShare,
  shareParam: shareParam,
  ttantidirt: ttantidirt,
  vid:vid,
  consumption:consumption,
  ttantidirtimage:ttantidirtimage
}
