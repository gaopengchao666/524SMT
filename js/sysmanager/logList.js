$(function() {
	$.ajax({
		url : "log/selectAllLogs",
		type : "GET",
		datatype : "json",
		cache : false,
		success : function(data) {
			showLogList(data);
			initPageInfo(data);
		}
	});
});

/**
 * 初始化分页信息
 */
function initPageInfo(data) {
	var url = 'log/selectAllLogs';
	CommonUtils.getAjaxData({
		url : url,
		type : 'GET'
	}, function(data) {
		PageUtils.refreshPageInfo({
			element : 'logPage',
			url : url,
			callback : showLogList
		}, data['page']);
	});
}

// 显示盘点计划
function showLogList(data) {
	_LogTab = $("#logList");
	_LogTab.html("");
	var datas = data['operationLogList'];
	$
			.each(
					datas,
					function(item, obj) {
						var dom = "";
						dom += "<tr class='contentText list_list'>";
						dom += "<td>" + obj.userLoginName + "</td>";
						dom += "<td>" + obj.logModule + "</td>";
						dom += "<td>" + obj.logMethod + "</td>";
						dom += "<td>" + obj.logCommite + "</td>";
						dom += "<td class='time'>" + obj.logDate + "</td>";
						dom += "<td>" + obj.logLevel + "</td>";
						dom += "</tr>";
						_LogTab.append(dom);
					});
	/*$("tbody tr:odd").css("background", "#EBF5FF");*/
	// ie8隔行变色
    CommonUtils.ie8TrChangeColor();
	$(".time").each(function(i){
		$(".time").eq(i).html($(".time").eq(i).html().substr(0,10));
	});
}
