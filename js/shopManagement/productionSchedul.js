var principal;
var stations;
$(function(){
	queryPrincipal();
	queryOrder();
	queryProcess();
});
function dateFormat(date){
    if (date){
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
    return '';
};
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
			dom+="<td>"+datas.planCode+"</td>";
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



function queryProcess(){
	
	$.ajax({
		url : "shopManagement/selectProcessByOrderID?orderID="+orderID,
		type : "GET",
		cache : false,
		async : false,
		success : function(data){
			var processs = eval(data);
			var processInfo =$("#processInfo");
		 	var dom = "";
			processInfo.html("");
			$.each(processs,function(index,obj){
				dom+="<tr class='listTableText list_list'>";
				dom+="<td>"+obj.processName+"</td>";
				dom+="<td><select name='station' class='selectWidth'>";
				if(obj.type!=2){
					queryStation(obj.processName);	
				}
				$.each(stations,function(index,station){
				dom+="<option value='"+station+"'>"+station+"</option>";
				});
				dom+="</select>";
				dom+="</td>";
				
				var pIndex = index;
				if(pIndex%2==0){
					dom+="<td id = "+pIndex+"><select  name='principal' class='selectWidth' onchange = 'change("+pIndex+","+principal.length+",this[selectedIndex].value)' >";
					$.each(principal,function(index,principal){
					dom+="<option value='"+principal+"'>"+principal+"</option>";
					});
					dom+="</select>";
					dom+="</td>";	
				}else{
					dom+="<td><input readonly = 'true' id ='font"+pIndex+"' value = ' "+principal[0]+"'/></td>"
				}
				dom+="<td>未开始</td>";
				dom+="<td>未开始</td>";
				dom+="<td>"+obj.planNum+"</td>";
				dom+="<td>0</td>";
				dom+="<td>0%</td>";
				dom+="<td>未开工</td>";
				dom+="<td></td>";
				dom+="</tr>";
			});
			processInfo.append(dom);
			CommonUtils.ie8TrChangeColor();
		}
		
	});
}

function change(id,length,value){
	
	if(id!=length){
		id = id+1;
	  $("#font"+id).val(" "+value);
	}
}
//保存排产信息
function schedulSave(){
	var startCodeRange = $("#startCodeRange").val();
	var endCodeRange = $("#endCodeRange").val();
	var processArr = [];
	if (startCodeRange.length == 0 || endCodeRange.length == 0){
	    alert("起始结束序列号不能为空");
	    return;
	}
	if (parseInt(endCodeRange) < parseInt(startCodeRange)){
	    alert("结束序列号不能小于起始序列号");
        return;
	}
	if (endCodeRange.length != 7 || startCodeRange.length !=7){
	    alert("起始序列号和结束序列号的长度必须为7位");
        return;
	}
	
	$("#processInfo").find("tr").each(function(){
		var tdArr = $(this).children();
		var process  = new Object();
		process.proceName = tdArr.eq(0).text();
		process.station = tdArr.eq(1).find("select").val();
		if(tdArr.eq(2).find("select").val()){
			process.principal = tdArr.eq(2).find("select").val();
		}else{
			process.principal = tdArr.eq(2).find("input").val();	
		}
		
		processArr.push(process);
	});
	$("#loader").removeClass("hidden");
	$.ajax({
		url : "shopManagement/saveSchedulInfo",
		type : "POST",
		cache : false,
		data : {
			"startCodeRange" : startCodeRange,
			"endCodeRange" : endCodeRange,
			"processArr" : JSON.stringify(processArr),
			"orderID" : orderID
		},
		success : function(){
			$("#loader").addClass("hidden");
			//更新待办事项状态
	        self.parent.menuFrame.updateWorkBeach();
			alert("保存成功",function(data){
			    if (data){
			        window.location = base +"shopManagement/toShopManagement";
			    }
			});
		}
	});
}

function schedulCancle(){
	window.location = base +"shopManagement/toCompleteCheck?oderID="+orderID;
}

function queryPrincipal(){

	$.ajax({
		//查询所有操作员的姓名
		url : "shopManagement/queryAllPrincipal",
		type : "GET",
		cache : false,
		async : false,
		success:function(data){
			principal = data;
		}
	});
}

function queryStation(processName){
	var url = encodeURI("shopManagement/queryAllStation?processName="+processName);
	$.ajax({
	   //查询所有的工位
		url : url,
		type : "GET",
		cache : false,
		async : false,
		success:function(data){
			stations = data;
		}
	});
}