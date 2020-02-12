window.outstockApplyAdd = (function($, module) {
	var steelMeshMaterialCode = $("#steelMeshMaterialCode").val().replace("]",
			"").replace("[", "");
	$("#steelMeshMaterialCode").val(steelMeshMaterialCode);
	function init() {
		query();
		$("#outstockOrderCode").val(
				"CKDH" + new Date().format("yyyyMMddhhmmssSSS"));
		// 绑定事件
		bindEvent();
	}

	function query() {
		$.ajax({
			url : "outstock/getSteelMeshOutstockDetails?steelMeshMaterialCode="
					+ encodeURI(steelMeshMaterialCode),
			type : "GET",
			datatype : "json",
			cache : false,
			success : function(data) {
				if (data == null || data == "" || data.SteelMeshOutstockDetails.length == 0) {
					alert("你需要申请的丝网已经出库，待入库后方可使用");
					return;
				}
				showOutstockApplyDetailList(data);
			}
		});
	}

	function showOutstockApplyDetailList(data) {

		var html = template('PickOutstockDetailTemp', data);
		$("#addTr").html("").html(html);
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
					maxlength : 100
				},
				'processName' : {
					maxlength : 100
				},
				'projectCode' : {
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
					maxlength : "长度不超过100"
				},
				'processName' : {
					maxlength : "长度不超过100"
				},
				'projectCode' : {
					maxlength : "长度不超过100"
				}
			}
		});
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
	  /*dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialPackUnit' value=''></td>";
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].packUnitNum' style='width:50px;' value=''></td>";*/
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

	function saveOutstockApply() {
		if (!$("#addForm").valid()) {
			return;
		}
		$("#loader").show();
		$.ajax({
			url : "outstock/addSteelMeshOutstock",
			type : "POST",
			data : $("#addForm").serialize(),
			async : true,
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if (data == "success") {
					window.location.href = "/outstock/toOutstockListJSP";
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
