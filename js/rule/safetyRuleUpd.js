window.safetyRuleUpd = (function($, module) {

	listMaterial = null;
	listWarehouse = null;
	listMaterialType = null;
	function init() {
		bindEvent();
	}
	function bindEvent() {
		// 正整数校验
		$.validator.addMethod("isIntLtZero", function(value, element) {
			value = parseInt(value);
			return this.optional(element) || value >= 0;
		}, "");
		// 不为空校验
		$.validator.addMethod("isNull", function(value, element) {
			if (value == "" || value == null) {
				return false;
			} else {
				return true;
			}
		}, "");
		// 名称重复校验
		$.validator.addMethod("ruleNameIsExist", function(value, element) {
			if(RuleNameOld==value){
				return true;
			}
			var value1 = encodeURI(encodeURI(jQuery.trim(value)));
			var flag1 = 1;
			$.ajax({
				type : "GET",
				url : "safetyRule/ruleNameIsExist?ruleName=" + value1,
				async : false,
				success : function(data) {
					if (data == "has") {
						flag1 = 0;
					}
				}
			});
			if (flag1 == 1) {
				return true;
			} else {
				return false;
			}
		}, "");
		//大于
		$.validator.addMethod("gt", function(value, element) {
			
			//param=element.parentElement.parentElement.previousElementSibling.firstChild.firstChild.value;
			var param=$(element).parents("tr").find("input[name='minNum']").val()
			return Number(value)> Number(param);
		}, $.validator.format("输入的值必须大于{1}！"));
		//小于
		$.validator.addMethod("lt", function(value, element) {
			//var param=element.parentElement.parentElement.nextElementSibling.firstChild.firstChild.value;
			var param=$(element).parents("tr").find("input[name='maxNum']").val()
				return Number(value)< Number(param);
		}, $.validator.format("输入的值必须小于{1}！"));
		_validate = $("#addForm").validate({
			rules : {
				'ruleName' : {
					ruleNameIsExist : true,
					isNull : true,
					maxlength : 255
				},
				'warehouseId' : {
					required : true,
					number : true
				},
				'materialTypeId' : {
					required : true,
					number : true
				},
				'materialCode' : {
					required : true
				},
				'minNum' : {
					isIntLtZero : true,
					number : true,
					lt:true
				},
				'maxNum' : {
					isIntLtZero : true,
					number : true,
					gt:true
				},
				'addNum' : {
					isIntLtZero : true,
					number : true
				},
				'expiryDate' : {
					isIntLtZero : true,
					number : true
				},
				'expiryDayNum' : {
					isIntLtZero : true,
					number : true
				}
			},
			messages : {
				'ruleName' : {
					ruleNameIsExist : "规则名称不能重复",
					isNull : "名称不能为空",
					maxlength : "长度不超过255"
				},
				'warehouseId' : {
					required : "必须选择仓库"
				},
				'materialTypeId' : {
					required : "请选择类型"
				},
				'materialCode' : {
					required : "请选择物料"
				},
				'minNum' : {
					isIntLtZero : "请输入正整数",
					lt:"值必须小于上限"
				},
				'maxNum' : {
					isIntLtZero : "请输入正整数",
					gt:"值必须大于下限"
				},
				'addNum' : {
					isIntLtZero : "请输入正整数"
				},
				'expiryDayNum' : {
					isIntLtZero : "请输入正整数"
				},
				'expiryDate' : {
					isIntLtZero : "请输入正整数"
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
			success : function(data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].warehouseId == WarehouseID) {
						$("#warehouse").val(data[i].houseName);
					}
				}
				listWarehouse = data;
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
			success : function(data) {
				var appendoption = "";
				/*
				 * if (MaterialType == null || MaterialType == "") {
				 * appendoption += "<option selected = selected value ='0'>全部类型</option>"; }
				 * else { appendoption += "<option value ='0'>全部类型</option>"; }
				 */
				$.each(data, function(item, obj) {
					if (MaterialType != null
							&& obj.materialTypeId == MaterialType) {
						appendoption += "<option selected = selected value ='"
								+ obj.materialTypeId + "'>" + obj.typeName
								+ "</option>";
					} else {
						appendoption += "<option value ='" + obj.materialTypeId
								+ "'>" + obj.typeName + "</option>";
					}

				});
				$("#materialType").append(appendoption);
				listMaterialType = data;
			}
		});
	}
	function getMaterialByTypeId(select) {
		materialTypeId = select.value;
		$.ajax({
			url : "safetyRule/getMaterialByTypeId?materialTypeId="
					+ materialTypeId,
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				listMaterial = data;

			}
		});
		if(!-[1,]){
			var o = select.parentElement.nextSibling;
			$(o.children[0]).html("<option value=''>请选择</option>");
			$(o.nextSibling.children[0]).val("");
			$(o.nextSibling.nextSibling.children[0]).val("");
			$(
					o.nextSibling.nextSibling.nextSibling.children[0])
					.val("");
			$(o.children[0]).append(materialOption(listMaterial));
		}else{
			var o = select.parentElement.nextElementSibling;
			$(o.children[0]).html("<option value=''>请选择</option>");
			$(o.nextElementSibling.children[0]).val("");
			$(o.nextElementSibling.nextElementSibling.children[0]).val("");
			$(
					o.nextElementSibling.nextElementSibling.nextElementSibling.children[0])
					.val("");
			$(o.children[0]).append(materialOption(listMaterial));
		}
		
	}

	// 添加物料id;
	function materialOption(listMaterial) {
		var appendoption1 = '';
		$.each(listMaterial, function(item, obj) {
			appendoption1 += "<option  id='" + item + "'  value ='"
					+ obj.materialCode + "'>" + obj.materialCode + "</option>";
		});
		return appendoption1;
	}
	// 选择物料id自动填充之后的数据
	function setMaterialOpton(obj) {
		if(!-[1,]){
			var i = $("option:selected", obj).attr("id");
			var o = obj.parentElement.nextSibling;
			$(o.children[0]).val(listMaterial[i].materialName);
			$(o.nextSibling.children[0]).val(listMaterial[i].model);
			$(o.nextSibling.nextSibling.children[0]).val(
					listMaterial[i].unit);
			if (listMaterial[i].isValidity == '1') {
				$(
						o.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.children[0])
						.val(listMaterial[i].validity);
			}
		}else{
			var i = $("option:selected", obj).attr("id");
			var o = obj.parentElement.nextElementSibling;
			$(o.children[0]).val(listMaterial[i].materialName);
			$(o.nextElementSibling.children[0]).val(listMaterial[i].model);
			$(o.nextElementSibling.nextElementSibling.children[0]).val(
					listMaterial[i].unit);
			if (listMaterial[i].isValidity == '1') {
				$(
						o.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.children[0])
						.val(listMaterial[i].validity);
			}
		}
		
	}

	function saveRule() {
		// $("#addForm").submit();
		if (!$("#addForm").valid()) {
			return;
		}
		$.ajax({
			url : "safetyRule/updSafetyRule",
			type : "POST",
			data : $("#addForm").serialize(),
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = "/safetyRule/toSafetyRuleListJsp";
				}
			}
		});
	}
	module.init = init;
	module.getMaterialByTypeId = getMaterialByTypeId;
	module.saveRule = saveRule;
	module.setMaterialOpton = setMaterialOpton;
	return module;
}($, window.safetyRuleUpd || {}));
$(function() {
	safetyRuleUpd.init();
});
