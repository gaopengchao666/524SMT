window.completeSupplyAdd = (function($, module) {
	_requestApplyForm = $("#addForm");
	_validate = null;
	trInt=0;
	/**
	 * 初始化
	 */
	function init() {
		bindEvent();
		//query();
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
				'creator' : {
					required : true,
					maxlength : 255
				},
				'requestPosition' : {
					required : true,
					maxlength : 255
				},
				'applyDateStr' : {
					required : true,
					maxlength : 255
				},
				'requestDateStr' : {
					required : true,
					maxlength : 255
				}
			},
			messages : {
				'billCode' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'creator' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'requestPosition' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'applyDateStr' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'requestDateStr' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				}
			}
		});
		validateDetail(_validate, 0);
	}

	function query() {
		$.ajax({
			url : urlPre+"completeSupply/getMaterialSupplyInfo",
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				showSupplyList(data);
			}
		});
	}
	// 显示安全库存补料详情
	function showSupplyList(data) {
		_CheckTab = $("#tablelist");
		_CheckTab.html("");
		$
				.each(
						data,
						function(item, obj) {
							trInt = $("#tablelist").find("tr").length;
							var dom = "";
							dom += "<tr class='contentText list_list'>";
							dom += "<td class='checkBox2item'><input type='checkbox' class='input_checkBox' ></td>";
							dom += "<td >" + (trInt+1) + "</td>";
							dom += "<td ><input type='text' name='demandApplyDetails["
									+ trInt
									+ "].materialCode'  value='"
									+ obj.materialCode + "'></td>";
							dom += "<td><input type='text' name='demandApplyDetails["
									+ trInt
									+ "].materialName' value='"
									+ obj.materialName + "'></td>";
							
							dom += "<td><input type='text' name='demandApplyDetails["
									+ trInt
									+ "].materialModel' value='"
									+ obj.materialModel + "'></td>";
							dom += "<td><input type='number' name='demandApplyDetails["
									+ trInt
									+ "].requestQuantity' value='"
									+ obj.requestQuantity + "'></td>";
							dom += "<td><input type='text' name='demandApplyDetails["
									+ trInt
									+ "].unit' value='"
									+ obj.unit
									+ "'></td>";
							dom += "</tr>";
							_CheckTab.append(dom);
							validateDetail(_validate, trInt);
						});
	}
	// -------- 增加明细 ---------
	function addDetail() {
		trInt = $("#tablelist").find("tr").length;
		var dom = "";
		dom += "<tr class='contentText list_list'>";
		dom += "<td class='checkBox2item'><input type='checkbox' class='input_checkBox' ></td>";
		dom += "<td >" + (trInt+1) + "</td>";
		dom += "<td><input type='text' name='demandApplyDetails["
				+ trInt
				+ "].materialCode' value=''  ></td>";//onblur='completeSupplyAdd.complement(this)'
		dom += "<td><input type='text'  name='demandApplyDetails["
				+ trInt + "].materialName' value=''></td>";//readonly='readonly'
		dom += "<td><input type='text'  name='demandApplyDetails["
				+ trInt + "].materialModel' value=''></td>";
		dom += "<td><input type='number' name='demandApplyDetails[" + trInt
				+ "].requestQuantity' value=''></td>";
		dom += "<td><input type='text' name='demandApplyDetails["
				+ trInt + "].unit' value=''></td>";
		dom += "</tr>";
		$("#tablelist").append(dom);

		// 入库单明细增加校验
		validateDetail(_validate, trInt);
	}
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		//
		var materialCode = "demandApplyDetails[" + len+ "].materialCode";
		var requestQuantity = "demandApplyDetails[" + len+ "].requestQuantity";
		var rules = {};
		rules[materialCode] = {
			required : true,
			maxlength : 100
		};
	
		rules[requestQuantity] = {
			required : true,
			range : [ 1, 10000 ]
		};
		
		$.extend(validate.settings.rules, rules);

		var message = {};
		message[materialCode] = {
			required : "物料编码不能为空",
			maxlength : "长度不超过100"
		};
		message[requestQuantity] = {
			required : "请求数量不可以为空",
			range : "数字超过范围10000"
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
	// -------- 删除明细 ---------
	function save() {
		if (!_requestApplyForm.valid()) {
			return;
		}
		// 校验详细
		$.ajax({
					url : urlPre+"completeSupply/addCompleteSupply",
					type : "POST",
					data : $("#addForm").serialize(),
					async : false,
					cache : false,
					success : function(data) {
						if (data == "success") {
							window.location.href = urlPre+"completeSupply/toCompleteSupplyListJsp";
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
}($, window.completeSupplyAdd || {}));
$(function() {
	completeSupplyAdd.init();
});
