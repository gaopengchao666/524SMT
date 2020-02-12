var zhitong;
var yici;

$(function(){
	queryOrder();
	queryProcess();
});
function dateFormat(date){
    if (date){
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
    return '';
};

function to2Fixed(data){
	return parseFloat(data).toFixed(2);
}
function queryOrder(){
	$.ajax({
		url : "shopManagement/selectOrderByID?orderID="+orderID,
		type : "GET",
		cache : false,
		success : function(data){
			var tableList = $("#orderInfo");
			tableList.html("");
			var datas = eval(data);
			if(datas.orderState=="已完工"){
			    $("#overOrderButton").hide();
			}
			var dom = "";
			dom+="<tr class='listTableText list_list'>";
			dom+="<td>"+datas.planCode
			+"</td>";
			dom+="<td>"+datas.productImageCode+"</td>";
			dom+="<td>"+datas.productName+"</td>";
			dom+="<td>"+datas.projectCode+"</td>";
			dom+="<td>"+datas.planNum+"</td>";
			dom+="<td>"+datas.overNum+"</td>";
			dom+="<td>"+datas.planStartTimeString+"</td>";
			dom+="<td>"+datas.planOverTimeString+"</td>";
			dom+="<td>"+dateFormat(datas.actualStartTime)+"</td>";
			dom+="<td>"+dateFormat(datas.actualOverTime)+"</td>";
			var progress = datas.orderProgress.split(":");
			var progress1 = parseInt(progress[0]);
			var progress2 = parseInt(progress[1]);
			dom += "<td>"+to2Fixed(progress1/progress2*100)+"%</td>";
			dom+="<td>"+datas.orderState+"</td>"
			var remark = datas.info == null ? "" : datas.info;
			dom+="<td class='td_ellipsis' title='"+remark+"'>"+remark+"</td>";
			tableList.append(dom);
			CommonUtils.ie8TrChangeColor();
		}	
	});
}
function queryProcess(){
	$.ajax({
		url : "onProcessControllerNew/finishOrderProcess?orderID="+orderID,
		type : "GET",
		cache : false,
		success : function(data){
			var datas = eval(data);
			var processInfo =$("#processInfo");
		 	var dom = "";
			processInfo.html("");
			var orderAllTime = 0.0;
			var orderZT = 1.0;
			var orderYICI;
			$.each(datas,function(index,obj){
				dom+="<tr class='listTableText list_list'>";
				dom+="<td onclick = 'toFinishProcess("+obj.id+")'>"+obj.processName+"</td>";
				dom+="<td>"+obj.station+"</td>";
				dom+="<td>"+obj.principal+"</td>";
				dom+="<td>"+to2Fixed(obj.allWorkTime)+"</td>";
				dom+="<td>"+to2Fixed(obj.meanWorkTime)+"</td>";
				dom+="<td>"+obj.planNum+"</td>";
				dom+="<td>"+obj.overNum+"</td>";
				dom+="<td>"+to2Fixed(obj.overNum/obj.planNum*100)+"%</td>";
				dom+="<td>"+to2Fixed(obj.ftq*100)+"%</td>";
				dom+="</tr>";
				orderAllTime += obj.allWorkTime;
				orderZT*=obj.ftq;
				orderYICI = obj.ftq;
			});
			zhitong = orderZT;
			yici = orderYICI;
			$("#orderAllTime").text(to2Fixed(orderAllTime));
			$("#orderMeanTime").text(to2Fixed(orderAllTime/datas.length));
			$("#orderZhitong").text(to2Fixed(orderZT*100)+"%");
			$("#orderYICI").text(to2Fixed(orderYICI*100)+"%");
			
			processInfo.append(dom);
			
			CommonUtils.ie8TrChangeColor();
		}
		
	});
}

//点击完工汇报
function overOrder(){
	
	if(groupName=="工艺师"){
		alert("权限不足");
		return;
	}
	$.ajax({
		url : "onProcessControllerNew/reportOrder",
		type : "GET",
		cache : false,
		data : {
			"orderID" : orderID,
			"orderYield" : $("#orderYICI").text(),
			"orderZhitong" : $("#orderZhitong").text(),
			"zhitong" : zhitong,
			"yici" : yici
		}, 
		success : function(data){
		    //更新待办事项状态
	        self.parent.menuFrame.updateWorkBeach();
			if(data=="success"){
				window.location = base +"shopManagement/toShopManagement";
			}
		}
	});
}
//点击返回
function orderReturn(){
	window.location = base + "shopManagement/toShopManagement";
}
//点击查看工序详情
function toFinishProcess(id){
    window.location = base +"onProcessControllerNew/toFinishProcessInfo?processID="+id;
}