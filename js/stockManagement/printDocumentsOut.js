window.outstockOnlyShowInfo = (function($, module) {
	var outstockOrderId=$("#outstockOrderId").val();
	var outstockDate = $("#outstockDate").val().substr(0,10);
	function init(){
		if($(".operate_area").attr("id") == 1){
			$(".operate_area").html("");
		}
		query();
		$("#outstockDate").val(outstockDate);
	} 
	function query	(){
		$.ajax({
			url : "outstock/selectOutstockSaveDetail?outstockOrderId="+outstockOrderId,
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
		var url = "outstock/selectOutstockSaveDetail?outstockOrderId="+outstockOrderId;
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
	
	function printOutstockOrder() {
		$.ajax({
			url : "outstock/printOutstockOrder",
			type : "POST",
			data : $("#printForm").serialize(),
			async : false,
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = url_Pre+"outstock/toOutstockListJSP";
				}
			}
		});
	
	}
	
	
	module.init = init; 
	module.printOutstockOrder = printOutstockOrder;
	return module;
}($, window.Material || {}));
$(function() {
	outstockOnlyShowInfo.init();
});
