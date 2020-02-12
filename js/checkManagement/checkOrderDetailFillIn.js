window.FillIn = (function($, module) {
	var _Page = "checkOrderDetaiPage";
	//m = new Map();
	var r = /^([1-9]\d*|[0]{1,1})$/;
	/**
	 * 初始化
	 */
	function init() {
		var checkId = $("#checkId").val();
		initPageInfo(checkId);
		//m.set("wb",1)
	}
	function initPageInfo(checkId) {
		// 更新page信息
		var url = "checkOrderDetail/getCheckOrderDetailList?pageSize=15&checkId="
				+ checkId;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : _Page,
				url : url,
				callback : CheckOrderDetailList
			}, data['page']);
			CheckOrderDetailList(data);
		});
	}

	function CheckOrderDetailList(data) {
		// 显示任务模板列表
		var html = template('checkOrderDetatilTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
      //修改了日期显示的格式，只显示年月日
		$(".time").each(function(i){
			$(".time").eq(i).html($(".time").eq(i).html().substr(0,10));
		});
	}

	function updnum(id, recordAmount, checkAmount) {
		// 校验输入数字

		if (!r.test(checkAmount)) {
			$("#checkSpan" + id).text("请正确输入数字(非负数)");
			$("#checkSpan" + id).css({
				color : "#B94A48",
				background: "#F2DEDE",
			    fontSize: "12px"
			});
			return;
		} else {
			$("#checkSpan" + id).text('');
		}
		var difference = checkAmount - recordAmount;
		var checkOrderDetail = {
			"id" : id,
			"checkAmount" : checkAmount,
			"differenceAmount" : difference,
		};

		$("#dif" + id).html(difference);
		if (difference == 0) {
			$("#reason" + id).val("无差异");
			updReason(id, "无差异");
		} else {
			$("#reason" + id).val(null);
			updReason(id, " ");
			$("#reSpan" + id + "").text("差异原因必填");
			$("#reSpan" + id + "").css({
				color : "#B94A48",
				background: "#F2DEDE",
			    fontSize: "12px"
			});

		}
		$.ajax({
			url : "checkOrderDetail/updCheckOrderDetail",
			type : "POST",
			data : JSON.stringify(checkOrderDetail),
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
			}
		});
	}
	var reg = /^\s*$/;
	function updReason(id, reason) {
		$("#reSpan" + id + "").text("");
		// 未填数字
		if ($("#checkAmount" + id).val() == null
				|| $("#checkAmount" + id).val() == '') {
			$("#checkSpan" + id).text("请正确输入数字(非负数)");
			$("#checkSpan" + id).css({
				color : "#B94A48",
				background: "#F2DEDE",
			    fontSize: "12px"
			});
			return;
		}
		// 差异原因全为空格
		if (reg.test(reason)) {
			$("#reSpan" + id).text("差异原因全为空格");
			$("#reSpan" + id).css({
				color : "#B94A48",
				background: "#F2DEDE",
			    fontSize: "12px"
			});
			return;
		};

		if (reason == '' || reason == null || reason == " ") {
			$("#reSpan" + id + "").text("差异原因必填");
			$("#reSpan" + id + "").css({
				color : "#B94A48",
				background: "#F2DEDE",
			    fontSize: "12px"
			});
			return;
		}
		var checkOrderDetail = {
			"id" : id,
			"differenceReason" : reason
		};
		$.ajax({
			url : "checkOrderDetail/updCheckOrderDetail",
			type : "POST",
			data : JSON.stringify(checkOrderDetail),
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {

			}
		});
	}
	// 校验页面
	function jiaoyanyemian() {
		var numlist = [];
		$("span[id^='checkSpan']").each(function() {
			if ($(this).text() != "") {
				$(this).css({
					color : "blue",
					background: "#F2DEDE",
				    fontSize: "12px"
				});
				numlist.push($(this).text());
			}
		});
		if (numlist.length > 0) {
			alert("请按要求输入数字");
			return true;
		}
		var relist = [];
		$("span[id^='reSpan']").each(function() {
			if ($(this).text() != "") {
				$(this).css({
					color : "blue",
					background: "#F2DEDE",
				    fontSize: "12px"
				});
				relist.push($(this).text());
			}
		});
		if (relist.length > 0) {
			alert("请输入差异原因");
			return true;
		}
	}
	// 校验后台
	function jiaoyanhoutai() {
		var re = true;
		$.ajax({
			url : "checkOrderDetail/jiaoyanAmountAndReason",
			type : "GET",
			data : {
				"id" : $("#checkId").val()
			},
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				if (data > 0) {
					alert("有"+data+"个物料未完成盘点,请检查");
				} else {
					re = false;
				}
			}
		});
		return re;
	}
	// 执行
	function execute() {
		if (jiaoyanyemian()) {
			return;
		}
		// 后台校验
		if (jiaoyanhoutai()) {
			return;
		}
		var checkOrder = {
			"id" : $("#checkId").val(),
			"state" : 2
		};
		// state 1已创建 /2未审核 /3未调整/4已完成
		$.ajax({
			url : "checkOrder/updCheckOrder",
			type : "POST",
			data : JSON.stringify(checkOrder),
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = urlPre
							+ "checkOrder/toCheckOrderListJsp";
				}
				//灭个灯
				//needlightOff();
			}
		});
	}
	
	/**
	 * 重置页面
	 */
	function resetCheckDetail(){
	    confirm("重置会清空盘点详情数据",function(result){
	       if (result){
	           var checkId = $("#checkId").val();
	           CommonUtils.getAjaxData({url:'checkOrderDetail/resetCheckDetail?checkId='+checkId,type:'get'},function(data){
	               if (data != 'success'){
	                   alert("重置失败");
	               }
	               else{
	                   /*//盘查盈亏清空
	                   $("tr").find("td:eq(13)").html("");
	                   //盘查数量差异原因清空
	                   $("input[id^='checkAmount'],input[id^='reason']").val("");
	                   //needlightOff();*/
	            	   //刷新页面
	            	   window.location.reload() //= urlPre+'checkOrder/toCheckOrderDetailFillIn?id='+$("#checkId").val();
	               }
	           });
	       } 
	    });
	}
	//亮灯
	function lights(location){
		$.ajaxSetup({cache : false});
		var localtionType;
		if(!location){
			return;
		}
		//alert(location);
		var pjList=location.split("-");
		var name ='';
		if("pz"==pjList[0]){
			localtionType = "plhj";
			//buling:
			name="plhj";
			if(pjList[2].length ==1){
				pjList[2] = "00"+pjList[2];
			}else if(pjList[2].length == 2){
				pjList[2] = "0"+pjList[2];
			}
			
			if(parseInt(pjList[1]) > 7)
			{
				var data="L0362B"+(Number(pjList[1])-7)+pjList[2];
			}else
			{
				var data="L0362A"+pjList[1]+pjList[2];
			}
		}else if("sm"==pjList[0]){
			localtionType = "dzfcg";
			name="dzfcg";
			var Obj={ "name":name,
					"group":parseInt(pjList[1]),
					"index":parseInt(pjList[2])
			};
			var data="pj"+JSON.stringify(Obj);
		}else if("wb"==pjList[0]){
			localtionType = "wb";
			name="wb";
			var Obj={ "name":name,
					"group":parseInt(pjList[1]),
					"index":parseInt(pjList[2])
			};
			var data="pj"+JSON.stringify(Obj);
		}else{
			return;
		}
		$("#loader").show();
		$.ajax({
			url : "checkOrderDetail/onelight?data="+data + "&localtionType="+localtionType,
			type : "GET",
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if(data=="success"){
					//记录灯是否亮过
					m.set(name,1);
				}else{
					alert(data);
				}
			},
			error:function() {
				$("#loader").hide();
				alert("异常");
			}
		});
		//前台跨域调用
		//url='http://192.168.16.112:8080/BQ206SMT_Light/comController/light?scanInfo='+data+'&tag=1&callback=handleResponse'
		/*$.getJSON(url ,function(data){
			alert(response);
			console.log(data);		
		})*/
		}
	//返回时灭灯
/*	function turedown(){
		//needlightOff();
		window.location.href = urlPre
		+ "checkOrder/toCheckOrderListJsp";
	}*/
	function needlightOff(){
		//light off
		if (m.has("plhj")) {
			lightOff("plhj");
		}
		if (m.has("dzfcg")) {
			lightOff("dzfcg");
		}
		if (m.has("wb")) {
			lightOff("wb");
		}
	}
	//light off
	function lightOff(name){
		$.ajax({
			url : "checkOrderDetail/lightOff?name="+name,
			type : "GET",
			contentType : 'application/json; charset=utf-8',
			datatype : "json",
			cache : false,
			async:false,
			success : function(data) {
				if(data=="success"){
				}else{
					alert(data);
				}
			},
			error:function() {
				alert("异常");
			}
		});
	}
	module.init = init;
	module.updnum = updnum;
	module.updReason = updReason;
	module.execute = execute;
	module.lights=lights;
	module.resetCheckDetail=resetCheckDetail;
	return module;
}($, window.FillIn || {}));
$(function() {
	FillIn.init();
});
