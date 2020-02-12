window.instockOnlyShowInfo = (function($, module) {
	var instockId=$("#instockOrderId").val();
	var instockDate = $("#instockDate").val().substr(0,10);
	function init(){
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
		$("#tablelist").html("").html(html);
		CommonUtils.ie8TrChangeColor();
		$(".time").each(function(i){
			var data = $(this).val();
			if(data==""){
				$(this).datepicker({
					dateFormat : 'yy-mm-dd',
					 monthNamesShort:["January","February","March","April","May","June", "July","August","September","October","November","December"],
					 	changeYear:true,
					 	changeMonth:true,
					 	showOn:"button",
					 	buttonImage:"img/button/calendar.png",
					 	buttonImageOnly:false
				});
			}else{
				$(this).val(data.substr(0,10));
			}
		});
		
		$(".expirationDate").datepicker({
			dateFormat : 'yy-mm-dd',
			 monthNamesShort:["January","February","March","April","May","June", "July","August","September","October","November","December"],
			 	changeYear:true,
			 	changeMonth:true,
			 	showOn:"button",
			 	buttonImage:"img/button/calendar.png",
			 	buttonImageOnly:false
		});
	}
	
	function saveInstockApply() {
		$("#loader").show();
		$.ajax({
			url : "instock/addInstockApplyForCheck",
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
	instockOnlyShowInfo.init();
});
