window.instockApplyAdd = (function($, module) {
	
	
	function init() {
		$("#instockCode").val(RndNum(13));
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
					required : true,
					maxlength : 100
				},
				'planNum' : {
					required : true,
					maxlength : 100
				},
				'materialUse' : {
					required : true,
					maxlength : 100
				},
				'projectCode' : {
					required : true,
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
					required : "产品图号不可以为空",
					maxlength : "长度不超过100"
				},
				'planNum' : {
					required : "计划号不能为空",
					maxlength : "长度不超过100"
				},
				'projectCode' : {
					required : "项目编码不可以为空",
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
		var materialPackUnit = "instockApplyDetails[" + len
				+ "].materialPackUnit";
		var packUnitNum = "instockApplyDetails[" + len + "].packUnitNum";
		var materialUseUnit = "instockApplyDetails[" + len
				+ "].materialUseUnit";
		var useUnitNum = "instockApplyDetails[" + len + "].useUnitNum";
		var warehouse = "instockApplyDetails[" + len + "].warehouse";
		var location = "instockApplyDetails[" + len + "].location";
		var remark = "instockApplyDetails[" + len + "].remark";
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
			required : true,
			maxlength : 100
		};
		rules[materialType] = {
			required : true,
			maxlength : 100
		};
		rules[materialPackUnit] = {
			required : true,
			maxlength : 20
		};
		rules[packUnitNum] = {
			required : true,
			range : [ 1, 10000 ]
		};
		rules[materialUseUnit] = {
			required : true,
			maxlength : 20
		};
		rules[useUnitNum] = {
			required : true,
			range : [ 1, 10000 ]
		};
		rules[warehouse] = {
			required : true,
			maxlength : 20
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
		message[materialSpec] = {
			required : "物资规格不可以为空",
			maxlength : "长度不超过100"
		};
		message[materialType] = {
			required : "物料类型不可以为空",
			maxlength : "长度不超过100"
		};
		message[materialPackUnit] = {
				required : "物料包装单位不可以为空",
				maxlength : "长度不超过20"
		};
		message[packUnitNum] = {
			required : "数量不可以为空",
			range : [ 1, 10000 ]
		};
		message[materialUseUnit] = {
			required : "物料使用单位不可以为空",
			maxlength : "长度不超过20"
		};
		message[useUnitNum] = {
				required : "数量不可以为空",
				range : [ 1, 10000 ]
			};
		message[warehouse] = {
			required : "仓库不可以为空",
			maxlength : "长度不超过20"
		};
		message[remark] = {
				maxlength : "长度不超过500"
			};
		$.extend(validate.settings.messages, message);
		//
		validateDetail(_validate, 0);
	}

	// -------- 增加明细 ---------
	function addDetail() {
		var trInt = $("#addTr").find("tr").length;
		var no = trInt + 1;// 序号
		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='text' readonly='readonly' value='" + no
				+ "'></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].materialCode' value='' onblur='complement(mId)'></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].materialName' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].materialType' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].materialSpec' value=''></td>";
		dom += "<td><input  name='instockApplyDetails[" + trInt
				+ "].materialPackUnit' value=''></td>";
		dom += "<td><input  name='instockApplyDetails[" + trInt
				+ "].packUnitNum' style='width:50px;' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].materialUseUnit' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].useUnitNum' style='width:50px;' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].warehouse' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
				+ "].location' value=''></td>";
		dom += "<td><input type='text' name='instockApplyDetails[" + trInt
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
		var rnd = "RKDH";
		for (var i = 0; i < n; i++) {
			rnd += Math.floor(Math.random() * 10);
		}
		return rnd;
	}


    $("#outstockNum").bind("change", function(){
     var list = [];
     var param = $(this).val();
     list.push(param);
      $.ajax({
          url : "instock/selectOutstockOrderByOustockId",
          type : "POST",
         data : JSON.stringify(list),
          contentType : 'application/json; charset=utf-8',
          async : true,
          cache: false ,
          success : function(data) {
        
        	$("#productDrawNo").val(data.productDrawNo);
            $("#projectCode").val(data.projectCode);
            $("#planNum").val(data.planNum);
            $("#materialUse").val(data.materialUse);
            var html = template('instockApplyDetailTemp', data);
            $("#addTr").html("").html(html);
    		$("tbody tr:odd").css("background", "#EBF5FF");
          }
      });
});

	function FillInMaterialType()
	{
		var url = "instock/getMatrialType?materialCode=" + _materialCode;
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			_materialType = data.typeName;
		});
	}
	
	function saveInstockApply() {
		if (!$("#addForm").valid()) {
			return;
		}

		$.ajax({
			url : "instock/addInstockApply",
			type : "POST",
			data : $("#addForm").serialize(),
			async : false,
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = "instock/instockList";
				}
			}
		});
	}
	function complement(id) {
		id = this.val();
	}
	module.init = init;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail;
	module.saveInstockApply = saveInstockApply;
	return module;
}($, window.Material || {}));
$(function() {
	instockApplyAdd.init();
});
