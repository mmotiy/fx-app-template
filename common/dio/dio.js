import app from './dio_conf.js'
import {config} from '@/common/lib/app.js';

/***

@miss 默认flase -true 请求前检测是否带有token  包括检测本地缓存
@resFun(res) 响应后统一进行的操作函数 res 返回的结果 


***/
function dio(url,data,{header,method="GET",dataType,responseType,success,fail,complete,miss,resFun=app.resFun,isNot=true}={}){
	// detection(data,header)
	// console.log(header);
	
	var isurltf = urltf(url)

	if(!isurltf){
		url = app.url + url;
	}
	
	// if(!handle_request(url))return;
	return new Promise((resolve,reject)=>{
		if(miss){
			var token = uni.getStorageSync("token");
			if(!token){
				if(header && !header.token){
					debug("缓存没有token");
					resolve("缓存没有token");
					return;
				}
			}
		}
		
		var startTime = formatTime('H:i:s:U');  //请求开始时间
		header = handle_header(header);  //自动添加请求头
		console.log(url)
		uni.request({
			url:url,
			data:data,
			header:header,
			method:method,
			dataType:dataType,
			responseType:responseType,
			success(res){
				debug('请求成功',startTime,res);
				if(isNot){
					resFun(res);
				}
				if(success){
					success(res);
				}else{
					resolve(res);
				}
			},
			fail(res){
				debug('请求失败',startTime,res);
				if(isNot){
					resFun(res);
				}
				if(fail){
					fail(res);
				}else{
					resolve(res);
				}
			},
			complete(){
				complete&&complete();
			}
		});
	});
}

function post(url,data,{header,method="POST",dataType,responseType,success,fail,complete,miss,resFun=app.resFun}={}){
	var isurltf = urltf(url)
	
	if(!isurltf){
		url = app.url + url;
	}
	return new Promise((resolve,reject)=>{
		if(miss){
			var token = uni.getStorageSync("token");
			if(!token){
				debug('请求失败',"缓存没有token");
				resolve("缓存没有token");
				return;
			}
		}
		var startTime = formatTime('H:i:s:P');  //请求开始时间
		header = handle_header(header);  //自动添加请求头
		uni.request({
			url:url,
			data:JSON.stringify(data),
			header:header,
			method:method,
			dataType:dataType,
			responseType:responseType,
			success(res){
				debug('请求成功',startTime,res);
				resFun(res);
				if(success){
					success(res);
				}else{
					resolve(res);
				}
			},
			fail(res){
                debug('请求失败',startTime,res);
				resFun(res);
				if(fail){
					fail(res);
				}else{
					resolve(res);
				}
			},
			complete(){
				
				complete&&complete();
			}
		});
	});
}

async function downloadFile(url,data){
	return new Promise((resolve,reject)=>{
		var header = {
			'content-type': 'application/json',
		}
		if(config.token && config.userId){
			header.Authorization = config.token;
			header.UID = config.userId;
		}
		uni.downloadFile({
			url:app.url + url,
			data:data || '',
			header:header,
			success(res) {
				resolve(res);
			},
			fail(e) {
				reject(e);
			}
		})
	});
}


async function uploadFile(url,data){
	return new Promise((resolve,reject)=>{
		var header = {
			
		}
		if(config.token && config.userId){
			header.Authorization = config.token;
			header.UID = config.userId;
		}
		uni.uploadFile({
			url: app.url + url,
			header:header,
			filePath: data,
			name: 'file',
			success: (uploadFileRes) => {
				resolve(uploadFileRes);
			},
			fail(e) {
				reject(e);
			}
		});
	});
	
}


//打印数据
function debug(status,startTime,res){
	if(app.debug){
		console.log("****** Request Start",startTime,"******");
		console.log(status,res || '没有数据');
		console.log("****** Request End",formatTime('H:i:s:U'),"******");
	}
}
//处理头部信息，有token自动添加token
function handle_header(header){
	var token,userId;
	if(config.token){
		token = config.token;
	}else{
		token = uni.getStorageSync("token");
		if(!token)return header;
	}
	
	// console.log(token);
	userId = config.userId;
	if(header){
		if(header.Authorization){
			
		}else{
			header.Authorization = token;
			header.UID = userId;
		}
	}else{
		header={
			Authorization:token,
			UID:userId
		}
	}
	return header;
}

//请求数据前 执行检测
function handle_request(url,data){
	
	var msg=null;
	if(isURL(url)){
		// console.log("IP 正常");
		msg = true
	}else{
		console.log("请检查IP是否正常",url);
		msg = false;
	}
	return msg
}

function urltf(str_url){
	var strRegex = '^((https|http|ftp|rtsp|mms)?://)';
	var re=new RegExp(strRegex);
	if (re.test(str_url)){
	    return (true);
	}else{
	    return (false);
	}
}

function isURL(str_url){
	console.log("变量嗡嗡嗡",str_url)
    var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            +'?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp的user@
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*()-]+.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,4})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$';
    var re=new RegExp(strRegex);
    if (re.test(str_url)){
        return (true);
    }else{
        return (false);
    }
}

// 处理时间
function formatTime(format, timestamp){  
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date()); 
    var pad = function(n, c){ 
        if((n = n + "").length < c){ 
            return new Array(++c - n.length).join("0") + n; 
        } else { 
            return n; 
        } 
    }; 
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"}; 
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
    var f = { 
        // Day 
        d: function(){return pad(f.j(), 2)}, 
        D: function(){return f.l().substr(0,3)}, 
        j: function(){return jsdate.getDate()}, 
        l: function(){return txt_weekdays[f.w()]}, 
        N: function(){return f.w() + 1}, 
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'}, 
        w: function(){return jsdate.getDay()}, 
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0}, 
        
        // Week 
        W: function(){ 
            var a = f.z(), b = 364 + f.L() - a; 
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1; 
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){ 
                return 1; 
            } else{ 
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){ 
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31"); 
                    return date("W", Math.round(nd2.getTime()/1000)); 
                } else{ 
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); 
                } 
            } 
        }, 
        
        // Month 
        F: function(){return txt_months[f.n()]}, 
        m: function(){return pad(f.n(), 2)}, 
        M: function(){return f.F().substr(0,3)}, 
        n: function(){return jsdate.getMonth() + 1}, 
        t: function(){ 
            var n; 
            if( (n = jsdate.getMonth() + 1) == 2 ){ 
                return 28 + f.L(); 
            } else{ 
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){ 
                    return 31; 
                } else{ 
                    return 30; 
                } 
            } 
        }, 
        
        // Year 
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0}, 
        //o not supported yet 
        Y: function(){return jsdate.getFullYear()}, 
        y: function(){return (jsdate.getFullYear() + "").slice(2)}, 
        
        // Time 
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"}, 
        A: function(){return f.a().toUpperCase()}, 
        B: function(){ 
            // peter paul koch: 
            var off = (jsdate.getTimezoneOffset() + 60)*60; 
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off; 
            var beat = Math.floor(theSeconds/86.4); 
            if (beat > 1000) beat -= 1000; 
            if (beat < 0) beat += 1000; 
            if ((String(beat)).length == 1) beat = "00"+beat; 
            if ((String(beat)).length == 2) beat = "0"+beat; 
            return beat; 
        }, 
        g: function(){return jsdate.getHours() % 12 || 12}, 
        G: function(){return jsdate.getHours()}, 
        h: function(){return pad(f.g(), 2)}, 
        H: function(){return pad(jsdate.getHours(), 2)}, 
        i: function(){return pad(jsdate.getMinutes(), 2)}, 
        s: function(){return pad(jsdate.getSeconds(), 2)}, 
        //u not supported yet 
        
        // Timezone 
        //e not supported yet 
        //I not supported yet 
        O: function(){ 
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4); 
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t; 
            return t; 
        }, 
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))}, 
        //T not supported yet 
        //Z not supported yet 
        
        // Full Date/Time 
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()}, 
        //r not supported yet 
        U: function(){return Math.round(jsdate.getTime()/1000)},
		u: function(){return Math.round(jsdate.getTime())}
    }; 
    var ret;   
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){ 
        if( t!=s ){ 
            // escaped 
            ret = s; 
        } else if( f[s] ){ 
            // a date function exists 
            ret = f[s](); 
        } else{ 
            // nothing special 
            ret = s; 
        } 
        return ret; 
    }); 
}


export default {
	dio,
	post,
	config,
	app,
	formatTime,
	downloadFile,
	uploadFile
} 