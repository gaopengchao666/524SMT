window.StockMaterialStatistics = (function($, module) {
	/**
	 * 初始化函数
	 */
	function init(){
		bindEvent();
	}
	
	/**
	 * 绑定事件
	 */
	function bindEvent(){
		getData();	
	}
	//获取汇总页面数据
	function getData(){
		var url = 'stockMaterialStatisticsData';
		$.ajaxSetup({cache : false});
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true'},function(data){
			PageUtils.refreshPageInfo({element:'queryPage',url : url,callback : showBills},data['page']);
			if(data != null){
				showBills(data);
			}
			$("#loader").addClass("hidden");
		});	
	}
	
    //汇总页面数据展示
    function showBills(data){
		$("#sumShow").html("");
    	var datas = data['smsList'];
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";			
			dom += "<td>"+obj.materialCode+"</td>";
			dom += "<td>"+obj.materialType+"</td>";
			dom += "<td>"+obj.materialName+"</td>";
			if(obj.materialModel == null || obj.materialModel == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.materialModel+"</td>";
			}
			if(obj.materialUse == null || obj.materialUse == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.materialUse+"</td>";
			}	
			dom += "<td>"+obj.useUnit+"</td>";	
			dom += "<td>"+obj.useNum+"</td>";	
			dom += "<td>"+obj.useLockNum+"</td>";	
			dom += "<td>"+obj.useUnlockNum+"</td>";	
			dom += "<td>"+obj.warehouseName+"</td>";	
			dom += "</tr>";
			$("#sumShow").append(dom);
		});
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    //点击汇总页签
    $(".layui-this").click(function(){
    	getData();
    });
    
    //点击详情页面    
    $(".tableListClick").click(function(){
    	getDetailData();
    });
    
    //获取详情页面数据
    function getDetailData(){
    	
    	var url = 'stockMaterialStatisticsDetailData';
    	$.ajaxSetup({cache : false});
    	$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true'},function(data){
			PageUtils.refreshPageInfo({element:'queryPageDtail',url : url,callback : showDetailBills},data['page']);
			if(data != null){
				showDetailBills(data);
			}
			$("#loader").addClass("hidden");			
		});	
    }
    //详情页面数据展示
    function showDetailBills(data){
		$("#detailShow").html("");
    	var datas = data['smsList'];
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";			
			dom += "<td>"+obj.materialCode+"</td>";
			dom += "<td>"+obj.materialType+"</td>";
			dom += "<td>"+obj.materialName+"</td>";
			if(obj.materialModel == null || obj.materialModel == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.materialModel+"</td>";
			}			
			if(obj.materialUse == null || obj.materialUse == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.materialUse+"</td>";
			}			
			dom += "<td>"+obj.productTimeStr+"</td>";
			dom += "<td>"+obj.instockTimeStr+"</td>";	
			dom += "<td>"+obj.useUnit+"</td>";	
			dom += "<td>"+obj.useNum+"</td>";	
			dom += "<td>"+obj.useLockNum+"</td>";	
			dom += "<td>"+obj.useUnlockNum+"</td>";	
			dom += "<td>"+obj.warehouseName+"</td>";
			dom += "<td>"+obj.location+"</td>";
			dom += "</tr>";
			$("#detailShow").append(dom);
		}); 			
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
	module.init = init;
	return module;
}($, window.StockMaterialStatistics || {}));
$(function() {
	StockMaterialStatistics.init();
});