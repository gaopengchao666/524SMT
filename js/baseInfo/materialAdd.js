window.MaterialAdd = (function($, module) {
	_materialForm = $("#addForm");
	_materialId = $("input[name='materialId']").val() || 0;
	_source = $("input[name='source']").val() || 0;
	_inputTypeName = $("input[name='materialType']");
	_inputTypeId = $("input[name='materialTypeId']");
	_inputUnitName = $("input[name='unit']");
	_inputUnitId = $("input[name='unitId']");
	_validate = null;
	materialCodeOld = $("input[name='materialCode']").val() || null;
	/**
	 * 初始化
	 */
	function init() {
		bindEvent();

		initPage();
	}

	/**
	 * 初始化页面
	 */
	function initPage() {
		// 如果是ERP物料 则只能修改计量单位
		if (parseInt(_source) > 0) {
			_materialForm.find("input[name!='unit'],textarea").attr("readOnly",
					true);
		}
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$.validator.addMethod("isMaterialRepeat", function(value, element) {
			var resData = true;
			if (materialCodeOld != value) {
				$.ajax({
					url : "material/isMaterialRepeat",
					type : "GET",
					data : {
						materialCode : value
					},
					async : false,
					success : function(data) {
						resData = data;
					}
				});
			}
			if (resData) {
				return true;
			} else {
				return false;
			}
		}, "");
		_validate = _materialForm.validate({
			rules : {
				'materialCode' : {
					required : true,
					maxlength : 255,
					/*
					 * remote : { url : "material/isMaterialRepeat", type :
					 * "GET", data : { materialId : _materialId }, async : true,
					 * cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isMaterialRepeat : true
				},
				'materialName' : {
					required : true,
					maxlength : 255
				},
				'materialType' : {
					required : true,
					maxlength : 255
				},
				'unit' : {
					required : true,
					maxlength : 255
				},
				'model' : {
					maxlength : 255
				},
				'describe' : {
					maxlength : 255
				}
			},
			messages : {
				'materialCode' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isMaterialRepeat : "物料编码不能重复"
				},
				'materialName' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'materialType' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'unit' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'model' : {
					maxlength : "最大长度是255"
				},
				'describe' : {
					maxlength : "最大长度是255"
				}
			}
		});

		// 物料类型 自动联想 最大10条数据
		_inputTypeName.autocomplete({
			// 选择后将 id赋值给隐藏域
			select : function(event, ui) {
				_inputTypeId.val(ui.item.id);
			},
			// 数据来源 根据输入值 模糊匹配
			source : function(request, response) {
				CommonUtils.getAjaxData({
					url : 'materialtype/queryMaterialTypesByName?typeName='
							+ encodeURI(request.term),
					type : 'get',
					async : 'true'
				}, function(data) {
					response($.map(data, function(item) {
						return {
							label : item.typeName + '-' + item.typeCode,// 下拉框显示值
							value : item.typeName,// 选中后,填充到下拉框的值
							id : item.materialTypeId
						// 选中后,填充到id里面的值
						}
					}));
				});
			}
		});

		// 计量单位 自动联想 最大10条数据
		_inputUnitName.autocomplete({
			// 选择后将 id赋值给隐藏域
			select : function(event, ui) {
				_inputUnitId.val(ui.item.id);
			},
			// 数据来源 根据输入值 模糊匹配
			source : function(request, response) {
				CommonUtils.getAjaxData({
					url : 'unit/queryUnitsByUnitName?unit='
							+ encodeURI(request.term),
					type : 'get',
					async : 'true'
				}, function(data) {
					response($.map(data, function(item) {
						return {
							label : item.unit + '-' + item.subUnit + '-'
									+ item.scaling,// 下拉框显示值
							value : item.subUnit,// 选中后,填充到下拉框的值
							id : item.unitId
						// 选中后,填充到id里面的值
						}
					}));
				});
			}
		});
	}

	/**
	 * 添加产线
	 */
	function addMaterial() {
		if (!$("#addForm").valid()) {
			return;
		}
		if (_inputTypeId.val().length == 0) {
			alert("请选择物料类型");
			return;
		}
		if (_inputUnitId.val().length == 0) {
			alert("请选择计量单位");
			return;
		}
		_materialForm.submit();
	}

	module.init = init;
	module.addMaterial = addMaterial;
	return module;
}($, window.MaterialAdd || {}));
$(function() {
	MaterialAdd.init();
});