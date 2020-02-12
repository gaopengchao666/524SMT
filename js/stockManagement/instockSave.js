window.instockSave = (function($, module) {
	var instockId=$("#instockOrderId").val();
	var instockDate = $("#instockDate").val().substr(0,10);
	function init(){
		if($(".operate_area").attr("id") == 1){
			$(".operate_area").html("");
		}
		query();
		$("#instockDate").val(instockDate);
	} 
	function query	(){
		$.ajax({
			url : "instock/getInstockApplyDetails?instockId="+instockId,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showInstockApplyDetailList(data);
				initPageInfo(data);
			}
		});
	}
	function initPageInfo(data) {
		var url = "instock/getInstockApplyDetails?instockId="+instockId;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'instockDetailPage',
				url : url,
				callback : showInstockApplyDetailList
			}, data['page']);
		});
	}
	// 显示
	function showInstockApplyDetailList(data) {
		
		var html = template('instockApplyDetailTemp', data);
		 // ie8隔行变色
		$("#tablelist").html("").html(html);
        $(".tablelist tr:odd").css("background", "rgb(245, 245, 245)");
        $(".tablelist tr:even").css("background", "white");
		$(".time").each(function(i){
			$(".time").eq(i).html($(".time").eq(i).html().substr(0,10));
		});
	}
	
	function saveInstockApply() {
		var locationes =  $(".location");
		var flag = "true";
		$(locationes).each(function(){
			if($(this).val() == "")
			{
				flag = "false";
			}
		});
		
		if(flag == "false")
		{
			alert("请填写库位信息，绑定物料和库位的关系");
			return;
		}
		
		$("#loader").show();
		$.ajax({
			url : "instock/updateInstockApply",
			type : "POST",
			data : $("#addForm").serialize(),
			async : true,
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if (data == "success") {
					window.location.href = url_Pre + "/instock/instockList";
				}
			}
		});
	}
	module.init = init;
	module.saveInstockApply = saveInstockApply;
	return module;
}($, window.Material || {}));
$(function() {
	instockSave.init();
});
