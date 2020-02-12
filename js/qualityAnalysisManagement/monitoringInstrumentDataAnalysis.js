window.MonitoringInstrumentDataAnalysis = (function($, module) {
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
		getData();	
	}
	
	
	//获取数据
	function getData(){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"false",
			url:"getTemAndHum?type=static&pageSize=9",
			success:function(data){
			  showBarGraph(data);			  
			}
		});
	}
	
	
	//分析图展示
	function showBarGraph(data){
		var index = 0;
		var myChartTem = echarts.init(document.getElementById('chartsTem'));
		var myChartHum = echarts.init(document.getElementById('chartsHum'));
		var _data_x = data['timeList'];
		var _temData_y = data['temList'];
		var _humData_y = data['humList'];
		var _upHum = data['upHum'];
		var _upTem = data['upTem'];
		var _downHum = data['downHum'];
		var _downTem = data['downTem'];
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
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,
			        data: _data_x,
			        axisLabel:{
						interval:0,
						rotate:45
					}
			    },
			    yAxis: [{
			    	type: 'value',
			        axisLabel: {
			            formatter: '{value} °C'
			        },
			        max: 50,
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
			                gt: _downTem,
			                lte: _upTem,
			                color: '#44A1F8'
			            }],
			            outOfRange: {
			                color: 'red'
			            }
			        },
			    series: [
			        {
			            name:'温度',
			            type:'line',
			            symbol:'circle',
			            symbolSize:5,
			            data:_temData_y,
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
			                    name:'温度上限',
			                    yAxis: _downTem
			                }, {
			                    name:'温度下限',
			                    yAxis: _upTem
			                }]
			            }
			        }
			    ]
			};
		
		humOption = {
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
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,			       
			        data:_data_x,
			        axisLabel:{
						interval:0,
						rotate:45
					}
			    },
			    yAxis: [{
			        type: 'value',
			        axisLabel: {
			            formatter: '{value} %'
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
			            left: 10,
			            pieces: [{
			                gt: _downHum,
			                lte: _upHum,
			                color: '#44A1F8'
			            }],
			            outOfRange: {
			                color: 'red'
			            }
			        },
			    series: [
			        {
			            name:'湿度',
			            type:'line',
			            symbol:'circle',
			            symbolSize:5,
			            data:_humData_y,
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
			                    name:'湿度上限',
			                    yAxis: _upHum
			                }, {
			                    name:'湿度下限',
			                    yAxis: _downHum
			                }]
			            }
			        }
			    ]
			};

		myChartHum.setOption(humOption);
		myChartTem.setOption(temOption);
		//定时任务
		setInterval(function(){
			
			$.ajax({			
				type:"GET",
				async:"false",
				url:"getTemAndHum?type=real&pageSize=9",
				success:function(data){
					if(_data_x.length < 9){
						_data_x.push(data['timeReal']);
						_humData_y.push(data['humReal']);
						_temData_y.push(data['temReal']);
					}else{
						_data_x.push(data['timeReal']);
						_humData_y.push(data['humReal']);
						_temData_y.push(data['temReal']);
						_data_x.shift();
						_humData_y.shift();
						_temData_y.shift();
					}
					//湿度曲线
					myChartHum.hideLoading();
					myChartHum.setOption({
						series:[{
							data:_humData_y
						}],
						xAxis:[{
							data:_data_x
						}]	
					});
					
					//湿度曲线温度曲线
					myChartTem.hideLoading();
					myChartTem.setOption({
						series:[{
							data:_temData_y
						}],
						xAxis:[{
							data:_data_x
						}]	
					});	
				}
			});
			index++;	
		},3600000);
	}	
	//首页重置按钮事件
    $("#btn_clear1").click(function(){
    	$(".select_text").find(":input").val("");
		$(".select_text").find("select").prop('selectedIndex', 0);
		//清空日期校验
		$("input[name='startTime']").datepicker("option","maxDate",null);
		$("input[name='endTime']").datepicker("option","minDate",null);
	});
    function printExcel(){
    	var startTime = $("input[name='startTime']").val();
    	var endTime =  $("input[name='endTime']").val();
		if(startTime){
			window.location.href=basePath+"qualityAnalysis/printExcel?startTime="+startTime+"&endTime="+endTime;
		}else{
			alert("请输入开始时间");
		}
		
    }
	module.init = init;
	module.printExcel = printExcel;
	return module;
}($, window.MonitoringInstrumentDataAnalysis || {}));
$(function() {
	MonitoringInstrumentDataAnalysis.init();
});