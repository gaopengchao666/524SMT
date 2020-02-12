window.LossManageList = (function($, module) {
	userInfo_zhuguan = null;
	userInfo_kuguanShengchan = null;
	/**
	 * 初始化页面信息
	 */
	function init() {
		//initUserInfo();
		initPageInfo();
	}
	function initPageInfo() {
		var id = document.getElementById("lossTittle").value;
		// 更新page信息
		var url = 'lossManage/queryLossDetailsByPage?id=' + id;
		CommonUtils.getAjaxData({
			url : url,
			async : false,
			dataType : "json",
			type : 'POST'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'lossDetailsPage',
				url : url,
				callback : showLossDetails
			}, data['page']);
			showLossDetails(data);
		});
	}
	// 显示数据
	function showLossDetails(data) {
		data = transData(data);
		var html = template('lossDetailsTemp', data);
		$("#tablelist").html("").html(html);
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();
	}
	/**
	 * 人员与时间数据转换
	 */
	function transData(data) {
		var applyNameCode = document.getElementById("applyNameCode");
		var checkNameCode = document.getElementById("checkNameCode");
		/*for (var j = 0; j < userInfo_kuguanShengchan.length; j++) {
			if (applyNameCode.value == userInfo_kuguanShengchan[j].userId) {
				applyNameCode.value = userInfo_kuguanShengchan[j].username;
			}
		}
		for (var j = 0; j < userInfo_zhuguan.length; j++) {
			if (checkNameCode.value == userInfo_zhuguan[j].userId) {
				checkNameCode.value = userInfo_zhuguan[j].username;
			}
		}*/
		// 处理时间
		var applyDate = document.getElementById("applyDate");
		var checkDate = document.getElementById("checkDate");
		if (!-[ 1, ]) {
			applyDate.value = applyDate.value.split(" ")[0]
		} else {
			applyDate.value = new Date(applyDate.value).toLocaleString().split(
					" ")[0];
			checkDate.value = new Date(checkDate.value).toLocaleString();
		}

		if (checkDate.value == "" || checkDate.value == "Invalid Date"
				|| checkDate.value == "NaN") {
			checkDate.value = "未审核";
		} else {
			checkDate.value = checkDate.value.split(" ")[0];
		}
		return data;
	}
	function initUserInfo() {
		$.ajax({
			url : "lossManage/getUserInfoZg",
			type : "GET",
			async : false,
			success : function(data) {
				userInfo_zhuguan = data.userInfo;// 获取具有车间主管权限的用户信息-1000000005
			}
		});
		$.ajax({
			url : "lossManage/getUserInfoKgSc",
			type : "GET",
			async : false,
			success : function(data) {
				userInfo_kuguanShengchan = data.userInfo;// 获取具有车间库管与生产人员权限组-1000000006，1000000007
			}
		});
	}

	module.init = init;
	return module;
}($, window.LossManageList || {}));
$(function() {
	LossManageList.init();
});
