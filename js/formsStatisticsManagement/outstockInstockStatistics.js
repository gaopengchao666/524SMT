window.OutstockInstockStatistics = (function($, module) {
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
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		$.ajaxSetup({cache : false});
		var url = 'formsStatistics/outstockInstockStatisticsData?startTime='+startTime+'&endTime='+endTime;		
		$("#loader").removeClass("hidden");
		$.ajax({			
			type:"GET",
			async:"true",
			url:url,
			success:function(data){
				if(data != null){
					showLeft(data);
					showCenter(data);
					showRight(data);
				}	
				$("#loader").addClass("hidden");
			}
		});
		
	}
	
	//条件统计
	$("#searchClick").click(function(){
		bindEvent();
	});
	
	//重置
	 $("#clearClick").click(function(){
	    	$(".select_text").find(":input").val("");
			$(".select_text").find("select").prop('selectedIndex', 0);
			//清空日期校验
			$("#startTime").datepicker("option","maxDate",null);
			$("#endTime").datepicker("option","minDate",null);
			bindEvent();
	 });
	//左侧饼图
	function showLeft(data){
		var sumList = data['sumList'];
		var myChart = echarts.init(document.getElementById('leftPie'));		
		option = {
				title : {
					text :"出入库单据占比",
		                x:'center',
		                z:0		            
				},
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)",
			        axisPointer: {
		                z:0
		            }
			    },
			    legend: {
			        orient: 'horizontal',
			        x: 'center',
			        y: 'bottom',
			        data:['入库单据','出库单据'],
			        z:0
			    },
			    series: [
			        {
			            name:'出入库单据占比',
			            type:'pie',
			            z:0,
			            radius:  ['45%', '60%'],
			            avoidLabelOverlap: false,
			            stillShowZeroSum:false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '20',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:[
			                {value:sumList[0], name:'入库单据'},
			                {value:sumList[1], name:'出库单据'}	             
			            ]
			        }
			    ],
			    color:['#87CEFA','#FF6BB5','#FF7F50','#DA70D6','#32CD32','#FFA500','#FF0000','#2EC7C9','#BB9FD0','#FF69B4','#C4E779']
			};
		
		myChart.setOption(option);
	} 
	
	//中间饼图
	function showCenter(data){
		var inList = data['inList'];
		var myChart = echarts.init(document.getElementById('centerPie'));
		option = {
				title : {
					text :"入库类型占比",
		                x:'center',
		                z:0
				},
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)",
			        axisPointer: {
		                z:0
		            }
			    },
			    legend: {
			        orient: 'horizontal',
			        x: 'center',
			        y: 'bottom',
			        data:['生产退料','安全库存补料','齐套缺料补料','机损补料','盘点入库','其它'],
			        z:0
			    },
			    series: [
			        {
			            name:'入库类型占比',
			            type:'pie',
			            z:0,
			            radius:  ['45%', '60%'],
			            avoidLabelOverlap: false,
			            stillShowZeroSum:false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '20',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:[
			                {value:inList[0], name:'生产退料'},
			                {value:inList[1], name:'安全库存补料'},
			                {value:inList[2], name:'齐套缺料补料'},
			                {value:inList[3], name:'机损补料'},
			                {value:inList[4], name:'盘点入库'},
			                {value:inList[5], name:'其它'}
			            ]
			        }
			    ],
			    color:['#87CEFA','#FF6BB5','#FF7F50','#DA70D6','#32CD32','#FFA500','#FF0000','#2EC7C9','#BB9FD0','#FF69B4','#C4E779']
			};
		myChart.setOption(option);
	} 
	
	//右边饼图
	function showRight(data){
		var outList = data['outList'];
		var myChart = echarts.init(document.getElementById('rightPie'));
		option = {
				title : {
					text :"出库类型占比",
		                x:'center',
		                z:0
		            
				},
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)",
			        axisPointer: {
		                z:0
		            }
			    },
			    legend: {
			        orient: 'horizontal',
			        x: 'center',
			        y: 'bottom',
			        data:['生产领料','生产补料','盘点出库','其它'],
			        z:0
			    },
			    series: [
			        {
			            name:'出库类型占比',
			            type:'pie',
			            z:0,
			            radius: ['45%', '60%'],
			            avoidLabelOverlap: false,
			            stillShowZeroSum:false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '20',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:[
			                {value:outList[0], name:'生产领料'},
			                {value:outList[1], name:'生产补料'},
			                {value:outList[2], name:'盘点出库'},
			                {value:outList[3], name:'其它'}
			            ]
			        }
			    ],
			    color:['#87CEFA','#FF6BB5','#FF7F50','#DA70D6','#32CD32','#FFA500','#FF0000','#2EC7C9','#BB9FD0','#FF69B4','#C4E779']
			};
		myChart.setOption(option);
	} 
	
	module.init = init;
	return module;
}($, window.OutstockInstockStatistics || {}));
$(function() {
	OutstockInstockStatistics.init();
});