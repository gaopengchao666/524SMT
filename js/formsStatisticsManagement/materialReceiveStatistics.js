window.MaterialReceiveStatistics = (function($, module) {
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
		getGraph();	
	}
	//点击分析图页签
	$(".layui-this").click(function(){
		$(".select_text input[type='text']").each(function(){
    		$(this).val("");
    	});
		$(".select_text").find("select").prop('selectedIndex', 0);			
		//清空日期校验
		$(".startTime").datepicker("option","maxDate",null);
		$(".endTime").datepicker("option","minDate",null);
		bindEvent();
	});
	//分析图查询
	function getGraph(){
		var statisticsType = $("input[name='s_type']:checked").val();
		var startTime = $(".startTime").val();
		var endTime = $(".endTime").val();
		$.ajaxSetup({cache : false});
		var url = 'materialReceiveStatisticsPage?pageSize=20&pageTable=1&statisticsType='+statisticsType+'&startTime='+startTime+'&endTime='+endTime;
		$("#loader").removeClass("hidden");		
		CommonUtils.getAjaxData({url:url,type:'GET',async:'false'},function(data){
			PageUtils.refreshPageInfo({element:'',url : url,callback : showBarGraph},data['page']);
			if(data != null){
				showBarGraph(data);
			}		
			$("#loader").addClass("hidden");
		});	
	}
	
	//列表查询
	function getTable(){		
		var statisticsType = $("input[name='s_type1']:checked").val();	
		var startTime = $(".startTime1").val();
		var endTime = $(".endTime1").val();
		$.ajaxSetup({cache : false});
		var url = 'materialReceiveStatisticsPage?pageTable=2&statisticsType='+statisticsType+'&startTime='+startTime+'&endTime='+endTime;
		$("#loader").removeClass("hidden");		
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true'},function(data){
			PageUtils.refreshPageInfo({element:'queryPage',url : url,callback : showBills},data['page']);
			if(data != null){
				showBills(data);
			}			
			$("#loader").addClass("hidden");
		});	
	}
	
	//分析图展示
	function showBarGraph(data){
		var materialNameList = data['materialNameList'];
		var materialTimeData = data['collerTimeList'];
		var materialNumData = data['collerNumList'];
		var myChart = echarts.init(document.getElementById('main'));
		option = {
			    tooltip: {
			        trigger: 'axis'
			    },
				 grid:{
					x: 50,
					y: 50,
					x2:50,
					y2:70,
					borderWidth:1	    	
				},
			    legend: {
			        data:['领用频次','领用数量']
			    },
			    xAxis: [
			        {
			            type: 'category',
			            data: materialNameList,
			            axisPointer: {
			                type: 'shadow'
			            },
						axisLabel:{
							interval:0,
							rotate:20,
							textStyle:{
								color:'#000000',
								fontSize:'10',
								fontWeight:'bold'
							}
						}						
			        }
			    ],    
			    yAxis: [
				        {
				            type: 'value',
				            name: '数量',
				            axisLabel: {
				                formatter: '{value}'
				            },
				            splitLine:{
				            	show:true
				            }
				            
				        },
				        {
				            type: 'value',
				            name: '频次',	
				            axisLabel: {
				                formatter: '{value}'
				            },
				            splitLine:{
				            	show:false
				            }
				        }
				    ],
				    series: [
				        {
				            name:'领用数量',
				            type:'bar',
				            data:materialNumData
				        },
				        {
				            name:'领用频次',
				            type:'bar',
				            yAxisIndex: 1,
				            data:materialTimeData
				        }
				    ]
				};
		myChart.setOption(option);
	}	
	//列表数据展示
	function showBills(data){
		$("#dataShow").html("");
    	var datas = data['collarStatisticalList'];  	
		$.each(datas,function(item,obj){
			var dom = "";
			dom += "<tr class='listTableText list_list'>";
			dom += "<td>"+obj.materialCode+"</td>";
			dom += "<td>"+obj.materialType+"</td>";
			dom += "<td>"+obj.materialName+"</td>";
			if(obj.materialModel == null || obj.materialModel == ''){
				dom += "<td>--</td>";
			}else{
				dom += "<td>"+obj.materialModel+"</td>";
			}
			dom += "<td>"+obj.useUnit+"</td>";	
			dom += "<td>"+obj.collarUseNum+"</td>";
			dom += "<td>"+obj.collarTimes+"</td>";
			dom += "</tr>";
			$("#dataShow").append(dom);
		});			
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
	
	
	//列表页签切换
	$(".tableListClick").click(function(){
		$(".select_text input[type='text']").each(function(){
    		$(this).val("");
    	});
		$(".select_text").find("select").prop('selectedIndex', 0);		
		//清空日期校验
		$(".startTime1").datepicker("option","maxDate",null);
		$(".endTime1").datepicker("option","minDate",null);
		getTable();
	});
	
    //列表展示条件查询
    $("#searchClickTable").click(function(){
    	getTable();	
    });
    //分析图条件查询    
    $("#searchClickGraph").click(function(){
    	getGraph();	   	
    });
    //列表展示重置条件
    $("#clearClickTable").click(function(){
    	$(".select_text input[type='text']").each(function(){
    		$(this).val("");
    	});
		$(".select_text").find("select").prop('selectedIndex', 0);		
		//清空日期校验
		$(".startTime1").datepicker("option","maxDate",null);
		$(".endTime1").datepicker("option","minDate",null);
		getTable();
    });
    //分析图重置条件
    $("#clearClickGraph").click(function(){
    	$(".select_text input[type='text']").each(function(){
    		$(this).val("");
    	});
		$(".select_text").find("select").prop('selectedIndex', 0);			
		//清空日期校验
		$(".startTime").datepicker("option","maxDate",null);
		$(".endTime").datepicker("option","minDate",null);
		getGraph();	
		
    });
   //单选框切换
    $("#radioTable1").click(function(){
    	getTable();	
    });
    
    $("#radioTable2").click(function(){
    	getTable();	
    });  
    $("#radioGraph1").click(function(){
    	getGraph();	    	
    });   
    $("#radioGraph2").click(function(){
    	getGraph();
    });		
	module.init = init;
	return module;
}($, window.MaterialReceiveStatistics || {}));
$(function() {
	MaterialReceiveStatistics.init();
});