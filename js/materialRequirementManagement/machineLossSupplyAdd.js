window.machineLossSupplyAdd = (function($, module) {
	_requestApplyForm = $("#addFrom");
	_validate = null;
	trInt=0;
	/**
	 * 初始化
	 */
	function init() {
		addDetail();
		bindEvent();
	}
	function RndNum(n) {
		var timestamp = "CKDH";
		for (var i = 0; i < n; i++) {
			rnd += Math.floor(Math.random() * 10);
		}
		return rnd;
	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		_validate = _requestApplyForm.validate({
			rules : {
				'billCode' : {
					required : true,
					maxlength : 255
				},
				'planCode' : {
					required : true,
					maxlength : 255
				},
				'productImageCode' : {
					required : true,
					maxlength : 255
				},
				'productCode' : {
					required : true,
					maxlength : 255
				},
				'process' : {
					required : true,
					maxlength : 255
				},
				'applicant' : {
					required : true,
					maxlength : 255
				},
				'applyDateStr' : {
					required : true,
					maxlength : 255
				},
				'section' : {
					required : true,
					maxlength : 255
				},
				'approver' : {
					required : true,
					maxlength : 255
				}
			},
			messages : {
				'billCode' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'planCode' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'productImageCode' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'productCode' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'process' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'applicant' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'applyDateStr' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'section' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'approver' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				}
			}
		});
		validateDetail(_validate, 0);
	}

	// -------- 增加明细 ---------
	function addDetail() {
		trInt = $("#tablelist").find("tr").length;
		var dom = "";
		dom += "<tr class='contentText list_list'>";
		dom += "<td class='checkBox2item'><input type='checkbox' class='input_checkBox' ></td>";
		dom += "<td >" + (trInt+1) + "</td>";
		dom += "<td><input type='text' name='machineLossSupplyDetails["
				+ trInt
				+ "].materialCode' value=''  ></td>";//onblur='machineLossSupplyAdd.complement(this)'
		dom += "<td><input type='text'  name='machineLossSupplyDetails["
				+ trInt + "].materialName' value=''><input type='text' name='machineLossSupplyDetails["
				+ trInt
				+ "].materialId' value=''  ></td>";//readonly='readonly'
		dom += "<td><input type='text'  name='machineLossSupplyDetails["
				+ trInt + "].materialModel' value=''></td>";
		dom += "<td><input type='text' name='machineLossSupplyDetails[" + trInt
				+ "].requestQuantity' value=''></td>";
		dom += "<td><input type='text' name='machineLossSupplyDetails["
				+ trInt + "].unit' value=''></td>";
		dom += "</tr>";
		$("#tablelist").append(dom);

		// 入库单明细增加校验
		if(trInt>0){
			validateDetail(_validate, trInt);
		}
		
		trInt++;
	}
	function validateDetail(validate, len) {
		$.validator.addMethod("isIntLtZero", function(value, element) {
			value = parseInt(value);
			return this.optional(element) || value >= 0;
		}, "整数必须大于等于0");
		if (typeof len != 'number') {
			return;
		}
		//
		var materialCode = "machineLossSupplyDetails[" + len+ "].materialCode";
		var requestQuantity = "machineLossSupplyDetails[" + len+ "].requestQuantity";
		var rules = {};
		rules[materialCode] = {
			required : true,
			maxlength : 100
		};
	
		rules[requestQuantity] = {
				required: true,
				isIntLtZero : true
		};
		
		$.extend(validate.settings.rules, rules);

		var message = {};
		message[materialCode] = {
			required : "物料编码不能为空",
			maxlength : "长度不超过100"
		};
		message[requestQuantity] = {
				required : "数量必填",
				isIntLtZero : "必须是正整数"
		};
		$.extend(validate.settings.messages, message);
		//
	}
	// -------- 删除明细 ---------
	function deleteDetail() {
		var checks = $("input[type='checkbox']:checked");
		if (checks.length == 0) {
			$("#tablelist").find("tr:last").remove();
		} else {
			$.each(checks, function(item, obj) {
				$(obj).parent().parent().remove();
			});
		}
	}
	// -------- 保存---------
	function save() {
		if (!_requestApplyForm.valid()) {
			return;
		}
		// 校验详细
		$.ajax({
					url : urlPre+"machineLossSupply/addMachineLossSupply",
					type : "POST",
					data : $("#addFrom").serialize(),
					async : false,
					cache : false,
					success : function(data) {
						if (data == "success") {
							window.location.href = urlPre+"machineLossSupply/toMachineLossSupplyListJsp";
						}
					}
				});
		
	}

	// z自动补全
	function complement(ma) {
		var materialCode = $(ma).val();
		$.ajax({url : urlPre+"demandApply/selectMaterialByCode?materialCode="
							+ materialCode,
					type : "GET",
					// datatype : "json",
					cache : false,
					success : function(data) {
						if (data) {
							var o = ma.parentElement.nextElementSibling;
							$(o.children[0]).val(data.materialName);
							$(o.children[1]).val(data.materialId);
							$(o.nextElementSibling.children[0]).val(
									data.materialTypeName);
							$(
									o.nextElementSibling.nextElementSibling.children[0])
									.val(data.materialModel);
							$(
									o.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.children[0])
									.val(data.unit);
						} else {

						}
					}
				});
	}
	module.init = init;
	module.complement = complement;
	module.deleteDetail = deleteDetail;
	module.addDetail = addDetail;
	module.save = save;
	return module;
}($, window.machineLossSupplyAdd || {}));
$(function() {
	machineLossSupplyAdd.init();
});
