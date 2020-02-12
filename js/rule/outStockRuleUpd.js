window.outStockRuleUpd = (function($, module) {

	listMaterial = null;
	listWarehouse = null;
	listProvider = null;
	listMaterialType = null;
	function init() {
		getMaterialType();
		getWarehouse();
		getProvider();
		bindEvent();
	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		// 优先级不重复
		$.validator.addMethod("isReCover", function(value, element) {
			var s1 = document.getElementById("priorityFirst").value;
			var s2 = document.getElementById("prioritySecond").value;
			var s3 = document.getElementById("priorityThird").value;
			if (s1 == s2 && s1 != "" && s2 != "") {
				return false;
			} else if (s1 == s3 && s1 != "" && s3 != "") {
				return false;
			} else if (s2 == s3 && s2 != "" && s3 != "") {
				return false;
			} else {
				return true;
			}
		}, "");
		// 规则名称不重复
		$.validator.addMethod("ruleNameIsExist", function(value, element) {
			value = encodeURI(encodeURI(jQuery.trim(value)));
			var flag1 = 1;
			if (ruleName != value) {
				$.ajax({
					type : "GET",
					url : "outStockRule/ruleNameIsExist?ruleName=" + value,
					async : false,
					success : function(data) {
						if (data == "has") {
							flag1 = 0;
						}
					}
				});
			}
			if (flag1 == 1) {
				return true;
			} else {
				return false;
			}
		}, "");
		$("#addForm").validate({
			rules : {
				'ruleName' : {
					required : true,
					ruleNameIsExist : true
				},
				'priorityFirst' : {
					required : true,
					isReCover : true
				},
				'prioritySecond' : {
					isReCover : true
				},
				'priorityThird' : {
					isReCover : true
				}
			},
			messages : {
				'ruleName' : {
					required : "名称不能为空",
					ruleNameIsExist : "规则名称重复"
				},
				'priorityFirst' : {
					required : "第一优先级必须选择",
					isReCover : "规则不能重复"
				},
				'prioritySecond' : {
					isReCover : "规则不能重复"
				},
				'priorityThird' : {
					isReCover : "规则不能重复"
				}
			}
		});
	}
	// 查询仓库
	function getWarehouse() {
		$.ajax({
			url : "warehouse/queryAllWarehouseList",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				var appendoption = "";
				$.each(data, function(item, obj) {
					if (WarehouseID != null && obj.warehouseId == WarehouseID) {
						appendoption += "<option selected = selected value ='"
								+ obj.warehouseId + "'>" + obj.houseName
								+ "</option>";
					} else {
						/*
						 * appendoption += "<option value ='" + obj.warehouseId +
						 * "'>" + obj.houseName + "</option>";
						 */
					}
				});
				$("#warehouse").append(appendoption);
				listWarehouse = data;
			}
		});
	}
	// 查询物料类型
	function getMaterialType() {
		$
				.ajax({
					url : "outStockRule/queryMaterialTypeByCode?materialTypeId="
							+ MaterialType,
					type : "GET",
					datatype : "json",
					cache : false,
					success : function(data) {
						if (data == null || data == "") {
							$("#materialType").append(
									"<option value=''>全部类型</option>");
						} else {
							$("#materialType").append(
									"<option value=" + MaterialType + ">"
											+ data + "</option>");
						}
					}
				});
	}
	// 查询供应商信息
	function getProvider() {
		var warehouse = $("#warehouse").find("option:selected").text();
		warehouse  = encodeURI(encodeURI(warehouse));
		var materialCode = $("#materialCode").val();
		$
				.ajax({
					url : "outStockRule/getSuppliers?warehouseName="
							+ warehouse + "&materialCode=" + materialCode,
					type : "GET",
					datatype : "json",
					cache : false,
					success : function(data) {
						listProvider = data;
						var appendoption = "";
						appendoption += "<option value='' selected = selected >请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option><option value='散包先出'>散包先出</option>"
						$.each(data, function(item, obj) {
							appendoption += "<option value ='" + obj + "'>"
									+ obj + "</option>";
						});
						$("#priorityFirst").append(appendoption);
						// $("#prioritySecond").append(appendoption);
						// $("#priorityThird").append(appendoption);
					}
				});
	}

	function level1(dom) {
		// document.getElementById("outStockRules[" + trInt +
		// "].priorityFirst").options.length = 0;
		document.getElementById("prioritySecond").options.length = 0;
		document.getElementById("priorityThird").options.length = 0;
		$(document.getElementById("prioritySecond")).prop("disabled", false);
		if (dom.value == "先入先出" || dom.value == "先入后出") {
			$(document.getElementById("prioritySecond"))
					.append(
							"<option value=''>请选择</option><option value='散包先出'>散包先出</option>");
			$.each(listProvider,
					function(index, value) {
						$(document.getElementById("prioritySecond")).append(
								"<option value='" + value + "'>" + value
										+ "</option>");
					});
		} else if (dom.value == "散包先出") {
			$(document.getElementById("prioritySecond"))
					.append(
							"<option value=''>请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
			$.each(listProvider,
					function(index, value) {
						$(document.getElementById("prioritySecond")).append(
								"<option value='" + value + "'>" + value
										+ "</option>");
					});
		} else {
			$(document.getElementById("prioritySecond"))
					.append(
							"<option value=''>请选择</option><option value='散包先出'>散包先出</option>");
			$(document.getElementById("prioritySecond"))
					.append(
							"<option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
		}
	}
	function level2(dom) {
		// document.getElementById("outStockRules[" + trInt +
		// "].prioritySecond").options.length = 0;
		document.getElementById("priorityThird").options.length = 0;
		$(document.getElementById("priorityThird")).prop("disabled", false);
		var firstDom = document.getElementById("priorityFirst");
		if (dom.value == "先入先出" || dom.value == "先入后出") {
			if (firstDom.value == "散包先出") {
				$.each(listProvider, function(index, value) {
					$(document.getElementById("priorityThird")).append(
							"<option value='" + value + "'>" + value
									+ "</option>");
				});
			} else {
				$(document.getElementById("priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='散包先出'>散包先出</option>");
			}
		} else if (dom.value == "散包先出") {
			if (firstDom.value == "先入先出" || firstDom.value == "先入后出") {
				$.each(listProvider, function(index, value) {
					$(document.getElementById("priorityThird")).append(
							"<option value='" + value + "'>" + value
									+ "</option>");
				});
			} else {
				$(document.getElementById("priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
			}
		} else {
			if (firstDom.value == "先入先出" || firstDom.value == "先入后出") {
				$(document.getElementById("priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='散包先出'>散包先出</option> ");
			} else {
				$(document.getElementById("priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
			}
		}
	}
	function saveRule() {
		if (!$("#addForm").valid()) {
			return;
		}
		$
				.ajax({
					url : "outStockRule/updOutStockRule",
					type : "POST",
					data : $("#addForm").serialize(),
					cache : false,
					success : function(data) {
						if (data == "success") {
							window.location.href = "/outStockRule/toOutStockRuleListJsp";
						}
					}
				});
	}

	module.init = init;
	module.level1 = level1;
	module.level2 = level2;
	module.saveRule = saveRule;
	return module;
}($, window.outStockRuleUpd || {}));
$(function() {
	outStockRuleUpd.init();
});
