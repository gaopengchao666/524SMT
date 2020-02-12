window.outstockApplyAdd = (function($, module) {
	/* var trInt = 0; */
	function init() {
		// 绑定事件
		bindEvent();
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		// 编写校验
		_validate = $("#addForm").validate({
			rules : {
				'outstockOrderCode' : {
					required : true,
					maxlength : 100
				},
				'planNum' : {
					maxlength : 100
				},
				'productDrawNo' : {
					maxlength : 100
				},
				'outstockType' : {
					required : true,
					maxlength : 100
				},
				'materialUse' : {
					required : true,
					maxlength : 100
				},
				'processName' : {
					required : true,
					maxlength : 100
				},
				'projectCode' : {
					required : true,
					maxlength : 100
				}
			},
			messages : {
				'outstockOrderCode' : {
					required : "出库单编码不可以为空",
					maxlength : "长度不超过100"
				},
				'planNum' : {
					maxlength : "长度不超过100"
				},
				'productDrawNo' : {
					maxlength : "长度不超过100"
				},
				'outstockType' : {
					required : "出库类型不可以为空",
					maxlength : "长度不超过100"
				},
				'materialUse' : {
					required : "物料用途不可以为空",
					maxlength : "长度不超过100"
				},
				'processName' : {
					required : "工序名称不可以为空",
					maxlength : "长度不超过100"
				},
				'projectCode' : {
					required : "项目编码不可以为空",
					maxlength : "长度不超过100"
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
		// 物料详情的校验
		var materialCode = "outstockApplyDetails[" + len + "].materialCode";
		var materialName = "outstockApplyDetails[" + len + "].materialName";
		var materialType = "outstockApplyDetails[" + len + "].materialType";
		var materialSpec = "outstockApplyDetails[" + len + "].materialSpec";
		var materialPackUnit = "outstockApplyDetails[" + len + "].materialPackUnit";
		var packUnitNum = "outstockApplyDetails[" + len + "].packUnitNum";
		var materialUseUnit = "outstockApplyDetails[" + len + "].materialUseUnit";
		var useUnitNum = "outstockApplyDetails[" + len + "].useUnitNum";
		var warehouse = "outstockApplyDetails[" + len + "].warehouse";
		var location = "outstockApplyDetails[" + len + "].location";
		var remark = "outstockApplyDetails[" + len + "].remark";
		var rules = {};
		rules[materialCode] = {
			required : true,
			maxlength : 100
		};
		rules[materialName] = {
			required : true,
			maxlength : 20
		};
		rules[materialType] = {
			required : true,
			maxlength : 100
		};
		rules[materialSpec] = {
			required : true,
			maxlength : 100
		};
		rules[materialPackUnit] = {
			required : true,
			maxlength : 100
		};
		rules[packUnitNum] = {
			required : true,
			range : [ 1, 10000 ]
		};
		rules[materialUseUnit] = {
			required : true,
			maxlength : 100
		};
		rules[useUnitNum] = {
			required : true,
			range : [ 1, 10000 ]
		};
		rules[warehouse] = {
			required : true,
			maxlength : 100
		};
		rules[location] = {
			required : true,
			maxlength : 100
		};
		rules[remark] = {
			maxlength : 500
		};
		$.extend(validate.settings.rules, rules);

		var message = {};
		message[materialCode] = {
			required : "物料编码不能为空",
			maxlength : "长度不超过100"
		};
		message[materialName] = {
			required : "物料名称不可以为空",
			maxlength : "长度不超过20"
		};
		message[materialType] = {
			required : "物资规格不可以为空",
			maxlength : "长度不超过100"
		};
		message[materialSpec] = {
			required : "物料型号不可以为空",
			maxlength : "长度不超过100"
		};
		message[materialPackUnit] = {
			required : "物料包装单位不可以为空",
			maxlength : "长度不超过100"
		};
		message[packUnitNum] = {
			required : "数量不可以为空",
			range : [ 1, 10000 ]
		};
		message[materialUseUnit] = {
			required : "物料使用单位不可以为空",
			maxlength : "长度不超过100"
		};
		message[useUnitNum] = {
			required : "数量不可以为空",
			range : [ 1, 10000 ]
		};
		message[warehouse] = {
				required : "仓库不可以为空",
				maxlength : "长度不超过100"
			};
		message[location] = {
				required : "库位不可以为空",
				maxlength : "长度不超过100"
			};
		message[remark] = {
				maxlength : "长度不超过500"
			};
		$.extend(validate.settings.messages, message);
	}

	// -------- 增加明细 ---------
	function addDetail() {

		var trInt = $("#addTr").find("tr").length;
		var no = trInt + 1;// 序号
		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='text' readonly='readonly' value='" + no
				+ "'></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialCode' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialName' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialType' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialSpec' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialPackUnit' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].packUnitNum' style='width:50px;' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialUseUnit' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].useUnitNum' style='width:50px;' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].warehouse' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].location' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].remark' value=''></td>";
		dom += "</tr>";
		$("#addTr").append(dom);
		CommonUtils.ie8TrChangeColor();
		// 入库详情列表添加时的校验
		validateDetail(_validate, trInt);
		trInt++;
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

	function RndNum(n) {
		var rnd = "CKDH";
		for (var i = 0; i < n; i++) {
			rnd += Math.floor(Math.random() * 10);
		}
		return rnd;
	}

	$("#outstockOrderCode").bind("change", function(){
		var url = "outstock/getOutstockOrderByCode?outstockOrderCode=" + $(this).val();
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			$("#planNum").val(data.planNum);
			$("#productDrawNo").val(data.productDrawNo);
			$("#outstockType").val("生产补料出库");
			$("#materialUse").val(data.materialUse);
			$("#processName").val(data.processName);
			$("#projectCode").val(data.projectCode);
		});
	});
	
	function saveOutstockApply() {
		if (!$("#addForm").valid()) {
			return;
		}
		$("#loader").show();
		$.ajax({
			url : "outstock/addOutstockApply",
			type : "POST",
			data : $("#addForm").serialize(),
			async : true,
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if (data == "success") {
					window.location.href = url_Pre + "/outstock/toOutstockListJSP";
				}
			}
		});
	}
	module.init = init;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail;
	module.saveOutstockApply = saveOutstockApply;
	return module;
}($, window.Material || {}));
$(function() {
	outstockApplyAdd.init();
});
