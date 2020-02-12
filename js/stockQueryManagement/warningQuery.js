window.WarningQuery = (function($, module) {
	
	 _inputTypeName1 = $("input[name='materialType1']");
	 _inputTypeId1 = $("input[name='materialTypeId1']");
	 _inputTypeName2 = $("input[name='materialType2']");
	 _inputTypeId2 = $("input[name='materialTypeId2']");
	
	/**
	 * 初始化函数
	 */
	function init(){
		var page = $(".layui-tab-content").attr("id");
		if(page == 1){
			var name = $("#alarmType1").attr("name");
			if(name != null && name != ""){
				$("#alarmType1").find("option[value='"+name+"']").attr("selected",true);
				getNumAlarm();
			}
		}else if(page == 2){	
			var name = $("#alarmType2").attr("name");
			if(name != null && name != ""){
				$("#alarmType2").find("option[value='"+name+"']").attr("selected",true);
				getdayAlarm();
				$("#pageNum").removeClass("layui-show");
				$("#pageDay").addClass("layui-show");
				$("#numAlarm").removeClass("layui-this");
				$("#dayAlarm").addClass("layui-this");
			}
		}
		
		getNumAlarm();
		
		
	}
	
	
	//物料类型 自动联想 最大10条数据
    _inputTypeName1.autocomplete({
       //选择后将 id赋值给隐藏域
       select:function(event,ui){
           _inputTypeId1.val(ui.item.id);
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
	
  //物料类型 自动联想 最大10条数据
    _inputTypeName2.autocomplete({
       //选择后将 id赋值给隐藏域
       select:function(event,ui){
           _inputTypeId2.val(ui.item.id);
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
	//数量告警
	function getNumAlarm(){
	   //页面加载数据
		var materialCode = $("#materialCode1").val();
		var materialModel = $("#materialModel1").val();
		var materialName = $("#materialName1").val();
		var materialType = $("input[name='materialType1']").val();
		var alarmType = $("#alarmType1 option:selected").val();
		$.ajaxSetup({cache : false});
		var url = 'queryStock/queryNumAlarm';
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"materialCode":encodeURI(materialCode),"materialModel":encodeURI(materialModel),"materialType":encodeURI(materialType),"materialName":encodeURI(materialName),"alarmType":encodeURI(alarmType)}},function(data){
			PageUtils.refreshPageInfo({element:'queryNumPage',url : url,data:{"materialCode":encodeURI(materialCode),"materialModel":encodeURI(materialModel),"materialType":encodeURI(materialType),"materialName":encodeURI(materialName),"alarmType":encodeURI(alarmType)},callback : showBills},data['page']);
			if(data != null){
				showBills(data);
			}
			$("#loader").addClass("hidden");
		});
		
	}
	
	//切换页签查询数据
	$("#numAlarm").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		getNumAlarm();
	});
	
	//数量告警查询
	$("#searchClick1").click(function(){	
		getNumAlarm();
	});
	
	//数量告警重置
	$("#clearClick1").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		getNumAlarm();
	});
	
	//数量告警列表展示
	function showBills(data){
		$("#numberAlarmData").html("");
    	var datas = data['numberAlarmList']; 	   	
		$.each(datas,function(item,obj){
			if(obj.alarmLevel == 1){
				var dom = "";
				dom += "<tr class='listTableText list_list'>";
				dom += "<td class='warningRed'>"+obj.materialCode+"</td>";
				dom += "<td class='warningRed'>"+obj.materialType+"</td>";
				dom += "<td class='warningRed'>"+obj.materialName+"</td>";	
				if(obj.materialModel == null || obj.materialModel == ''){
					dom += "<td class='warningRed'>--</td>";
				}else{
					dom += "<td class='warningRed'>"+obj.materialModel+"</td>";
				}
				dom += "<td class='warningRed'>"+obj.downPackNum+"</td>";
				dom += "<td class='warningRed'>"+obj.useUnit+"</td>";				
				dom += "<td class='warningRed'>"+obj.warehouseUseNum+"</td>";
				dom += "<td class='warningRed'>"+obj.upPackNumStr+"</td>";
				dom += "<td class='warningRed'>"+obj.warehouseName+"</td>";
				dom += "</tr>";
				$("#numberAlarmData").append(dom);
			}			
		});
		
		$.each(datas,function(item,obj){
			if(obj.alarmLevel == 2){
				var dom = "";
				dom += "<tr class='listTableText list_list'>";
				dom += "<td class='warningYellow'>"+obj.materialCode+"</td>";
				dom += "<td class='warningYellow'>"+obj.materialType+"</td>";
				dom += "<td class='warningYellow'>"+obj.materialName+"</td>";			
				if(obj.materialModel == null || obj.materialModel == ''){
					dom += "<td class='warningYellow'>--</td>";
				}else{
					dom += "<td class='warningYellow'>"+obj.materialModel+"</td>";
				}
				dom += "<td class='warningYellow'>"+obj.downPackNum+"</td>";
				dom += "<td class='warningYellow'>"+obj.useUnit+"</td>";
				dom += "<td class='warningYellow'>"+obj.warehouseUseNum+"</td>";
				dom += "<td class='warningYellow'>"+obj.upPackNumStr+"</td>";
				dom += "<td class='warningYellow'>"+obj.warehouseName+"</td>";
				dom += "</tr>";
				$("#numberAlarmData").append(dom);
			}
			
		});		 		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
	//有效期告警查询
    $(".dayAlarm").click(function(){
    	$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
    	getdayAlarm();
    });
  
    //有效期告警查询方法
    function getdayAlarm(){
    	var materialCode = $("#materialCode2").val();
		var materialModel = $("#materialModel2").val();
		var materialName = $("#materialName2").val();
		var instockTime = $("#instockTime").val();
		var materialType = $("input[name='materialType2']").val();
		var alarmType = $("#alarmType2 option:selected").val();
		$.ajaxSetup({cache : false});
		var url = 'queryStock/queryDayAlarm';
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"materialCode":encodeURI(materialCode),"materialModel":encodeURI(materialModel),"materialType":encodeURI(materialType),"materialName":encodeURI(materialName),"alarmType":encodeURI(alarmType),"instockTime":encodeURI(instockTime)}},function(data){
			PageUtils.refreshPageInfo({element:'queryDayPage',url : url,data:{"materialCode":encodeURI(materialCode),"materialModel":encodeURI(materialModel),"materialType":encodeURI(materialType),"materialName":encodeURI(materialName),"alarmType":encodeURI(alarmType)},callback : showDayBills},data['page']);		
			if(data != null){
				showDayBills(data);
			}
			$("#loader").addClass("hidden");
		}); 
    }
    
    //有效期告警条件查询
    $("#searchClick2").click(function(){	
    	getdayAlarm();
    });
    //有效期告警条件置空
    $("#clearClick2").click(function(){
    	$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		getdayAlarm();
    });
    //有效期告警列表数据展示
    function showDayBills(data){
		$("#dayAlarmList").html("");
    	var datas = data['dayAlarmList'];	   	
		$.each(datas,function(item,obj){
			if(obj.alarmLevel == 1){
				var dom = "";
				dom += "<tr class='listTableText list_list'>";
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
				dom += "<td class='warningRed'>"+obj.alarmTimeStr+"</td>";
				dom += "</tr>";
				$("#dayAlarmList").append(dom);		
			}			
		});
		
		$.each(datas,function(item,obj){
			if(obj.alarmLevel == 2){
				var dom = "";
				dom += "<tr class='listTableText list_list'>";		
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
				dom += "<td class='warningYellow'>"+obj.alarmTimeStr+"</td>";				
				dom += "</tr>";
				$("#dayAlarmList").append(dom);
			}			
		});		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
	
	module.init = init;
	return module;
}($, window.WarningQuery || {}));
$(function() {
	WarningQuery.init();
});