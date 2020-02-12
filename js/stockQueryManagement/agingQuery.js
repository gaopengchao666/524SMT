window.AgingQuery = (function($, module) {
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
	function bindEvent(){
	    var materialCode = $("#materialCode").val();
	    var materialName = $("#materialName").val();
	    var materialModel = $("#materialModel").val();
	    var instockTime = $("#instockTime").val();
	    var startNum = $("#startNum").val();
	    var endNum = $("#endNum").val();
		var materialType = $("input[name='materialType']").val();
		$.ajaxSetup({cache : false});
		var url = 'queryStock/queryStockAgePage';
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"materialCode":encodeURI(materialCode),"materialName":encodeURI(materialName),"materialModel":encodeURI(materialModel),"instockTime":encodeURI(instockTime),"startNum":encodeURI(startNum),"endNum":encodeURI(endNum),"materialType":encodeURI(materialType)}},function(data){
			PageUtils.refreshPageInfo({element:'queryPage',url : url,data:{"materialCode":encodeURI(materialCode),"materialName":encodeURI(materialName),"materialModel":encodeURI(materialModel),"instockTime":encodeURI(instockTime),"startNum":encodeURI(startNum),"endNum":encodeURI(endNum),"materialType":encodeURI(materialType)},callback : showBills},data['page']);						
		    if(data != null){
				showBills(data);
			}	
		    $("#loader").addClass("hidden");
		});
		
	}

    //有效期告警条件查询
    $("#searchClick").click(function(){	
    	bindEvent();    	
    });
    
    $("#clearClick").click(function(){
    	$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		bindEvent();
    });
    //有效期告警列表数据展示
    function showBills(data){
		$("#agingList").html("");
    	var datas = data['agingOrValidityList'];	   	
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			if(obj.alarmLevel == 1){								
				dom += "<td class='warningRed'>"+obj.materialCode+"</td>";
				dom += "<td class='warningRed'>"+obj.materialType+"</td>";
				dom += "<td class='warningRed'>"+obj.materialName+"</td>";
				if(obj.materialModel == null || obj.materialModel == ''){
					dom += "<td class='warningRed'>--</td>";
				}else{
					dom += "<td class='warningRed'>"+obj.materialModel+"</td>";
				}				
				dom += "<td class='warningRed'>"+obj.productTimeStr+"</td>";
				dom += "<td class='warningRed'>"+obj.instockTimeStr+"</td>";
				dom += "<td class='warningRed'>"+obj.packUnit+"</td>";
				dom += "<td class='warningRed'>"+obj.packNum+"</td>";
				dom += "<td class='warningRed'>"+obj.stockAge+"</td>";
				dom += "<td class='warningRed'>"+obj.warehouseName+"</td>";						
			}else if(obj.alarmLevel == 2){
				dom += "<td class='warningYellow'>"+obj.materialCode+"</td>";
				dom += "<td class='warningYellow'>"+obj.materialType+"</td>";
				dom += "<td class='warningYellow'>"+obj.materialName+"</td>";
				if(obj.materialModel == null || obj.materialModel == ''){
					dom += "<td class='warningYellow'>--</td>";
				}else{
					dom += "<td class='warningYellow'>"+obj.materialModel+"</td>";
				}
				dom += "<td class='warningYellow'>"+obj.productTimeStr+"</td>";
				dom += "<td class='warningYellow'>"+obj.instockTimeStr+"</td>";
				dom += "<td class='warningYellow'>"+obj.packUnit+"</td>";
				dom += "<td class='warningYellow'>"+obj.packNum+"</td>";
				dom += "<td class='warningYellow'>"+obj.stockAge+"</td>";
				dom += "<td class='warningYellow'>"+obj.warehouseName+"</td>";
			}else{
				dom += "<td class=''>"+obj.materialCode+"</td>";
				dom += "<td class=''>"+obj.materialType+"</td>";
				dom += "<td class=''>"+obj.materialName+"</td>";
				if(obj.materialModel == null || obj.materialModel == ''){
					dom += "<td class=''>--</td>";
				}else{
					dom += "<td class=''>"+obj.materialModel+"</td>";
				}
				dom += "<td class=''>"+obj.productTimeStr+"</td>";
				dom += "<td class=''>"+obj.instockTimeStr+"</td>";
				dom += "<td class=''>"+obj.packUnit+"</td>";
				dom += "<td class=''>"+obj.packNum+"</td>";
				dom += "<td class=''>"+obj.stockAge+"</td>";
				dom += "<td class=''>"+obj.warehouseName+"</td>";
			}
			dom += "</tr>";
			$("#agingList").append(dom);
		});
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }	
	module.init = init;
	return module;
}($, window.AgingQuery || {}));
$(function() {
	AgingQuery.init();
});