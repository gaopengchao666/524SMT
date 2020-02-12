window.checkRuleList = (function($, module) {
	warehoseList = null;
	materialTypeList = null;
	/**
	 * 初始化
	 */
	function init() {
		/*getWarehouse();
		getMaterialType();*/
		initPageInfo();
		bindEvent();
	}
	// 查询仓库
	/*function getWarehouse() {
		$.ajax({
			url : "warehouse/queryAllWarehouseList",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				warehoseList = data;
			}
		});
	}
	// 查询物料类型
	function getMaterialType() {
		$.ajax({
			url : "materialtype/queryAllMaterialTypeList",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				materialTypeList = data;
			}
		});
	}*/
	/**
	 * 加载页面
	 */
	function initPageInfo() {
		// 更新page信息
		var url = 'checkRule/queryCheckRulesByPage';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'checkRulePage',
				url : url,
				callback : showCheckRule
			}, data['page']);
			showCheckRule(data);
		});
	}

	/**
	 * 显示产线列表
	 */
	function showCheckRule(data) {
		// 显示任务模板列表
		template.defaults.imports.dateFormat = function(date, format) {
			if (date) {
				return moment(date).format(format);
			}
			return '';
		};
		/*for (var i = 0; i < data.checkRuleList.length; i++) {
			data.checkRuleList[i].checkWarehouse = setWarehouseName(data.checkRuleList[i].checkWarehouse);
			data.checkRuleList[i].checkMaterialType = setMaterialTypeName(data.checkRuleList[i].checkMaterialType);
		}*/
		var html = template('ruleCheckTemp', data);
		$("#tablelist").html("").html(html);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}
	// 匹配仓库名称与物资类型
	/*function setWarehouseName(warehouseid) {
		for (var i = 0; i < warehoseList.length; i++) {
			if (warehoseList[i].warehouseId == warehouseid) {
				return warehoseList[i].houseName;
			}
		}
	}
	function setMaterialTypeName(materialTypeId) {
		for (var i = 0; i < materialTypeList.length; i++) {
			if (materialTypeList[i].materialTypeId == materialTypeId) {
				return materialTypeList[i].typeName;
			}
		}
	}*/
	/**
	 * 删除产线
	 */
	function deleteCheckRules() {
		var list = [];// 项目中要删除的id集合
		var checks = $("input[type='checkbox']:checked");
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
					url : 'checkRule/deleteCheckRules',
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
		
						var current = PageUtils._currentPage['checkRulePage'];
						PageUtils.pageClick(current, 'checkRulePage');
					}
				});
            }
		});
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
	}

	module.init = init;

	module.deleteCheckRules = deleteCheckRules;
	return module;
}($, window.checkRuleList || {}));
$(function() {
	checkRuleList.init();
});