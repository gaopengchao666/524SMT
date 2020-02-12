window.InventorySupplyInfo = (function($, module) {
	var billCode=$("#billCode").val();
	var demandId=$("#demandId").val();
	function init(){
		query();
	}
	function query	(){
		$.ajax({
			url : "inventorySupply/getDemandApplyDetailList?billCode="+billCode,
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
		var url = "inventorySupply/getDemandApplyDetailList?billCode="+billCode;
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
	//审批
	function approval(){
		var url1="inventorySupply/approval?billCode="+billCode+"&id="+demandId;
		jQuery.ajax({
			url :url1,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				if(data=="success"){
					//更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
					window.location.href=urlPre+"inventorySupply/toInventorySupplyListJsp";
				}else{
					alert("操作失败");
				}
			}
		});
	}
	//发送
	function sendBillOrder2Erp(){
		$("#loader").show();
		var url1="inventorySupply/sendBillOrder2Erp?id="+demandId;
		jQuery.ajax({
			url :url1,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if(data=="success"){
					//更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
					alert("发送成功");
					window.location.href=urlPre+"inventorySupply/toInventorySupplyListJsp";
				}else{
					alert(data);
				}
			}
		});
	}
	//驳回
	function turnDown(){
		var url1="inventorySupply/turnDown?billCode="+billCode+"&id="+demandId;
		jQuery.ajax({
			url :url1,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				if(data=="success"){
					//更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
					window.location.href=urlPre+"inventorySupply/toInventorySupplyListJsp";
				}else{
					alert("操作失败");
				}
			}
		});
	}
	function printExcel(){
		var url1="inventorySupply/printExcel?id="+demandId;
		jQuery.ajax({
			url :url1,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				if(data=="success"){
					alert("操作ok");
				}else{
					alert("操作失败");
				}
			}
		});
	}
	module.init = init; 
	module.approval=approval;
	module.printExcel=printExcel;
	module.sendBillOrder2Erp=sendBillOrder2Erp;
	module.turnDown=turnDown;
	return module;
}($, window.InventorySupplyInfo || {}));
$(function() {
	InventorySupplyInfo.init();
});
