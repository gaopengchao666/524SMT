window.AvailabilityQuery = (function($, module) {
	 _inputTypeName = $("input[name='materialType']");
	 _inputTypeId = $("input[name='materialTypeId']");
	/**
	 * 初始化函数
	 */
	function init(){
						
	}
	
	//物料类型 自动联想 最大10条数据
    _inputTypeName.autocomplete({
       //选择后将 id赋值给隐藏域
       select:function(event,ui){
           _inputTypeId.val(ui.item.id);
       },
       //数据来源 根据输入值 模糊匹配
       source:function(request,response){
    	   $.ajaxSetup({cache : false});
           CommonUtils.getAjaxData({url:'materialtype/queryMaterialTypesByName?typeName='
               +encodeURI(request.term),type:'get',async:'true'},function(data){
                   response($.map(data,function(item){
                       return {
                           label:item.typeName,//下拉框显示值
                           value:item.typeName,//选中后,填充到下拉框的值
                           id:item.materialTypeId//选中后,填充到id里面的值
                       }
                   }));
           });
       }
    });
	
	/**
	 * 绑定事件
	 */
	function getAvailabilityQty(){
		var materialCode = $("#materialCode").val();
		var materialModel = $("#materialModel").val();
		var materialName = $("#materialName").val();
		var materialType = $("input[name='materialType']").val();
		var warehouseName = $("#warehouseName").val();
		$.ajaxSetup({cache : false});
		var url = 'queryStock/queryAvailabilityQty';
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"materialCode":encodeURI(materialCode),"materialModel":encodeURI(materialModel),"materialType":encodeURI(materialType),"materialName":encodeURI(materialName),"warehouseName":encodeURI(warehouseName)}},function(data){
			PageUtils.refreshPageInfo({element:'queryPage',url : url,data:{"materialCode":encodeURI(materialCode),"materialModel":encodeURI(materialModel),"materialType":encodeURI(materialType),"materialName":encodeURI(materialName),"warehouseName":encodeURI(warehouseName)},callback : showBills},data['page']);
			if (data != null) {		
				showBills(data);
			}
			$("#loader").addClass("hidden");
		});	
	}
	
	
	//查询
	$("#searchClick").click(function(){
		getAvailabilityQty();
	});	
	
    //重置
	$("#clearClick").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		getAvailabilityQty();
	});
					
	//物料可用余量明细汇总列表数据展示
	function showBills(data){
		$("#availabilityData").html("");
    	var datas = data['availabilityList'];
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
			dom += "<td>"+obj.materialUse+"</td>";
			dom += "<td>"+obj.useUnit+"</td>";
			dom += "<td>"+obj.useNum+"</td>";
			dom += "<td>"+obj.useLockNum+"</td>";
			dom += "<td>"+obj.useUnlockNum+"</td>";
			dom += "<td>"+obj.warehouseName+"</td>";
			dom += "</tr>";
			$("#availabilityData").append(dom);
		});		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
	
	module.init = init;
	return module;
}($, window.AvailabilityQuery || {}));
$(function() {
	AvailabilityQuery.init();
});