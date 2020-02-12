var type;

$(function() {
	queryOrder();
	queryProcess();
	queryProcessLog();
	
	
});

function to2Fixed(data){
	return parseFloat(data).toFixed(2);
}

//日期转换方法
function dateFormat(date) {
	if (date) {
		return moment(date).format("YYYY-MM-DD HH:mm:ss");
	}
	return '';
};
//查询工单信息
function queryOrder() {
	$.ajax({
		url : "shopManagement/selectOrderByID?orderID=" + orderID,
		type : "GET",
		cache : false,
		async : false,
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
			dom += "<td>" + datas.startCodeRange+"-"+datas.endCodeRange + "</td>";
			dom += "<td>"+datas.planNum+"</td>";
			dom += "<td>"+datas.overNum+"</td>";
			dom+="<td>"+datas.planStartTimeString+"</td>";
			dom+="<td>"+datas.planOverTimeString+"</td>";
			dom += "<td>"+dateFormat(datas.actualStartTime)+"</td>";
			dom += "<td>"+dateFormat(datas.actualOverTime)+"</td>";
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

function queryProcess() {
	$.ajax({
		url : "onProcessControllerNew/queryFinishProcess",
		type : "GET",
		cache : false,
		async : false,
		data : {
			"processID" : processID,
		},
		success : function(data) {
			var datas = eval(data);
			type = datas.type;
			var processInfo = $("#processInfo");
			processInfo.html("");
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+datas.processName+"</td>";
			dom += "<td>"+datas.station+"</td>";
			dom += "<td>"+datas.principal+"</td>";
			dom += "<td>"+dateFormat(datas.actualStartTime)+"</td>";
			dom += "<td>"+dateFormat(datas.actuOverTime)+"</td>";
			dom += "<td>"+datas.planNum+"</td>";
			dom += "<td>"+datas.overNum+"</td>";
			dom += "<td>"+parseInt(datas.overNum) / parseInt(datas.planNum)*100+"%</td>";
			processInfo.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
	});

}

function queryProcessLog() {
	$.ajax({
		url : "onProcessControllerNew/queryFinishProcessLog",
		cache : false,
		async : false,
		data : {
			"processID" : processID,
		},
		type : "GET",
		success : function(data) {
			var datas = eval(data);
			var headDom = "";
			var dom = "";
			var processLogHead = $("#processInfoLogHead");
			processLogHead.html("");
			var processLog = $("#processInfoLog");
			processLog.html("");
			headDom += "<tr class='menuText list_head'>";
			headDom += "<th>序列号</th>";
			headDom += "<th>开始时间</th>";
			headDom += "<th>完工时间</th>";
			if (type == "1") {
				headDom += "<th>生产员</th>";
			} else {
				headDom += "<th>检验员</th>";
				headDom += "<th>检验结果</th>";
			}
			headDom+="</tr>";
			processLogHead.append(headDom);
			$.each(datas, function(index, obj) {
				dom += "<tr class='listTableText list_list'>";
				if (type == "3") {
					dom += "<td>"+obj.serial+"</td>";
				}else{
				dom += "<td>" + obj.serial + "</td>";
				}
				dom += "<td>" + dateFormat(obj.startTime) + "</td>";
				dom += "<td>" + dateFormat(obj.overTime) + "</td>";
				dom += "<td>" + obj.productionPeopel + "</td>";
				if (type != "1") {
					if(obj.checkStatus=="ng"){
						dom += "<td><font color = 'red'>" + obj.checkStatus.toUpperCase() + "</font></td>"	
					}else{
						dom += "<td>" + obj.checkStatus.toUpperCase() + "</td>"	
					}
					
				}
				dom += "</tr>";
			});
			processLog.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
		

	});
	$.ajax({
		url : "onProcessControllerNew/queryReFinishProcessLog",
		cache : false,
		async : false,
		data : {
			"processID" : processID,
			"type" : type
		},
		type : "GET",
		success : function(data) {
			var datas = eval(data);
			var headDom = "";
			var dom = "";
			var processLog = $("#processInfoLog");
			$.each(datas, function(index, obj) {
				dom += "<tr class='listTableText list_list'>";
				if (type == "3") {
					dom += "<td>"+obj.serial+"</td>";
				}else{
				dom += "<td>" + obj.serial + "</td>";
				}
				dom += "<td>" + dateFormat(obj.startTime) + "</td>";
				dom += "<td>" + dateFormat(obj.endTime) + "</td>";
				dom += "<td>" + obj.productionPeople + "</td>";
				if (type != "1") {
					if(obj.status=="ng"){
						dom += "<td><font color = 'red'>" + obj.status.toUpperCase() + "</font></td>"
					}else{
						dom += "<td>" + obj.status.toUpperCase() + "</td>"
					}
					
				}
				dom += "</tr>";
			});
			processLog.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
		

	});
}

function toFinish(){
	window.location = base+"onProcessControllerNew/toReportOrder?orderID="+orderID;
}