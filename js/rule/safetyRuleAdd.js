window.safetyRuleAdd = (function($, module) {

	_validate = null;
	var r = /^([1-9]\d*|[0]{1,1})$/;
	trInt = 0;// 记录行
	function init() {
		addDetail();
		bindEvent();

	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		// 名称重复校验
		$.validator.addMethod("ruleNameIsExist", function(value, element) {
			var value1 = encodeURI(encodeURI(jQuery.trim(value)));
			var flag1 = 1;
			var flag2 = 1;
			$.ajaxSetup({cache : false});
			$.ajax({
				type : "GET",
				url : "safetyRule/ruleNameIsExist?ruleName=" + value1,
				async : false,
				cache : false,
				success : function(data) {
					if (data == "has") {
						flag1 = 0;
					}
				}
			});
			var ruleNames = $("input[name$='.ruleName']");
			for (var i = 0; i < ruleNames.length; i++) {
				if (element.name != ruleNames[i].name
						&& jQuery.trim(ruleNames[i].value) == value) {
					flag2 = 0;
				}
			}
			if (flag1 == 1 && flag2 == 1) {
				return true;
			} else {
				return false;
			}
		}, "");
		// 规则物料编码验证
		$.validator.addMethod("materialCodeIsExist", function(value,
				element) {
			value1 = encodeURI(encodeURI(value));
			$.ajaxSetup({cache : false});
			// var TypeId =
			// element.parentElement.previousElementSibling.firstChild.value;
			var flag1 = 1;
			var flag2 = 1;
			$.ajax({
				type : "GET",
				url : "safetyRule/materialTypeAndCodeIsExist?materialCode="
						+ value1,
				async : false,
				cache : false,
				success : function(data) {
					if (data == "has") {
						flag1 = 0;
					}
				}
			});
			var ruleNames = $("input[name$='.materialCode']");
			for (var i = 0; i < ruleNames.length; i++) {
				if (element.name != ruleNames[i].name
						&& ruleNames[i].value == value) {
					flag2 = 0;
				};
			}
			if (flag1 == 1 && flag2 == 1) {
				return true;
			} else {
				return false;
			};
		}, "");
		// 整数校验
		$.validator.addMethod("isIntLtZero", function(value, element) {
			return r.test(value);
		}, "整数必须大于等于0");
		//大于
		$.validator.addMethod("gt", function(value, element) {
			
			//param=element.parentElement.parentElement.previousElementSibling.firstChild.firstChild.value;
			var param=$(element).parents("tr").find("input[name$='minNum']").val()
			return Number(value)> Number(param);
		}, $.validator.format("输入的值必须大于{1}！"));
		//小于
		$.validator.addMethod("lt", function(value, element) {
			var param=$(element).parents("tr").find("input[name$='maxNum']").val()
			if(param){
				return Number(value)< Number(param) 
			}else {return true}
		}, $.validator.format("输入的值必须小于{1}！"));
		_validate = $("#addForm").validate({
			rules : {
				'safetyRules[0].ruleName' : {
					ruleNameIsExist : true,
					required : true,
					maxlength : 255
				},
				'safetyRules[0].safetyNum' : {
					required : true,
					isIntLtZero : true
				},
				'safetyRules[0].minNum' : {
					isIntLtZero : true,
					lt : true,
					required : true
				},
				'safetyRules[0].maxNum' : {
					required : true,
					isIntLtZero : true,
					gt : true
				},
				'safetyRules[0].materialCode' : {
					required : true,
					materialCodeIsExist : true
				}
			},
			messages : {
				'safetyRules[0].ruleName' : {
					ruleNameIsExist : "名称不能重复",
					required : "名称不能为空",
					maxlength : "长度不超过255"
				},
				'safetyRules[0].safetyNum' : {
					required : "不能为空",
					isIntLtZero : "输入正整数"
				},
				'safetyRules[0].minNum' : {
					required : "不能为空",
					isIntLtZero : "输入正整数",
					lt:"值必须小于上限"
				},
				'safetyRules[0].maxNum' : {
					required : "不能为空",
					isIntLtZero : "输入正整数",
					gt:"值必须大于下限"
				},
				'safetyRules[0].materialCode' : {
					required : "不能为空",
					materialCodeIsExist : "不能重复"
				}
			}
		});
	}
	// 追加校验
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		var ruleName = "safetyRules[" + len + "].ruleName";
		var safetyNum = "safetyRules[" + len + "].safetyNum";
		var minNum = "safetyRules[" + len + "].minNum";
		var maxNum = "safetyRules[" + len + "].maxNum";
		var materialCode = "safetyRules[" + len + "].materialCode";
		//var warehouseName = "safetyRules[" + len + "].warehouseName";

		var rules = {};
		rules[ruleName] = {
			ruleNameIsExist : true,
			required : true,
			maxlength : 255
		};
		rules[safetyNum] = {
			isIntLtZero : true,
			required : true
		};
		rules[minNum] = {
			isIntLtZero : true,
			required : true,
			lt:true

		};
		rules[maxNum] = {
			isIntLtZero : true,
			required : true,
			gt:true

		};
		rules[materialCode] = {
			required : true,
			materialCodeIsExist : true
		};
		/*rules[warehouseName] = {
				required : true
		};*/
		$.extend(validate.settings.rules, rules);
		var messages = {};

		messages[ruleName] = {
			ruleNameIsExist : "名称不能重复",
			required : "名称不能为空",
			maxlength : "长度不超过100"
		};
		messages[safetyNum] = {
			isIntLtZero : "请输入正整数",
			required : "不能为空"
		};
		messages[minNum] = {
			isIntLtZero : "请输入正整数",
			required : "不能为空",
			lt:"值必须小于上限"
		};
		messages[maxNum] = {
			isIntLtZero : "请输入正整数",
			required : "不能为空",
			gt:"值必须大于下限"
		};
		messages[materialCode] = {
			required : "不能为空",
			materialCodeIsExist : "不能重复"
		};
		/*messages[warehouseName] = {
				required : "不能为空"
		};*/
		$.extend(validate.settings.messages, messages);
	}
	// -------- 增加明细 ---------
	function addDetail() {
		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='checkbox'  class='input_checkBox'></td>";
		dom += "<td><div  class='addRemind1'><input type='text' class='input_widthliu' name='safetyRules["
				+ trInt + "].ruleName' value=''/></div></td>";
		dom +="<td ><input type='text' name='safetyRules["
				+ trInt + "].materialName' /></td>";
		dom += "<td><div  class='addRemind1'><input name='safetyRules["
				+ trInt + "].materialCode' /></div></td>";//onchange='safetyRuleAdd.setMaterialOpton(this,"+trInt+")'
		dom += "<td><input type='hidden' name='safetyRules["
				+ trInt + "].materialTypeId' value='' /><input class='input_widthliu' name='safetyRules["
				+ trInt
				+ "].materialTypeName' readonly='readonly' value='' /></td>";
		dom += "<td><input type='hidden' name='safetyRules["
				+ trInt + "].materialId' value='' /><input class='input_widthliu' name='safetyRules[" + trInt
				+ "].materialModel' readonly='readonly' value='' /></td>";
		dom += "<td><input name='safetyRules[" + trInt
				+ "].unit' readonly='readonly' value='' /></td>";
		dom += "<td><input class='input_widthliu' name='safetyRules[" + trInt
				+ "].warehouseId' type='hidden' value='' /><input class='input_widthliu' name='safetyRules[" + trInt
				+ "].warehouseName' readonly='readonly' value='' /></td>";
		dom += "<td><div  class='addRemind1'><input type='text' value='' class='num_write' name='safetyRules["
				+ trInt + "].addNum' /></div></td>";
		dom += "<td class='addNumber'><div  class='addRemind1'><input type='text'  value='' class='num_write' name='safetyRules["
				+ trInt + "].minNum' value='0' /></div></td>";
		dom += "<td class='addNumber'><div  class='addRemind1'><input type='text'  value='' class='num_write' name='safetyRules["
				+ trInt + "].maxNum' /></div></td>";
		dom += "<td><select class='select_widthliu' name='safetyRules["
				+ trInt
				+ "].expiryDayNum'><select></td></tr>";
		$("#addTr").append(dom);
		if (trInt != 0) {
			validateDetail(_validate, trInt);
		}
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();
		var tr=trInt;
		  //物料类型 自动联想 最大10条数据
		$("input[name='safetyRules["+tr+"].materialName']").autocomplete({
			delay:500,
			focus:function(event,ui){
				 $("input[name='safetyRules["+tr+"].materialId']").val(ui.item.id);
		    	   $("input[name='safetyRules["+tr+"].materialName']").val(ui.item.value);
		    	   $("input[name='safetyRules["+tr+"].materialCode']").val(ui.item.code);
		    	   $("input[name='safetyRules["+tr+"].materialModel']").val(ui.item.Model);
		    	   $("input[name='safetyRules["+tr+"].materialTypeId']").val(ui.item.TypeId);
		    	   $("input[name='safetyRules["+tr+"].materialTypeName']").val(ui.item.Type);
		    	   $("input[name='safetyRules["+tr+"].warehouseId']").val(ui.item.houseId);
		    	   $("input[name='safetyRules["+tr+"].warehouseName']").val(ui.item.house);
		    	   $("input[name='safetyRules["+tr+"].unit']").val(ui.item.unit);
				
				//$("input[name='safetyRules["+tr+"].materialName']").val(ui.item.value);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    	   	$("input[name='safetyRules["+tr+"].materialId']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].materialName']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].materialCode']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].materialModel']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].materialTypeId']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].materialTypeName']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].warehouseId']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].warehouseName']").val(null);
	    	   	$("input[name='safetyRules["+tr+"].unit']").val(null);
	    	    $("select[name='safetyRules["+tr+"].expiryDayNum']").html("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='safetyRules["+tr+"].materialId']").val(ui.item.id);
	    	   $("input[name='safetyRules["+tr+"].materialName']").val(ui.item.value);
	    	   $("input[name='safetyRules["+tr+"].materialCode']").val(ui.item.code);
	    	   $("input[name='safetyRules["+tr+"].materialModel']").val(ui.item.Model);
	    	   $("input[name='safetyRules["+tr+"].materialTypeId']").val(ui.item.TypeId);
	    	   $("input[name='safetyRules["+tr+"].materialTypeName']").val(ui.item.Type);
	    	   $("input[name='safetyRules["+tr+"].warehouseId']").val(ui.item.houseId);
	    	   $("input[name='safetyRules["+tr+"].warehouseName']").val(ui.item.house);
	    	   $("input[name='safetyRules["+tr+"].unit']").val(ui.item.unit);
	    	   if(ui.item.isV==1){
	    		   $("select[name='safetyRules["+tr+"].expiryDayNum']").append("<option value='30'>提前30天</option><option value='60'>提前60天</option><option value='90'>提前90天</option>");
	    	   }else{
	    		   $("select[name='safetyRules["+tr+"].expiryDayNum']").html("");
	    	   }
	    	   $("input[name='safetyRules["+tr+"].materialName']").valid();
	    	   $("input[name='safetyRules["+tr+"].materialCode']").valid();
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
	                           house:item.houseName,
	                           houseId:item.warehouseId,
	                           Type:item.materialType,
	                           TypeId:item.materialTypeId,
	                           unit:item.useUnit,
	                           id:item.materialId,
	                           isV:item.isValidity
	                       };
	                   }));
	           });
	       }
	    });
		 $("input[name='safetyRules["+tr+"].materialCode']").autocomplete({
			 delay:500,
				change:function(event,ui){
					   if(!ui.item){
							$("input[name='safetyRules["+tr+"].materialId']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].materialName']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].materialCode']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].materialModel']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].materialTypeId']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].materialTypeName']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].warehouseId']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].warehouseName']").val(null);
				    	   	$("input[name='safetyRules["+tr+"].unit']").val(null);
				    	   	$("select[name='safetyRules["+tr+"].expiryDayNum']").html("");
					   }},
			focus:function(event,ui){
				   $("input[name='safetyRules["+tr+"].materialId']").val(ui.item.id);
		    	   $("input[name='safetyRules["+tr+"].materialName']").val(ui.item.name);
		    	   $("input[name='safetyRules["+tr+"].materialCode']").val(ui.item.value);
		    	   $("input[name='safetyRules["+tr+"].materialModel']").val(ui.item.Model);
		    	   $("input[name='safetyRules["+tr+"].materialTypeId']").val(ui.item.TypeId);
		    	   $("input[name='safetyRules["+tr+"].materialTypeName']").val(ui.item.Type);
		    	   $("input[name='safetyRules["+tr+"].warehouseId']").val(ui.item.houseId);
		    	   $("input[name='safetyRules["+tr+"].warehouseName']").val(ui.item.house);
		    	   $("input[name='safetyRules["+tr+"].unit']").val(ui.item.unit);
		    	   if(ui.item.isV==1){
		    		   $("select[name='safetyRules["+tr+"].expiryDayNum']").append("<option value='30'>提前30天</option><option value='60'>提前60天</option><option value='90'>提前90天</option>");
		    	   }else{
		    		   $("select[name='safetyRules["+tr+"].expiryDayNum']").html("");
		    	   }
		    	   $("input[name='safetyRules["+tr+"].materialName']").valid();
		    	   $("input[name='safetyRules["+tr+"].materialCode']").valid();
		    	   //$("input[name='safetyRules["+tr	+"].materialCode']").val(ui.item.value);
		    	   return false;
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='safetyRules["+tr+"].materialId']").val(ui.item.id);
	    	   $("input[name='safetyRules["+tr+"].materialName']").val(ui.item.name);
	    	   $("input[name='safetyRules["+tr+"].materialCode']").val(ui.item.value);
	    	   $("input[name='safetyRules["+tr+"].materialModel']").val(ui.item.Model);
	    	   $("input[name='safetyRules["+tr+"].materialTypeId']").val(ui.item.TypeId);
	    	   $("input[name='safetyRules["+tr+"].materialTypeName']").val(ui.item.Type);
	    	   $("input[name='safetyRules["+tr+"].warehouseId']").val(ui.item.houseId);
	    	   $("input[name='safetyRules["+tr+"].warehouseName']").val(ui.item.house);
	    	   $("input[name='safetyRules["+tr+"].unit']").val(ui.item.unit);
	    	   if(ui.item.isV==1){
	    		   $("select[name='safetyRules["+tr+"].expiryDayNum']").append("<option value='30'>提前30天</option><option value='60'>提前60天</option><option value='90'>提前90天</option>");
	    	   }else{
	    		   $("select[name='safetyRules["+tr+"].expiryDayNum']").html("");
	    	   }
	    	   $("input[name='safetyRules["+tr+"].materialName']").valid();
	    	   $("input[name='safetyRules["+tr+"].materialCode']").valid();
	    		
	       },
	       //数据来源 根据输入值 模糊匹配
	       source:function(request,response){
	           CommonUtils.getAjaxData({url:'safetyRule/queryMaterialsByName?materialCode='
	   			+ encodeURI(request.term),type:'get',async:'true'},function(data){
	                   response($.map(data,function(item){
	                       return {
	                           label:item.materialCode,//下拉框显示值
	                           value:item.materialCode,//选中后,填充到下拉框的值
	                           name:item.materialName,
	                           Model:item.model,
	                           house:item.houseName,
	                           houseId:item.warehouseId,
	                           Type:item.materialType,
	                           TypeId:item.materialTypeId,
	                           unit:item.useUnit,
	                           id:item.materialId,
	                           isV:item.isValidity
	                       };
	                   }));
	           });
	       }
	    });
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
		;
	}

	function saveRule() {
		if (!$("#addForm").valid()) {
			return;
		}
		$.ajax({
			url : "safetyRule/addSafetyRule",
			type : "POST",
			data : $("#addForm").serialize(),
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = urlPre
							+ "safetyRule/toSafetyRuleListJsp";
				}
			}
		});
	}

	module.init = init;
	module.addDetail = addDetail;
	//module.setMaterialOpton=setMaterialOpton;
	module.deleteDetail = deleteDetail;
	module.saveRule = saveRule;
	return module;
}($, window.safetyRuleAdd || {}));
$(function() {
	safetyRuleAdd.init();
});
