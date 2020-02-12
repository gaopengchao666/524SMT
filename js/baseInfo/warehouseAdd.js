window.WarehouseAdd = (function($, module) {
	_warehouseForm = $("#addForm"), _warehouseId = $(
			"input[name='warehouseId']").val() || 0, _validate = null;
	houseNameOld = $("input[name='houseName']").val() || null;
	houseCodeOld = $("input[name='houseCode']").val() || null;
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
		$.validator.addMethod("isWarehouseRepeat1", function(value, element) {
			var resData = true;
			if (houseNameOld != value) {
				$.ajax({
					url : "warehouse/isWarehouseRepeat",
					type : "GET",
					data : {
						houseName : value
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
		$.validator.addMethod("isWarehouseRepeat2", function(value, element) {
			var resData = true;
			if (houseCodeOld != value) {
				$.ajax({
					url : "warehouse/isWarehouseRepeat",
					type : "GET",
					data : {
						houseCode : value
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
		_validate = _warehouseForm.validate({
			rules : {
				'houseName' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "warehouse/isWarehouseRepeat", type :
					 * "GET", data : {warehouseId:_warehouseId}, async : true,
					 * cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isWarehouseRepeat1 : true
				},
				'houseCode' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "warehouse/isWarehouseRepeat", type :
					 * "GET", data : {warehouseId:_warehouseId}, async : true,
					 * cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isWarehouseRepeat2 : true
				},
				'positionAmount' : {
					number : true,
					max : 2000
				}
			},
			messages : {
				'houseName' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isWarehouseRepeat1 : "仓库名称不能重复"
				},
				'houseCode' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isWarehouseRepeat2 : "仓库编码不能重复"
				},
				'positionAmount' : {
					number : "必须为数字",
					max : "最大不能超过2000"
				}
			}
		});
	}

	/**
	 * 添加仓库
	 */
	function addWarehouse() {
		if (!_warehouseForm.valid()) {
			return;
		}
		_warehouseForm.submit();
	}

	module.init = init;
	module.addWarehouse = addWarehouse;
	return module;
}($, window.WarehouseAdd || {}));
$(function() {
	WarehouseAdd.init();
});