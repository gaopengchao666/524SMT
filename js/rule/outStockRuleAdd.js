window.OutStockRuleAdd = (function($, module) {

	var listMaterialCode = null;
	var listWarehouse = null;
	var listMaterial = null;
	var listProvider = null
	var _validate = null;
	// 初始一个用来存储仓库数据的JSON
	var warehouseInfoJSON = {};
	trInt = 0;// 记录行
	function init() {
		getWarehouse();
		addDetail();
		bindEvent();
	}
	/**
	 * 绑定事件
	 */
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
		// 优先级不重复
		$.validator.addMethod("isReCover", function(value, element) {
			var trInt = element.name.split("[")[1].split("]")[0];
			var s1 = document.getElementById("outStockRules[" + trInt
					+ "].priorityFirst").value;
			var s2 = document.getElementById("outStockRules[" + trInt
					+ "].prioritySecond").value;
			var s3 = document.getElementById("outStockRules[" + trInt
					+ "].priorityThird").value;
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
			$.ajaxSetup({
				cache : false
			});
			value = encodeURI(encodeURI(jQuery.trim(value)));
			var flag1 = 1;
			var flag2 = 1;
			$.ajax({
				type : "GET",
				url : "outStockRule/ruleNameIsExist?ruleName=" + value,
				async : false,
				cache : false,
				success : function(data) {
					if (data == "has") {
						flag1 = 0;
					}
				}
			});
			var ruleNames = $("input[name$='.ruleName']");
			for (var i = 0; i < ruleNames.length; i++) {
				if (element.name != ruleNames[i].name
						&& jQuery.trim(ruleNames[i].value) == value) {
					flag2 = 0;
				}
			}
			if (flag1 == 1 && flag2 == 1) {
				return true;
			} else {
				return false;
			}
		}, "");
		// 规则不重复
		$.validator.addMethod("ruleIsExist", function(value, element) {
			value = encodeURI(encodeURI(value));
			$.ajaxSetup({
				cache : false
			});
			var trInt = element.name.split("[")[1].split("]")[0];
			var warehouseId = document.getElementById("outStockRules[" + trInt
					+ "].warehouseId").value;
			var flag1 = 1;
			var flag2 = 1;
			$.ajax({
				type : "GET",
				url : "outStockRule/ruleIsExist?materialCode=" + value
						+ "&warehouse=" + warehouseId,
				async : false,
				cache : false,
				success : function(data) {
					if (data == "has") {
						flag1 = 0;
					}
				}
			});
			var ruleNames = $("select[name$='.materialCode']");
			for (var i = 0; i < ruleNames.length; i++) {
				if (element.name != ruleNames[i].name
						&& ruleNames[i].value == value) {
					flag2 = 0;
				}
			}
			if (flag1 == 1 && flag2 == 1) {
				return true;
			} else {
				return false;
			}
		}, "");
		_validate = $("#addForm").validate({
			rules : {
				'outStockRules[0].ruleName' : {
					isNull : true,
					maxlength : 255,
					ruleNameIsExist : true
				},
				'outStockRules[0].warehouseId' : {
					required : true
				},
				'outStockRules[0].priorityFirst' : {
					required : true,
					isReCover : true
				},
				'outStockRules[0].prioritySecond' : {
					isReCover : true
				},
				'outStockRules[0].priorityThird' : {
					isReCover : true
				},
				'outStockRules[0].materialCode' : {
					ruleIsExist : true
				}

			},
			messages : {
				'outStockRules[0].ruleName' : {
					isNull : "名称不能为空",
					maxlength : "长度不超过255",
					ruleNameIsExist : "规则名称重复"
				},
				'outStockRules[0].warehouseId' : {
					required : "必须选择仓库"
				},
				'outStockRules[0].priorityFirst' : {
					required : "第一优先级必须选择",
					isReCover : "规则不能重复"
				},
				'outStockRules[0].prioritySecond' : {
					isReCover : "规则不能重复"
				},
				'outStockRules[0].priorityThird' : {
					isReCover : "规则不能重复"
				},
				'outStockRules[0].materialCode' : {
					ruleIsExist : "该规则已经存在"
				}

			}
		});
	}
	// 追加校验
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		var ruleName = "outStockRules[" + len + "].ruleName";
		var warehouseId = "outStockRules[" + len + "].warehouseId";
		var priorityFirst = "outStockRules[" + len + "].priorityFirst";
		var prioritySecond = "outStockRules[" + len + "].prioritySecond";
		var priorityThird = "outStockRules[" + len + "].priorityThird";
		var materialCode = "outStockRules[" + len + "].materialCode"
		var rules = {};
		rules[ruleName] = {
			isNull : true,
			maxlength : 255,
			ruleNameIsExist : true
		};
		rules[warehouseId] = {
			number : true,
			required : true
		};
		rules[priorityFirst] = {
			required : true,
			isReCover : true
		};
		rules[prioritySecond] = {
			isReCover : true
		};
		rules[priorityThird] = {
			isReCover : true
		};
		rules[materialCode] = {
			ruleIsExist : true
		};
		$.extend(validate.settings.rules, rules);
		var messages = {};

		messages[ruleName] = {
			isNull : "名称不能为空",
			maxlength : "长度不超过255",
			ruleNameIsExist : "规则名称重复"
		};
		messages[warehouseId] = {
			required : "必须选择仓库",
		};
		messages[priorityFirst] = {
			required : "第一优先级必须选择",
			isReCover : "规则不能重复"
		};
		messages[prioritySecond] = {
			isReCover : "规则不能重复"
		};
		messages[priorityThird] = {
			isReCover : "规则不能重复"
		};
		messages[materialCode] = {
			ruleIsExist : "该规则已经存在"
		};

		$.extend(validate.settings.messages, messages);
	}
	// 物料名称输入，获得修改事件
	function materialNameChange(trInt, nowInput) {
		// 获取当前行的仓库
		var warehouse = document.getElementById("outStockRules[" + trInt
				+ "].warehouseId");
		if (warehouse.value == "" || warehouse.value == null) {
			alert("请选择仓库");
		} else {
			// 动态模糊查询当前输入的内容，从库存记录表中获取物料编码
			// getMaterialCode(nowInput.value);
			// setMaterialCodeSelectOption(trInt);
			getProvider(trInt);
		}
	}
	
	// 仓库选择框数据改变事件
	function warehouseChange(trInt, nowSelect) {
		var index = nowSelect.selectedIndex;
		warehouseInfoJSON["outStockRules[" + trInt + "].warehouseId"] = nowSelect.options[index].text;
		// document.getElementById("outStockRules[" + trInt +
		// "].materialCode").innerHTML = "<option value=''>所有物料</option>";
		$("input[name='outStockRules[" + (trInt) + "].materialCode']").val("");
		$("input[name='outStockRules[" + (trInt) + "].materialName']").val("");
		$("input[name='outStockRules[" + (trInt) + "].materialModel']").val("");
		$("input[name='outStockRules[" + (trInt) + "].unit']").val("");
		$("input[name='outStockRules[" + (trInt) + "].materialTypeName']").val(
				"");
		$("input[name='outStockRules[" + (trInt) + "].materialTypeId']")
				.val("");
		document.getElementById("outStockRules[" + trInt + "].priorityFirst").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].prioritySecond").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].priorityThird").options.length = 0;
		$(document.getElementById("outStockRules[" + trInt + "].priorityFirst"))
				.append(level1InOption());
		listProvider = "";
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
				listWarehouse = data;
			}
		});
	}
	// 查询供应商信息
	function getProvider2(trInt, materialCode) {
		warehouseName = warehouseInfoJSON["outStockRules[" + trInt
				+ "].warehouseId"];
		warehouseName = 
		warehouseName = encodeURI(encodeURI(warehouseName));
		materialCode = encodeURI(encodeURI(materialCode));
		$.ajax({
			url : "outStockRule/getSuppliers?warehouseName=" + warehouseName
					+ "&materialCode=" + materialCode,
			type : "GET",
			datatype : "json",
			cache : false,
			async : true,
			success : function(data) {
				listProvider = data;
			}
		});
		// $("#outStockRules[" + trInt +
		// "].priorityFirst").html(level1InOption());
		document.getElementById("outStockRules[" + trInt + "].priorityFirst").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].prioritySecond").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].priorityThird").options.length = 0;
		$(document.getElementById("outStockRules[" + trInt + "].priorityFirst"))
				.append(level1InOption());
		$.each(listProvider, function(index, value) {
			$(
					document.getElementById("outStockRules[" + trInt
							+ "].priorityFirst")).append(
					"<option value='" + value + "'>" + value + "</option>");

			/*
			 * document.getElementById("outStockRules[" + trInt +
			 * "].prioritySecond").options.add(new Option(value, value));
			 * document.getElementById("outStockRules[" + trInt +
			 * "].priorityThird").options.add(new Option(value, value));
			 */
		});
	}

	// 查询供应商信息
	function getProvider(trInt) {
		warehouseName = warehouseInfoJSON["outStockRules[" + trInt
				+ "].warehouseId"];
		var materialCode = $(
				document.getElementById("outStockRules[" + trInt
						+ "].materialCode")).val();
		warehouseName = encodeURI(encodeURI(warehouseName));
		materialCode = encodeURI(encodeURI(materialCode));
		$.ajax({
			url : "outStockRule/getSuppliers?warehouseName=" + warehouseName
					+ "&materialCode=" + materialCode,
			type : "GET",
			datatype : "json",
			cache : false,
			async : true,
			success : function(data) {
				listProvider = data;
			}
		});
		// $("#outStockRules[" + trInt +
		// "].priorityFirst").html(level1InOption());
		document.getElementById("outStockRules[" + trInt + "].priorityFirst").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].prioritySecond").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].priorityThird").options.length = 0;
		$(document.getElementById("outStockRules[" + trInt + "].priorityFirst"))
				.append(level1InOption());
		$.each(listProvider, function(index, value) {
			$(
					document.getElementById("outStockRules[" + trInt
							+ "].priorityFirst")).append(
					"<option value='" + value + "'>" + value + "</option>");

			/*
			 * document.getElementById("outStockRules[" + trInt +
			 * "].prioritySecond").options.add(new Option(value, value));
			 * document.getElementById("outStockRules[" + trInt +
			 * "].priorityThird").options.add(new Option(value, value));
			 */
		});
	}

	// 模糊查询物料编码
	function getMaterialCode(materialName) {
		materialName = encodeURI(encodeURI(materialName));
		$.ajax({
			url : "safetyRule/queryMaterialCodesByName?materialName="
					+ materialName,
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				listMaterialCode = data;
			}
		});
	}
	function setMaterialCodeSelectOption(trInt) {
		var select = document.getElementById("outStockRules[" + trInt
				+ "].materialCode");
		// 清空数据
		if (!-[ 1, ]) {
			var o = select.parentElement.nextSibling;
			$(o.children[0]).val("");
			$(o.children[1]).val("");
			$(o.nextSibling.children[0]).val("");
			$(o.nextSibling.nextSibling.children[0]).val("");
		} else {
			var o = select.parentElement.nextElementSibling;
			$(o.children[0]).val("");
			$(o.children[1]).val("");
			$(o.nextElementSibling.children[0]).val("");
			$(o.nextElementSibling.nextElementSibling.children[0]).val("");
		}

		/*
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityFirst").options .add(new Option("请选择", ""));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].prioritySecond").options .add(new Option("请选择", ""));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityThird").options .add(new Option("请选择", ""));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityFirst").options .add(new Option("先入先出", "先入先出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].prioritySecond").options .add(new Option("先入先出", "先入先出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityThird").options .add(new Option("先入先出", "先入先出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityFirst").options .add(new Option("先入后出", "先入后出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].prioritySecond").options .add(new Option("先入后出", "先入后出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityThird").options .add(new Option("先入后出", "先入后出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityFirst").options .add(new Option("散包先出", "散包先出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].prioritySecond").options .add(new Option("散包先出", "散包先出"));
		 * document.getElementById("outStockRules[" + trInt +
		 * "].priorityThird").options .add(new Option("散包先出", "散包先出"));
		 */

		select.innerHTML = "";
		var appends = "<option value=''>请选择</option>";
		$.each(listMaterialCode, function(index, value) {
			appends += "<option value=" + value + ">" + value + "</option>";
		});
		$(select).html(appends);
	}
	// 添加select中仓库;
	function warehouseOption() {
		var appendoption = '';
		$.each(listWarehouse, function(item, obj) {
			appendoption += "<option value ='" + obj.warehouseId + "'>"
					+ obj.houseName + "</option>";
		});
		return appendoption;
	}
	// 选择物料id自动填充之后的数据
	function setMaterialOpton(obj, trInt) {
		// 查询物料信息
		var materialCode = obj.value;
		var material = null;
		$
				.ajax({
					url : "safetyRule/queryMaterialByCode?materialCode="
							+ materialCode,
					type : "GET",
					datatype : "json",
					cache : false,
					async : false,
					success : function(data) {
						material = data;
					}
				});
		// 查询物料信息
		if (!-[ 1, ]) {
			$(obj.parentElement.previousSibling.children[0]).val(
					material.materialName);
			var o = obj.parentElement.nextSibling;
			$(o.children[0]).val(material.materialType);
			$(o.children[1]).val(material.materialTypeId);
			$(o.nextSibling.children[0]).val(material.model);
			$(o.nextSibling.nextSibling.children[0]).val(material.unit);
		} else {
			$(obj.parentElement.previousElementSibling.children[0]).val(
					material.materialName);
			var o = obj.parentElement.nextElementSibling;
			$(o.children[0]).val(material.materialType);
			$(o.children[1]).val(material.materialTypeId);
			$(o.nextElementSibling.children[0]).val(material.model);
			$(o.nextElementSibling.nextElementSibling.children[0]).val(
					material.unit);
		}
		getProvider(trInt, materialCode);
	}
	// -------- 增加明细 ---------
	function addDetail() {

		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='checkbox'  class='input_checkBox'></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='outStockRules["
				+ trInt + "].ruleName' value=''/></div></td>";
		dom += "<td><div  class='addRemind1'><select onchange='OutStockRuleAdd.warehouseChange("
				+ trInt
				+ ",this)' name='outStockRules["
				+ trInt
				+ "].warehouseId' id='outStockRules["
				+ trInt
				+ "].warehouseId'><option value=''>选择仓库</option>"
				+ warehouseOption() + "</select></div></td>";
		dom += "<td><input type='text' name='outStockRules["
				+ trInt
				+ "].materialName' id=' name='outStockRules["
				+ trInt
				+ "].materialName' onchange='OutStockRuleAdd.materialNameChange("
				+ trInt + ",this)'></td>";
		/*
		 * dom += "<td><select
		 * onchange='OutStockRuleAdd.setMaterialOpton(this," + trInt + ")'
		 * name='outStockRules[" + trInt + "].materialCode' id='outStockRules[" +
		 * trInt + "].materialCode'></select></td>";
		 */

		/*
		 * dom += "<td><input type='text'
		 * onchange='OutStockRuleAdd.setMaterialOpton(this," + trInt + ")'
		 * name='outStockRules[" + trInt + "].materialCode' id='outStockRules[" +
		 * trInt + "].materialCode'></td>"
		 */

		dom += "<td><input type='text'   name='outStockRules[" + trInt
				+ "].materialCode' id='outStockRules[" + trInt
				+ "].materialCode'></td>"

		dom += "<td><input name='outStockRules[" + trInt
				+ "].materialTypeName' readonly='readonly' value='' />"
				+ "<input type='hidden' name='outStockRules[" + trInt
				+ "].materialTypeId' readonly='readonly' value='' /></td>";
		dom += "<td><input name='outStockRules[" + trInt
				+ "].materialModel' readonly='readonly' value='' /></td>";
		dom += "<td><input name='outStockRules[" + trInt
				+ "].unit' readonly='readonly' value='' /></td>";
		dom += "<td><div  class='addRemind1'><select name='outStockRules["
				+ trInt + "].priorityFirst' id='outStockRules[" + trInt
				+ "].priorityFirst' onchange='OutStockRuleAdd.level1(" + trInt
				+ ",this)'><option value=''>请选择</option></select></div></td>";
		dom += "<td><div  class='addRemind1'><select name='outStockRules["
				+ trInt
				+ "].prioritySecond' id='outStockRules["
				+ trInt
				+ "].prioritySecond' disabled = 'disabled' onchange='OutStockRuleAdd.level2("
				+ trInt
				+ ",this)'><option value=''>请选择</option></select></div></td>";
		dom += "<td><div  class='addRemind1'><select name='outStockRules["
				+ trInt
				+ "].priorityThird' id='outStockRules["
				+ trInt
				+ "].priorityThird' disabled = 'disabled'><option value=''>请选择</option></select></div></td>";
		$("#addTr").append(dom);
		if (trInt != 0) {
			validateDetail(_validate, trInt);
		}
		warehouseInfoJSON["outStockRules[" + trInt + "].warehouseId"] = "";

		var tr = trInt;
		// 物料类型 自动联想 最大10条数据
		$("input[name='outStockRules[" + (tr) + "].materialCode']")
				.autocomplete(
						{
							delay : 500,
							focus : function(event, ui) {
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialCode']").val(
										ui.item.code);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialName']").val(
										ui.item.name);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialModel']").val(
										ui.item.Model);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].unit']").val(ui.item.unit);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeName']").val(
										ui.item.type);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeId']").val(
										ui.item.typeId);
								return false;
							},
							// 改变后清空
							change : function(event, ui) {
								if (!ui.item) {
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialCode']").val(
											"");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialName']").val(
											"");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialModel']").val(
											"");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].unit']").val("");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialTypeName']")
											.val("");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialTypeId']")
											.val("");
								}
							},
							// 选择后将 id赋值给隐藏域
							select : function(event, ui) {
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialCode']").val(
										ui.item.code);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialName']").val(
										ui.item.name);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialModel']").val(
										ui.item.Model);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].unit']").val(ui.item.unit);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeName']").val(
										ui.item.type);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeId']").val(
										ui.item.typeId);
								$("#outStockRules["+(tr)+"].warehouseId").val(ui.item.warehouseId);
								warehouseInfoJSON["outStockRules[" + tr + "].warehouseId"] = ui.item.houseName;
								getProvider(tr);
							},
							// 数据来源 根据输入值 模糊匹配
							source : function(request, response) {
								CommonUtils
										.getAjaxData(
												{
													url : 'safetyRule/queryMaterialsByName?warehouseId='
															+ encodeURI($(
																	document
																			.getElementById("outStockRules["
																					+ tr
																					+ "].warehouseId"))
																	.val())
															+ '&materialCode='
															+ encodeURI(request.term),
													type : 'get',
													async : 'true'
												},
												function(data) {
													response($
															.map(
																	data,
																	function(
																			item) {
																		$(document.getElementById("outStockRules["+tr+"].warehouseId")).val(item.warehouseId);
																		warehouseInfoJSON["outStockRules[" + tr + "].warehouseId"] = item.houseName;
																		return {
																			label : item.materialCode,// 下拉框显示值
																			value : item.materialCode,// 选中后,填充到下拉框的值
																			name : item.materialName,
																			code : item.materialCode,
																			Model : item.model,
																			type : item.materialType,
																			typeId : item.materialTypeId,
																			unit : item.useUnit,
																			warehouseId:item.warehouseId,
																			houseName : item.houseName
																		};
																	}));
												});
							}
						});
		$("input[name='outStockRules[" + (tr) + "].materialName']")
				.autocomplete(
						{
							delay : 500,
							focus : function(event, ui) {
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialCode']").val(
										ui.item.code);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialName']").val(
										ui.item.value);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialModel']").val(
										ui.item.Model);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].unit']").val(ui.item.unit);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeName']").val(
										ui.item.type);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeId']").val(
										ui.item.typeId);
								return false;
							},
							// 改变后清空
							change : function(event, ui) {
								if (!ui.item) {
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialCode']").val(
											"");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialName']").val(
											"");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialModel']").val(
											"");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].unit']").val("");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialTypeName']")
											.val("");
									$(
											"input[name='outStockRules[" + (tr)
													+ "].materialTypeId']")
											.val("");
								}
							},
							// 选择后将 id赋值给隐藏域
							select : function(event, ui) {
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialCode']").val(
										ui.item.code);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialName']").val(
										ui.item.value);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialModel']").val(
										ui.item.Model);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].unit']").val(ui.item.unit);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeName']").val(
										ui.item.type);
								$(
										"input[name='outStockRules[" + (tr)
												+ "].materialTypeId']").val(
										ui.item.typeId);
								
								$(document.getElementById("outStockRules["+tr+"].warehouseId")).val(ui.item.warehouseId);
								warehouseInfoJSON["outStockRules[" + tr + "].warehouseId"] = ui.item.houseName;
								getProvider(tr);
							},
							// 数据来源 根据输入值 模糊匹配
							source : function(request, response) {
								CommonUtils
										.getAjaxData(
												{
													url : 'safetyRule/queryMaterialsByName?warehouseId='
															+ encodeURI($(
																	document
																			.getElementById("outStockRules["
																					+ tr
																					+ "].warehouseId"))
																	.val())
															+ '&materialName='
															+ encodeURI(request.term),
													type : 'get',
													async : 'true'
												},
												function(data) {
													response($
															.map(
																	data,
																	function(item) {
																		$(document.getElementById("outStockRules["+tr+"].warehouseId")).val(item.warehouseId);
																		warehouseInfoJSON["outStockRules[" + tr + "].warehouseId"] = item.houseName;
																		return {
																			label : item.materialName,// 下拉框显示值
																			value : item.materialName,// 选中后,填充到下拉框的值
																			code : item.materialCode,
																			Model : item.model,
																			type : item.materialType,
																			typeId : item.materialTypeId,
																			unit : item.useUnit,
																			warehouseId:item.warehouseId,
																			houseName:item.houseName
																		};
																	}));
												});
							}
						});

		trInt++;
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();
	}
	// -------- 删除明细 ---------
	function deleteDetail() {

		var checks = $("input[type='checkbox']:checked");
		if (checks.length == 0) {
			$("#addTr").find("tr:last").remove();
		} else {
			$.each(checks, function(item, obj) {
				$(obj).parent().parent().remove();
			});
		}
	}

	function saveRule() {
		if (!$("#addForm").valid()) {
			return;
		}
		$
				.ajax({
					url : "outStockRule/addOutStockRule",
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
	function level1InOption() {
		dom = "<option value=''>请选择</option>";
		dom += "<option value='先入先出'>先入先出</option>";
		dom += "<option value='先入后出'>先入后出</option>";
		dom += "<option value='散包先出'>散包先出</option>";
		return dom;
	}
	function level1(trInt, dom) {
		// document.getElementById("outStockRules[" + trInt +
		// "].priorityFirst").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].prioritySecond").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].priorityThird").options.length = 0;
		$(
				document.getElementById("outStockRules[" + trInt
						+ "].prioritySecond")).prop("disabled", false);
		if (dom.value == "先入先出" || dom.value == "先入后出") {
			$(
					document.getElementById("outStockRules[" + trInt
							+ "].prioritySecond"))
					.append(
							"<option value=''>请选择</option><option value='散包先出'>散包先出</option>");
			$.each(listProvider,
					function(index, value) {
						$(
								document.getElementById("outStockRules["
										+ trInt + "].prioritySecond")).append(
								"<option value='" + value + "'>" + value
										+ "</option>");
					});
		} else if (dom.value == "散包先出") {
			$(
					document.getElementById("outStockRules[" + trInt
							+ "].prioritySecond"))
					.append(
							"<option value=''>请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
			$.each(listProvider,
					function(index, value) {
						$(
								document.getElementById("outStockRules["
										+ trInt + "].prioritySecond")).append(
								"<option value='" + value + "'>" + value
										+ "</option>");
					});
		} else {
			$(
					document.getElementById("outStockRules[" + trInt
							+ "].prioritySecond"))
					.append(
							"<option value=''>请选择</option><option value='散包先出'>散包先出</option>");
			$(
					document.getElementById("outStockRules[" + trInt
							+ "].prioritySecond"))
					.append(
							"<option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
		}
	}
	function level2(trInt, dom) {
		// document.getElementById("outStockRules[" + trInt +
		// "].prioritySecond").options.length = 0;
		document.getElementById("outStockRules[" + trInt + "].priorityThird").options.length = 0;
		$(document.getElementById("outStockRules[" + trInt + "].priorityThird"))
				.prop("disabled", false);
		var firstDom = document.getElementById("outStockRules[" + trInt
				+ "].priorityFirst");
		if (dom.value == "先入先出" || dom.value == "先入后出") {
			if (firstDom.value == "散包先出") {
				$.each(listProvider, function(index, value) {
					$(
							document.getElementById("outStockRules[" + trInt
									+ "].priorityThird")).append(
							"<option value='" + value + "'>" + value
									+ "</option>");
				});
			} else {
				$(
						document.getElementById("outStockRules[" + trInt
								+ "].priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='散包先出'>散包先出</option>");
			}
		} else if (dom.value == "散包先出") {
			if (firstDom.value == "先入先出" || firstDom.value == "先入后出") {
				$.each(listProvider, function(index, value) {
					$(
							document.getElementById("outStockRules[" + trInt
									+ "].priorityThird")).append(
							"<option value='" + value + "'>" + value
									+ "</option>");
				});
			} else {
				$(
						document.getElementById("outStockRules[" + trInt
								+ "].priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
			}
		} else {
			if (firstDom.value == "先入先出" || firstDom.value == "先入后出") {
				$(
						document.getElementById("outStockRules[" + trInt
								+ "].priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='散包先出'>散包先出</option> ");
			} else {
				$(
						document.getElementById("outStockRules[" + trInt
								+ "].priorityThird"))
						.append(
								"<option value=''>请选择</option><option value='先入先出'>先入先出</option><option value='先入后出'>先入后出</option>");
			}
		}
	}
	module.init = init;
	module.addDetail = addDetail;
	module.warehouseChange = warehouseChange;
	module.materialNameChange = materialNameChange;
	module.deleteDetail = deleteDetail;
	module.saveRule = saveRule;
	module.setMaterialOpton = setMaterialOpton;
	module.getProvider = getProvider;
	module.level1 = level1;
	module.level2 = level2;
	return module;
}($, window.OutStockRuleAdd || {}));
$(function() {
	OutStockRuleAdd.init();
});
