window.OutStockRuleList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		initPageInfo();
	}

	function initPageInfo() {
		// 更新page信息
		var url = 'outStockRule/getOutStockRuleList';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'outStockRulePage',
				url : url,
				callback : showOutStockRuleList
			}, data['page']);
			showOutStockRuleList(data);
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

	// 显示盘点计划
	function showOutStockRuleList(data) {
		var html = template('outStockRuleTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	// 删除物料
	function delOutStockRule() {
		var list = [];
		var checks = $("input[name='list']:checked");
		$.each(checks, function(index, obj) {
			list.push(obj.id);
		});
		if (!list.length > 0) {
			alert("请选择要删除的内容!!");
			return;
		}
		confirm("确定要删除吗?",function(result){
            if (result){
		$.ajax({
			type : 'POST',
			url : 'outStockRule/delOutStockRules',
			cache : false,
			data : JSON.stringify(list),
			contentType : 'application/json; charset=utf-8',
			async : true,
			success : function(data) {
				if (data == 'success') {
					alert("删除成功");
				} else if (data == "error") {
					alert("有计划被使用：无法删除!!!");
				} else {
					alert("错误");
				}

				var current = PageUtils._currentPage['outStockRulePage'];
				PageUtils.pageClick(current, 'outStockRulePage');
			}
		});
            }
		});
	}

	module.init = init;
	module.delOutStockRule = delOutStockRule;
	return module;
}($, window.OutStockRuleList || {}));
$(function() {
	OutStockRuleList.init();
});


