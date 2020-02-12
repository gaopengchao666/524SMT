window.WHPositionAdd = (function($, module) {
	_whPositionForm = $("#addForm");
	_positionId = $("input[name='positionId']").val() || 0;
	_validate = null;
	positionCodeOld = $("input[name='positionCode']").val() || null;
	positionNameOld = $("input[name='positionName']").val() || null;
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
		$.validator.addMethod("isWHPositionRepeat1", function(value, element) {
			var resData = true;
			if (positionCodeOld != value) {
				$.ajax({
					url : "whposition/isWHPositionRepeat",
					type : "GET",
					data : {
						positionCode : value
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
		$.validator.addMethod("isWHPositionRepeat2", function(value, element) {
			var resData = true;
			if (positionNameOld != value) {
				$.ajax({
					url : "whposition/isWHPositionRepeat",
					type : "GET",
					data : {
						positionName : value
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
		_validate = _whPositionForm.validate({
			rules : {
				'positionCode' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "whposition/isWHPositionRepeat", type :
					 * "GET", data : {positionId:_positionId}, async : true,
					 * cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isWHPositionRepeat1 : true
				},
				'positionName' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "whposition/isWHPositionRepeat", type :
					 * "GET", data : {positionId:_positionId}, async : true,
					 * cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isWHPositionRepeat2 : true
				},
				'positionAddr' : {
					maxlength : 255
				},
				'warehouseId' : {
					required : true
				},
				'remark' : {
					maxlength : 255
				}
			},
			messages : {
				'positionCode' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isWHPositionRepeat1 : "库位编码不能重复"
				},
				'positionName' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isWHPositionRepeat2 : "库位名称不能重复"
				},
				'positionAddr' : {
					maxlength : "长度不超过255"
				},
				'warehouseId' : {
					required : "不能为空"
				},
				'remark' : {
					maxlength : "长度不超过255"
				}
			}
		});
	}

	/**
	 * 添加产线
	 */
	function addWHPosition() {
		if (!_whPositionForm.valid()) {
			return;
		}
		_whPositionForm.submit();
	}

	module.init = init;
	module.addWHPosition = addWHPosition;
	return module;
}($, window.WHPositionAdd || {}));
$(function() {
	WHPositionAdd.init();
});