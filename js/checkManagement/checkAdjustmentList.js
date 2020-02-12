window.checkAdjustmentList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		query();
	}
	function query() {
		$.ajax({
			url : "checkOrder/getCheckOrderList?state=3",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showCheckAdjustmentList(data);
				initPageInfo(data);
			}
		});
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo(data) {
		var url = 'checkOrder/getCheckOrderList?state=3';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'checkOrderPage',
				url : url,
				callback : showCheckAdjustmentList
			}, data['page']);
		});
	}

	// 显示
	function showCheckAdjustmentList(data) {
		var html = template('checkOrderTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}

	module.init = init;
	return module;
}($, window.checkAdjustmentList || {}));
$(function() {
	checkAdjustmentList.init();
});
