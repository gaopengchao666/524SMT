window.LossManageAdd = (function($, module) {
	detailsNum = 0;
	detailsRow = 1;
	userInfoZg = null;
	_validate = null;
	/**
	 * 初始化页面信息
	 */
	function init() {
		initUserInfo();
		bindEvent();
		addDetail();
		CommonUtils.ie8TrChangeColor();
	}
	function initUserInfo() {
		$.ajaxSetup({cache : false});
		$.ajax({
			url : "lossManage/getUserInfoZg",
			type : "GET",
			async : false,
			cache : false,
			success : function(data) {
				userInfoZg = data.userInfo;
			}
		});

		if (!-[ 1, ]) {
			var select = document.getElementById("checkNameCode");
			var option1 = document.createElement("option");
			option1.text = "请选择";
			option1.value = "";
			select.add(option1);
			for (var i = 0; i < userInfoZg.length; i++) {
				var option = document.createElement("option");
				option.text = userInfoZg[i].username;
				option.value = userInfoZg[i].userId;
				select.add(option);
			}
		} else {
			var dom = "<option value=''>请选择</option>";
			for (var i = 0; i < userInfoZg.length; i++) {
				dom += "<option value=" + userInfoZg[i].userId + ">"
						+ userInfoZg[i].username + "</option>"
			}
			document.getElementById("checkNameCode").innerHTML = dom;
		}
	}

	// -------- 增加明细 ---------
	function addDetail() {
		var dom = "";
		dom = "<tr class='contentText list_list'  id='detail_" + detailsRow
				+ "'><td><input type='checkbox' class='input_checkBox'/></td>";
		dom += "<td><span>" + detailsRow + "</span></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='details["
				+ detailsNum
				+ "].materialCode' value='' /></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='details["
				+ detailsNum
				+ "].materialName' class='materialName' value=''/></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='details["
				+ detailsNum
				+ "].materialModel' class='materialModel' value=''/></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='details["
				+ detailsNum
				+ "].materialUnit' class='materialUnit' value=''/></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='details["
				+ detailsNum + "].count' value=''/></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='details["
				+ detailsNum + "].remark' value=''/></div></td></tr>";
		
		$("#addTr1").append(dom);
		validateDetail(_validate, detailsNum);
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();
		var tr=detailsNum;
		//物料类型 自动联想 最大10条数据
		$("input[name='details["+(tr)+"].materialCode']").autocomplete({
			delay:500,
			focus:function(event,ui){
				   $("input[name='details["+(tr)+"].materialCode']").val(ui.item.code);
		    	   $("input[name='details["+(tr)+"].materialName']").val(ui.item.name);
		    	   $("input[name='details["+(tr)+"].materialModel']").val(ui.item.Model);
		    	   $("input[name='details["+(tr)+"].materialUnit']").val(ui.item.unit);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    		   $("input[name='details["+(tr)+"].materialCode']").val("");
		    	   $("input[name='details["+(tr)+"].materialName']").val("");
		    	   $("input[name='details["+(tr)+"].materialModel']").val("");
		    	   $("input[name='details["+(tr)+"].materialUnit']").val("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='details["+(tr)+"].materialCode']").val(ui.item.code);
	    	   $("input[name='details["+(tr)+"].materialName']").val(ui.item.name);
	    	   $("input[name='details["+(tr)+"].materialModel']").val(ui.item.Model);
	    	   $("input[name='details["+(tr)+"].materialUnit']").val(ui.item.unit);
	    	   
	       },
	       //数据来源 根据输入值 模糊匹配
	       source:function(request,response){
	           CommonUtils.getAjaxData({url:'safetyRule/queryMaterialsByName?materialCode='
	   			+ encodeURI(request.term),type:'get',async:'true'},function(data){
	                   response($.map(data,function(item){
	                       return {
	                           label:item.materialCode,//下拉框显示值
	                           value:item.materialCode,//选中后,填充到下拉框的值
	                           name :item.materialName,
	                           code:item.materialCode,
	                           Model:item.model,
	                           unit:item.useUnit,
	                       };
	                   }));
	           });
	       }
	    });
		$("input[name='details["+(tr)+"].materialName']").autocomplete({
			delay:500,
			focus:function(event,ui){
				   $("input[name='details["+(tr)+"].materialCode']").val(ui.item.code);
		    	   $("input[name='details["+(tr)+"].materialName']").val(ui.item.value);
		    	   $("input[name='details["+(tr)+"].materialModel']").val(ui.item.Model);
		    	   $("input[name='details["+(tr)+"].materialUnit']").val(ui.item.unit);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    		   $("input[name='details["+(tr)+"].materialCode']").val("");
		    	   $("input[name='details["+(tr)+"].materialName']").val("");
		    	   $("input[name='details["+(tr)+"].materialModel']").val("");
		    	   $("input[name='details["+(tr)+"].materialUnit']").val("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='details["+(tr)+"].materialCode']").val(ui.item.code);
	    	   $("input[name='details["+(tr)+"].materialName']").val(ui.item.value);
	    	   $("input[name='details["+(tr)+"].materialModel']").val(ui.item.Model);
	    	   $("input[name='details["+(tr)+"].materialUnit']").val(ui.item.unit);
	    	   
	       },
	       //数据来源 根据输入值 模糊匹配
	       source:function(request,response){
	           CommonUtils.getAjaxData({url:'safetyRule/queryMaterialsByName?materialName='
	   			+ encodeURI(request.term),type:'get',async:'true'},function(data){
	                   response($.map(data,function(item){
	                       return {
	                           label:item.materialName,//下拉框显示值
	                           value:item.materialName,//选中后,填充到下拉框的值
	                           code:item.materialCode,
	                           Model:item.model,
	                           unit:item.useUnit,
	                       };
	                   }));
	           });
	       }
	    });
		detailsNum += 1;
		detailsRow += 1;
	}
	
	// -------- 删除明细 ---------
	function deleteDetail() {
		var checks = $("input[type='checkbox']:checked");
		if (checks.length == 0) {
			$("#addTr1").find("tr:last").remove();
		} else {
			$.each(checks, function(item, obj) {
				$(obj).parent().parent().remove();
			});
		}
	}
	// 提交保存
	function submit() {
		if (!$("#addFrom").valid()) {
			return;
		}
		$("#submit").prop("disabled",true);
		$.ajax({
			url : "lossManage/addLossInfo",
			type : "POST",
			async : false,
			data : $("#addFrom").serialize(),
			success : function(data) {
				if (data == "success") {
					window.location.href = "/lossManage/list";
				}
			}
		});
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		// 正整数校验
		$.validator.addMethod("isIntLtZero", function(value, element) {
			value = parseInt(value);
			return this.optional(element) || value >= 0;
		}, "");
		// 不为空校验
		$.validator.addMethod("isNull", function(value, element) {
			if (value == "" || value == null) {
				return false;
			} else {
				return true;
			}
		}, "");
		$.validator.addMethod("itemCodeExist", function(value, element) {
			var resData = null;
			$.ajax({
				url : "lossManage/itemCodeExist?param="+encodeURI(encodeURI(value)),
				type : "GET",
				async : false,
				success : function(data) {
					resData = data;
				}
			});
			if (resData == "true") {
				return true;
			} else {
				return false;
			}
		}, "");
		$.validator.addMethod("productCodeExist", function(value, element) {
			var resData = null;
			$.ajax({
				url : "lossManage/productCodeExist?param="+encodeURI(encodeURI(value)),
				type : "GET",
				async : false,
				success : function(data) {
					resData = data;
				}
			});
			if (resData == "true") {
				return true;
			} else {
				return false;
			}
		}, "");
		$.validator.addMethod("productNameExist", function(value, element) {
			var resData = null;
			$.ajax({
				url : "lossManage/productNameExist?param="+encodeURI(encodeURI(value)),
				type : "GET",
				async : false,
				success : function(data) {
					resData = data;
				}
			});
			if (resData == "true") {
				return true;
			} else {
				return false;
			}
		}, "");
		$.validator.addMethod("planCodeExist", function(value, element) {
			var resData = null;
			$.ajax({
				url : "lossManage/planCodeExist?param="+encodeURI(encodeURI(value)),
				type : "GET",
				async : false,
				success : function(data) {
					resData = data;
				}
			});
			if (resData == "true") {
				return true;
			} else {
				return false;
			}
		}, "");
		$.validator.addMethod("workProcessExist", function(value, element) {
			var resData = null;
			$.ajax({
				url : "lossManage/workProcessExist?param="+encodeURI(encodeURI(value)),
				type : "GET",
				async : false,
				success : function(data) {
					resData = data;
				}
			});
			if (resData == "true") {
				return true;
			} else {
				return false;
			}
		}, "");
		_validate = $("#addFrom").validate({
			rules : {
				'itemCode' : {
					isNull : true,
					required : true,
					maxlength : 255,
					itemCodeExist:true
				},
				'productCode' : {
					isNull : true,
					required : true,
					productCodeExist:true
				},
				'productName' : {
					isNull : true,
					required : true,
					productNameExist:true
				},
				'planCode' : {
					isNull : true,
					required : true,
					planCodeExist:true
				},
				'applyDate' : {
					required : true
				},
				'workProcess' : {
					isNull : true,
					required : true,
					workProcessExist:true
				},
				'checkNameCode' : {
					isNull : true,
					required : true
				}
			},
			messages : {
				'itemCode' : {
					isNull : "不能为空",
					required : "不能为空",
					maxlength : 255,
					itemCodeExist:"项目不存在"
				},
				'productCode' : {
					isNull : "不能为空",
					required : "不能为空",
					productCodeExist:"产品图号错误"
				},
				'productName' : {
					isNull : "不能为空",
					required : "不能为空",
					productNameExist:"产品名称错误"
				},
				'planCode' : {
					isNull : "不能为空",
					required : "不能为空",
					planCodeExist:"计划号错误"
				},
				'applyDate' : {
					required : "不能为空"
				},
				'workProcess' : {
					isNull : "不能为空",
					required : "不能为空",
					workProcessExist:"工序不存在"
				},
				'checkNameCode' : {
					isNull : "不能为空",
					required : "不能为空"
				}
			}
		});
	}
	// 追加校验
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		var materialCode = "details[" + len + "].materialCode";
		var materialName = "details[" + len + "].materialName";
		var materialModel = "details[" + len + "].materialModel";
		var materialUnit = "details[" + len + "].materialUnit";
		var count = "details[" + len + "].count";

		var rules = {};
		rules[materialCode] = {
			isNull : true,
			required : true
		};
		rules[materialName] = {
			isNull : true,
			required : true
		};
		rules[count] = {
			isIntLtZero : true,
			isNull : true,
			required : true,
			number : true
		};

		$.extend(validate.settings.rules, rules);
		var messages = {};

		messages[materialCode] = {
			isNull : "不能为空",
			required : "不能为空"
		};
		messages[materialName] = {
			isNull : "不能为空",
			required : "不能为空"
		};
		messages[count] = {
			isIntLtZero : "请输入正整数",
			isNull : "不能为空",
			required : "不能为空",
			number : "请输入数字"
		};

		$.extend(validate.settings.messages, messages);
	}

	module.init = init;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail;
	module.submit = submit;
	return module;
}($, window.LossManageAdd || {}));
$(function() {
	LossManageAdd.init();
});
