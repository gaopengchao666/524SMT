window.SafetyRuleList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		initPageInfo();

	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo() {
		// 更新page信息
		var url = 'safetyRule/getSafetyRuleList';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'safetyRulePage',
				url : url,
				callback : showSafetyRuleList
			}, data['page']);
			showSafetyRuleList(data);
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
	function showSafetyRuleList(data) {

		var html = template('safetyRuleTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	// 添加物料
	function addSafetyRule() {
		window.location.href = "/safetyRule/toAddSafetyRuleJsp";
	}
	// 删除物料
	function delSafetyRule() {
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
			url : 'safetyRule/delSafetyRules',
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

				var current = PageUtils._currentPage['safetyRulePage'];
				PageUtils.pageClick(current, 'safetyRulePage');
			}
		});
            }
		});
	}

	/**
	 * 更新物料
	 */
	/*
	 * function updCheck(check_id) { window.location.href = basePath +
	 * "check/toCheck?check_id=" + check_id; }
	 */

	module.init = init;
	module.delSafetyRule = delSafetyRule;
	module.addSafetyRule = addSafetyRule;
	return module;
}($, window.SafetyRuleList || {}));
$(function() {
	SafetyRuleList.init();
});
