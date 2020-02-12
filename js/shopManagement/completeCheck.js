var replenishInfos;
var processStatusInfo;
var toolIndex;
function dateFormat(date){
    if (date){
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
    return '';
};
var h = document.documentElement.clientHeight;
$(".wrap").css("height", h);
$(function(){
    queryOrder();
    queryFlow();
    queryProcess();
});

function queryOrder(){
	$.ajax({
		url : "shopManagement/selectOrderByID?orderID="+orderID,
		cache : false,
		type : "GET",
		success : function(data){
			var tableList = $("#orderInfo");
			tableList.html("");
			var datas = eval(data);
			var dom = "";
			dom+="<tr class='listTableText list_list'>";
			dom+="<td>"+datas.planCode
			+"</td>";
			dom+="<td>"+datas.productImageCode+"</td>";
			dom+="<td>"+datas.productName+"</td>";
			dom+="<td>"+datas.projectCode+"</td>";
			dom+="<td>"+datas.planNum+"</td>";
			dom+="<td>0</td>";
			dom+="<td>"+datas.planStartTimeString+"</td>";
			dom+="<td>"+datas.planOverTimeString+"</td>";
			dom+="<td>尚未开始</td>";
			dom+="<td>尚未开始</td>";
			dom+="<td>0%</td>";
			dom+="<td>未开工</td>"
			var remark = datas.info == null ? "" : datas.info;
			dom+="<td class='td_ellipsis' title='"+remark+"'>"+remark+"</td>";
			tableList.append(dom);
			CommonUtils.ie8TrChangeColor();
		}	
	});
}
function isNull(data){
	if(data==null){
		return "";
	}else{
		return data;
	}
}

function queryFlow(){
	$.ajax({
		url: "shopManagement/selectFlowByOrderID?orderID="+orderID,
		type : "GET",
		cache : false,
		success :function(data){
			var flow = eval(data);
			if(flow==null)return;
			var flowInfo = $("#flowInfo");
			flowInfo.html("");
			var toolInfo = $("#toolInfo");
			toolInfo.html("");
			var dom = "";
			dom+= "<tr class='listTableText list_list'>";
			dom+= "<td id = 'flow'>"+isNull(flow.fileName)+"</td>";
			dom+= "<td>"+isNull(flow.flowName)+"</td>";
			dom+= "<td>"+isNull(flow.pbomName)+"</td>";
			dom+="</tr>";
			flowInfo.append(dom);
			var tools = flow.silkNumber.split(",");
			toolIndex = tools.length;
			if(tools.length!=0){
				var toolDom = "";
				$.each(tools,function(index,toolName){
					toolDom+="<tr class='listTableText list_list'><td id = 'tool"+index+"'>"+isNull(toolName)+"</td></tr>"
					
				});
				toolInfo.html(toolDom);
			}
			
			CommonUtils.ie8TrChangeColor();
		}
	});
}




function queryProcess(){
	$.ajax({
		url : "shopManagement/selectProcessByOrderID?orderID="+orderID,
		type : "GET",
		cache : false,
		success : function(data){
			var datas = eval(data);
			var processInfo =$("#processInfo");
		 	var dom = "";
			processInfo.html("");
			$.each(datas,function(index,obj){
				dom+="<tr class='listTableText list_list'>";
				dom+="<td>"+(index+1)+"</td>";
				dom+="<td>"+obj.processName+"</td>";
				dom+="<td id = 'process"+(index+1)+"'>"+obj.completeStatus+"</td>";
				dom+="</tr>";
			});
			processInfo.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
		
	});
}


// 获取每行 td 的兄弟节点
$(".tablelist td").hover(function() {
	$(this).parent().children().addClass("td_hover");
}, function() {
	$(this).parent().children().removeClass("td_hover");
});

// 点击弹框关闭按钮
function backsupply() {
	$(".mask").css("display", "none");
}

function checkFlow(){
	var tag = 0;
	var tools = [];
	for(var i=0;i<toolIndex;i++){
		var toolName = $("#tool"+i).text();
		tools.push(toolName);
	}
	
	var flow = $("#flow").text();
	if(flow==""|flow=="null"){
		alert("缺少工艺文件，请先设定工艺文件");
		tag = 1;
		return tag;
	}
	
	$.ajax({
		url : "shopManagement/selectTool?tool="+tools,
	    type : "GET",
	    async: false,
	    cache : false,
	    success : function(data){
	    	if(data=="error"){
	    		alert("未查询到丝网信息",function(){});
	    		tag = 1;
	    	}
	    }
	});
	return tag;
	
}


// 点击齐套检查
function homogeneityCheck() {
	if(groupName=="工艺师"){
		alert("权限不足");
		return;
	}
	if(checkFlow()==1){
		return;
	}
	$("#loader").removeClass("hidden");
		$.ajax({
			url : "shopManagement/selectIsComplete?orderID="+orderID,
			type : "GET",
			cache : false,
			async : true,
			success : function(data){
				$("#loader").addClass("hidden");
				var datas = eval(data);
				var dom = "";
				processStatusInfo = datas['process'];
				updateProcessStatus(datas['process']);
				if(data['replenishinfo'].length!=0){
					replenishInfos = datas['replenishinfo'];
					var data0 = data['replenishinfo'][0];
					$("#replenishInfoOrderCode").text(data0.replenishInfoOrderCode);
					$("#planCode").text(data0.planCode);
					$("#imageCode").text(data0.imageCode);
					$("#productName").text(data0.productName);
					$("#applyTime").text(dateFormat(new Date()));
					var replenishInfo = $("#replenishInfo");
					replenishInfo.html("");
					$.each(datas['replenishinfo'],function(index,obj){
						dom+="<tr class='listTableText list_list'>";
						dom+="<td>"+obj.materialCode+"</td>";
						dom+="<td>"+obj.materialName+"</td>";
						dom+="<td>"+isNull(obj.model)+"</td>";
						dom+="<td>"+obj.needNum+"</td>";
						dom+="<td>"+obj.unit+"</td>";
//						dom+="<td>"+obj.packUnit+"</td>"
//						dom+="<td>"+obj.packNum+"</td>";
						dom+="</tr>";
						
					});
					replenishInfo.append(dom);
					CommonUtils.ie8TrChangeColor();
					var processString = "";
					var isComplete = false;
					$.each(datas['process'],function(index,process){
						if(process.completeStatus=="不需要物料"){
							return false;
						}else if(process.completeStatus=="已齐套"){
							return true;
						}else{
							isComplete = true;
						}
						
					});
					if(isComplete){
						confirm(processString+"物料不齐套",function(){
    						$(".mask").css("display", "block");
    					});
					}else{
						alert("物料齐套，可以进行排产");
					}
					
				}
			}
		});	
	
	
	
}
function updateProcessStatus(datas){
	var processInfo =$("#processInfo");
 	var dom = "";
	processInfo.html("");
	$.each(datas,function(index,obj){
		dom+="<tr class='listTableText list_list'>";
		dom+="<td>"+(index+1)+"</td>";
		dom+="<td>"+obj.processName+"</td>";
		dom+="<td id = 'process"+(index+1)+"'>"+obj.completeStatus+"</td>";
		dom+="</tr>";
	});
	processInfo.append(dom);
	CommonUtils.ie8TrChangeColor();
}
$("#replenishInfoOk").click(function(){
	$("#loader").removeClass("hidden");
	$.ajax({
		url : "shopManagement/insertReplenishInfo",
		type : "POST",
		cache : false,
		async: true,
		data : {
			"replenishInfo":JSON.stringify(replenishInfos),
			"orderID":orderID
		},
	    success : function(data){
	    	$("#loader").addClass("hidden");
	    	if(data=="success"){
	    		backsupply();
	    		alert("发送补料单成功",function(){
	    			
	    		});
	    	}else if(data =="补料单已发送"){
	    		backsupply();
	    		alert("已发送补料清单，不可重复发送",function(){
	    			
	    		});
	    	}else{
	    		backsupply();
	    		alert(data,function(){
	    			
	    		});
	    		
	    	}
	    	
	    }
	});
});

function scheduling(){
	if(groupName=="工艺师"){
		return;
	}
	if(checkFlow()==1)return;
	$("#processInfo").find("tr").each(function(){
		var tdArr = $(this).children();
		var tdText = tdArr.eq(2).text();
		if(tdText=="未检查"){
			alert("请先进行齐套检查",function(){});
			return false;
		}else if(tdText == "已齐套"){
			$.ajax({
				url : "shopManagement/updateProcessStatus",
				type:"GET",
				cache : false,
				data : {
					"processStatusInfo":JSON.stringify(processStatusInfo)
				},
				success : function(data){
					if(data=="success"){
						window.location = base+"shopManagement/toProductionScheduling";
					}
				}
			   
			});
			
			return false;
		}else if(tdText == "未齐套"){
			alert("请补齐"+tdArr.eq(1).text()+"物料再进行排产",function(){});
			return false;
		}else if(tdText == "不需物料"){
			$.ajax({
				url : "shopManagement/updateProcessStatus",
				type:"GET",
				data : {
					"processStatusInfo":JSON.stringify(processStatusInfo)
				},
				success : function(data){
					if(data=="success"){
						window.location = base+"shopManagement/toProductionScheduling";
					}
				}
			   
			});
			return false;
		}else{
			alert("产品图号为空，请先定义工艺流程卡",function(){});
			return false;
		}
	});
	
}