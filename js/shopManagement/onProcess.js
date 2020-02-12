var h = document.documentElement.clientHeight;
$(".wrap").css("height", h);

// 获取每行 td 的兄弟节点
$("td").hover(function() {
	$(this).parent().children().addClass("td_hover");
}, function() {
	$(this).parent().children().removeClass("td_hover");
});

function to2Fixed(data){
	return parseFloat(data).toFixed(2);
}
$(function(){
	queryOrder();
	queryProcess();
	queryReProcess();
});
function dateFormat(date){
    if (date){
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
    return '';
};
function queryOrder() {
	$.ajax({
		url : "shopManagement/selectOrderByID?orderID=" + orderID,
		type : "GET",
		cache : false,
		success : function(data) {
			var tableList = $("#orderInfo");
			tableList.html("");
			var datas = eval(data);
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>" + datas.planCode + "</td>";
			dom += "<td>" + datas.productImageCode + "</td>";
			dom += "<td>" + datas.productName + "</td>";
			dom += "<td>" + datas.projectCode + "</td>";
			dom += "<td>"+datas.startCodeRange+"-"+datas.endCodeRange+"</td>";
			dom += "<td>" + datas.planNum + "</td>";
			dom += "<td>"+datas.overNum+"</td>";
			dom+="<td>"+datas.planStartTimeString+"</td>";
			dom+="<td>"+datas.planOverTimeString+"</td>";
			dom += "<td>" + dateFormat(datas.actualStartTime) + "</td>";
			dom += "<td>" + dateFormat(datas.actualOverTime) + "</td>";
			var progress = datas.orderProgress.split(":");
			var progress1 = parseInt(progress[0]);
			var progress2 = parseInt(progress[1]);
			dom += "<td>"+to2Fixed(progress1/progress2*100)+"%</td>";
			dom += "<td>"+datas.orderState+"</td>"
			var remark = datas.info == null ? "" : datas.info;
			dom += "<td class='td_ellipsis' title='"+remark+"'>" + remark + "</td>";
			tableList.append(dom);
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
				dom+="<td onclick = 'toProcessLog("+obj.id+",1)' class='cursor'>"+obj.processName+"</td>";
				dom+="<td>"+obj.station+"</td>";
				dom+="<td>"+obj.principal+"</td>";
				dom+="<td>"+dateFormat(obj.actualStartTime)+"</td>";
				dom+="<td>"+dateFormat(obj.actuOverTime)+"</td>";
				dom+="<td>"+obj.planNum+"</td>";
				dom+="<td>"+obj.overNum+"</td>";
				dom+="<td>"+to2Fixed((parseInt(obj.overNum)/parseInt(obj.planNum)*100))+"%</td>";
				dom+="<td>"+obj.processStatus+"</td>";
				dom+="</tr>";
			});
			processInfo.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
		
	});
}

function queryReProcess(){
	$.ajax({
		url : "onProcessControllerNew/queryReProcess?orderID="+orderID,
		cache :false,
		type : "GET",
		success : function(data){
			var datas = eval(data);
			var reProcessInfo = $("#reProcessInfo");
			reProcessInfo.html = "";
			var dom = "";
			$.each(datas,function(index,obj){
			dom+="<tr class='listTableText list_list'>";
			dom+="<td onclick = 'toProcessLog("+obj.id+",2)' class='cursor'>"+obj.processName+"</td>";
			dom+="<td>"+obj.station+"</td>";
			dom+="<td>"+obj.principal+"</td>";
			dom+="<td>"+dateFormat(obj.actualStartTime)+"</td>";
			dom+="<td>"+dateFormat(obj.actualOverTime)+"</td>";
			dom+="<td>"+obj.rePlanNum+"</td>";
			dom+="<td>"+obj.reOverNum+"</td>";
			dom+="<td>"+(parseInt(obj.reOverNum)/parseInt(obj.rePlanNum)*100)+"%</td>";
			dom+="<td>"+obj.reProcessStatus+"</td>";
			});
			reProcessInfo.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
	});
}

function toProcessLog(id,type){
	window.location = base+"onProcessControllerNew/toProcessLog?processID="+id+"&type="+type+"&orderID="+orderID;
	
}