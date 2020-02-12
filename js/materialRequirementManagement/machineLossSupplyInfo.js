window.MachineLossSupplyInfo = (function($, module) {
	var billCode=$("#billCode").val();
	var demandId=$("#demandId").val();
	var totalRecord=0;
	function init(){
		query();
		if(!$("input[name='applyDateStr']").val()){
			$("input[name='applyDateStr']").val(autoDate())
		}
		//更新待办事项状态
        self.parent.menuFrame.updateWorkBeach();
	}
	function query	(){
		$.ajax({
			url : "machineLossSupply/getDemandApplyDetailList?billCode="+billCode,
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
		var url = "machineLossSupply/getDemandApplyDetailList?billCode="+billCode;
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
		totalRecord=data['page'].totalRecord
	}
	// 显示
	function showDemandApplyDetailList(data) {
		var html = template('demandApplyDetailTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	function sendBillOrder2Erp(){
		confirm("将发送补料申请",function(result){
            if (result){
		$("#loader").show();
		var url1="machineLossSupply/sendBillOrder2Erp?id="+demandId;
		jQuery.ajax({
			url :url1,
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if(data=="success"){
					alert("发送成功");
					window.location.href=urlPre+"machineLossSupply/toMachineLossSupplyListJsp";
				}else{
					alert(data);
				}
			}
		});
            }
		});
	}
	function autoDate(){
        var unixtimestamp = new Date();
        var year = unixtimestamp.getFullYear();
        var month = "0" + (unixtimestamp.getMonth() + 1);
        var date = "0" + unixtimestamp.getDate();
        return year  +"-"+  month.substring(month.length-2, month.length) +"-"  + date.substring(date.length-2, date.length);
	};
	// -------- 删除明细 ---------
	function deleteDetail() {
		var checks = $("input[type='checkbox']:checked");
		var list=[];
		$.each(checks, function(index, obj) {
			list.push(obj.value);
		});
		if (!list.length > 0) {
			alert("请选择要删除的内容!!");
			return;
		}else if(totalRecord==list.length){
			confirm("确定移除全部物料吗? 这样会连同单据一起删除",function(result){
				if (result){
					$.ajax({
						type : 'POST',
						url : 'machineLossSupply/delMachineLossSupplys',
						cache : false,
						data : JSON.stringify([billCode]),
						contentType : 'application/json; charset=utf-8',
						async : true,
						success : function(data) {
							if (data == 'success') {
								alert("移除成功");
							}
							window.location.href=urlPre+"machineLossSupply/toMachineLossSupplyListJsp";
						}
					});
				}
			});
			
		}else{
			confirm("确定移除这些物料吗?",function(result){
				if (result){
					$.ajax({
						type : 'POST',
						url : 'machineLossSupply/delMachineLossSupplyDetails',
						cache : false,
						data : JSON.stringify(list),
						contentType : 'application/json; charset=utf-8',
						async : true,
						success : function(data) {
							if (data == 'success') {
								alert("移除成功");
							}
							var current = PageUtils._currentPage['demandApplyDetailPage'];
							PageUtils.pageClick(current, 'demandApplyDetailPage');
						}
					});
				}
			});
		}
	}
	module.init = init; 
	module.sendBillOrder2Erp=sendBillOrder2Erp;
	module.deleteDetail=deleteDetail;
	return module;
}($, window.MachineLossSupplyInfo || {}));
$(function() {
	MachineLossSupplyInfo.init();
});
