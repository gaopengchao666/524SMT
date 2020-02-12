var finishSerial = [];
var processName;
//获得扫码枪数据
function getQRCode(data){
	if(groupName=="工艺师"){
		alert("权限不足");
		return;
	}
	//如果工序不是终检或终检返工则隐藏输入框失去焦点
	if(processType!="1"){
		if($("#msg_top").length==1){
			return;
		}
		//判断如果当前工序为终检或终检返工工序则调用不同的方法
		data = data.replace(/\+/g, "");
		data = data.replace(/[\r\n]/g, "");
		data = data.slice(4);
		var judgeResult = judge(data);
		var scanData = "";
		var type = 0;
		if(judgeResult=="number"){
			scanData = data+"";
			type = 1;
		}else{
			scanData = JSON.parse(data);
			type = scanData.type;
		}
		
		
		if(processType=="2"){
			finishCheck(scanData,type);
		}else{
			finishCheckMake(scanData,type);
		}
	}
}

function to2Fixed(data){
	return parseFloat(data).toFixed(2);
}

$(function() {
	queryOrder();
	queryProcess();
	queryProcessLog();
	
	
});
//日期转换方法
function dateFormat(date) {
	if (date) {
		return moment(date).format("YYYY-MM-DD HH:mm:ss");
	}
	return '';
};


// 完成添加失效模式
function okClick() {
	if(groupName=="工艺师"){
		alert("权限不足");
		return;
	}
	var processInfoLog = new Object();
	processInfoLog.processInfoID = processID;
	processInfoLog.startTime = $("#startTime").text();
	processInfoLog.overTime = $("#endTime").text();
	processInfoLog.productionPeopel = $("#checkPeople").text();
	processInfoLog.checkStatus = $("#checkStatus").text().toLowerCase();
	processInfoLog.serial = $("#serial").text();
	if(processInfoLog.checkStatus==""|processInfoLog.overTime==""){
		alert("扫描未完成");
		return;
	}
	//将失效模式添加至失效模式数组
	var failureModels = [];
	$("#addFailurModel").find("tr").each(function(){
		var tdArr = $(this).children();
		var failureModel = new Object();
		failureModel.name = tdArr.eq(0).text();
		failureModel.num = tdArr.eq(1).find("input").val();
		failureModels.push(failureModel);
	});
	if(processInfoLog.checkStatus=="ng"){
		if(failureModels.length==0){
			alert("请扫描失效模式");
			return;
		}
	}
	//将终检工序添加至表中
	$.ajax({
		url:"onProcessControllerNew/insertFailureModel",
		cache : false,
		data : {
			"processInfoLog" : JSON.stringify(processInfoLog),
			"failureModels" : JSON.stringify(failureModels),
			"processID" : processID,
			"type" : type
		},
		type : "GET",
		success : function(data){
			if(data=="finish"){
			    backsupply();
			    window.location = base+"onProcessControllerNew/toReportOrder?orderID="+orderID;
			}else if(data=="error"){
				alert("保存失败",function(){
					backsupply();
				});
			}else{
				finishSerial.push(processInfoLog.serial);
				processInfoLog.ID = data;
				//失效模式添加完成后增加一行工序记录
				var processLog = $("#processInfoLog");
				var dom  = "";
				dom += "<tr class='listTableText list_list'>";
				dom += "<td onclick = 'queryFailureModel("+JSON.stringify(processInfoLog)+")' class='cursor'>"+processInfoLog.serial+"</td>";
				dom +="<td>"+processInfoLog.startTime+"</td>"
				dom +="<td>"+processInfoLog.overTime+"</td>";
				dom +="<td>"+userName+"</td>";
				if(processInfoLog.checkStatus=="ng"){
					dom +="<td><font color = 'red'>"+processInfoLog.checkStatus.toUpperCase()+"</font></td>";
				}else{
					dom +="<td>"+processInfoLog.checkStatus+"</td>";
				}
				dom +="</tr>";
				processLog.append(dom);
				CommonUtils.ie8TrChangeColor();
				backsupply();
			}
		}
	});
	
}
//查询工单信息
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
		url : "onProcessControllerNew/queryProcess",
		type : "GET",
		cache : false,
		data : {
			"processID" : processID,
			"type" : type
		},
		success : function(data) {
			if (type == "2") {
				$("#processTable").text("工序返工计划信息列表");
				$("#processLogTable").text("工序返工记录信息列表");
				var json = JSON.parse(data);
				var processInfo = $("#processInfo");
				processInfo.html("");
				var dom = "";
				processName = json.processName;
				dom += "<tr class='listTableText list_list'>";
				dom += "<td>"+json.processName+"</td>";
				dom += "<td>"+json.station+"</td>";
				dom += "<td>"+json.principal+"</td>";
				dom += "<td>"+dateFormat(json.actualStartTime)+"</td>";
				dom += "<td>"+dateFormat(json.actualOverTime)+"</td>";
				dom += "<td>"+json.rePlanNum+"</td>";
				dom += "<td>"+json.reOverNum+"</td>";
				dom += "<td>"+to2Fixed(parseInt(json.reOverNum) / parseInt(json.rePlanNum)*100)+"%</td>";
				processInfo.append(dom);
				CommonUtils.ie8TrChangeColor();
			} else {
				var json = JSON.parse(data);
				var processInfo = $("#processInfo");
				processInfo.html("");
				var dom = "";
				processName = json.processName;
				dom += "<tr class='listTableText list_list'>";
				dom += "<td>"+json.processName+"</td>";
				dom += "<td>"+json.station+"</td>";
				dom += "<td>"+json.principal+"</td>";
				dom += "<td>"+dateFormat(json.actualStartTime)+"</td>";
				dom += "<td>"+dateFormat(json.actuOverTime)+"</td>";
				dom += "<td>"+json.planNum+"</td>";
				dom += "<td>"+json.overNum+"</td>";
				dom += "<td>"+to2Fixed((parseInt(json.overNum) / parseInt(json.planNum))*100)+"%</td>";
				processInfo.append(dom);
				CommonUtils.ie8TrChangeColor();
			}
		}
	});

}

function queryProcessLog() {
	$.ajax({
		url : "onProcessControllerNew/queryProcessLog",
		cache : false,
		data : {
			"processID" : processID,
			"type" : type
		},
		type : "GET",
		success : function(data) {
			showProcessLog(data);

		}
		

	});
}
function showProcessLog(data) {
	var datas = eval(data);
	var processType = datas[0];
	var dataJson = JSON.parse(data[1]);
	var headDom = "";
	var dom = "";
	var processLogHead = $("#processInfoLogHead");
	processLogHead.html("");
	var processLog = $("#processInfoLog");
	processLog.html("");
	if (type == "1") {
		headDom += "<tr class='menuText list_head'>";
		headDom += "<th>序列号</th>";
		headDom += "<th>开始时间</th>";
		headDom += "<th>完工时间</th>";
		if (processType == "1") {
			headDom += "<th>生产员</th>";
		} else {
			headDom += "<th>检验员</th>";
		}
		if (processType == "2"|processType=="3") {
			headDom += "<th>检验结果</th>";
		}
		
		headDom+="</tr>";
		processLogHead.append(headDom);

		$.each(dataJson, function(index, obj) {
			finishSerial.push(obj.serial+"");
			dom += "<tr class='listTableText list_list'>";
			if (processType == "3") {
				dom += "<td onclick = 'queryFailureModel("+JSON.stringify(obj)+")' class='cursor'>"+obj.serial+"</td>";
			}else{
			dom += "<td>" + obj.serial + "</td>";
			}
			dom += "<td>" + dateFormat(obj.startTime) + "</td>";
			dom += "<td>" + dateFormat(obj.overTime) + "</td>";
			dom += "<td>" + obj.productionPeopel + "</td>";
			if (processType != "1") {
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

	} else {
		headDom += "<tr class='menuText list_head'>";
		headDom += "<th>序列号</th>";
		headDom += "<th>开始时间</th>";
		headDom += "<th>完工时间</th>";
		if (processType == "1") {
			headDom += "<th>生产员</th>";
		} else {
			headDom += "<th>检验员</th>";
		}
		if (processType == "2"|processType=="3") {
			headDom += "<th>检验结果</th>";
		}
		headDom += "</tr>";
		processLogHead.append(headDom);

		$.each(dataJson, function(index, obj) {
			dom += "<tr class='listTableText list_list'>";
			if (processType == "3") {
				dom += "<td  onclick = 'queryFailureModel("+JSON.stringify(obj)+")' class='cursor'>"+ obj.serial + "</td>";
			}else{
			dom += "<td>" + obj.serial + "</td>";
//			$.ajax({
//				url : "onProcessControllerNew/selectReFinishMakeCheckStatus?serial="+obj.serial,
//				async : false,
//				cache : false,
//				type : "GET",
//				success : function(data){
//					if(data=="y"){
//						finishSerial.push(obj.serial+"");
//					}
//				}
//			});
			}
			dom += "<td>" + dateFormat(obj.startTime) + "</td>";
			dom += "<td>" + dateFormat(obj.endTime) + "</td>";
			dom += "<td>" + obj.productionPeople + "</td>";
			if (processType == "2") {
				if(obj.status=="ng"){
					dom += "<td><font color = 'red'>" + obj.status.toUpperCase() + "</font></td>"
				}else{
					dom += "<td>" + obj.status.toUpperCase() + "</td>"
				}
				if(obj.status=="ok"){
					finishSerial.push(obj.serial+"");	
				}
			}else if(processType == "3"){
				if(obj.status=="ng"){
					dom += "<td><font color = 'red'>" + obj.status.toUpperCase() + "</font></td>"
				}else{
					dom += "<td>" + obj.status.toUpperCase() + "</td>"
				}
				if(obj.checkStatus=="ok"){
					finishSerial.push(obj.serial+"");	
				}
			}
			dom += "</tr>";
			
			
		});
		processLog.append(dom);
		CommonUtils.ie8TrChangeColor();
	}

}

function queryFailureModel(obj) {
	var objID;
	if(type==2){
		objID = obj.id;
		$("#endTime").text(dateFormat(obj.endTime));
		$("#checkStatus").text(obj.status);
		$("#checkPeople").text(obj.productionPeople);
	}else{
		objID = obj.ID;
		$("#endTime").text(dateFormat(obj.overTime));
		$("#checkStatus").text(obj.checkStatus);
		$("#checkPeople").text(obj.productionPeopel);
	}
	$("#closeMask").show();
	$("#ok").hide();
	$("#serial").text(obj.serial);
	$("#processName").text(processName);
	
	$("#startTime").text(dateFormat(obj.startTime));
	
	
     $.ajax({
    	 url:"onProcessControllerNew/queryFailureModel?id="+objID+"&type="+type,
         type:"GET",
         cache : false,
         success : function(data){
        	 var datas = eval(data);
        	 var failureModel = $("#addFailurModel");
        	 failureModel.html("");
        	 var dom  = "";
        	 $.each(datas,function(index,obj){
        		 dom+="<tr class='listTableText list_list'>";
            	 dom+="<td colspan='3'>"+obj.failureModelName+"</td>";
            	 dom+="<td colspan='3'>"+obj.failureModelNum+"</td>";
            	 dom+="</tr>";
        	 });
        	 failureModel.append(dom);
        	 CommonUtils.ie8TrChangeColor();
        	 $(".mask").css("display", "block");
         }
     });
}
//终检制作工序
function finishCheckMake(scanData,fType){
//	for(var i = 0;i<finishSerial.length;i++){
//		if(scanData==finishSerial[i]){
//			alert("请勿重复扫描pcb板");
//			return;
//		}
//	}
	var isok = false;
	if(fType!=1){
		return;
	}
	$.ajax({
		url : "onProcessControllerNew/selectPcbIsReProcess",
		type : "GET",
		cache: false,
		async : false,
		data : {
			"pcbCode" : scanData,
			"type": type,
			"processID" : processID,
			"orderID" : orderID
		},
		success:function(data){
			if(data=="error"){
				alert("非本工单pcb板");
				isok = true;
			}else if(data=="n"){
				alert("此pcb板不在当前工序内");
				isok = true;
			}
		}
		
	});
	if(isok){
		return;
	}
	if(fType == 1){
		var processLog = $("#processInfoLog");
		var trArr = processLog.find("tr").children();
		var endTime = "";
		if(trArr.length!=0){
			var trArr = $("#processInfoLog").find("tr");
			var tdArr = trArr.eq(trArr.length-1).children();
			endTime = tdArr.eq(2).text();
		}
		if(trArr.length==0|endTime!=""){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+scanData+"</td>";
			dom +="<td>"+dateFormat(new Date())+"</td>"
			dom +="<td></td>";
			dom +="<td>"+userName+"</td>";
			dom +="</tr>";
			processLog.append(dom);
			CommonUtils.ie8TrChangeColor();
		}else{
			var trArr = $("#processInfoLog").find("tr");
			var tdArr = trArr.eq(trArr.length-1).children();
			if(tdArr.eq(0).text()==scanData){
				finishSerial.push(scanData);
				tdArr.eq(2).text(dateFormat(new Date()));
				var processLog = new Object();
				processLog.serial = tdArr.eq(0).text();
				processLog.startTime = tdArr.eq(1).text();
				processLog.endTime = tdArr.eq(2).text();
				processLog.makePeople = tdArr.eq(3).text();
				$.ajax({
					url : "onProcessControllerNew/insertFinishChcekMake",
					type : "GET",
					async : false,
					data : {
						"processID" : processID,
						"processLog":JSON.stringify(processLog)
					}
				});
				
			}else{
				alert("未扫描完成");
			}
		}
		

		
	}
}

function finishCheck(scanData,fType){
//	for(var i = 0;i<finishSerial.length;i++){
//		if(scanData==finishSerial[i]){
//			alert("请勿重复扫描pcb板");
//			return;
//		}
//	}
	var isok = false;
	if(fType==1){
		$.ajax({
			url : "onProcessControllerNew/selectPcbIsReProcess",
			type : "GET",
			cache: false,
			async : false,
			data : {
				"pcbCode" : scanData,
				"type": type,
				"processID" : processID,
				"orderID" : orderID
			},
			success:function(data){
				if(data=="error"){
					alert("非本工单pcb板");
					isok = true;
					return;
				}else if(data=="n"){
					alert("此pcb板不在当前工序内");
					isok = true;
					return;
				}
			}
			
		});	
	}
	if(isok){
		return;
	}
	$("#closeMask").hide();
	$("#ok").show();
	if (fType == 1) {
		if ($(".mask").css("display")=="none") {
			$(".mask").css("display", "block");
			$("#serial").text(scanData);
			$("#startTime").text(dateFormat(new Date()));
			$("#checkPeople").text(userName);
			$("#processName").text(processName);
		} else {
			if ($("#endTime").text() == "") {
				$("#endTime").text(dateFormat(new Date()));
			}
			
			
		}

	} else if (fType == 2) {
		if ($(".mask").css("display")=="block") {
			$("#checkStatus").html("OK");
		} 
	} else if (fType == 3) {
		if ($(".mask").css("display")=="block") {
			$("#checkStatus").text("NG");
			$("#checkStatus").css("color","red");
		} 
	}else if(fType == 4){
		if ($(".mask").css("display")=="block") {
			if($("#checkStatus").text()==""){
				alert("请先扫描检验结果");
				return ;
			}else if($("#checkStatus").text()=="OK"){
				return ;
			}
		var failrModel = $("#addFailurModel");
		
		var trList = failrModel.children("tr");
		
		for(var i = 0;i<trList.length;i++){
			var failrModelText = trList.eq(i).find("td").eq(0).text();
			if(scanData.info==failrModelText){
				alert("当前失效模式已添加");
				return;
			}
		}
		
		var dom = "";
		dom += "<tr class='listTableText list_list'>";
		dom += "<td colspan='3'>"+scanData.info+"</td>";
		dom += "<td colspan='3'><input name = 'failureNum' /></td>";
		dom += "</tr>";
	    failrModel.append(dom);
	    CommonUtils.ie8TrChangeColor();
		}
	}
}

function backsupply(){
	$(".mask").css("display","none");
	maskToNull();
}
//失效模式框置空
function maskToNull(){
	//将失效模式添加框的内容置空，便于下次输入
	$("#serial").text("");
	$("#processName").text("");
	$("#checkPeople").text("");
	$("#startTime").text("");
	$("#endTime").text("");
	$("#checkStatus").text("");
	//将失效模式表格置空
	var failureModel = $("#addFailurModel");
	failureModel.html("");
}

function judge(string){
    try{
        if(typeof JSON.parse(string) == "object"){
            return "json";
        }else{
            var n = Number(string);
            if(!isNaN(n)){
                if(string.length==7){
                     return "number";
                }else{
                     return "error";
                }
            }else{
                return "error";
            }
        }
    }catch(e){
        return "error";
    }
   
}

function returnOnProcess(){
	window.location = base + "onProcessControllerNew/toOnProcess?orderID="+orderID;
}

	

