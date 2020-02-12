window.machineLossOnlyShowInfo = (function($, module) {
	var machineLossId=$("#machineLossId").val();
	var applyDate = $("input[name='applyDate']").val().substr(0,10);
	function init(){
		query();
		$("input[name='applyDate']").val(applyDate);
	} 
	
	function query	(){
		$.ajax({
			url : "machineloss/getMachineLossDetails?machineLossId="+machineLossId,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showMachineLossDetailList(data);
				initPageInfo(data);
			}
		});
	}
	function initPageInfo(data) {
		var url = "machineloss/getMachineLossDetails?machineLossId="+machineLossId;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'MachineLossDetailPage',
				url : url,
				callback : showMachineLossDetailList
			}, data['page']);
		});
	}
	
	// 显示所有出库申请详情的列表
	function showMachineLossDetailList(data) {
		
		var html = template('machineLossDetailTemp', data);
		$("#tablelist").html("").html(html);
		CommonUtils.ie8TrChangeColor();
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
	machineLossOnlyShowInfo.init();
	if($("#reviewer").val() != userName || $("#state").val() == "已审核")
    {
		$("#agreen").hide();
    }
});
