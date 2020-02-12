window.checkRuleUpd = (function($, module) {

	//listMaterial = null;
	//listWarehouse = null;
	//listMaterialType = null;
	function init() {
		//getMaterialType();
		// getWarehouse();
		//innerCheckRuleOptions();
	}
	// 查询仓库
	function getWarehouse() {
		$.ajax({
			url : "warehouse/queryAllWarehouseList",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				var appendoption = "<option value ='0'>全部仓库</option>";
				$.each(data, function(item, obj) {
						appendoption += "<option value ='"
								+ obj.warehouseId + "'>" + obj.houseName
								+ "</option>";
				});
				$("#checkWarehouseId").append(appendoption);
			}
		});
	}
	// 查询物料类型
	/*function getMaterialType() {
		$.ajax({
			url : "materialtype/queryAllMaterialTypeList",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				var appendoption = "";
				if (MaterialType == "") {
					appendoption += "<option selected = selected value ='0'>全部类型</option>";
				} else {
					appendoption += "<option  value ='0'>全部类型</option>";
				}
				$.each(
					data,
					function(item, obj) {
						if (MaterialType != null
								&& obj.materialTypeId == MaterialType) {
							appendoption += "<option selected = selected value ='"
									+ obj.materialTypeId
									+ "'>"
									+ obj.typeName
									+ "</option>";
						} else {
							appendoption += "<option value ='"
									+ obj.materialTypeId
									+ "'>"
									+ obj.typeName
									+ "</option>";

						}

					});
				$("#checkMaterialType").append(appendoption);
				listMaterialType = data;
			}
		});
	}*/
	// 填充盘点规则
	function innerCheckRuleOptions() {
		var appendoption = "";
		if (checkRule == "月度") {
			appendoption += "<option selected=selected value='月度'>按月盘点</option><option value='季度'>按季盘点</option><option value='年度'>按年盘点</option>"
		} else if (checkRule == "季度") {
			appendoption += "<option  value='月度'>按月盘点</option><option selected=selected value='季度'>按季盘点</option><option value='年度'>按年盘点</option>"
		} else if (checkRule == "年度") {
			appendoption += "<option value='月度'>按月盘点</option><option value='季度'>按季盘点</option><option selected=selected value='年度'>按年盘点</option>"
		}
		$("#checkRule").append(appendoption);
	}

	function saveRule() {
		// $("#addForm").submit();
		$.ajax({
			url : "checkRule/updCheckRule",
			type : "POST",
			data : $("#addForm").serialize(),
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = "/checkRule/toCheckRuleListJsp";
				}
			}
		});
	}
	module.init = init;
	module.saveRule = saveRule;
	return module;
}($, window.checkRuleUpd || {}));
$(function() {
	checkRuleUpd.init();
});
