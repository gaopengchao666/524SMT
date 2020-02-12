window.MaterialTypeAdd = (function($, module) {
	_materialTypeForm = $("#addForm");
	_materialTypeId = $("input[name='materialTypeId']").val() || 0;
	_validate = null;
	materialTypeCodeOld = $("input[name='typeCode']").val() || null;
	materialTypeNameOld = $("input[name='typeName']").val() || null;
	/**
	 * 初始化
	 */
	function init() {
		bindEvent();
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$.validator.addMethod("isMaterialTypeRepeat1",
				function(value, element) {
					var resData = true;
					if (materialTypeCodeOld != value) {
						$.ajax({
							url : "materialtype/isMaterialTypeRepeat",
							type : "GET",
							data : {
								typeCode : value
							},
							async : false,
							success : function(data) {
								resData = data;
							}
						});
					}
					if (resData == true) {
						return true;
					} else {
						return false;
					}
				}, "");
		$.validator.addMethod("isMaterialTypeRepeat2",
				function(value, element) {
					var resData = true;
					if (materialTypeNameOld != value) {
						$.ajax({
							url : "materialtype/isMaterialTypeRepeat",
							type : "GET",
							data : {
								typeName : value
							},
							async : false,
							success : function(data) {
								resData = data;
							}
						});
					}
					if (resData == true) {
						return true;
					} else {
						return false;
					}
				}, "");
		_validate = _materialTypeForm.validate({
			rules : {
				'typeCode' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "materialtype/isMaterialTypeRepeat", type :
					 * "GET", data : {materialTypeId:_materialTypeId}, async :
					 * true, cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isMaterialTypeRepeat1 : true
				},
				'typeName' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "materialtype/isMaterialTypeRepeat", type :
					 * "GET", data : {materialTypeId:_materialTypeId}, async :
					 * true, cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isMaterialTypeRepeat2 : true
				},
				'remark' : {
					maxlength : 255
				}
			},
			messages : {
				'typeCode' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isMaterialTypeRepeat1 : "物料类型编码不能重复"
				},
				'typeName' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isMaterialTypeRepeat2 : "物料类型名称不能重复"
				},
				'remark' : {
					maxlength : "长度不超过255"
				}
			}
		});
	}

	/**
	 * 添加物料类型
	 */
	function addMaterialType() {
		if (!_materialTypeForm.valid()) {
			return;
		}
		_materialTypeForm.submit();
	}

	module.init = init;
	module.addMaterialType = addMaterialType;
	return module;
}($, window.MaterialTypeAdd || {}));
$(function() {
	MaterialTypeAdd.init();
});