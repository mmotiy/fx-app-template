// created by gpake
import {config as config1} from './app.js';

(function() {

var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null,
    qiniuShouldUseQiniuFileName: false
}

module.exports = {
    init: init,
    upload: upload,
}

// 在整个程序生命周期中，只需要 init 一次即可
// 如果需要变更参数，再调用 init 即可
function init(options) {
    config = {
        qiniuRegion: '',
        qiniuImageURLPrefix: '',
        qiniuUploadToken: '',
        qiniuUploadTokenURL: '',
        qiniuUploadTokenFunction: null,
        qiniuShouldUseQiniuFileName: false
    };
    updateConfigWithOptions(options);
}

function updateConfigWithOptions(options) {
    if (options.region) {
        config.qiniuRegion = options.region;
    } else {
        console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
        config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
        config.qiniuUploadTokenURL = options.uptokenURL;
    } else if(options.uptokenFunc) {
        config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
        config.qiniuImageURLPrefix = options.domain;
    }
    config.qiniuShouldUseQiniuFileName = options.shouldUseQiniuFileName
}

function upload(filePath, success, fail, options, progress, cancelTask, before, complete) {
    if (null == filePath) {
        console.error('qiniu uploader need filePath to upload');
        return;
    }
    if (options) {
      updateConfigWithOptions(options);
    }
    if (config.qiniuUploadToken) {
        doUpload(filePath, success, fail, options, progress, cancelTask, before, complete);
    } else if (config.qiniuUploadTokenURL) {
        getQiniuToken(function() {
            doUpload(filePath, success, fail, options, progress, cancelTask, before, complete);
        },fail);
    } else if (config.qiniuUploadTokenFunction) {
        config.qiniuUploadToken = config.qiniuUploadTokenFunction();
        if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
            console.error('qiniu UploadTokenFunction result is null, please check the return value');
            return
        }
        doUpload(filePath, success, fail, options, progress, cancelTask, before, complete);
    } else {
        console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
        return;
    }
}

function doUpload(filePath, success, fail, options, progress, cancelTask, before, complete) {
    if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
        console.error('qiniu UploadToken is null, please check the init config or networking');
        return
    }
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
        fileName = options.key;
    }
    var formData = {
        'token': config.qiniuUploadToken
    };
    if (!config.qiniuShouldUseQiniuFileName) {
      formData['key'] = fileName
    }
    before && before();
    var uploadTask = uni.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        formData: formData,
        success: function (res) {
			var dataString = res.data;
			try{
				var dataObject = JSON.parse(dataString);
				// //do something
				var fileUrl = config.qiniuImageURLPrefix + '/' + dataObject.key;
				dataObject.fileUrl = fileUrl
				dataObject.imageURL = fileUrl;
				if (success) {
				  success(dataObject);
				}
			}catch(e){
				//TODO handle the exception
				console.log(e);
				console.log('parse JSON failed, origin String is: ' + dataString)
				if (fail) {
				  fail(e);
				}
			}
        },
        fail: function (error) {
            console.error(error);
            if (fail) {
                fail(error);
            }
        },
        complete: function(err) {
			config.qiniuUploadToken = null;
            complete && complete(err);
        }
    })

    uploadTask.onProgressUpdate((res) => {
        progress && progress(res)
    })

    cancelTask && cancelTask(() => {
        uploadTask.abort()
    })
}

function getQiniuToken(callback,fail) {  //获取token
  uni.request({
    url: config.qiniuUploadTokenURL,
	header:{Authorization:config1.token},
	data:{bucket:"wegames"},
    success: function (res) {
		console.log("获取token",res);
      var token = res.data.data;
      if (token && token.length > 0) {
        config.qiniuUploadToken = token;
        if (callback) {
            callback();
        }
      } else {
        console.error('qiniuUploader cannot get your token, please check the uptokenURL or server')
		fail('qiniuUploader cannot get your token, please check the uptokenURL or server');
      }
    },
    fail: function (error) {
      console.error('qiniu UploadToken is null, please check the init config or networking: ' + JSON.stringify(error));
	  fail(error);
    }
  })
}

function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch(code) {
        case 'ECN': uploadURL = 'https://up.qiniup.com'; break;
        case 'NCN': uploadURL = 'https://up-z1.qiniup.com'; break;
        case 'SCN': uploadURL = 'https://up-z2.qiniup.com'; break;
        case 'NA': uploadURL = 'https://up-na0.qiniup.com'; break;
        case 'ASG': uploadURL = 'https://up-as0.qiniup.com'; break;
        default: console.error('please make the region is with one of [ECN, SCN, NCN, NA, ASG]');
    }
    return uploadURL;
}

})();