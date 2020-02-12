window.QualifiedRateAnalysis = (function($, module) {
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
		getFirstCompletedRateData();	
	}
	//点击一次交验合格率统计页签
	$(".layui-this").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime1']").datepicker("option","maxDate",null);
		$("input[name='endTime1']").datepicker("option","minDate",null);
		bindEvent();		
	});
	//获取一次交验合格率数据
	function getFirstCompletedRateData(){
		var startTime = $("#startTime1").val();
		var endTime = $("#endTime1").val();
		var planCode = $("#planCode1").val();
		var imageCode = $("#imageCode1").val();
		$.ajaxSetup({cache : false});
		$("#loader").removeClass("hidden");
		$.ajax({			
			type:"GET",
			async:"true",
			cache : false,
			url:"/qualityAnalysis/getFirstCompletedRate?flag="+Math.random(),
			data:{"startTime":encodeURI(startTime),"endTime":encodeURI(endTime),"planCode":encodeURI(planCode),"imageCode":encodeURI(imageCode)},
			success:function(data){
			  showFirstCompletedRateTable(data);
			  showFirstCompletedRateGraph(data);
			  $("#loader").addClass("hidden");
			}
		});
	}
	//一次交验合格率列表展示
	function showFirstCompletedRateTable(data){
		$("#tableflow1").html("");
    	var datas = data['firstCompletedRateList']; 
    	var index = 1
    	$.each(datas,function(item,obj){
			var dom = "";
			if(obj.actualRate < obj.planRate){
				dom += "<tr class='listTableText list_list'>";
				dom += "<td class='warningRed'>NO"+index+"</td>";
				dom += "<td class='warningRed'>"+obj.planCode+"</td>";
				dom += "<td class='warningRed'>"+obj.imageCode+"</td>";
				dom += "<td class='warningRed'>"+obj.completedTimeStr+"</td>";
				dom += "<td class='warningRed'>"+obj.planNum+"</td>";
				dom += "<td class='warningRed'>"+obj.okNum+"</td>";
				dom += "<td class='warningRed'>"+obj.planRate+"</td>";
				dom += "<td class='warningRed'>"+obj.actualRate+"</td></tr>";				
			}else{
				dom += "<tr class='listTableText list_list'>";
				dom += "<td>NO"+index+"</td>";
				dom += "<td>"+obj.planCode+"</td>";
				dom += "<td>"+obj.imageCode+"</td>";
				dom += "<td>"+obj.completedTimeStr+"</td>";
				dom += "<td>"+obj.planNum+"</td>";
				dom += "<td>"+obj.okNum+"</td>";				
				dom += "<td>"+obj.planRate+"</td>";
				dom += "<td>"+obj.actualRate+"</td></tr>";
			}
			$("#tableflow1").append(dom);
			index ++;
    	});
    	// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	
	//一次交验合格率分析图展示
	function showFirstCompletedRateGraph(data){
		var myChart = echarts.init(document.getElementById('chartsFirstCompletedRate'));
		myChart.clear();
		var _data_x = data['nameList'];
		var _data_y = data['rateList'];
		var _lowerLine = data['planRate'];
		temOption = {
			    tooltip: {
			        trigger: 'axis'
			    },
			    grid:{
			    	x:50,
			    	y:30,
			    	x2:30,
			    	y2:70,
			    	borderWidth:1
			    },
			    /*toolbox: {
			        feature: {
			            magicType: {type: ['bar']},
			            restore: {},
			            saveAsImage: {}
			        }
			    },*/
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,
			        data: _data_x,
			        axisLabel:{
						interval:0,
						rotate:40
					}
			    },
			    yAxis: [{
			    	type: 'value',
			        axisLabel: {
			            formatter: '{value}%'
			        },
			        max: 100,
			        min: 0,
			        splitNumber:10   	
			    },{
			        type: 'value',			       
			        splitNumber:10
			    }],
			    visualMap: {
			    	    show:false,
			            top: 10,
			            right: 10,
			            pieces: [{
			                gte: _lowerLine,
			                lt: 100,
			                color: '#44A1F8'
			            }],
			            outOfRange: {
			                color: 'red'
			            }
			        },
			    series: [
			        {
			            name:'合格率',
			            type:'line',
			            symbol:'circle',
			            symbolSize:5,
			            data:_data_y,
			            itemStyle:{
			            	normal:{
			            		lineStyle:{
			            			color:'#44A1F8',
			            			width:2
			            		},
			            		itemStyle:{
			            			color:'#44A1F8',
			            			width:2
			            		}
			            	}
			            },
			            markLine: {
			                silent: true,
			                lineStyle:{
			                	color:'red',
		            			width:2,
		            			type:'solid'
			                },
			                data: [{
			                    name:'合格率下限',
			                    yAxis: _lowerLine
			                }]
			            }
			        }
			    ]
			};
		
		myChart.setOption(temOption);
	}	
	//一次交验合格率条件查询
	$("#btn_search1").click(function(){
		getFirstCompletedRateData();
	});
	//一次交验合格率条件查询
	$("#btn_clear1").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime1']").datepicker("option","maxDate",null);
		$("input[name='endTime1']").datepicker("option","minDate",null);
		bindEvent();
	});
	
	//统计失效模式
	$(".failureMode").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime2']").datepicker("option","maxDate",null);
		$("input[name='endTime2']").datepicker("option","minDate",null);
		getFailureMode();
	});
	//获取数据
	function getFailureMode(){
		var startTime = $("#startTime2").val();
		var endTime = $("#endTime2").val();
		var planCode = $("#planCode2").val();
		var imageCode = $("#imageCode2").val();
		$.ajaxSetup({cache : false});
		$("#loader").removeClass("hidden");
		$.ajax({			
			type:"GET",
			async:"true",
			cache:false,
			url:"/qualityAnalysis/getFailureMode?flag="+Math.random(),
			data:{"startTime":encodeURI(startTime),"endTime":encodeURI(endTime),"planCode":encodeURI(planCode),"imageCode":encodeURI(imageCode)},
			success:function(data){
			  showFailureModeTable(data);
			  showFailureModeGraph(data); 
			  $("#loader").addClass("hidden");
			}
		});
	}
	//失效模式列表展示
	function showFailureModeTable(data){
		$("#tableflow2").html("");
    	var datas = data['failureModeList']; 
    	$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+obj.failureModeName+"</td>";
			dom += "<td>"+obj.failureModeNum+"</td></tr>";
			$("#tableflow2").append(dom);
    	});
    	 // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	//失效模式分析图展示
	function showFailureModeGraph(data){
		var _data_x = data['failureModeNameList'];
		var _dataBar_y = data['failureModeNumList'];
		var _dataLine_y = data['failureModeRateList'];
		var myChart = echarts.init(document.getElementById('chartsFailureMode'));
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
			            data: _data_x
			        } ,
			        {
			            type: 'category',
			            boundaryGap: true,
			            show : false,
			            data:_data_x
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
			            data:_dataBar_y,
			            barWidth:'20%'
			        },
			        {
			            name:'%',
			            type:'line',
			            symbol:'circle',
			            symbolSize:3,
			            data:_dataLine_y
			        }
			    ],
			    color:['#87CEFA','#FF6BB5','#FF7F50','#DA70D6','#32CD32','#FFA500','#FF0000','#2EC7C9','#BB9FD0','#FF69B4','#C4E779']
			};
		   
			myChart.setOption(option);
	}
	
	//失效模式条件查询
	$("#btn_search2").click(function(){
		getFailureMode();
	});
	//失效模式条件重置
	$("#btn_clear2").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime2']").datepicker("option","maxDate",null);
		$("input[name='endTime2']").datepicker("option","minDate",null);
		getFailureMode();
	});
	
	//直通率
	$(".directRate").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime3']").datepicker("option","maxDate",null);
		$("input[name='endTime3']").datepicker("option","minDate",null);
		getDirectRate();
	});
	//获取直通率数据
	function getDirectRate(){
		var startTime = $("#startTime3").val();
		var endTime = $("#endTime3").val();
		var planCode = $("#planCode3").val();
		var imageCode = $("#imageCode3").val();
		$.ajaxSetup({cache : false});
		$("#loader").removeClass("hidden");
		$.ajax({			
			type:"GET",
			async:"true",
			cache:false,
			url:"/qualityAnalysis/getDirectRate?flag="+Math.random(),
			data:{"startTime":encodeURI(startTime),"endTime":encodeURI(endTime),"planCode":encodeURI(planCode),"imageCode":encodeURI(imageCode)},
			success:function(data){
			  showDirectRateTable(data);
			  showDirectRateGraph(data);  
			  $("#loader").addClass("hidden");
			}
		});
		
	}
	//直通率列表展示
	function showDirectRateTable(data){
		$("#tableflow3").html("");
    	var datas = data['directRateList'];
    	var index = 1;
    	$.each(datas,function(item,obj){
    		var dom = "";
    		if(obj.actualRate < obj.planRate){
    			dom += "<tr class='listTableText list_list' onclick='QualifiedRateAnalysis.rolledYieldShow(\""+obj.orderId+"\",\""+obj.planCode+"\",\""+obj.imageCode+"\");'>";
    			dom += "<td class='warningRed'>NO"+index+"</td>";
    			dom += "<td class='warningRed'>"+obj.planCode+"</td>";
    			dom += "<td class='warningRed'>"+obj.imageCode+"</td>";
    			dom += "<td class='warningRed'>"+obj.completeTimeStr+"</td>";
    			dom += "<td class='warningRed'>"+obj.planRate+"</td>";
    			dom += "<td class='warningRed'>"+obj.actualRate+"</td></tr>";
    			
    		}else{
    			dom += "<tr id='NO"+index+"' class='listTableText list_list' onclick='QualifiedRateAnalysis.rolledYieldShow(\""+obj.orderId+"\",\""+obj.planCode+"\",\""+obj.imageCode+"\");'>";
    			dom += "<td class=''>NO"+index+"</td>";
    			dom += "<td class=''>"+obj.planCode+"</td>";
    			dom += "<td class=''>"+obj.imageCode+"</td>";
    			dom += "<td class=''>"+obj.completeTimeStr+"</td>";
    			dom += "<td class=''>"+obj.planRate+"</td>";
    			dom += "<td class=''>"+obj.actualRate+"</td></tr>";    			
    		}
			$("#tableflow3").append(dom);
			index ++;
    	});
    	// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	//直通率分析图展示
	function showDirectRateGraph(data){
		var directRateList = data['directRateList'];
		var myChart = echarts.init(document.getElementById('chartsDirectRate'));
		myChart.clear();
		var _data_x = data['nameList'];
		var _data_y = data['rateList'];
		var _lowerLine = data['planRate'];
		temOption = {
			    tooltip: {
			        trigger: 'axis'
			    },
			    grid:{
			    	x:50,
			    	y:30,
			    	x2:30,
			    	y2:70,
			    	borderWidth:1
			    },
			    /*toolbox: {
			        feature: {
			            magicType: {type: ['bar']},
			            restore: {},
			            saveAsImage: {}
			        }
			    },*/
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,
			        data: _data_x,
			        axisLabel:{
						interval:0,
						rotate:40
					}
			    },
			    yAxis: [{
			    	type: 'value',
			        axisLabel: {
			            formatter: '{value}%'
			        },
			        max: 100,
			        min: 0,
			        splitNumber:10   	
			    },
			    {
			        type: 'value',			       
			        splitNumber:10
			    }],
			    visualMap: {
			    	    show:false,
			            top: 10,
			            right: 10,
			            pieces: [{
			                gte: _lowerLine,
			                lt: 100,
			                color: '#44A1F8'
			            }],
			            outOfRange: {
			                color: 'red'
			            }
			        },
			    series: [
			        {
			            name:'合格率',
			            type:'line',
			            symbol:'circle',
			            symbolSize:5,
			            data:_data_y,
			            itemStyle:{
			            	normal:{
			            		lineStyle:{
			            			color:'#44A1F8',
			            			width:2
			            		},
			            		itemStyle:{
			            			color:'#44A1F8',
			            			width:2
			            		}
			            	}
			            },
			            markLine: {
			                silent: true,
			                lineStyle:{
			                	color:'red',
		            			width:2,
		            			type:'solid'
			                },
			                data: [{
			                    name:'直通率下限',
			                    yAxis: _lowerLine
			                }]
			            }
			        }
			    ]
			};
		
		myChart.setOption(temOption);
		
		myChart.on('click',function(param){
			var name = param.name;
			var index = parseInt(name.substring(2))-1;
			rolledYieldShow(directRateList[index].orderId,directRateList[index].planCode,directRateList[index].imageCode);
		});
	}
	
	//直通率条件查询
	$("#btn_search3").click(function(){
		getDirectRate();
	});
	//直通率条件重置
	$("#btn_clear3").click(function(){
		$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime3']").datepicker("option","maxDate",null);
		$("input[name='endTime3']").datepicker("option","minDate",null);
		getDirectRate();
	});
	
	//点击右上角关闭弹框
	function rolledYieldClose(){
		$(".rolledYield").css("display", "none");
	}
	//点击计划显示弹框
	function rolledYieldShow(orderId,planCode,drawingCode){	
		$("#planCode4").val(planCode);
    	$("#drawingCode4").val(drawingCode);
    	$.ajaxSetup({cache : false});
    	//$("#loader").removeClass("hidden");
		$.ajax({			
			type:"GET",
			async:"true",
			cache:false,
			url:"/qualityAnalysis/getProcedureDerectRate?flag="+Math.random()+"&orderId="+orderId,
			success:function(data){
			  showProcedureDerectRateTable(data);
			  //$("#loader").addClass("hidden");
			}
		});
		$(".rolledYield").css("display", "block");
	}
	//工序直通率列表展示
	function showProcedureDerectRateTable(data){
		$("#tableflow4").html("");
    	var datas = data['procedureDirectRateList']; 
    	$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+obj.procedureName+"</td>";
			dom += "<td>"+obj.startTimeStr+"</td>";
			dom += "<td>"+obj.endTimeStr+"</td>";		
			dom += "<td>"+obj.procedureDirectRateStr+"</td></tr>";
			$("#tableflow4").append(dom);
    	});
    	// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	module.init = init;
	module.rolledYieldClose = rolledYieldClose;
	module.rolledYieldShow = rolledYieldShow;
	return module;
}($, window.QualifiedRateAnalysis || {}));
$(function() {
	QualifiedRateAnalysis.init();
});