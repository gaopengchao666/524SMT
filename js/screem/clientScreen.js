window.ClientScreen = (function($, module) {
	
	 var _lyPcbNumList = [];
	 var _pcbNumList = [];
	 var _pgOrderNumList = [];
	 var _pgPlanNumList = []; 
	
	function init(){  
		getTemAndHum();
		setProductNum(0);
		getFirstPassyield(1);
		getFailureMode(1);
		getWorkshopProPlan(1);
		upLoadImage();
		getWebsocket();
		
		//温度定时变更
		TemHumChange(); 
		//一次交验合格率定时变更
		FirstPassyieldChange();
		//列表定时切换
		getWorkshopProPlanPageSum();
		//动态展示失效模式
		FailureModeChange();
    }
	
	//查询温度和湿度
	function getTemAndHum(){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"false",
			url:"clientScreen/getTemAndHumClient",
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
	
	//获取车间生产情况
    function setProductNum(data){ 
    	$.ajaxSetup({cache : false});
    	$.ajax({			
			type:"GET",
			async:"false",
			url:"clientScreen/workshopProductionClient",
			success:function(datas){
				console.log("factory");
				showData(datas['lyPcbNumList'],"lyPcbNumClient",_lyPcbNumList,data);
				showData(datas['pcbNumList'],"pcbNumClient",_pcbNumList,data);
				showData(datas['pgOrderNumList'],"pgOrderNumClient",_pgOrderNumList,data);
				showData(datas['pgPlanNumList'],"pgPlanNumClient",_pgPlanNumList,data);
				
				_lyPcbNumList = datas['lyPcbNumList'];
				_pcbNumList = datas['pcbNumList'];
				_pgOrderNumList = datas['pgOrderNumList'];
				_pgPlanNumList = datas['pgPlanNumList'];
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
			url:"clientScreen/getFirstCompletedRateClient?flag="+data,
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
						rotate:15
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
	//获取失效模式数据
	function getFailureMode(data){
		$.ajaxSetup({cache : false});
		$.ajax({			
			type:"GET",
			async:"false",
			url:"clientScreen/getFailureModeClient?flag="+data,
			success:function(data){
				showFailureMode(data);  
			}
		});
	}
	
	//失效模式分析展示
	function showFailureMode(data){		
		var _data_x = data['failureModeNameList'];
		var _dataBar_y = data['failureModeNumList'];
		var _dataLine_y = data['failureModeRateList'];
		var _month = data['month'];
		var myChart = echarts.init(document.getElementById('failureMode'));			
		option = {
				title : {
			        text: '失效模式分析('+_month+')',
			        textStyle:{
			        	color: '#dcdcdc'
			        },
			        x:'center'
			    },
			    tooltip: {
			        trigger: 'axis'
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
			            data: _data_x,
			            splitLine:{
			            	show:false,
			            	lineStyle: {
								color: '#646464'
							}
			            },
						axisLine:{
							lineStyle: {
								color: '#C8C8C8'
							}
						}
			        } ,
			        {
			            type: 'category',
			            boundaryGap: true,
			            show : false,
			            data:_data_x,
			            splitLine:{
			            	show:false,
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
			    yAxis: [
			        {
			            type: 'value',
			            scale: true,
			            name: '%',
			            max: 100,
			            min: 0,
			            splitNumber:10,
			            splitLine:{
			            	show:false,
			            	lineStyle: {
								color: '#C8C8C8'
							}
			            },
						axisLine:{
							lineStyle: {
								color: '#C8C8C8'
							}
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
			            splitNumber:10,
			            splitLine:{
			            	show:true,
			            	lineStyle: {
								color: '#C8C8C8'
							}
			            },
						axisLine:{
							lineStyle: {
								color: '#C8C8C8'
							}
						}
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
			    color: ['#44a1f8', '#dd5252']
			};
			myChart.setOption(option);
			window.onresize = myChart.resize;
	}
	 //车间生产计划状态
    function getWorkshopProPlan(data){
    	$.ajaxSetup({cache : false});
    	$.ajax({			
			type:"GET",
			async:"false",
			url:"clientScreen/workshopProPlanClient?page="+data,
			success:function(datas){
				if(datas['workshopProPlanList'].length != 0){
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
				dom += "<td>"+obj.productName+"</td>";
				dom += "<td><div class='progressDiv'><span class='progressChange' style='width: "+obj.completedRate+"%;'>"+obj.completedRate+"%</span></div></td>";
			}else{
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
			url:"clientScreen/getWorkshopProPlanPageSumClient",
			success:function(data){	
				 WorkshopProPlanChange(parseInt(data['pageSum']));
			}
		});
    }
    
    
    //图片异步上传
    function upLoadImage(){
    	$.ajaxSetup({cache : false});
    	var url = "clientScreen/uploadImgClient";
		$('#file').fileupload({
			url : url,
			dataType : 'text',
			done : function(e, data) {
				document.getElementById("pic").src = "/clientImage/" + data.result;
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
    
    //失效模式动态展示
    function FailureModeChange(){
    	var index = 1;
		var timeTicket3 = setInterval(function (){
			if(2 > index){
				getFailureMode(index);
			}else if(2 == index){
				getFailureMode(index);
				FailureModeChange();				
			}else{
				clearInterval(timeTicket3);
			}	
			index++;
		},5000);
    }
    //websocket实时更新数据
    function getWebsocket(){
		WEB_SOCKET_SWF_LOCATION = basePath+"js/WebSocketMain.swf"
		var websocket = null;
		//判断当前浏览器是否支持WebSocket
		if('WebSocket' in window){
		    websocket = new WebSocket("ws://"+basePathWS+"/websocket?client1");
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
	return module;
}($, window.ClientScreen || {}));
$(function() {
	ClientScreen.init();
});