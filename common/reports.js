import {config} from '@/common/lib/app.js'

function reportBrower() {
				let pages = getCurrentPages();
				let route = pages[pages.length - 1].is;
				console.log(route);
				this.$dio.dio('reports/browse/' + config.userInfo.id + '/' + config.appId, { pid: config.ttp, shareid: config.shareid, gdictkey: `${config.dictKey}_MODE`,path: route});
				//上报日志的同时 检验是否存在推广位
}

function ttReport(name,data){
	tt.reportAnalytics(name,data);
	console.log(name+" 上报" + JSON.stringify(data))
}


module.exports = {
  ttReport:ttReport,
	reportBrower:reportBrower
}
