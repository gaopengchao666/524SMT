window.instockApplyAdd = (function($, module) {
	var r = /^[1-9]+\d*$/;
	var _userunit;
	var _scaling;
	var _materialCode;
	var _materialType;
	var _planNum;
	var _outstockNumber;
	var listProvider;
	var listWarehouse;
	var flag = 0// 标识erp的出库单没有入库过，如果入库了flag=1；
	function init() {
		$("#instockCode").val("RKDH" + new Date().format("yyyyMMddhhmmssSSS"));
		// 绑定事件
		bindEvent();
		addDetail();
		getWarehouse();

		$("#instockType").bind(
				"change",
				function() {
					if ($(this).val() == "生产退料入库") {
						$("table").find("tr").eq(0).find("th").eq(0).html(
								"出库单号：");
						$("table").find("tr").eq(0).find("input").eq(0)
								.removeAttr("readonly");
					} else if ($(this).val() == "其它类型入库") {
						$("table").find("tr").eq(0).find("input").eq(0).attr(
								"readonly", "readonly");
					} else {
						$("table").find("tr").eq(0).find("th").eq(0).html(
								"ERP出库单号：");
						$("table").find("tr").eq(0).find("input").eq(0)
								.removeAttr("readonly");
					}
				});
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$.validator.addMethod("isIntLtZero", function(value, element) {
			return r.test(value);
		}, "整数必须大于0");

		// 有效期校验
		$.validator.addMethod("isExpirationDate", function(value, element) {
			if (value == "1") {
				return false;
			} else {
				return true;
			}
		}, "");

		// 供应商校验
		$.validator.addMethod("providerOK", function(value, element) {
			value = encodeURI(encodeURI(value));
			if (value == "") {
				return true;
			}
			var flagx = 1;
			$.ajax({
				type : "GET",
				url : "instock/providerOK?provideName=" + value,
				async : false,
				success : function(data) {
					if (data == "has") {
					} else {
						flagx = 0;
					}
				}
			});
			if (flagx == 1) {
				return true;
			} else {
				return false;
			}
		}, "");

		// 编写校验
		_validate = $("#addForm").validate({
			rules : {
				'instockCode' : {
					required : true,
					maxlength : 100
				},
				'instockDate' : {
					date : true
				},
				'instockType' : {
					required : true,
					maxlength : 100
				},
				'productDrawNo' : {
					maxlength : 100
				},
				'planNum' : {
					maxlength : 100
				},
				'materialUse' : {
					maxlength : 100
				},
				'projectCode' : {
					maxlength : 100
				},
				'creator' : {
					required : true,
					maxlength : 20
				}
			},
			messages : {
				'instockCode' : {
					required : "入库单编码不可以为空",
					maxlength : "长度不超过100"
				},
				'instockDate' : {
					required : "入库日期不可以为空，并且必须为日期类型",
				},
				'instockType' : {
					required : '入库类型不可以为空',
					maxlength : "长度不超过100"
				},
				'productDrawNo' : {
					maxlength : "长度不超过100"
				},
				'planNum' : {
					maxlength : "长度不超过100"
				},
				'materialUse' : {
					maxlength : "长度不超过100"
				},
				'projectCode' : {
					maxlength : "长度不超过100"
				},
				'creator' : {
					required : "制单人人不可以为空",
					maxlength : "长度不超过20"
				}
			}
		});
		validateDetail(_validate, 0);
	}

	/**
	 * 入库单详细 增加校验
	 */
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		//
		var materialCode = "instockApplyDetails[" + len + "].materialCode";
		var materialName = "instockApplyDetails[" + len + "].materialName";
		var materialType = "instockApplyDetails[" + len + "].materialType";
		var materialSpec = "instockApplyDetails[" + len + "].materialSpec";
		/*
		 * var materialPackUnit = "instockApplyDetails[" + len +
		 * "].materialPackUnit"; var packUnitNum = "instockApplyDetails[" + len +
		 * "].packUnitNum";
		 */
		var materialUseUnit = "instockApplyDetails[" + len
				+ "].materialUseUnit";
		var useUnitNum = "instockApplyDetails[" + len + "].useUnitNum";
		var warehouse = "instockApplyDetails[" + len + "].warehouse";
		var location = "instockApplyDetails[" + len + "].location";
		var productDate = "instockApplyDetails[" + len + "].productDate";
		var expirationDate = "instockApplyDetails[" + len + "].expirationDate";
		var provider = "instockApplyDetails[" + len + "].provider";

		/* var remark = "instockApplyDetails[" + len + "].remark"; */
		var rules = {};
		rules[materialCode] = {
			required : true,
			maxlength : 100
		};
		rules[materialName] = {
			required : true,
			maxlength : 20
		};
		rules[materialSpec] = {
			maxlength : 100
		};
		rules[materialType] = {
			maxlength : 100
		};
		/*
		 * rules[materialPackUnit] = { required : true, maxlength : 20 };
		 * rules[packUnitNum] = { required : true, isIntLtZero :true, number :
		 * true };
		 */
		rules[materialUseUnit] = {
			required : true,
			maxlength : 20
		};
		rules[useUnitNum] = {
			required : true,
			isIntLtZero : true,
			number : true
		};
		rules[warehouse] = {
			required : true,
			maxlength : 20
		};
		rules[productDate] = {
			required : true
		};

		rules[expirationDate] = {
			isExpirationDate : true
		};
		rules[provider] = {
			providerOK : true
		}
		/*
		 * rules[remark] = { maxlength : 500 };
		 */
		$.extend(validate.settings.rules, rules);

		var message = {};
		message[materialCode] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[materialName] = {
			required : "不能为空",
			maxlength : "长度不超过20"
		};
		message[materialSpec] = {
			maxlength : "长度不超过100"
		};
		message[materialType] = {
			maxlength : "长度不超过100"
		};
		/*
		 * message[materialPackUnit] = { required : "不能为空", maxlength :
		 * "长度不超过20" }; message[packUnitNum] = { required : "不能为空", isIntLtZero
		 * :"必须为整数", number : "请输入数字" };
		 */
		message[materialUseUnit] = {
			required : "不能为空",
			maxlength : "长度不超过20"
		};
		message[useUnitNum] = {
			required : "不能为空",
			isIntLtZero : "必须为整数",
			number : "请输入数字"
		};
		message[warehouse] = {
			required : "不能为空",
			maxlength : "长度不超过20"
		};
		message[productDate] = {
			required : "生产日期必填"
		};
		message[expirationDate] = {
			isExpirationDate : "有效期管理"
		};
		message[provider] = {
			providerOK : "供应商不存在"
		};
		/*
		 * message[remark] = { maxlength : "长度不超过500" };
		 */
		$.extend(validate.settings.messages, message);
	}

	// -------- 增加明细 ---------
	function addDetail() {
		var trInt = $("#addTr").find("tr").length;
		var no = trInt + 1;// 序号
		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='checkbox' class='input_checkBox'></td>";
		dom += "<td>" + no + "</td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
				+ trInt
				+ "].materialCode' value='' class='materialCode'></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
				+ trInt
				+ "].materialName' class='materialName' value=''><input type='hidden' name='instockApplyDetails["
				+ trInt
				+ "].unitscale' class='unitscale' value=''><input type='hidden' name='instockApplyDetails["
				+ trInt + "].mname' class='mname' value=''></div></td>";
		dom += "<td><input type='text' name='instockApplyDetails["
				+ trInt
				+ "].materialType' readonly='readonly' class='materialType' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails["
				+ trInt
				+ "].materialSpec' readonly='readonly' class='materialSpec' value=''></td>";
		/*
		 * dom += "<td><div class='addRemind1'><input style='width:50px;'
		 * name='instockApplyDetails[" + trInt + "].materialPackUnit'
		 * readonly='readonly' class='materialPackUnit' value=''></div></td>";
		 * dom += "<td><div class='addRemind1'><input
		 * name='instockApplyDetails[" + trInt + "].packUnitNum'
		 * style='width:50px;' onblur='instockApplyAdd.unitScaling(this)'
		 * value=''></div></td>";
		 */
		dom += "<td><div  class='addRemind1'><input type='text' style='width:50px;'  name='instockApplyDetails["
				+ trInt
				+ "].materialUseUnit' readonly='readonly' class='materialUseUnit' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
				+ trInt
				+ "].useUnitNum' class='useUnitNum'  style='width:50px;' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
				+ trInt + "].warehouse' class='warehouse' value=''></div></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].location' value=''></td>";
		dom += "<td><div  class='addRemind1'><input class='productDate' name='instockApplyDetails["
				+ trInt
				+ "].productDate' readonly='readonly' value=''></div></td>";
		dom += "<td><input class='expirationDate' name='instockApplyDetails["
				+ trInt
				+ "].expirationDate' readonly='readonly' value=''></td>";
		dom += "<td><input name='instockApplyDetails[" + trInt
				+ "].provider' value=''</td>";
		dom += "</tr>";
		$("#addTr").append(dom);
		CommonUtils.ie8TrChangeColor();

		var tr = trInt;
		// 物料类型 自动联想 最大10条数据
		$("input[name='instockApplyDetails[" + (tr) + "].materialCode']")
				.autocomplete(
						{
							delay : 500,
							focus : function(event, ui) {
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialCode']")
										.val(ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialName']")
										.val(ui.item.name);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialSpec']")
										.val(ui.item.Model);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialUseUnit']")
										.val(ui.item.unit);
								/* $("input[name='instockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit); */
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].warehouse']").val(
										ui.item.HouseName);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialType']")
										.val(ui.item.Type);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].unitscale']").val(
										ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].mname']").val(
										ui.item.name);
								return false;
							},
							// 改变后清空
							change : function(event, ui) {
								if (!ui.item) {
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialCode']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialName']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialSpec']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr)
													+ "].materialUseUnit']")
											.val("");
									/* $("input[name='instockApplyDetails["+(tr)+"].materialPackUnit']").val(""); */
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].warehouse']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialType']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].unitscale']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].mname']").val(
											"");
								}
							},
							// 选择后将 id赋值给隐藏域
							select : function(event, ui) {
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialCode']")
										.val(ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialName']")
										.val(ui.item.name);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialSpec']")
										.val(ui.item.Model);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialUseUnit']")
										.val(ui.item.unit);
								/* $("input[name='instockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit); */
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].warehouse']").val(
										ui.item.HouseName);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialType']")
										.val(ui.item.Type);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].unitscale']").val(
										ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].mname']").val(
										ui.item.name);
							},
							// 数据来源 根据输入值 模糊匹配
							source : function(request, response) {
								CommonUtils
										.getAjaxData(
												{
													url : 'safetyRule/queryMaterialsByName?materialCode='
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
																		return {
																			label : item.materialCode,// 下拉框显示值
																			value : item.materialCode,// 选中后,填充到下拉框的值
																			name : item.materialName,
																			code : item.materialCode,
																			Model : item.model,
																			unit : item.useUnit,
																			Type : item.materialType,
																			materialPackUnit : item.unit,
																			HouseName : item.houseName,
																		};
																	}));
												});
							}
						});

		$("input[name='instockApplyDetails[" + (tr) + "].materialName']")
				.autocomplete(
						{
							delay : 500,
							focus : function(event, ui) {
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialCode']")
										.val(ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialName']")
										.val(ui.item.name);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialSpec']")
										.val(ui.item.Model);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialUseUnit']")
										.val(ui.item.unit);
								/* $("input[name='instockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit); */
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].warehouse']").val(
										ui.item.HouseName);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialType']")
										.val(ui.item.Type);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].unitscale']").val(
										ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].mname']").val(
										ui.item.name);
								return false;
							},
							// 改变后清空
							change : function(event, ui) {
								if (!ui.item) {
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialCode']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialName']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialSpec']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr)
													+ "].materialUseUnit']")
											.val("");
									/* $("input[name='instockApplyDetails["+(tr)+"].materialPackUnit']").val(""); */
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].warehouse']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].materialType']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].unitscale']")
											.val("");
									$(
											"input[name='instockApplyDetails["
													+ (tr) + "].mname']").val(
											"");
								}
							},
							// 选择后将 id赋值给隐藏域
							select : function(event, ui) {
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialCode']")
										.val(ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialName']")
										.val(ui.item.name);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialSpec']")
										.val(ui.item.Model);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialUseUnit']")
										.val(ui.item.unit);
								/* $("input[name='instockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit); */
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].warehouse']").val(
										ui.item.HouseName);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].materialType']")
										.val(ui.item.Type);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].unitscale']").val(
										ui.item.code);
								$(
										"input[name='instockApplyDetails["
												+ (tr) + "].mname']").val(
										ui.item.name);
							},
							// 数据来源 根据输入值 模糊匹配
							source : function(request, response) {
								CommonUtils
										.getAjaxData(
												{
													url : 'safetyRule/queryMaterialsByName?materialName='
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
																		return {
																			label : item.materialName,// 下拉框显示值
																			value : item.materialName,// 选中后,填充到下拉框的值
																			name : item.materialName,
																			code : item.materialCode,
																			Model : item.model,
																			unit : item.useUnit,
																			Type : item.materialType,
																			materialPackUnit : item.unit,
																			HouseName : item.houseName,
																		};
																	}));
												});
							}
						});

		$(".expirationDate").datepicker(
				{
					minDate : 0,
					dateFormat : 'yy-mm-dd',
					monthNamesShort : [ "January", "February", "March",
							"April", "May", "June", "July", "August",
							"September", "October", "November", "December" ],
					changeYear : true,
					changeMonth : true,
					showOn : "button",
					buttonImage : "img/button/calendar.png",
					buttonImageOnly : false
				});

		$(".productDate").datepicker(
				{
					dateFormat : 'yy-mm-dd',
					maxDate : 0,
					monthNamesShort : [ "January", "February", "March",
							"April", "May", "June", "July", "August",
							"September", "October", "November", "December" ],
					changeYear : true,
					changeMonth : true,
					showOn : "button",
					buttonImage : "img/button/calendar.png",
					buttonImageOnly : false
				});

		/*
		 * $("#erpOutstockNum") .bind( "change"
		 */

		// 入库详情列表添加时的校验
		validateDetail(_validate, trInt);
		trInt++;

	}

	// 添加select中仓库;
	function warehouseOption() {
		var appendoption = '';
		$.each(listWarehouse, function(item, obj) {
			appendoption += "<option value ='" + obj.houseName + "'>"
					+ obj.houseName + "</option>";
		});
		return appendoption;
	}

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

	// 添加select中的规则
	function rulesOption() {
		var appendoption = '';
		$.each(listProvider, function(item, obj) {
			appendoption += "<option value ='" + obj.supplierName + "'>"
					+ obj.supplierName + "</option>";
		});
		return appendoption;
	}

	// 查询供应商信息
	function getProvider() {
		$.ajax({
			url : "outStockRule/getSuppliers",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				listProvider = data;
			}
		});
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

	/**
	 * 时间对象的格式化;
	 */
	Date.prototype.format = function(format) {
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S+" : this.getMilliseconds()
		// millisecond
		}

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		}

		for ( var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				var formatStr = "";
				for (var i = 1; i <= RegExp.$1.length; i++) {
					formatStr += "0";
				}

				var replaceStr = "";
				if (RegExp.$1.length == 1) {
					replaceStr = o[k];
				} else {
					formatStr = formatStr + o[k];
					var index = ("" + o[k]).length;
					formatStr = formatStr.substr(index);
					replaceStr = formatStr;
				}
				format = format.replace(RegExp.$1, replaceStr);
			}
		}
		return format;
	}

	$("#erpOutstockNum")
			.bind(
					"change",
					function() {
						var list = [];
						var param = $(this).val();
						_outstockNumber = $(this).val();
						list.push(param);
						if ($("#instockType").val() == "生产退料入库") {
							var url = "outstock/getOutstockOrderByCode?outstockOrderCode="
									+ $(this).val();
							CommonUtils.getAjaxData({
								url : url,
								type : 'GET'
							}, function(data) {
								if (data == "") {
									alert("你输入的出库单号不存在");
									return;
								}
								$("#productDrawNo").val(data.productDrawNo);
								$("#planNum").val(data.planNum);
								$("#materialUse").val(data.materialUse);
								$("#projectCode").val(data.projectCode);
								$("#processName").val(data.processName);
							});

							// 通过出库单号去现编物资管理表中搜索出了
							var url1 = "instock/getEdgesByOutstockCode?outstockOrderCode="
									+ $(this).val();
							CommonUtils
									.getAjaxData(
											{
												url : url1,
												type : 'GET'
											},
											function(data) {
												$(data["edgeMaterials"])
														.each(
																function(i) {
																	_materialCode = data["edgeMaterials"][i].materialCode;
																	/* FillInMaterialUseAndUnit(); */
																	/*
																	 * data["edgeMaterials"][i].subUnit =
																	 * _userunit;
																	 */
																	FillInMaterialType();
																	data["edgeMaterials"][i].materialType = _materialType;
																	/*
																	 * data["edgeMaterials"][i].unitAmount =
																	 * Math
																	 * .ceil(data["edgeMaterials"][i].restAmount /
																	 * _scaling);
																	 */

																	$
																			.ajax({
																				url : url_Pre
																						+ "inventorySupply/selectMaterialByCode?materialCode="
																						+ _materialCode,
																				type : "GET",
																				cache : false,
																				async : false,
																				success : function(
																						data1) {
																					if (data1.warehouseId != "") {
																						data["edgeMaterials"][i].warehouseName = data1.houseName;
																					}
																				}
																			});
																});

												var html = template(
														'edgeMaterialsDetailTemp',
														data);
												$("#addTr").html("").html(html);
												$("tbody tr:odd")
														.css("background",
																"#EBF5FF");

												$(".productDate")
														.datepicker(
																{
																	dateFormat : 'yy-mm-dd',
																	maxDate : 0,
																	monthNamesShort : [
																			"January",
																			"February",
																			"March",
																			"April",
																			"May",
																			"June",
																			"July",
																			"August",
																			"September",
																			"October",
																			"November",
																			"December" ],
																	changeYear : true,
																	changeMonth : true,
																	showOn : "button",
																	buttonImage : "img/button/calendar.png",
																	buttonImageOnly : false
																});

												$(".expirationDate")
														.datepicker(
																{
																	dateFormat : 'yy-mm-dd',
																	minDate : 0,
																	monthNamesShort : [
																			"January",
																			"February",
																			"March",
																			"April",
																			"May",
																			"June",
																			"July",
																			"August",
																			"September",
																			"October",
																			"November",
																			"December" ],
																	changeYear : true,
																	changeMonth : true,
																	showOn : "button",
																	buttonImage : "img/button/calendar.png",
																	buttonImageOnly : false
																});
											});

						} else {
							var urloutstock = "instock/getStockIDByERPOutstockNum?outstockNumber="
									+ _outstockNumber;
							CommonUtils.getAjaxData({
								url : urloutstock,
								type : 'GET'
							}, function(data) {
								if (data != "") {
									flag = 1;// 标识状态w为1，不能再吃入库
									alert("你输入的ERP出库单号已经完成了入库操作，不可以重复入库。");
									return;
								}
							});

							$
									.ajax({
										url : "instock/selectERPODViewByOustockNum",
										type : "POST",
										data : JSON.stringify(list),
										contentType : 'application/json; charset=utf-8',
										async : true,
										cache : false,
										success : function(data) {
											if (data == null
													|| data == ""
													|| data.erpOutstockDetailViews.length == 0) {
												alert("你输入的ERP出库单号不存在");
												return;
											} else {
												/* FillInPlanNum(); */
												$("#productDrawNo")
														.val(
																data["erpOutstockDetailViews"][0].graphNumber);
												$("#instockType")
														.val(
																data["erpOutstockDetailViews"][0].outstockType);
												$("#projectCode")
														.val(
																data["erpOutstockDetailViews"][0].project);
												/* $("#planNum").val(_planNum); */
												$("#planNum")
														.val(
																data["erpOutstockDetailViews"][0].planNumber);
												$("#erpReturnCode")
														.val(
																data["erpOutstockDetailViews"][0].erpReturnCode);
												$(
														data["erpOutstockDetailViews"])
														.each(
																function(i) {
																	_materialCode = data["erpOutstockDetailViews"][i].materialCode;

																	$
																			.ajax({
																				url : url_Pre
																						+ "inventorySupply/selectMaterialByCode?materialCode="
																						+ _materialCode,
																				type : "GET",
																				cache : false,
																				async : false,
																				success : function(
																						data1) {
																					if (data1.warehouseId != "") {
																						data["erpOutstockDetailViews"][i].warehouseName = data1.houseName;
																					}
																				}
																			});

																	FillInMaterialUseAndUnit();
																	data["erpOutstockDetailViews"][i].materialUseUnit = _userunit;
																	FillInMaterialType();
																	data["erpOutstockDetailViews"][i].materialType = _materialType;
																	/*
																	 * data["erpOutstockDetailViews"][i].useUnitNum =
																	 * data["erpOutstockDetailViews"][i].amount
																	 * _scaling;
																	 */
																});

												var html = template(
														'instockApplyDetailTemp',
														data);
												$("#addTr").html("").html(html);
												$("tbody tr:odd")
														.css("background",
																"#EBF5FF");

												$(".productDate")
														.datepicker(
																{
																	dateFormat : 'yy-mm-dd',
																	maxDate : 0,
																	monthNamesShort : [
																			"January",
																			"February",
																			"March",
																			"April",
																			"May",
																			"June",
																			"July",
																			"August",
																			"September",
																			"October",
																			"November",
																			"December" ],
																	changeYear : true,
																	changeMonth : true,
																	showOn : "button",
																	buttonImage : "img/button/calendar.png",
																	buttonImageOnly : false
																});

												$(".expirationDate")
														.datepicker(
																{
																	dateFormat : 'yy-mm-dd',
																	minDate : 0,
																	monthNamesShort : [
																			"January",
																			"February",
																			"March",
																			"April",
																			"May",
																			"June",
																			"July",
																			"August",
																			"September",
																			"October",
																			"November",
																			"December" ],
																	changeYear : true,
																	changeMonth : true,
																	showOn : "button",
																	buttonImage : "img/button/calendar.png",
																	buttonImageOnly : false
																});
											}
										}
									});
						}
					});

	$("#erpReturnCode").bind(
			"change",
			function() {
				var url = "instock/getDataByErpReturn?erpReturnCode="
						+ encodeURI($(this).val());
				CommonUtils.getAjaxData({
					url : url,
					type : 'GET'
				}, function(data) {
					$("#productDrawNo").val(data.productDrawNo);
					$("#planNum").val(data.planNum);
					$("#instockType").val(data.instockType);
				});
			});

	function FillInMaterialUseAndUnit() {
		var url = "instock/FillInMaterialUseAndUnit?materialCode="
				+ _materialCode;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			_userunit = data.subUnit;
			_scaling = data.scaling;
		});
	}

	function FillInMaterialType() {
		var url = "instock/getMatrialType?materialCode=" + _materialCode;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			_materialType = data.typeName;
		});
	}

	function FillInMaterialType() {
		var url = "instock/getMatrialType?materialCode=" + _materialCode;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			_materialType = data.typeName;
		});
	}

	function FillInPlanNum() {
		var url = "instock/getPlanNum?OutstockNumber=" + _outstockNumber;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			_planNum = data;
		});
	}
	function saveInstockApply() {
		var erpOutstockNum = $("#erpOutstockNum").val();
		var type = $("#instockType").val();
		if (type == "安全库存补料入库" || type == "齐套缺料补料入库" || type == "机损补料入库") {
			if (erpOutstockNum == "") {
				alert("ERP出库单号为必填项");
				return;
			}
		} else if (type == "生产退料入库") {
			if (erpOutstockNum == "") {
				alert("出库单号为必填项");
				return;
			}
		}

		// 用于验证是否有效期管理物料校验的标识
		var flag1 = '0';
		var list = [];
		// 在提交的时候，便利的查询物料是否有效期

		for (var i = 0, len = $("#addTr").find("tr").length; i < len; i++) {
			var materialCode = $("#addTr").find("tr").eq(i).find("input").eq(1)
					.val();
			var expirationDate = $("#addTr").find("tr").eq(i).find("input").eq(
					12).val();

			// 异步的ajax根据物料编码查询出来物料的基础信息
			$.ajax({
				type : "GET",
				url : "safetyRule/queryMaterialsByName?materialCode="
						+ encodeURI(materialCode),
				async : false,
				success : function(data) {
					var validity = data[0].isValidity;
					if (validity == "1" && expirationDate == "") {
						list.push(materialCode);
						flag1 = "1";
					}
				}
			});
		}
		// 对重复的物料编码进行了一次去重复的操作
		var obj = {};
		var arr = [];
		for (var i = 0, len = list.length; i < len; i++) {
			var s = list[i];
			if (obj[s])
				continue;
			else {
				obj[s] = s;
				arr.push(s);
			}
		}

		if (flag1 == "1") {
			alert("物料编码为: " + arr + " 是有效期管理的物料，失效日期为必填,请认真填写。");
			return;
		}

		if (!$("#addForm").valid()) {
			return;
		}
		if (flag == 1) {
			window.location.href = url_Pre + "/instock/toInstockApplyAddJsp";
			alert("你输入的ERP出库单号已经完成了入库操作，不可以重复入库！");
			return;
		}

		$("#loader").show();
		$.ajax({
			url : "instock/addInstockApply",
			type : "POST",
			data : $("#addForm").serialize(),
			async : true,
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if (data == "success") {
					window.location.href = url_Pre + "/instock/instockList";
				} else {
					window.location.href = url_Pre + "/instock/instockList";
					alert("给ERP反馈入库物料信息，接口通信失败！！！");
				}
			}
		});
	}

	function unitScaling(unit) {
		var resultNum;
		var materialCode = $(unit).parent().parent().parent().find(
				"input[class='unitscale']").val();
		var num = $(unit).val();
		var unitUrl = "instock/FillInMaterialUseAndUnit?materialCode="
				+ materialCode;
		CommonUtils.getAjaxData({
			url : unitUrl,
			type : 'GET'
		}, function(data) {
			_scaling = data.scaling;
			resultNum = num * _scaling;
			$(unit).parent().parent().parent().find("input").eq(10).val(
					resultNum);
		});

		var warehouse = $(unit).parent().parent().parent().find(
				"input[class='warehouse']").val();
		var useUnitNum = $(unit).parent().parent().parent().find(
				"input[class='useUnitNum']").val();
		var mname = $(unit).parent().parent().parent().find(
				"input[class='mname']").val();
		var materialSpec = $(unit).parent().parent().parent().find(
				"input[class='materialSpec']").val();
		var materialPackUnit = $(unit).parent().parent().parent().find(
				"input[class='materialPackUnit']").val();
		var materialUseUnit = $(unit).parent().parent().parent().find(
				"input[class='materialUseUnit']").val();
		var materialType = $(unit).parent().parent().parent().find(
				"input[class='materialType']").val();

		if (warehouse == "盘状物料库") {
			$(unit).parent().parent().parent().remove();
			for (var i = 0; i < num; i++) {

				// 查分盘状物料的模板dom
				var trInt = $("#addTr").find("tr").length;
				var no = trInt + 1;// 序号
				var dom = "<tr class='contentText list_list'>";
				dom += "<td><input type='checkbox' class='input_checkBox'></td>";
				dom += "<td>" + no + "</td>";
				dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
						+ trInt
						+ "].materialCode' value='"
						+ materialCode
						+ "' class='materialCode'></div></td>";
				dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
						+ trInt
						+ "].materialName' class='materialName' value='"
						+ mname
						+ "'><input type='hidden' name='instockApplyDetails["
						+ trInt
						+ "].unitscale' class='unitscale' value='"
						+ materialCode + "'></div></td>";
				dom += "<td><input type='text' name='instockApplyDetails["
						+ trInt
						+ "].materialType' readonly='readonly' class='materialType' value='"
						+ materialType + "'></td>";
				dom += "<td><input type='text' name='instockApplyDetails["
						+ trInt
						+ "].materialSpec' readonly='readonly' class='materialSpec' value='"
						+ materialSpec + "'></td>";
				dom += "<td><div  class='addRemind1'><input style='width:50px;'  name='instockApplyDetails["
						+ trInt
						+ "].materialPackUnit' readonly='readonly' class='materialPackUnit' value='"
						+ materialPackUnit + "'></div></td>";
				dom += "<td><div  class='addRemind1'><input  name='instockApplyDetails["
						+ trInt
						+ "].packUnitNum' style='width:50px;' onblur='instockApplyAdd.unitScaling(this)'  value='1'></div></td>";
				dom += "<td><div  class='addRemind1'><input type='text' style='width:50px;'  name='instockApplyDetails["
						+ trInt
						+ "].materialUseUnit' readonly='readonly' class='materialUseUnit' value='"
						+ materialUseUnit + "'></div></td>";
				dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
						+ trInt
						+ "].useUnitNum' class='useUnitNum'  style='width:50px;' value='"
						+ _scaling + "'></div></td>";
				dom += "<td><div  class='addRemind1'><input type='text' name='instockApplyDetails["
						+ trInt
						+ "].warehouse' class='warehouse' value='"
						+ warehouse + "'></div></td>";
				dom += "<td><input type='text' name='instockApplyDetails["
						+ trInt + "].location' value=''></td>";
				dom += "<td><div  class='addRemind1'><input class='productDate' name='instockApplyDetails["
						+ trInt
						+ "].productDate' readonly='readonly' value=''></div></td>";
				dom += "<td><input class='expirationDate' name='instockApplyDetails["
						+ trInt
						+ "].expirationDate' readonly='readonly' value=''></td>";
				dom += "<td><input name='instockApplyDetails[" + trInt
						+ "].provider' value=''</td>";
				dom += "</tr>";

				$("#addTr").append(dom);

				$(".expirationDate").datepicker(
						{
							minDate : 0,
							dateFormat : 'yy-mm-dd',
							monthNamesShort : [ "January", "February", "March",
									"April", "May", "June", "July", "August",
									"September", "October", "November",
									"December" ],
							changeYear : true,
							changeMonth : true,
							showOn : "button",
							buttonImage : "img/button/calendar.png",
							buttonImageOnly : false
						});

				$(".productDate").datepicker(
						{
							dateFormat : 'yy-mm-dd',
							maxDate : 0,
							monthNamesShort : [ "January", "February", "March",
									"April", "May", "June", "July", "August",
									"September", "October", "November",
									"December" ],
							changeYear : true,
							changeMonth : true,
							showOn : "button",
							buttonImage : "img/button/calendar.png",
							buttonImageOnly : false
						});

			}
		}
	}
	module.init = init;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail;
	module.saveInstockApply = saveInstockApply;
	/*module.complement = complement;*/
	module.unitScaling = unitScaling;
	return module;
}($, window.Material || {}));
$(function() {
	instockApplyAdd.init();
});
