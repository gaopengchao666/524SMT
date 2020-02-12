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
	//分析图页签
	$(".layui-this").click(function(){
		$(".select_text input[type='text']").each(function(){
    		$(this).val("");
    	});
		$(".select_text").find("select").prop('selectedIndex', 0);		
		//清空日期校验
		$(".startTime").datepicker("option","maxDate",null);
		$(".endTime").datepicker("option","minDate",null);
		getGraph();
	});
	//分析图查询
	function getGraph(){
		var startTime = $(".startTime").val();
		var endTime = $(".endTime").val();	
		$.ajaxSetup({cache : false});
		var url = 'productLossStatisticsData?pageTable=1&&startTime='+startTime+'&endTime='+endTime;
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({url:url,type:'GET',async:'true'},function(data){
			PageUtils.refreshPageInfo({element:'',url : url,callback : showBarGraph},data['page']);
			if(data != null){
				showBarGraph(data);
			}			
			$("#loader").addClass("hidden");
		});	
	}
	
	//列表查询
	function getTable(){		
		var startTime = $(".startTime1").val();
		var endTime = $(".endTime1").val();	
		$.ajaxSetup({cache : false});
		var url = 'productLossStatisticsData?pageTable=2&startTime='+startTime+'&endTime='+endTime;
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
		var materialCodeList = data['materialCodeList'];
		var lossNumData = data['lossNumList'];
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
			        data:['使用数量','机损数量']
			    },
			    xAxis: [
			        {
			            type: 'category',
			            data: materialCodeList,
			            z:0,
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
			            name: '使用数量',
			            axisLabel: {
			                formatter: '{value}'
			            },
			            splitLine:{
			            	show:true
			            }
			        },
			        {
			            type: 'value',
			            name: '机损数量',
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
			            name:'使用数量',
			            type:'bar',
			            data:materialNumData
			        },
			        {
			            name:'机损数量',
			            type:'bar',
			            yAxisIndex: 1,
			            data:lossNumData
			        }
			    ]
			};

		myChart.setOption(option);
	}	
	//列表数据展示
	function showBills(data){
		$("#dataShow").html("");
    	var datas = data['lossList'];  	
		$.each(datas,function(item,obj){
			var dom = "";
			if(obj.collarUseNum == 0 || obj.lossRate > 100){
				dom += "<tr class='listTableText list_list'>";
				dom += "<td class='warningRed'>"+obj.materialCode+"</td>";
				dom += "<td class='warningRed'>"+obj.materialType+"</td>";
				dom += "<td class='warningRed'>"+obj.materialName+"</td>";
				if(obj.materialModel == null || obj.materialModel == ''){
					dom += "<td>--</td>";
				}else{
					dom += "<td>"+obj.materialModel+"</td>";
				}
				dom += "<td class='warningRed'>"+obj.useUnit+"</td>";	
				dom += "<td class='warningRed'>"+obj.collarUseNum+"</td>";
				dom += "<td class='warningRed'>"+obj.lossNum+"</td>";
				if(obj.lossRate > 100){
					dom += "<td>"+obj.lossRate+"</td>";
				}else{
					dom += "<td class='warningRed' style='font-size: 16px;'>∞</td>";
				}				 		
				dom += "</tr>";
			}else{
				dom += "<tr class='listTableText list_list'>";
				dom += "<td>"+obj.materialCode+"</td>";
				dom += "<td>"+obj.materialType+"</td>";
				dom += "<td>"+obj.materialName+"</td>";
				dom += "<td>"+obj.materialModel+"</td>";
				dom += "<td>"+obj.useUnit+"</td>";	
				dom += "<td>"+obj.collarUseNum+"</td>";
				dom += "<td>"+obj.lossNum+"</td>";
				dom += "<td>"+obj.lossRate+"</td>";		
				dom += "</tr>";
			}
			
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
    
   //数据导出
    $("#exportTable").click(function(){
    	var startTime = $(".startTime1").val();
		var endTime = $(".endTime1").val();	
		window.location.href = basePath+'formsStatistics/exportProductLossStatistics?startTime='+startTime+'&endTime='+endTime;
    });
    
    
	module.init = init;
	return module;
}($, window.MaterialReceiveStatistics || {}));
$(function() {
	MaterialReceiveStatistics.init();
});