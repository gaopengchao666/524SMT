window.CompleteSupplyInfo = (function($, module) {
	var billCode=$("#billCode").val();
	var demandId=$("#demandId").val();
	function init(){
		query();
	}
	function query	(){
		$.ajax({
			url : "completeSupply/getDemandApplyDetailList?billCode="+billCode,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showDemandApplyDetailList(data);
				initPageInfo(data);
			}
		});
	}
	function initPageInfo(data) {
		var url = "completeSupply/getDemandApplyDetailList?billCode="+billCode;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'demandApplyDetailPage',
				url : url,
				callback : showDemandApplyDetailList
			}, data['page']);
		});
	}
	// 显示
	function showDemandApplyDetailList(data) {
		
		var html = template('demandApplyDetailTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	//发送
	function sendBillOrder2Erp(){
		var url1="completeSupply/sendBillOrder2Erp?id="+demandId;
		jQuery.ajax({
			url :url1,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				if(data=="success"){
					alert("发送成功");
					//更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
				}else{
					alert(data);
				}
				window.location.href=urlPre+"completeSupply/toCompleteSupplyListJsp";
			}
		});
	}
	
	module.init = init; 
	module.sendBillOrder2Erp=sendBillOrder2Erp;
	return module;
}($, window.CompleteSupplyInfo || {}));
$(function() {
	CompleteSupplyInfo.init();
});
