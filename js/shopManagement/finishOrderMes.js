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
			dom+="<td>"+to2Fixed(datas.overNum/datas.planNum*100)+"%</td>";
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
				dom+="<td>"+obj.processName+"</td>";
				dom+="<td>"+obj.planNum+"</td>";
				dom+="<td>"+obj.overNum+"</td>";
				dom+="<td>"+to2Fixed(obj.overNum/obj.planNum*100)+"%</td>";
				dom+="</tr>";
				orderAllTime += obj.allWorkTime;
				orderZT*=obj.ftq;
				orderYICI = obj.ftq;
			});
			processInfo.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
		
	});
}
