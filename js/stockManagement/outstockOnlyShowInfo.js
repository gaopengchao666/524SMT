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
		 $(".time").each(function(i){
				$(".time").eq(i).html($(".time").eq(i).html().substr(0,10));
			});
		//二维码加载的时候，此方法在拼接内容之后
		/*$(".info_area td").hover(function() {
			$(this).parent().children().addClass("td_hover");
			$(this).append("<div class='twocode_hover'><img src="+$(this).parent().find("input").val() +" /></div>");
		}, function() {
			$(this).parent().children().removeClass("td_hover");
			$(".twocode_hover").remove();
		});*/
	}
	
	module.init = init; 
	return module;
}($, window.Material || {}));
$(function() {
	outstockOnlyShowInfo.init();
});
