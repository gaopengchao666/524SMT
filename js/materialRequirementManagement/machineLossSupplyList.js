window.machineLossSupplyList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		query();
	}
	function query() {
		$.ajax({
			url : "machineLossSupply/getMachineLossSupplyList",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showMachineLossSupplyList(data);
				initPageInfo(data);
			}
		});
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo(data) {
		var url = 'machineLossSupply/getMachineLossSupplyList';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'machineLossSupplyPage',
				url : url,
				callback : showMachineLossSupplyList
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
	function showMachineLossSupplyList(data) {
		
		var html = template('machineLossSupplyTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}

	// 删除申请单
	function delMachineLossSupply() {
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
				url : 'machineLossSupply/delMachineLossSupplys',
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
	
					var current = PageUtils._currentPage['machineLossSupplyPage'];
					PageUtils.pageClick(current, 'machineLossSupplyPage');
				}
			});
			}
		});
	}
	module.init = init;
	module.delMachineLossSupply = delMachineLossSupply;
	return module;
}($, window.machineLossSupplyList || {}));
$(function() {
	machineLossSupplyList.init();
});
