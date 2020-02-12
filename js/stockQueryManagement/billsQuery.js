window.BillsQuery = (function($, module) {
	/**
	 * 初始化函数
	 */
	function init(){				
	}
	
	
	/**
	 * 绑定事件
	 */
	function bindEvent(){
		var planCode = $("#planCode").val();
		var drawCode = $("#drawCode").val();
		var creator = $("#creator").val();
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		var orderCode = $("#orderCode").val();
		var orderType = $("#orderType option:selected").val();
		$.ajaxSetup({cache : false});
		var url = 'queryStock/queryOrderData';
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"planCode":planCode,"drawCode":drawCode,"creator":creator,"startTime":startTime,"endTime":endTime,"orderCode":orderCode,"orderType":orderType}},function(data){
			PageUtils.refreshPageInfo({element:'queryPage',url : url,data:{"planCode":planCode,"drawCode":drawCode,"creator":creator,"startTime":startTime,"endTime":endTime,"orderCode":orderCode,"orderType":orderType},callback : showBills},data['page']);
			if(data != null){
				showBills(data);
			}			
			$("#loader").addClass("hidden");
		});	
	}
	
	//条件查询
	$("#searchClick").click(function(){	
    	bindEvent();  	
    });
    //查询条件置空
    $("#clearClick").click(function(){
    	$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("#startTime").datepicker("option","maxDate",null);
		$("#endTime").datepicker("option","minDate",null);
		bindEvent();
    });
    //页面数据展示
    function showBills(data){
		$("#dataShow").html("");
    	var datas = data['orderList'];
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			if(obj.orderType == 1){
				dom += "<td><a class='cursor' href='/instock/toInstockApplyInfoJsp?pageFlag=1&id="+obj.orderId+"'>"+obj.orderCode+"</a></td>";
				dom += "<td>入库单</td>";
			}else{
				dom += "<td><a class='cursor' href='/outstock/toOutstockApplyInfoJsp?pageFlag=1&id="+obj.orderId+"'>"+obj.orderCode+"</a></td>";
				dom += "<td>出库单</td>";				
			}
			if(obj.planCode =='' || obj.planCode ==null){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.planCode+"</td>";
			}
			if(obj.drawCode == null || obj.drawCode == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.drawCode+"</td>";
			}
			if(obj.projectCode == null || obj.projectCode == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.projectCode+"</td>";
			}
			if(obj.materialUse == null || obj.materialUse == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.materialUse+"</td>";
			}						
			dom += "<td>"+obj.optionWay+"</td>";
			dom += "<td>"+obj.creator+"</td>";
			dom += "<td>"+obj.optionTimeStr+"</td>";
			dom += "<td>"+obj.applyMen+"</td>";
			dom += "<td>"+obj.applyTimeStr+"</td>";		
			dom += "</tr>";
			$("#dataShow").append(dom);
		}); 			
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
	
	module.init = init;
	return module;
}($, window.BillsQuery || {}));
$(function() {
	BillsQuery.init();
});