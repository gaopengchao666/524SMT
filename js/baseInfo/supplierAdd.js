window.SupplierAdd = (function($, module) {
	_supplierForm = $("#addForm"), _supplierId = $("input[name='supplierId']")
			.val() || 0, _validate = null;
	supplierNameOld = $("input[name='supplierName']").val() || null;
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
		$.validator.addMethod("isSupplierRepeat", function(value, element) {
			var resData = true;
			if (supplierNameOld != value) {
				$.ajax({
					url : "supplier/isSupplierRepeat",
					type : "GET",
					data : {
						supplierName : value
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
		
		/**
		 * 用于校验手机号码是否合法的方法
		 * 
		 * @param userEmail
		 */
		$.validator.addMethod("okPhone",function registeredUserPhone(value, element) {
			if(value!=""){
				var filter = /^1[3|4|5|7|8][0-9]{9}$/;
				if (filter.test(value)) {
					return true;
				} else {
					return false;
				}
			}else{
				return true;
			}
		},"");
		
		_validate = _supplierForm.validate({
			rules : {
				'supplierName' : {
					required : true,
					maxlength : 255,
					/*
					 * remote: { url : "supplier/isSupplierRepeat", type :
					 * "GET", data : {supplierId:_supplierId}, async : true,
					 * cache : false, contentType : 'application/json;
					 * charset=utf-8', dataType : "json" }
					 */
					isSupplierRepeat : true
				},
				'contactNumber':{
					okPhone:true
				},
				'email' : {
					maxlength : 255
				},
				'contacts' : {
					maxlength : 255
				},
				'remark' : {
					maxlength : 255
				}
			},
			messages : {
				'supplierName' : {
					required : "不能为空",
					maxlength : "长度不超过255",
					isSupplierRepeat : "供应商不能重复"
				},
				'email' : {
					maxlength : "长度不超过255"
				},
				'contacts' : {
					maxlength : "长度不超过255"
				},
				'remark' : {
					maxlength : "长度不超过255"
				},
				'contactNumber' :{
					okPhone : "电话号码格式错误"
				}
			}
		});
	}

	/**
	 * 添加产线
	 */
	function addSupplier() {
		if (!_supplierForm.valid()) {
			return;
		}
		_supplierForm.submit();
	}

	module.init = init;
	module.addSupplier = addSupplier;
	return module;
}($, window.SupplierAdd || {}));
$(function() {
	SupplierAdd.init();
});