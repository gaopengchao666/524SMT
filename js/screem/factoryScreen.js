window.FactoryScreen = (function($, module) {
	
	 var _lyPcbNumList = [];
	 var _pcbNumList = [];
	 var _pgOrderNumList = [];
	 var _pgPlanNumList = []; 
	 var _mLossNumList = [];
	 var _lwOrderNumList = [];
	
	function init(){
		setProductNum(0);
		getWorkshopProPlan(1);
		getTemAndHum();
		getOutputAnalysis();
		getFirstPassyield(1);
		getWebsocket();
		
		//温湿度定时更新
		TemHumChange();
		//列表定时切换
		getWorkshopProPlanPageSum();
		//一次交验合格率定时切换
		FirstPassyieldChange();
    }
	
	//获取车间生产情况
    function setProductNum(data){ 
    	$.ajaxSetup({cache : false});
    	$.ajax({			
			type:"GET",
			async:"false",
			url:"factoryScreen/workshopProductionFactory",
			success:function(datas){
				console.log("factory");
				showData(datas['lyPcbNumList'],"lyPcbNumFactory",_lyPcbNumList,data);
				showData(datas['pcbNumList'],"pcbNumFactory",_pcbNumList,data);
				showData(datas['mLossNumList'],"mLossNumFactory",_mLossNumList,data);
				showData(datas['lwOrderNumList'],"lwOrderNumFactory",_lwOrderNumList,data);
				showData(datas['pgOrderNumList'],"pgOrderNumFactory",_pgOrderNumList,data);
				showData(datas['pgPlanNumList'],"pgPlanNumFactory",_pgPlanNumList,data);
				
				_lyPcbNumList = datas['lyPcbNumList'];
				_pcbNumList = datas['pcbNumList'];
				_pgOrderNumList = datas['pgOrderNumList'];
				_pgPlanNumList = datas['pgPlanNumList'];
				_mLossNumList = datas['mLossNumList'];
				_lwOrderNumList = datas['lwOrderNumList'];
			}
		});  	  
    }
    
    //数码管数据展示
    function showData(data,name,_data,flag){
    	if(flag == 0){
    		for (var i = 0; i < data.length; i++) {
   			 $("#"+name+(i+1)+"-2").text(data[i]);
   		    }
    	}else{
    		for (var i = 0; i < data.length; i++) {
				if(data[i] != _data[i]){
					ScreenChange.changeBtn(name+(i+1)+"-",data[i]);
				}else{
					$("#"+name+(i+1)+"-2").text(data[i]);
				}
			}
    	}
    }
	
	//一次校验合格率
	function getFirstPassyield(data){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"false",
			url:"factoryScreen/getFirstCompletedRateFactory?flag="+data,
			success:function(data){
				showFirstPassyield(data);  
			}
		});
	}
	//一次交验合格率数据展示
	function showFirstPassyield(data){
		var myChart = echarts.init(document.getElementById('firstPassyield'));
		var _data_x = data['nameList'];
		var _data_y = data['rateList'];
		var _lowerLine = data['planRate'];
		var _month = data['month'];
		option = {
				title : {
			        text: '一次交验合格率分析('+_month+')',
			        textStyle:{
			        	color: '#dcdcdc'
			        },
			        x:'center'
			    },
				tooltip: {
			        trigger: 'axis'
			    },
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,
			        data: _data_x,
			        axisLabel:{
						interval:0,
						rotate:40
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#646464'
						}
					},
					axisLine:{
						lineStyle: {
							color: '#C8C8C8'
						}
					}
			    },
			    yAxis: [{
			    	type: 'value',
			        axisLabel: {
			            formatter: '{value}%'
			        },
			        max: 100,
			        min: 0,
			        splitNumber:10,
			        splitLine: {
						show: true,
						lineStyle: {
							color: '#646464'
						}
					},
					axisLine:{
						lineStyle: {
							color: '#C8C8C8'
						}
					}
			    },{
			        splitLine: {
						show: false,
						lineStyle: {
							color: '#646464'
						}
					},
					axisLine:{
						lineStyle: {
							color: '#C8C8C8'
						}
					}
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
			    ],
			    color: ['#44a1f8', '#dd5252']
			};
		myChart.setOption(option);
		window.onresize = myChart.resize;
	}
	//查询周产量同比
	function getOutputAnalysis(){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"false",
			url:"factoryScreen/getOutputAnalysisFactory",
			success:function(datas){
				showOutputAnalysis(datas);
			}
		});
	}
	//产量周同比分析展示
	function showOutputAnalysis(data){
		var _data_x = ['周一','周二','周三','周四','周五'];
		var _dataLast_y = data['lastWeekData'];
		var _dataNow_y = data['thisWeekData'];
		var myChart = echarts.init(document.getElementById('outputAnalysis'));
		var outputOption = {
		    title : {
		        text: '产量周同比分析',
		        textStyle:{
		        	color: '#dcdcdc'
		        },
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['上周','本周'],
		        textStyle:{
		        	color: '#dcdcdc'
		        },
		        left:'left'
		    },
		    toolbox: {
		        show : false,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            data : _data_x,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#646464'
						}
					},
					axisLine:{
						lineStyle: {
							color: '#C8C8C8'
						}
					}
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            splitLine: {
						show: true,
						lineStyle: {
							color: '#646464'
						}
					},
					axisLine:{
						lineStyle: {
							color: '#C8C8C8'
						}
					}
		        }
		    ],
		    series : [
		        {
		            name:'上周',
		            type:'bar',
		            data:_dataLast_y,
		           
		        },
		        {
		            name:'本周',
		            type:'bar',
		            data:_dataNow_y,
		        }
		    ],
		    color:['#44A1F8','#DD5252']
		};
		myChart.setOption(outputOption);
		window.onresize = myChart.resize;
	}
	
	//查询温度和湿度
	function getTemAndHum(){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"false",
			url:"factoryScreen/getTemAndHumFactory",
			success:function(datas){
				showTem(datas['tem'],datas['upTem'],datas['downTem']);
				showHum(datas['hum'],datas['upHum'],datas['downHum']);
				
			}
		});
	}
	//温度数据展示
	function showTem(tem,upTem,downTem){
		$("#temperature").text(tem);
	    $("#temp_red_bottom").css("height", downTem+"%");
	    $("#temp_green").css("height", upTem+"%");
	}
	//湿度数据展示
	function showHum(hum,upHum,downHum){
		var myChart = echarts.init(document.getElementById('humidity'));			
		option = {
			backgroundColor: 'transparent',
		    tooltip : {
		        formatter: "{a} <br/>{b} : {c}%"
		    },
		    toolbox: {
		        show : false,
		        feature : {
		            mark : {show: true},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    series : [
		        {
		            name:'显示湿度',
		            type:'gauge',
		            radius: 80,
		            splitNumber: 5,        // 分割段数，默认为5
		            axisLine: {            // 坐标轴线
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    color: [[(downHum/100), '#FF0303'],[(upHum/100), '#00CD00'],[1, '#FF0303']], 
		                    width: 5
		                }
		            },
		            axisTick: {            // 坐标轴小标记
		                splitNumber: 5,    // 每份split细分多少段
		                length :10,         // 属性length控制线长
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    color: 'auto'
		                }
		            },
		            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    color: 'auto'
		                }
		            },
		            splitLine: {           // 分隔线
		                show: true,        // 默认显示，属性show控制显示与否
		                length :15,        // 属性length控制线长
		                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                    color: 'auto'
		                }
		            },
		            pointer : {
		                width : 3
		            },
		            title : {
		                show : true,
		                offsetCenter: [0, '-40%'],       // x, y，单位px
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontWeight: 'bolder'
		                }
		            },
		            detail : {
		                formatter:'{value}',
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    color: '#fff',
		                    fontWeight: 'bold'
		                },
		                fontSize:14,
		                padding:[50,10,0,0]
		            },
		            data:[{value: hum}]
		        }
		    ]
		};
		myChart.setOption(option);
	}
    
    //车间生产计划状态
    function getWorkshopProPlan(data){
    	$.ajaxSetup({cache : false});
    	$.ajax({			
			type:"GET",
			async:"false",
			url:"factoryScreen/workshopProPlanFactory?pageSize=5&page="+data,
			success:function(datas){
				if(datas != null){
					showTable(datas);
				}
			}
    	});
    }
    
    
    //列表数据展示
    function showTable(data){
    	var datas = data['workshopProPlanList'];
    	$("#showTable").html("");
    	$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr>";
			if(obj.planCode != null){
				dom += "<td>"+obj.planCode+"</td>";
				dom += "<td>"+obj.imageCode+"</td>";
				dom += "<td>"+obj.planNum+"</td>";
				dom += "<td>"+obj.completedNum+"</td>";
				dom += "<td><div class='progressDiv'><span class='progressChange' style='width: "+obj.completedRate+"%;'>"+obj.completedRate+"%</span></div></td>";
			}else{
				dom += "<td>--</td>";
				dom += "<td>--</td>";
				dom += "<td>--</td>";
				dom += "<td>--</td>";
				dom += "<td>--</td>";
			}			
			dom += "</tr>";
			$("#showTable").append(dom);
		});
    }
    //车间生产计划状态列表轮询次数
    function getWorkshopProPlanPageSum(){
    	$.ajaxSetup({cache : false});
    	$.ajax({			
			type:"GET",
			async:"false",
			url:"factoryScreen/getWorkshopProPlanPageSumFactory",
			success:function(data){	
				 WorkshopProPlanChange(parseInt(data['pageSum']));
			}
		});
    }
    
    
    
    //温湿度动态变更
    function TemHumChange(){
    	clearInterval(timeTicket);
		var timeTicket = setInterval(function (){
			getTemAndHum();
		},3600*1000);
    }
    
    //列表动态展示
    function WorkshopProPlanChange(flag){
    	var index = 1;
		var timeTicket1 = setInterval(function (){
			if(flag > index){
				getWorkshopProPlan(index);
			}else if(flag == index){
				getWorkshopProPlan(index);
				getWorkshopProPlanPageSum();				
			}else{
				clearInterval(timeTicket1);
			}
			
			index++;
		},5000);
    }
    //一次交验合格率动态显示
    function FirstPassyieldChange(){
    	var index = 1;
		var timeTicket2 = setInterval(function (){
			if(2 > index){
				getFirstPassyield(index);
			}else if(2 == index){
				getFirstPassyield(index);
				FirstPassyieldChange();				
			}else{
				clearInterval(timeTicket2);
			}	
			index++;
		},5000);
    }
    //websocket数据实时更新
    function getWebsocket(){
		WEB_SOCKET_SWF_LOCATION = basePath+"js/WebSocketMain.swf"
		var websocket = null;
		//判断当前浏览器是否支持WebSocket
		if('WebSocket' in window){
		    websocket = new WebSocket("ws://"+basePathWS+"/websocket?client2");
		}
		else{
		    alert('Not support websocket');
		 }
		 
		//连接发生错误的回调方法
		websocket.onerror = function(){
		    setMessageInnerHTML("error");
		};
		 
		//连接成功建立的回调方法
		websocket.onopen = function(event){
		    setMessageInnerHTML("open");
		};
		 
		//接收到消息的回调方法
		websocket.onmessage = function(event){
		    setMessageInnerHTML(event.data);
		};
		 
		//连接关闭的回调方法
		websocket.onclose = function(){
		    setMessageInnerHTML("close");
		};
		 
		//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
		window.onbeforeunload = function(){
		    websocket.close();
		};
		

	    //将消息显示在网页上
	   function setMessageInnerHTML(innerHTML){
	       if(innerHTML == "1"){
	    	   setProductNum(1);
	    	   getOutputAnalysis();
	       }else{
	    	   console.log(innerHTML);
	       }
	   }
	 
	   //关闭连接
	   function closeWebSocket(){
	      websocket.close();
	   }
	 
	   //发送消息
	   function send(message){
	      websocket.send(message);
	   }	
	}
    
	module.init = init;
	module.setProductNum = setProductNum;
	module.getOutputAnalysis = getOutputAnalysis;
	return module;
}($, window.FactoryScreen || {}));
$(function() {
	FactoryScreen.init();
});