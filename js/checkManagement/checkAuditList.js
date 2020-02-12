window.checkAuditList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		query();
	}
	function query() {
		$.ajax({
			url : "checkOrder/getCheckOrderList?state=2",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showCheckAuditList(data);
				initPageInfo(data);
			}
		});
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo(data) {
		var url = 'checkOrder/getCheckOrderList?state=2';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'checkOrderPage',
				url : url,
				callback : showCheckAuditList
			}, data['page']);
		});
	}

	// 显示
	function showCheckAuditList(data) {
		var html = template('checkOrderTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}

	module.init = init;
	return module;
}($, window.checkAuditList || {}));
$(function() {
	checkAuditList.init();
});
