window.instockApplyList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		query();

	}
	function query() {
		$.ajax({
			url : "instock/getInstockApplyList",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showInstockApplyList(data);
				initPageInfo(data);
			}
		});
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo(data) {
		var url = 'instock/getInstockApplyList';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'instockApplyPage',
				url : url,
				callback : showInstockApplyList
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
	function showInstockApplyList(data) {

		var html = template('instockApplyTemp', data);
		$("#tablelist").html("").html(html);
		
		CommonUtils.ie8TrChangeColor();
		//修改了日期显示的格式，只显示年月日
		$(".time").each(function(i){
			$(".time").eq(i).html($(".time").eq(i).html().substr(0,10));
		});
	}

	/**
	 * 删除物料
	 */
	/* function delInstockApply(){
	     var list = [];//项目中要删除的id集合
	     var checks = $("input[type='checkbox']:checked");
	     $.each(checks,function(index,obj){
	         list.push(obj.id);
	     });
	     
	     if (list.length == 0){
	         return;
	     }
	     
	     window.confirm("确定要删除吗?",function(result){
	         if (result){
	             var deleteInstockOrderUrl = 'instock/delInstockApplys';
	             CommonUtils.getAjaxData({
	                 url : deleteInstockOrderUrl,
	                 data : JSON.stringify(list),
	                 type : 'POST'
	             }, function(data) {
	                 if(data=="success"){
	                     //刷新当前分页数据
	                     var current = PageUtils._currentPage['instockApplyPage'];
	     				PageUtils.pageClick(current, 'instockApplyPage');
	                 }
	             });
	         }
	     });
	 }*/

	/**
	 * 删除产线
	 */
	function delInstockApply() {
		var list = [];//项目中要删除的id集合
		var checks = $("input[type='checkbox']:checked");
		$.each(checks, function(index, obj) {
			list.push(obj.id);
		});

		if (list.length == 0) {
			return;
		}

		if (!confirm("确定要删除吗?")) {
			return;
		}

		var deleteInstockOrderUrl = 'instock/delInstockApplys';
		CommonUtils.getAjaxData({
			url : deleteInstockOrderUrl,
			data : JSON.stringify(list),
			type : 'POST'
		}, function(data) {
			if (data == "success") {
				//刷新当前分页数据
				var current = PageUtils._currentPage['instockApplyPage'];
				PageUtils.pageClick(current, 'instockApplyPage');
			}
		});
	}

	module.init = init;
	module.delInstockApply = delInstockApply;
	return module;
}($, window.Material || {}));
$(function() {
	instockApplyList.init();
});