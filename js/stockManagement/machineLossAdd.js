window.machineLossAdd = (function($, module) {
	var r = /^[1-9]+\d*$/;
	/* var trInt = 0; */
	function init() {
		$("#machineCode").val("JSDH" + new Date().format("yyyyMMddhhmmssSSS"));
		// 绑定事件
		bindEvent();
		addDetail();
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$.validator.addMethod("isIntLtZero", function(value, element) {
			return r.test(value);
		}, "整数必须大于0");
		
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
		// 编写校验
		_validate = $("#addForm").validate({
			rules : {
				'machineCode' : {
					required : true,
					maxlength : 100
				},
				'planNum' : {
					required : true,
					maxlength : 100,
					planCodeExist:true
				},
				'productDrawNo' : {
					required : true,
					maxlength : 100
				},
				'projectCode' : {
					maxlength : 100
				},
				'processName' : {
					maxlength : 100,
					workProcessExist:true
				},
				'reviewer' : {
					required : true,
					maxlength : 100
				}
			},
			messages : {
				'machineCode' : {
					required : "机损单编码不可以为空",
					maxlength : "长度不超过100"
				},
				'planNum' : {
					required : "计划号不可以为空",
					maxlength : "长度不超过100",
					planCodeExist:"计划号错误"
				},
				'productDrawNo' : {
					required : "产品图号不可以为空",
					maxlength : "长度不超过100"
				},
				'projectCode' : {
					maxlength : "长度不超过100"
				},
				'processName' : {
					maxlength : "长度不超过100",
					workProcessExist:"工序不存在"
				},
				'reviewer' : {
					required : "审核人不可以为空",
					maxlength : "长度不超过100"
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
		// 物料详情的校验
		var materialCode = "machineLossDetails[" + len + "].materialCode";
		var materialName = "machineLossDetails[" + len + "].materialName";
		var materialType = "machineLossDetails[" + len + "].materialType";
		var materialSpec = "machineLossDetails[" + len + "].materialSpec";
		var materialUseUnit = "machineLossDetails[" + len + "].materialUseUnit";
		var useUnitNum = "machineLossDetails[" + len + "].useUnitNum";
		var rules = {};
		rules[materialCode] = {
			required : true,
			maxlength : 100
		};
		rules[materialName] = {
			required : true,
			maxlength : 20
		};
		rules[materialType] = {
			required : true,
			maxlength : 100
		};
		rules[materialSpec] = {
			maxlength : 100
		};
	
		rules[materialUseUnit] = {
			required : true,
			maxlength : 100
		};
		rules[useUnitNum] = {
			required : true,
			isIntLtZero :true
		};
		$.extend(validate.settings.rules, rules);

		var message = {};
		message[materialCode] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[materialName] = {
			required : "不能为空",
			maxlength : "长度不超过20"
		};
		message[materialType] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[materialSpec] = {
			maxlength : "长度不超过100"
		};

		message[materialUseUnit] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[useUnitNum] = {
			required : "不能为空",
			isIntLtZero :"必须为整数"
		};
		$.extend(validate.settings.messages, message);
	}

	// -------- 增加明细 ---------
	function addDetail() {

		var trInt = $("#addTr").find("tr").length;
		var no = trInt + 1;// 序号
		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='checkbox' class='input_checkBox'></td>";
		dom += "<td><input type='text' readonly='readonly' value='" + no
				+ "'></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='machineLossDetails[" + trInt
				+ "].materialCode' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='machineLossDetails[" + trInt
				+ "].materialName' class='materialName' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' readonly='readonly' name='machineLossDetails[" + trInt
				+ "].materialType' class='materialType' value=''></div></td>";
		dom += "<td><input type='text' readonly='readonly' name='machineLossDetails[" + trInt
				+ "].materialSpec' class='materialSpec' value=''></td>";
		dom += "<td><div  class='addRemind1'><input type='text' readonly='readonly' name='machineLossDetails[" + trInt
				+ "].materialUseUnit' class='materialUseUnit' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='machineLossDetails[" + trInt
				+ "].useUnitNum' style='width:100px;' value=''></div></td>";
		dom += "<td><input type='text' name='machineLossDetails[" + trInt
				+ "].remark' value=''></td>";
		dom += "</tr>";
		$("#addTr").append(dom);
		CommonUtils.ie8TrChangeColor();
		
		var tr=trInt;
		//物料类型 自动联想 最大10条数据
		$("input[name='machineLossDetails["+(tr)+"].materialCode']").autocomplete({
			delay:500,
			focus:function(event,ui){
				   $("input[name='machineLossDetails["+(tr)+"].materialCode']").val(ui.item.code);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialName']").val(ui.item.name);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialType']").val(ui.item.Type);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    		   $("input[name='machineLossDetails["+(tr)+"].materialCode']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialName']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialSpec']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialUseUnit']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialType']").val("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='machineLossDetails["+(tr)+"].materialCode']").val(ui.item.code);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialName']").val(ui.item.name);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialType']").val(ui.item.Type);
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
	                           Type:item.materialType,
	                       };
	                   }));
	           });
	       }
	    });
		
		$("input[name='machineLossDetails["+(tr)+"].materialName']").autocomplete({
			delay:500,
			focus:function(event,ui){
				 $("input[name='machineLossDetails["+(tr)+"].materialCode']").val(ui.item.code);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialName']").val(ui.item.name);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
		    	   $("input[name='machineLossDetails["+(tr)+"].materialType']").val(ui.item.Type);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    		   $("input[name='machineLossDetails["+(tr)+"].materialCode']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialName']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialSpec']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialUseUnit']").val("");
		    	   $("input[name='machineLossDetails["+(tr)+"].materialType']").val("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='machineLossDetails["+(tr)+"].materialCode']").val(ui.item.code);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialName']").val(ui.item.name);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
	    	   $("input[name='machineLossDetails["+(tr)+"].materialType']").val(ui.item.Type);
	       },
	       //数据来源 根据输入值 模糊匹配
	       source:function(request,response){
	           CommonUtils.getAjaxData({url:'safetyRule/queryMaterialsByName?materialName='
	   			+ encodeURI(request.term),type:'get',async:'true'},function(data){
	                   response($.map(data,function(item){
	                       return {
	                    	   label:item.materialName,//下拉框显示值
	                           value:item.materialName,//选中后,填充到下拉框的值
	                           name :item.materialName,
	                           code:item.materialCode,
	                           Model:item.model,
	                           unit:item.useUnit,
	                           Type:item.materialType,
	                       };
	                   }));
	           });
	       }
	    });
		
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
	        // millisecond
	    }

	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
	        - RegExp.$1.length));
	    }

	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(format)) {
	        var formatStr="";
	        for(var i=1;i<=RegExp.$1.length;i++){
	            formatStr+="0";
	        }

	        var replaceStr="";
	        if(RegExp.$1.length == 1){
	            replaceStr=o[k];
	        }else{
	            formatStr=formatStr+o[k];
	            var index=("" + o[k]).length;
	            formatStr=formatStr.substr(index);
	            replaceStr=formatStr;
	        }
	        format = format.replace(RegExp.$1, replaceStr);
	        }
	    }
	    return format;
	}
	

	function saveMachineloss() {
		if (!$("#addForm").valid()) {
			return;
		}
		$.ajax({
			url : "machineloss/addMachineLoss",
			type : "POST",
			data : $("#addForm").serialize(),
			async : false,
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = url_Pre + "/machineloss/returnToMachineLossJSP";
				}
			}
		});
	}
	module.init = init;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail;
	module.saveMachineloss = saveMachineloss;
	return module;
}($, window.Material || {}));
$(function() {
	machineLossAdd.init();
});
