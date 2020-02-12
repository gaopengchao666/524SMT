window.Audit = (function($, module) {
	var _Page = "checkOrderDetaiPage";
	/**
	 * 初始化
	 */
	function init() {
		var checkId = $("#checkId").val();
		initPageInfo(checkId);
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
	function agree(){
		var  checkOrder ={
				"id" :$("#checkId").val(),
				"state":3
				};
		//state 1已创建  /2未审核 /3未调整/4已完成
		$.ajax({
			url : "checkOrder/updCheckOrder",
			type : "POST",
			data : JSON.stringify(checkOrder),
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
				if(data=="success"){
					//更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
					window.location.href=urlPre+"checkOrder/toCheckAuditListJsp";
				}
			}
		});
	}
	function disagree(){
		var  checkOrder ={
				"id" :$("#checkId").val(),
				"state":1
				};
		//state 1已创建  /2未审核 /3未调整/4已完成
		$.ajax({
			url : "checkOrder/updCheckOrder",
			type : "POST",
			data : JSON.stringify(checkOrder),
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
				if(data=="success"){
					 self.parent.menuFrame.updateWorkBeach();
					window.location.href=urlPre+"checkOrder/toCheckAuditListJsp";
				}
			}
		});
	}
	
	
	module.init = init;
	module.disagree=disagree;
	module.agree=agree;
	return module;
}($, window.Audit || {}));
$(function() {
	Audit.init();
});
