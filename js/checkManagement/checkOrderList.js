window.checkOrderList = (function($, module) {
	
	/**
	 * 初始化
	 */
	function init() {
		// 是否添加盘点单
		addCheckOrderAuto();
		query();
		//更新待办事项状态
        self.parent.menuFrame.updateWorkBeach();
	}
	function addCheckOrderAuto() {
		var checkRuleidAuto = $("#checkRuleid").val();
		if(checkRuleidAuto){
			toAddCheckOrder(checkRuleidAuto);
		}
	}
	function toAddCheckOrder(checkRuleid) {
		window.confirm("确认添加本期盘点单?", function(result) {
			if(result){
			$("#loader").show();
			$.ajax({
				url : "checkOrder/addCheckOrder?checkRuleid="
					+ checkRuleid + "&username=" + encodeURI(userName),
					type : "GET",
					datatype : "json",
					cache : false,
					success : function(data) {
						$("#loader").hide();
						if("success"==data){
							window.location.href=urlPre+"checkOrder/toCheckOrderListJsp";
						}else if("sizeIs0"==data){
							alert('该规则没有物料进行盘点，请重新选择');
						}
					}
			});
			}
		});
	}
	function query() {
		$.ajax({
			url : "checkOrder/getCheckOrderList",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showCheckOrderList(data);
				initPageInfo1(data);
			}
		});
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo1(data) {
		var url = 'checkOrder/getCheckOrderList';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'checkOrderPage',
				url : url,
				callback : showCheckOrderList
			}, data['page']);
		});
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$("input[type='checkbox']").on("click", function() {
			setDeleteIsUsed();
		});
	}

	/**
	 * 删除按钮是否可用
	 */
	function setDeleteIsUsed() {
		var checks = $("input[type='checkbox']:checked");
		if (checks == '' || checks.length == 0) {
			$("#delCheck").attr("disabled", true);
		} else {
			$("#delCheck").attr("disabled", false);
		}
	}

	// 显示
	function showCheckOrderList(data) {

		var html = template('checkOrderTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}

	// 删除盘点单
	function deleteCheckOrders() {
		var list = [];
		var checks = $("input[type='checkbox']:checked");
		$.each(checks, function(index, obj) {
			list.push(obj.id);
		});
		if (!list.length > 0) {
			alert("请选择要删除的内容!!");
			return;
		}
		window.confirm("确认删除?", function(result) {
			if(result){
				$.ajax({
					type : 'POST',
					url : 'checkOrder/delCheckOrders',
					cache : false,
					data : JSON.stringify(list),
					contentType : 'application/json; charset=utf-8',
					async : true,
					success : function(data) {
						if (data == 'success') {
							alert("删除成功");
						} else if (data == "error") {
							alert("无法删除!!!");
						} else {
							alert("错误");
						}
						var current = PageUtils._currentPage['checkOrderPage'];
						PageUtils.pageClick(current, 'checkOrderPage');
					}
				});
			}
		});
	}
	
	//点击手动添加按钮
	function handleAdd(){
		$(".mask").css("display", "block");
		
		queryCheckRule();
	}
	function queryCheckRule() {
		$.ajax({
			url : "checkRule/queryCheckRulesByPage",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showCheckRuleList(data);
				initPageInfo(data);
			}
		});
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo(data) {
		var url = 'checkRule/queryCheckRulesByPage';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'checkRulePage',
				url : url,
				callback : showCheckRuleList
			}, data['page']);
		});
	}
	// 显示盘点计划
	function showCheckRuleList(data) {
		_CheckTab = $("#checkRuleInfo");
		_CheckTab.html("");
		var datas = data['checkRuleList'];
		$
				.each(
						datas,
						function(item, obj) {
							var dom = "";
							dom += "<tr class='contentText list_list'>";
							dom += "<td class='checkBox2item'><input type='checkbox' name='checkIdlist' class='input_checkBox'  id='"
									+ obj.id
									+ "' value='"
									+ obj.id
									+ "'></td>";
							dom += "<td >"
									+ obj.ruleName
									+ "</td>";
							dom += "<td>" + (obj.checkWarehouseId==0?'全部仓库':obj.checkWarehouseName)+ "</td>";
							dom += "<td>" + obj.checkRule + "</td>";
							dom += "<td>" + obj.checkPeople + "</td>";
							dom += "<td>" + obj.auditPeople + "</td>";
							dom += "</tr>";
							_CheckTab.append(dom);
						});
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	//选择checkoder id
	function getRuleId(){
		var list = [];
		var checks = $("input[name='checkIdlist']:checked");
		$.each(checks, function(index, obj) {
			list.push(obj.id);
		});
		if (list.length == 1) {
			var checkRuleid=list[0];
			toAddCheckOrder(checkRuleid);
		}else{
			alert("请选择一个盘点规则");
		}
		
	}
	module.getRuleId=getRuleId;
	module.handleAdd=handleAdd;
	module.init = init;
	module.deleteCheckOrders = deleteCheckOrders;
	return module;
}($, window.checkOrderList || {}));
$(function() {
	checkOrderList.init();
});
