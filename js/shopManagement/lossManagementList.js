window.LossManageList = (function($, module) {
	var userInfo_zhuguan = null;
	var userInfo_kuguanShengchan = null;
	/**
	 * 初始化页面信息
	 */
	function init() {
		initUserInfo();
		initPageInfo();
	}
	/**
	 * 初始化数据
	 */
	function initPageInfo() {
		// 更新page信息
		var url = 'lossManage/queryLossInfoByPage';
		CommonUtils.getAjaxData({
			url : url,
			async : false,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'lossManagementPage',
				url : url,
				callback : showLossManageList
			}, data['page']);
			showLossManageList(data);
		});
	}
	/**
	 * 通过模板显示列表
	 */
	function showLossManageList(data) {
		transData(data);
		var html = template('lossManagementTemp', data);
		$("#tablelist").html("").html(html);
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();
	}
	/**
	 * 人员与时间数据显示的转换（）
	 */
	function transData(data) {
		if (data.lossTittles != undefined) {
			for (var i = 0; i < data.lossTittles.length; i++) {
				/*for (var j = 0; j < userInfo_kuguanShengchan.length; j++) {
					if (data.lossTittles[i].applyNameCode == userInfo_kuguanShengchan[j].userId) {
						data.lossTittles[i].applyNameCode = userInfo_kuguanShengchan[j].username;
					}
				}
				for (var j = 0; j < userInfo_zhuguan.length; j++) {
					if (data.lossTittles[i].checkNameCode == userInfo_zhuguan[j].userId) {
						data.lossTittles[i].checkNameCode = userInfo_zhuguan[j].username;
					}
				}*/
				if (!-[ 1, ]) {
					data.lossTittles[i].applyDate = new Date(
							data.lossTittles[i].applyDate.split(" ")[0])
							.toLocaleString().split(" ")[0];
				} else {
					data.lossTittles[i].applyDate = new Date(
							data.lossTittles[i].applyDate).toLocaleString()
							.split(" ")[0];
				}
				if (data.lossTittles[i].checkDate == ""
						|| data.lossTittles[i].checkDate == null) {
					data.lossTittles[i].checkDate = "未审核";
				} else {
					data.lossTittles[i].checkDate = new Date(
							data.lossTittles[i].checkDate).toLocaleString()
							.split(" ")[0];
				}
			}
		}
		return data;
	}
	/**
	 * 初始化用户的信息
	 */
	function initUserInfo() {
		/*
		 * $.ajax({ url : "user/userss", type : "GET", async : false, success :
		 * function(data) { userInfo = data.userList;// 获取所有的用户信息 } });
		 */
		
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
		// 填充两个下拉条件选择框
		if (!-[ 1, ]) {
			var select = document.getElementById("checkManCode");
			var option1 = document.createElement("option");
			option1.text = "请选择";
			option1.value = "";
			select.add(option1);
			for (var i = 0; i < userInfo_zhuguan.length; i++) {
				var option = document.createElement("option");
				option.text = userInfo_zhuguan[i].username;
				option.value = userInfo_zhuguan[i].userId;
				select.add(option);
			}
		} else {
			var dom = "<option value=''>请选择</option>";
			for (var i = 0; i < userInfo_zhuguan.length; i++) {
				dom += "<option value=" + userInfo_zhuguan[i].userId + ">"
						+ userInfo_zhuguan[i].username + "</option>"
			}
			document.getElementById("checkManCode").innerHTML = dom;
		}
		if (!-[ 1, ]) {
			var select = document.getElementById("applyManCode");
			var option1 = document.createElement("option");
			option1.text = "请选择";
			option1.value = "";
			select.add(option1);
			for (var i = 0; i < userInfo_kuguanShengchan.length; i++) {
				var option = document.createElement("option");
				option.text = userInfo_kuguanShengchan[i].username;
				option.value = userInfo_kuguanShengchan[i].userId;
				select.add(option);
			}
		} else {
			var dom = "<option value=''>请选择</option>";
			for (var i = 0; i < userInfo_kuguanShengchan.length; i++) {
				dom += "<option value=" + userInfo_kuguanShengchan[i].userId
						+ ">" + userInfo_kuguanShengchan[i].username
						+ "</option>"
			}
			document.getElementById("applyManCode").innerHTML = dom;
		}
	}

	module.init = init;
	return module;
}($, window.LossManageList || {}));
$(function() {
	LossManageList.init();
});
