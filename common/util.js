const CryptoJS = require('./lib/aes.js');
import {config} from '@/common/lib/app.js';
import qiniuUploader from '@/common/lib/qiniuUploader.js';

function dataformt(date){
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
  
}

function formatTime(format, timestamp) {
    var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
    var pad = function(n, c) {
        if ((n = n + "").length < c) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    };
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    var f = {
        // Day 
        d: function() {
            return pad(f.j(), 2)
        },
        D: function() {
            return f.l().substr(0, 3)
        },
        j: function() {
            return jsdate.getDate()
        },
        l: function() {
            return txt_weekdays[f.w()]
        },
        N: function() {
            return f.w() + 1
        },
        S: function() {
            return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
        },
        w: function() {
            return jsdate.getDay()
        },
        z: function() {
            return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
        },

        // Week 
        W: function() {
            var a = f.z(),
                b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                return 1;
            } else {
                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime() / 1000));
                } else {
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month 
        F: function() {
            return txt_months[f.n()]
        },
        m: function() {
            return pad(f.n(), 2)
        },
        M: function() {
            return f.F().substr(0, 3)
        },
        n: function() {
            return jsdate.getMonth() + 1
        },
        t: function() {
            var n;
            if ((n = jsdate.getMonth() + 1) == 2) {
                return 28 + f.L();
            } else {
                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                    return 31;
                } else {
                    return 30;
                }
            }
        },

        // Year 
        L: function() {
            var y = f.Y();
            return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
        },
        //o not supported yet 
        Y: function() {
            return jsdate.getFullYear()
        },
        y: function() {
            return (jsdate.getFullYear() + "").slice(2)
        },

        // Time 
        a: function() {
            return jsdate.getHours() > 11 ? "pm" : "am"
        },
        A: function() {
            return f.a().toUpperCase()
        },
        B: function() {
            // peter paul koch: 
            var off = (jsdate.getTimezoneOffset() + 60) * 60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() +
                off;
            var beat = Math.floor(theSeconds / 86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00" + beat;
            if ((String(beat)).length == 2) beat = "0" + beat;
            return beat;
        },
        g: function() {
            return jsdate.getHours() % 12 || 12
        },
        G: function() {
            return jsdate.getHours()
        },
        h: function() {
            return pad(f.g(), 2)
        },
        H: function() {
            return pad(jsdate.getHours(), 2)
        },
        i: function() {
            return pad(jsdate.getMinutes(), 2)
        },
        s: function() {
            return pad(jsdate.getSeconds(), 2)
        },
        //u not supported yet 

        // Timezone 
        //e not supported yet 
        //I not supported yet 
        O: function() {
            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
            else t = "+" + t;
            return t;
        },
        P: function() {
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2))
        },
        //T not supported yet 
        //Z not supported yet 

        // Full Date/Time 
        c: function() {
            return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
        },
        //r not supported yet 
        U: function() {
            return Math.round(jsdate.getTime() / 1000)
        }
    };
    var ret;
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
        if (t != s) {
            // escaped 
            ret = s;
        } else if (f[s]) {
            // a date function exists 
            ret = f[s]();
        } else {
            // nothing special 
            ret = s;
        }
        return ret;
    });
}

var key = CryptoJS.enc.Utf8.parse("hbE0MmHbhdE3wBav");
var iv = CryptoJS.enc.Utf8.parse('tEJksWqSUzAeAN2Q');

function Encrypt(word) { //加密
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString().toUpperCase();
    //toString()  转字符串   toUpperCase()  转换成大写
}

function Decrypt(word) { //解密
    var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

async function sleep(time) {
    return new Promise((resovle, reject) => {
        setTimeout(_ => resovle('ok'), time)
    })
}

function getQueryString(name, location) {
    // #ifdef H5
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    if (location) {
        var r = location.match(reg);
    } else {
        var r = window.location.search.substr(1).match(reg);
    }
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
    // #endif

}

function savefile(data,encoding,filePath) {
    
    if(!filePath){
        // #ifdef MP-WEIXIN
        filePath = wx.env.USER_DATA_PATH + '/csQrCode_' + Date.now() + '.png'
        // #endif
    }
    console.log(filePath)
    let fileManager = uni.getFileSystemManager();
    fileManager.writeFile({
        data: data,
        encoding: encoding,
        filePath: filePath,
        success: data => {
            console.log(data)
            uni.saveImageToPhotosAlbum({
                filePath: filePath,
                success: function() {
                    uni.showToast({
                        icon: 'none',
                        title: '保存成功！'
                    })
                },
                fail: console.error
            })
        }
    })
}
async function localImageUrl(url){
	return new Promise((resolve,reject)=>{
		uni.downloadFile({
			url:url,
			success:(res)=>{
				console.log(res)
				resolve(res)
			},
			fail:reject
		})
	})
}

function showToast(msg,icon){
	uni.showToast({
		icon:icon ||'none',
		title:msg
	});
}

function deepCopy(target){ 
    let copyed_objs = [];//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
    function _deepCopy(target){ 
        if((typeof target !== 'object')||!target){return target;}
        for(let i= 0 ;i<copyed_objs.length;i++){
            if(copyed_objs[i].target === target){
                return copyed_objs[i].copyTarget;
            }
        }
        let obj = {};
        if(Array.isArray(target)){
            obj = [];//处理target是数组的情况 
        }
        copyed_objs.push({target:target,copyTarget:obj}) 
        Object.keys(target).forEach(key=>{ 
            if(obj[key]){ return;} 
            obj[key] = _deepCopy(target[key]);
        }); 
        return obj;
    } 
    return _deepCopy(target);
}

function isNewPeople(){
	var time = new Date().getTime();
	console.log(config.curDay,time,time-config.curDay)
	if(config.curDay){
		if(time - config.curDay > 86400){
			return false;
		}else{
			return true;
		}
	}else{
		return false;
	}
}

async function upload(arr,index,{schedule=function(res){console.log(res)}}={}){  //上传图片七牛云
	// that.imgList.push({key:dio.formatTime('Ymdu')+res.tempFilePaths[i].split('//')[1],src:res.tempFilePaths[i]})
	// [{key:this.$util.formatTime('Ymdu')}]
	var that = this;
	return new Promise((reslove,resject)=>{
		if(arr.length>index){
			qiniuUploader.upload(arr[index].src, (res) => {
				console.log("上传图片的后的结果：",res,index);
				arr[index] = 'http://'+res.imageURL;
				reslove(that.upload(arr,index+1));
				// return;
			}, (error) => {
				var a = JSON.stringify(error);
				that.showToast(a);
				reslove({code:101,data:a});
			}, {
				region: 'SCN',
				domain: 'create.adota.cn', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
				key: arr[index].key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
				// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
				uptokenURL:'https://www.adota.cn/wxpro/qiniu/token60s'
				// uptokenURL:'http://192.168.0.110:8084/qiniu/token60s'
			},schedule);
		}else{
			reslove({code:0,data:arr});
		}
	});
}
const roundStrBase = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function roundStr(len){
	let str = ""
	for(let i=len;len-->0;){
		let index = Math.floor(Math.random()*roundStrBase.length)
		str+=roundStrBase[index]
	}
	return str
}

function compareVersion(curV,reqV){
   if(curV && reqV){
      //将两个版本号拆成数字
      var arr1 = curV.split('.'),
          arr2 = reqV.split('.');
      var minLength=Math.min(arr1.length,arr2.length),
          position=0,
          diff=0;
      //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
      while(position<minLength && ((diff=parseInt(arr1[position])-parseInt(arr2[position]))==0)){
          position++;
      }
      diff=(diff!=0)?diff:(arr1.length-arr2.length);
      //若curV大于reqV，则返回true
      return diff>0;
   }else{
      //输入为空
      console.log("版本号不能为空");
      return false;
   }
}
module.exports = {
    formatTime: formatTime,
    Encrypt: Encrypt, //加密
    Decrypt: Decrypt, //解密
    sleep: sleep,
    getQueryString: getQueryString,
    savefile:savefile,
    localImageUrl:localImageUrl,
    dataformt:dataformt,
	showToast:showToast,
	deepCopy:deepCopy,
	isNewPeople:isNewPeople,
	upload:upload,
	roundStr:roundStr,
	compareVersion:compareVersion
}
