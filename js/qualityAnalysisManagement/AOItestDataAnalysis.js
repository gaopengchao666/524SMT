window.AOITestDataAnalysis = (function($, module) {
	/**
	 * 初始化函数
	 */
	function init(){
		bindEvent();				
	}
	
	/**
	 * 绑定事件
	 */
	function bindEvent(){
		getAOIData();	
	}
	
	//统计条件
	$("input[name='s_type1']").click(function(){
		if($("input[name='s_type1']:checked").val() == 1){
			$(".workOrder").hide();
			$(".testTime").show();
			$("#planCode1").val("");
			$("#drawingCode1").val("");
			
			$(".select_text").find(":input").val("");
			$(".select_text").find("select").prop('selectedIndex', 0);
			//清空日期校验
			$("input[name='startTime1']").datepicker("option","maxDate",null);
			$("input[name='endTime1']").datepicker("option","minDate",null);
			
			getAOIData();
			
		}else{
			$(".testTime").hide();
			$(".workOrder").show();
			$("#startTime1").val("");
			$("#endTime1").val("");
			$("input[name='startTime1']").datepicker("option","maxDate",null);
			$("input[name='endTime1']").datepicker("option","minDate",null);
			
			$(".select_text").find(":input").val("");
			$(".select_text").find("select").prop('selectedIndex', 0);
			//清空日期校验
			$("input[name='startTime1']").datepicker("option","maxDate",null);
			$("input[name='endTime1']").datepicker("option","minDate",null);
			
			getAOIData();
		}
	});
	
	$("input[name='s_type2']").click(function(){
		if($("input[name='s_type2']:checked").val() == 3){
			$(".workOrder2").hide();
			$(".testTime2").show();
			$("#planCode2").val("");
			$("#drawingCode2").val("");
			
			$(".select_text").find(":input").val("");
			$(".select_text").find("select").prop('selectedIndex', 0);
			//清空日期校验
			$("input[name='startTime2']").datepicker("option","maxDate",null);
			$("input[name='endTime2']").datepicker("option","minDate",null);
			
			getAoiTestResult();
			
		}else{
			$(".testTime2").hide();
			$(".workOrder2").show();
			$("#startTime2").val("");
			$("#endTime2").val("");
			$("input[name='startTime2']").datepicker("option","maxDate",null);
			$("input[name='endTime2']").datepicker("option","minDate",null);
			
			$(".select_text").find(":input").val("");
			$(".select_text").find("select").prop('selectedIndex', 0);
			//清空日期校验
			$("input[name='startTime2']").datepicker("option","maxDate",null);
			$("input[name='endTime2']").datepicker("option","minDate",null);
			
			getAoiTestResult();
			
		}
	});
	
	//首页数据查询
	function getAOIData(){
		var planCode = $("#planCode1").val();
		var drawingCode = $("#drawingCode1").val();
		var startTime = $("#startTime1").val();
		var endTime = $("#endTime1").val();
		var seachType = $("input[name='s_type1']:checked").val();
		$.ajaxSetup({cache : false});
		$("#loader").removeClass("hidden");
		$.ajax({			
			type:"GET",
			async:"true",
			url:"qualityAnalysis/getAOIData",
			data:{"startTime":startTime,"endTime":endTime,"planCode":encodeURI(planCode),"drawingCode":encodeURI(drawingCode),"seachType":seachType},
			success:function(data){
				showGraph(data);
				showListTable(data);
				showNGList(data);
				$("#loader").addClass("hidden");
			}
			
		});
	}
	
	//首页页签点击时间
	$(".aoiTestStatics").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime1']").datepicker("option","maxDate",null);
		$("input[name='endTime1']").datepicker("option","minDate",null);
		getAOIData();
	});
	
	//首页查询按钮事件
	$("#btn_search1").click(function(){
		getAOIData();
	});	
	//首页重置按钮事件
    $("#btn_clear1").click(function(){
    	$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime1']").datepicker("option","maxDate",null);
		$("input[name='endTime1']").datepicker("option","minDate",null);
		bindEvent();
	});
	//分析图展示
	function showGraph(data){
		var data_x = data['ngNameList'];
		var data_y_line = data['ngLineList'];
		var data_y_bar = data['ngBarList'];
		var myChart = echarts.init(document.getElementById('NGCharts'));
		myChart.clear();
		option = {
			    tooltip: {
			        trigger: 'axis'
			    },
			    grid:{
			    	x:35,
			    	y:30,
			    	x2:35,
			    	y2:25,
			    	borderWidth:1
			    },
			  toolbox: {
			        show: false,
			        feature: {
                       dataView: {readOnly: false},
			            restore: {},
			            saveAsImage: {}
			        }
			    },
			    dataZoom: {
			        show: false,
			        start: 0,
			        end: 100
			    },
			    xAxis: [
			        {
			            type: 'category',
			            boundaryGap: true,
			            data: data_x
			        } ,
			        {
			            type: 'category',
			            boundaryGap: true,
			            show : false,
			            data:data_x
			        }  
			    ],
			    yAxis: [
			        {
			            type: 'value',
			            scale: true,
			            name: '%',
			            max: 100,
			            min: 0,
			            splitNumber:10,
			            splitLine:{
			            	show:false
			            }
			        },
			        {
			            type: 'value',
			            scale: true,
			            name: '数量',
			            max: function(value){
			            	if((value.max)%10 == 0){
			            		return value.max + 10;
			            	}else{
			            		return value.max + (10-(value.max%10));
			            	}
			            },
			            min: 0,
			            splitNumber:10		          
			        }
			    ],
			    series: [
			        {
			            name:'数量',
			            type:'bar',
			            xAxisIndex: 1,
			            yAxisIndex: 1,
			            data:data_y_bar,
			            barWidth:'20%'
			        },
			        {
			            name:'%',
			            type:'line',
			            symbol:'circle',
			            symbolSize:3,
			            data:data_y_line
			        }
			    ],
			    color:['#87CEFA','#FF6BB5','#FF7F50','#DA70D6','#32CD32','#FFA500','#FF0000','#2EC7C9','#BB9FD0','#FF69B4','#C4E779']
			};

		myChart.setOption(option);
	}	
	//PCB板子统计信息
	function showListTable(data){
		$("#showList").html("");
    	var obj = data['pcbMassage'];   
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+obj.pcbSum+"</td>";
			dom += "<td>"+obj.pcbOkSum+"</td>";
			dom += "<td>"+obj.pcbNgSum+"</td>";
			dom += "<td>"+obj.ppm+"</td>";
			dom += "<td>"+obj.compQty+"</td>";
			dom += "<td>"+obj.firstNgSum+"</td>";
			dom += "<td>"+obj.okNgSum+"</td>";
			dom += "<td>"+obj.dpmo+"</td></tr>";
			$("#showList").append(dom);
	}
	//NG失效模式统计
	function showNGList(data){
		$("#showNG").html("");
    	var datas = data['ngMassage'];
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+obj.ngName+"</td>";
			dom += "<td>"+obj.ngNum+"</td></tr>";			
			$("#showNG").append(dom);
		}); 
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	
	//AOI检测结果
	$(".aoiTestResult").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime2']").datepicker("option","maxDate",null);
		$("input[name='endTime2']").datepicker("option","minDate",null);
		getAoiTestResult(); 
	});
	$("#searchClick2").click(function(){
		getAoiTestResult();
	});
	$("#clearClick2").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime2']").datepicker("option","maxDate",null);
		$("input[name='endTime2']").datepicker("option","minDate",null);
		getAoiTestResult();
	});
	//按工单汇总信息
	function getAoiTestResult(){
		var startTime = $("#startTime2").val();
		var endTime = $("#endTime2").val();
		var planCode = $("#planCode2").val();
		var drawingCode = $("#drawingCode2").val();
		$.ajaxSetup({cache : false});
		var url = 'qualityAnalysis/getAOIResultData';
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"startTime":startTime,"endTime":endTime,"planCode":encodeURI(planCode),"drawingCode":encodeURI(drawingCode)}},function(data){
			PageUtils.refreshPageInfo({element:'resultPage',url : url,data:{"startTime":startTime,"endTime":endTime,"planCode":encodeURI(planCode),"drawingCode":encodeURI(drawingCode)},callback : showResultTable},data['page']);
			if(data != null){
				showResultTable(data);
			}
			$("#loader").addClass("hidden");
		});	
	}
	//按工单数据展示
	function showResultTable(data){
		$("#tableflow").html("");
    	var datas = data['resultList'];
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list' onclick='AOITestDataAnalysis.testResultShow(\""+obj.drawingCode+"\",\""+obj.planNum+"\",\""+obj.planOKTimeStr+"\",\""+obj.planStartTimeStr+"\",\""+obj.pcbSum+"\");'>";
			dom += "<td>"+obj.planNum+"</td>";
			dom += "<td>"+obj.drawingCode+"</td>";
			dom += "<td>"+obj.pcbSum+"</td>";
			dom += "<td>"+obj.compQty+"</td>";
			dom += "<td>"+obj.productName+"</td>";
			dom += "<td>"+obj.firstNgSum+"</td>";
			dom += "<td>"+obj.okNgSum+"</td>";
			dom += "<td>"+obj.planOKTimeStr+"</td>";
			if(obj.pcbSum > 0){
				dom += "<td>--</td>";	
			}else{
				dom += "<td style='color: red;'>AOI数据未同步</td>";
			}			
			dom += "</tr>";			
			$("#tableflow").append(dom);
		});
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	
	//每个工单PCB板子检测情况
	//点击右上角关闭弹框
	function testResultClose(){
		$(".testResult").css("display", "none");
	}
	
	$("#searchClick3").click(function(){
		var planNum = $("#planCode3").val();
		var drawingCode = $("#drawingCode3").val();
		var planOKTimeStr = $("#planOKTimeStr").val();
		var planStartTimeStr = $("#planStartTimeStr").val();
		testResultShow(drawingCode,planNum,planOKTimeStr,planStartTimeStr);
	});
	$("#clearClick3").click(function(){
		$("input[name='startTime3']").val("");
		$("input[name='endTime3']").val("");
		//清空日期校验
		$("input[name='startTime3']").datepicker("option","maxDate",null);
		$("input[name='endTime3']").datepicker("option","minDate",null);
		var planNum = $("#planCode3").val();
		var drawingCode = $("#drawingCode3").val();
		var planOKTimeStr = $("#planOKTimeStr").val();
		var planStartTimeStr = $("#planStartTimeStr").val();
		testResultShow(drawingCode,planNum,planOKTimeStr,planStartTimeStr);
	});
	
	//点击计划显示弹框
	function testResultShow(drawingCode,planNum,planOKTimeStr,planStartTimeStr,pcbNum){
		if(parseInt(pcbNum) == 0){
			return;
		}
		$("#planCode3").val(planNum);
		$("#drawingCode3").val(drawingCode);
		$("#planOKTimeStr").val(planOKTimeStr);
		$("#planStartTimeStr").val(planStartTimeStr);
		var startTime = $("#startTime3").val();
		var endTime = $("#endTime3").val();	
		$.ajaxSetup({cache : false});
		var url = 'qualityAnalysis/getAOIResultDataDetail';
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true',data:{"startTime":startTime,"endTime":endTime,"planNum":encodeURI(planNum),"drawingCode":encodeURI(drawingCode),"planStartTime":planStartTimeStr,"planOKTime":planOKTimeStr}},function(data){
			PageUtils.refreshPageInfo({element:'queryPage',url : url,data:{"startTime":startTime,"endTime":endTime,"planNum":encodeURI(planNum),"drawingCode":encodeURI(drawingCode),"planStartTime":planStartTimeStr,"planOKTime":planOKTimeStr},callback : showResultDetail},data['page']);						
		    if(data != null){
		    	showResultDetail(data);
				$(".testResult").css("display", "block");
			}	
		});
	}
	
	function showResultDetail(data){
		$("#tableflow1").html("");
    	var datas = data['pcbDataList'];
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list' onclick='AOITestDataAnalysis.rolledYieldShow(\""+obj.pcbBarcode+"\",\""+obj.pcbIDTimestr+"\");'>";
			dom += "<td>"+obj.pcbBarcode+"</td>";
			dom += "<td>"+obj.compQty+"</td>";
			dom += "<td>"+obj.progName+"</td>";
			dom += "<td>"+obj.firstNgSum+"</td>";
			dom += "<td>"+obj.okNgSum+"</td>";
			dom += "<td>"+obj.pcbIDstr+"</td>";
			dom += "</tr>";			
			$("#tableflow1").append(dom);
		});
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	
	//点击右上角关闭弹框
	function rolledYieldClose(){
		$(".rolledYield").css("display", "none");
	}
	//点击计划显示弹框
	function rolledYieldShow(pcbBarcode,checkTime){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"true",
			url:"qualityAnalysis/getAOIResultNgData?pcbBarcode="+pcbBarcode+"&checkTime="+checkTime,
			success:function(data){
				if(data['ngDataList'].length > 0){
					showResultNgDetail(data);
					$(".rolledYield").css("display", "block");					
				}
			}
		});
	}
	
	function showResultNgDetail(data){
		$("#tableflow2").html("");
		$("#img").html("");
    	var datas = data['ngDataList'];
    	var index = 1;    	
		$.each(datas,function(item,obj){
			if(index == 1){
				var dom = "";
				dom += "<tr id='NO"+index+"' class='listTableText list_list' onclick='AOITestDataAnalysis.showNgImg(\""+obj.ngImagePath+"\",\"NO"+index+"\");'>";
				dom += "<td class='warningRed'>"+obj.pcbBarcode+"</td>";
				dom += "<td class='warningRed'>"+obj.yjid+"</td>";
				dom += "<td class='warningRed'>"+obj.ngName+"</td>";
				dom += "<td class='warningRed'>"+obj.loc+"</td>";
				dom += "<td class='warningRed'>"+obj.compName+"</td>";
				dom += "<td class='warningRed'>"+obj.rtName+"</td>";
				dom += "<td class='warningRed'>"+obj.item+"</td>";
				dom += "</tr>";
			}else{
				var dom = "";
				dom += "<tr id='NO"+index+"' class='listTableText list_list' onclick='AOITestDataAnalysis.showNgImg(\""+obj.ngImagePath+"\",\"NO"+index+"\");'>";
				dom += "<td class=''>"+obj.pcbBarcode+"</td>";
				dom += "<td class=''>"+obj.yjid+"</td>";
				dom += "<td class=''>"+obj.ngName+"</td>";
				dom += "<td class=''>"+obj.loc+"</td>";
				dom += "<td class=''>"+obj.compName+"</td>";
				dom += "<td class=''>"+obj.rtName+"</td>";
				dom += "<td class=''>"+obj.item+"</td>";
				dom += "</tr>";
			}						
			$("#tableflow2").append(dom);
			index ++;
		});
		$("#img").append("<img id='rolledYield_img1' src='/SpcLocalImg/"+datas[0].ngImagePath+"'/>");		
	}
	
	
	function showNgImg(imgPath,index){
		$("tr").find("td").each(function(){
			$(this).removeClass('warningRed');
		});  
		$("#"+index).find("td").each(function(){
			$(this).addClass('warningRed');
		});
		$("#img").html("");
		$("#img").append("<img id='rolledYield_img1' src='/SpcLocalImg/"+imgPath+"'/>")
	}
    	
	module.init = init;
	module.testResultClose = testResultClose;
	module.testResultShow = testResultShow;
	module.rolledYieldClose = rolledYieldClose;
	module.rolledYieldShow = rolledYieldShow;
	module.showNgImg = showNgImg;
	return module;
}($, window.AOITestDataAnalysis || {}));
$(function() {
	AOITestDataAnalysis.init();
});