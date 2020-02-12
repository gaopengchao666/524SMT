window.AdjustmentInfo = (function($, module) {
	
	var _Page = "checkOrderDetaiPage";
	
	/**
	 * 初始化
	 */
	function init() {
		var checkId = $("#checkId").val();
		initPageInfo(checkId);
		//判断按钮是否显示
		showAdjustButton(checkId);
	}
	////判断需入须出按钮是否显示
	function showAdjustButton(checkId){
		//更新page信息
		var url = "checkOrderDetail/showAdjustButton?checkId="
				+ checkId;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET',
			cache : false,
		}, function(data) {
			if ("r" == data) {
				$("#toInStock").removeClass("hidden")
			} else if ("c" == data) {
				$("#toOutStock").removeClass("hidden")
			} else if ("c&r" == data) {
				$("#toInStock").removeClass("hidden")
				$("#toOutStock").removeClass("hidden")
			}
		});
	}
	
	function initPageInfo(checkId) {
		//更新page信息
		var url = "checkOrderDetail/getCheckOrderDetailList?pageSize=15&checkId="
				+ checkId;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : _Page,
				url : url,
				callback : CheckOrderDetailList
			}, data['page']);
			CheckOrderDetailList(data);
		});
	}

	function CheckOrderDetailList(data) {
		//显示任务模板列表
		var html = template('checkOrderDetatilTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
      //修改了日期显示的格式，只显示年月日
		$(".time").each(function(i){
			$(".time").eq(i).html($(".time").eq(i).html().substr(0,10));
		});
	}

	
	//执行
	function toOutStock(){
		var checkId=$("#checkId").val();
		$("#loader").show();
		$.ajax({
			url : "checkOrderDetail/adjustCheckOrder2OutStock?checkId="+checkId,
			type : "GET",
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if(data=="error"){
					alert("创建失败")
				}else{
					//更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
			        window.location.reload()
			        //window.location.href=urlPre+"outstock/toOutstockForCheckJsp?id="+data;
				}
			},
			error :function(data) {
				$("#loader").hide();
			}
		});
	}
	
	function toInStock(){
		var checkId=$("#checkId").val();
		$("#loader").show();
		$.ajax({
			url : "checkOrderDetail/adjustCheckOrder2InStock?checkId="+checkId,
			type : "GET",
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if(data=="error"){
					alert("创建失败")
				}else{
					//更新待办事项状态
					 self.parent.menuFrame.updateWorkBeach();
				        window.location.reload()
				}
			},
			error :function(data) {
				$("#loader").hide();
			}
		});
	}
	
	module.init = init;
	module.toOutStock=toOutStock;
	module.toInStock=toInStock;
	return module;
}($, window.AdjustmentInfo || {}));
$(function() {
	AdjustmentInfo.init();
});
