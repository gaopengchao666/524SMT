// 告警提示框
var tag = false;
var warningPageNow = 0;

window.setInterval(function() {
	var warningType = document.getElementById("warningType");
	var warningInfo = document.getElementById("warningInfo");
	if (tag) {
		tag = false;
		$(".warning").css("display", "none");
	} else {
		$.ajaxSetup({
			cache : false
		});
		$.ajax({
			url : "/warningArea/warningData?warningPageNow=" + warningPageNow,
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				if (data.alarmData != undefined) {
					if (data.alarmData.typeName == "湿度指标异常告警"
							|| data.alarmData.typeName == "温度指标异常告警") {
						warningType.innerHTML = "车间"+data.alarmData.typeName;
						warningInfo.innerHTML = "";
					} else {
						warningType.innerHTML = data.alarmData.typeName;
						var dom = "";
						dom += "工单：" + data.alarmData.planNumber + "-"
								+ data.alarmData.graphNumber + "生产出现异常";
						if (data.alarmData.taskName != null
								&& data.alarmData.taskName != "null") {
							dom += "。工序：" + data.alarmData.taskName;
						}
						dom += "。请注意！";
						warningInfo.innerHTML = dom;
					}
					tag = true;
					$(".warning").css("display", "block");
				}
				warningPageNow -= 1;
				if (warningPageNow < 0) {
					warningPageNow = data.pageCount || 0;
				}
			}
		});
	}
}, 5000);
$(function() {
	// 初始化页面大小信息
	$.ajaxSetup({
		cache : false
	});
	$.ajax({
		url : "/warningArea/warningCount",
		type : "GET",
		datatype : "json",
		cache : false,
		async : false,
		success : function(data) {
			warningPageNow = data;
		}
	});
});