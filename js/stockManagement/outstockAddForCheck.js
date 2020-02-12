window.outstockOnlyShowInfo = (function($, module) {
	var outstockOrderId=$("#outstockOrderId").val();
	var outstockDate = $("#outstockDate").val().substr(0,10);
	function init(){
		query();
		$("#outstockDate").val(outstockDate);
	} 
	function query	(){
		$.ajax({
			url : "outstock/getOutstockApplyDetails?outstockOrderId="+outstockOrderId,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showOutstockApplyDetailList(data);
				initPageInfo(data);
			}
		});
	}
	function initPageInfo(data) {
		var url = "outstock/getOutstockApplyDetails?outstockOrderId="+outstockOrderId;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'outstockDetailPage',
				url : url,
				callback : showOutstockApplyDetailList
			}, data['page']);
		});
	}
	
	// 显示所有出库申请详情的列表
	function showOutstockApplyDetailList(data) {
		
		var html = template('outstockApplyDetailTemp', data);
		$("#tablelist").html("").html(html);
		CommonUtils.ie8TrChangeColor();
	}
	
	module.init = init; 
	return module;
}($, window.Material || {}));
$(function() {
	outstockOnlyShowInfo.init();
});
