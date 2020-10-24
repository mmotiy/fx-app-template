const app = {
    // url: 'https://www.adota.cn/wxtest/',
    url: 'https://www.adota.cn/wxpro/',
    // url: 'https://www.adota.cn/wxbeta/',
    // url: 'http://192.168.0.133:8084/',
    
    debug: false, // true 打印返回数据
    resFun: function(res) {
        if (res.statusCode == 200) {
            if (res.data) {
				console.log('链接成功');
            } else {
                uni.showToast({
                    title: res.errMsg,
                    icon: 'none'
                });
            }
        } else {
            uni.showToast({
                title: '网络异常,请检查网络状况',
                icon: 'none'
            });
        }

    }, //响应数据拦截器
}


export default app

