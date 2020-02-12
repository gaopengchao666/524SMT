var tabTag = "tab1";
var _addForm = $("#addForm");
//默认根据跳转链接携带参数默认改变选择页签
var allTab = true;
var _validate;

$(function() {
	//计划开始时间
	$("input[name='planStartTime']").datepicker({
		dateFormat : 'yy-mm-dd',
        monthNamesShort:["January","February","March","April","May","June", "July","August","September","October","November","December"],
		 	changeYear:true,
		 	changeMonth:true,
		 	showOn:"button",
		 	buttonImage:"img/button/calendar.png",
		 	buttonImageOnly:false,
			onSelect : function(dateText){
			    $("input[name='planEndTime']").datepicker("option","minDate",dateText);
			}
	});

	//计划结束时间
	$("input[name='planEndTime']").datepicker({
		dateFormat : 'yy-mm-dd',
        monthNamesShort:["January","February","March","April","May","June", "July","August","September","October","November","December"],
		 	changeYear:true,
		 	changeMonth:true,
		 	showOn:"button",
		 	buttonImage:"img/button/calendar.png",
		 	buttonImageOnly:false,
		onSelect : function(dateText){
		    $("input[name='planStartTime']").datepicker("option","maxDate",dateText);
		}
	});

});
$(function(){
	bindCheck();
	if(tabid=="0"){
		tabTag = "tab2"
		$("#tab2").click();
		$("#td").addClass("cursor");
		$("#tab6").hide();
	}else if(tabid=="1"){
		tabTag = "tab3"
		$("#tab3").click();
		$("#td").addClass("cursor");
		$("#tab6").hide();
	}else if(tabid=="2"){
		tabTag = "tab4"
		$("#tab4").click();
		$("#td").addClass("cursor");
		$("#tab6").hide();
	}else {
		if(groupName=="生产人员"|groupName=="检验员"){
			tabTag = "tab3"
				$("#tab3").click();
				$("#td").addClass("cursor");
				$("#tab6").hide();
				allTab = false;
		}
	}
	
});
//获取高度
$(function(){
	var h = document.documentElement.clientHeight;
	$(".wrap").css("height", h);
	queryData();
	
});
function bindCheck(){
	_validate = $("#addForm").validate({
		rules :{
			'imageCode' : {
				required : true,
				maxlength : 100
			},
			'projectCode' : {
				required : true,
				maxlength : 100
			},
			'planNum' : {
				required : true,
				number : true,
				range : [1,9999999]
			},
			'planStartTime' : {
				required : true,
			},
			'planEndTime' : {
				required : true,
			},
			'batch' : {
				required : true,
				maxlength : 100
			},
			'projectFrom' : {
				required : true,
				maxlength : 100
			},
			'productName' : {
				required : true,
				maxlength : 100
			},
			'makeTeam' : {
				required : true,
				maxlength : 100
			}
		},
		messages : {
			'imageCode' : {
				required : "图号不能为空",
				maxlength : "长度不超过100"
			},
			'projectCode' : {
				required : "项目编码不能为空",
				maxlength : "长度不超过100"
			},
			'planNum' : {
				required : "计划数量不能为空",
				number : "请输入数字",
				range : "请输入正确的计划数量"
			},
			'planStartTime' : {
				required : "计划开始时间不能为空",
			},
			'planEndTime' : {
				required :  "计划结束时间不能为空",
			},
			'batch' : {
				required :  "批次号不能为空",
				maxlength : "长度不超过100"
			},
			'projectFrom' : {
				required :  "项目来源不能为空",
				maxlength : "长度不超过100"
			},
			'productName' : {
				required :  "项目名称不能为空",
				maxlength : "长度不超过100"
			},
			'makeTeam' : {
				required :  "承制班组不能为空",
				maxlength : "长度不超过100"
			}
		}
		
	});
}
//显示工单列表
function showProductionOrderPlanList(data){
	  template.defaults.imports.dateFormat = function(date, format){
          if (date){
              return moment(date).format(format);
          }
          return '';
      };
	var html = template('shopManagementTemp', data);
	$("#tablelist").html("").html(html);
//	if(tabTag=="tab1"){
//		$(".cursor").removeClass("cursor");
//	}
}
//点击页签
$(".layui-tab-title li").click(function(){
	if($(this).attr("id")=="tab6"){
		alert("权限不足");
		return;
	}
	tabTag = $(this).attr("id");
	if(!allTab&tabTag!="tab3"){
		alert("权限不足");
		return;
	}
	if(tabTag=="tab5"){
		if(groupName=="工艺师"){
			alert("权限不足");
			return;
		}
		$("#tab6").hide();
		$("#defaultDiv").hide();
		$("#addForm").show();
		$("#planCode").text("JH"+dateFormat(new Date()));
		$("#createPeople").text(userName);
	}else{
		$("#defaultDiv").show();
		$("#addForm").hide();
		queryData();
		if(tabTag=="tab1"){
			$("#tabTitle").text("生产计划总列表");
			$("#tab6").show();
		}else if(tabTag=="tab2"){
			$("#tabTitle").text("未排产车间计划列表");
			$("#td").addClass("cursor");
			$("#tab6").hide();
		}else if(tabTag=="tab3"){
			$("#tabTitle").text("在制车间计划列表");
			$("#td").addClass("cursor");
			$("#tab6").hide();
		}else if(tabTag=="tab4"){
			$("#tabTitle").text("完工车间计划列表");
			$("#td").addClass("cursor");
			$("#tab6").hide();
		}
	}
	$(".layui-tab-title li").removeClass("layui-this");
	$(this).addClass("layui-this");
});
//可点击td跳转
function tdClick(id,isReport,status){
	if(tabTag=="tab1"){
		if(status=="未排产"){
			window.location = base+"shopManagement/toCompleteCheck?orderID="+id;
		}else if(status=="生产中"){
		    if(isReport==1){
		        window.location = base+"onProcessControllerNew/toReportOrder?orderID="+id;    
		    }else{
		        window.location = base+"onProcessControllerNew/toOnProcess?orderID="+id;    
		    }
		}else if(status=="已完工"){
			window.location = base+"onProcessControllerNew/toReportOrder?orderID="+id;	
		}
		//window.location = base+"onProcessControllerNew/reportOrderToMes?planCode=JH20180717105442&imageCode=image1"
	}else if(tabTag=="tab2"){
		window.location = base+"shopManagement/toCompleteCheck?orderID="+id;
	}else if(tabTag=="tab3"){
		if(isReport==1){
		window.location = base+"onProcessControllerNew/toReportOrder?orderID="+id;	
		}else{
		window.location = base+"onProcessControllerNew/toOnProcess?orderID="+id;
		}
	}else if(tabTag=="tab4"){
		window.location = base+"onProcessControllerNew/toReportOrder?orderID="+id;	
	}
	
}
//查询数据
function queryData(){
	var url = "shopManagement/selectAllOrder?tabid="+tabTag;
	CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
		PageUtils.refreshPageInfo({element:'productionPlanManagementPage',url : url,callback : showProductionOrderPlanList},data['page']);	
	showProductionOrderPlanList(data);
	CommonUtils.ie8TrChangeColor();
	});	
}

function createOrder(){
    //校验不通过返回
    if (!_addForm.valid()){
        return;
    }
    
	var order = new Object();
	order.planCode = $("#planCode").text();
	order.imageCode = $("#imageCode").val();
	order.projectCode = $("#projectCode").val();
	order.planNum = $("#planNum").val();
	order.planStartTime = $("#planStartTime").val();
	order.planEndTime = $("#planEndTime").val();
	order.batch = $("#batch").val();
	order.projectFrom = $("#projectFrom").val();
	order.projectType = $("#projectType").val();
	order.productName = $("#productName").val();
	order.makeTeam = $("#makeTeam").val();
	order.createPeople = $("#createPeople").text();
	order.info = $("#info").val();
	$("#addForm").ajaxSubmit({
		url : "shopManagement/createOrder",
		type : "GET",
		cache : false,
		data : {
			"order" : JSON.stringify(order)
		},
		success : function(data){
			if(data=="success"){
				$(".mask").css("display","block");
			}
		}
	});
	
}

$("#ok").click(function(){
	$(".mask").css("display","none");
	window.location = base +"shopManagement/toShopManagement";
});
function dateFormat(date){
    if (date){
        return moment(date).format("YYYYMMDDHHmmss");
    }
    return '';
};
//将工单导出为excel
$("#exportOrder").click(function(){
	if(groupName=="生产人员"|groupName=="检验员"|groupName=="工艺师"){
		alert("权限不足");
		return;
	}
	var v = $("#orderSelect").val();
	var toExportOrder = encodeURI(base +"shopManagement/exportExcel?orderType="+v);
	window.location = toExportOrder;

});