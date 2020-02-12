window.outstockApplyAdd = (function($, module) {
	var r = /^[1-9]+\d*$/;
	function init() {
		$("#outstockOrderCode").val("CKDH" + new Date().format("yyyyMMddhhmmssSSS"));
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
		var materialCode = "outstockApplyDetails[" + len + "].materialCode";
		var materialName = "outstockApplyDetails[" + len + "].materialName";
		var materialType = "outstockApplyDetails[" + len + "].materialType";
		var materialSpec = "outstockApplyDetails[" + len + "].materialSpec";
	/*	var materialPackUnit = "outstockApplyDetails[" + len
				+ "].materialPackUnit";
		var packUnitNum = "outstockApplyDetails[" + len + "].packUnitNum";*/
		var materialUseUnit = "outstockApplyDetails[" + len
				+ "].materialUseUnit";
		var useUnitNum = "outstockApplyDetails[" + len + "].useUnitNum";
		var warehouse = "outstockApplyDetails[" + len + "].warehouse";
		/*var location = "outstockApplyDetails[" + len + "].location";*/
		var remark = "outstockApplyDetails[" + len + "].remark";
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
	/*	rules[materialPackUnit] = {
			required : true,
			maxlength : 100
		};
		rules[packUnitNum] = {
			required : true,
			isIntLtZero :true,
			number : true
		};*/
		rules[materialUseUnit] = {
			required : true,
			maxlength : 100
		};
		rules[useUnitNum] = {
			required : true,
			isIntLtZero :true,
			number : true
		};
		rules[warehouse] = {
			required : true,
			maxlength : 100
		};
		rules[remark] = {
			maxlength : 500
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
		/*message[materialPackUnit] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[packUnitNum] = {
			required : "不能为空",
			isIntLtZero :"必须为整数",
			number : "请输入数字"
		};*/
		message[materialUseUnit] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[useUnitNum] = {
			required : "不能为空",
			isIntLtZero :"必须为整数",
			number : "请输入数字"
		};
		message[warehouse] = {
			required : "不能为空",
			maxlength : "长度不超过100"
		};
		message[remark] = {
			maxlength : "长度不超过500"
		};
		$.extend(validate.settings.messages, message);
	}

	// -------- 增加明细 ---------
	function addDetail() {

		var trInt = $("#addTr").find("tr").length;
		var no = trInt + 1;// 序号
		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='checkbox' class='input_checkBox'></td>";
		dom += "<td>"+ no + "</td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='outstockApplyDetails[" + trInt
				+ "].materialCode' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' class='materialName' name='outstockApplyDetails[" + trInt
				+ "].materialName' value=''><input type='hidden' name='outstockApplyDetails["+trInt+"].unitscale' class='unitscale' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' readonly='readonly' class='materialType' name='outstockApplyDetails[" + trInt
				+ "].materialType' value=''></div></td>";
		dom += "<td><input type='text' class='materialSpec' readonly='readonly' name='outstockApplyDetails[" + trInt
				+ "].materialSpec' value=''></td>";
		/*dom += "<td><div  class='addRemind1'><input type='text' style='width:90px;'  readonly='readonly' name='outstockApplyDetails[" + trInt
				+ "].materialPackUnit' class='materialPackUnit' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text'name='outstockApplyDetails[" + trInt
				+ "].packUnitNum' style='width:90px;'  class='packUnitNum' onblur='outstockApplyAdd.unitScaling(this)' value=''></div></td>";*/
		dom += "<td><div  class='addRemind1'><input type='text' style='width:90px;' readonly='readonly' name='outstockApplyDetails[" + trInt
				+ "].materialUseUnit' class='materialUseUnit' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='outstockApplyDetails[" + trInt
				+ "].useUnitNum' style='width:90px;' class='useUnitNum' onblur='outstockApplyAdd.useUnitNumScaling(this)' value=''></div></td>";
		dom += "<td><div  class='addRemind1'><input type='text' readonly='readonly' name='outstockApplyDetails[" + trInt
				+ "].warehouse' class='warehouse' value=''></div></td>";
		/*dom += "<td class='addRemind'><input type='text' name='outstockApplyDetails[" + trInt
				+ "].location' value=''></td>";*/
		dom += "<td><input type='text' name='outstockApplyDetails[" + trInt
				+ "].remark' value=''></td>";
		dom += "</tr>";
		$("#addTr").append(dom);
		CommonUtils.ie8TrChangeColor();
		var tr=trInt;
		//物料类型 自动联想 最大10条数据
		$("input[name='outstockApplyDetails["+(tr)+"].materialCode']").autocomplete({
			delay:500,
			focus:function(event,ui){
				 $("input[name='outstockApplyDetails["+(tr)+"].materialCode']").val(ui.item.code);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialName']").val(ui.item.name);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
		    	/*   $("input[name='outstockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit);*/
		    	   $("input[name='outstockApplyDetails["+(tr)+"].warehouse']").val(ui.item.HouseName);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialType']").val(ui.item.Type);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].unitscale']").val(ui.item.code);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    		   $("input[name='outstockApplyDetails["+(tr)+"].materialCode']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialName']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialSpec']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialUseUnit']").val("");
		    	/*   $("input[name='outstockApplyDetails["+(tr)+"].materialPackUnit']").val("");*/
		    	   $("input[name='outstockApplyDetails["+(tr)+"].warehouse']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialType']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].unitscale']").val("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialCode']").val(ui.item.code);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialName']").val(ui.item.name);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
	    	   /*$("input[name='outstockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit);*/
	    	   $("input[name='outstockApplyDetails["+(tr)+"].warehouse']").val(ui.item.HouseName);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialType']").val(ui.item.Type);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].unitscale']").val(ui.item.code);
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
	                          /* materialPackUnit:item.unit,*/
	                           HouseName:item.houseName,
	                       };
	                   }));
	           });
	       }
	    });
		
		$("input[name='outstockApplyDetails["+(tr)+"].materialName']").autocomplete({
			delay:500,
			focus:function(event,ui){
				 $("input[name='outstockApplyDetails["+(tr)+"].materialCode']").val(ui.item.code);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialName']").val(ui.item.name);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
		    	   /*$("input[name='outstockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit);*/
		    	   $("input[name='outstockApplyDetails["+(tr)+"].warehouse']").val(ui.item.HouseName);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialType']").val(ui.item.Type);
		    	   $("input[name='outstockApplyDetails["+(tr)+"].unitscale']").val(ui.item.code);
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    		   $("input[name='outstockApplyDetails["+(tr)+"].materialCode']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialName']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialSpec']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialUseUnit']").val("");
		    	 /*  $("input[name='outstockApplyDetails["+(tr)+"].materialPackUnit']").val("");*/
		    	   $("input[name='outstockApplyDetails["+(tr)+"].warehouse']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].materialType']").val("");
		    	   $("input[name='outstockApplyDetails["+(tr)+"].unitscale']").val("");
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialCode']").val(ui.item.code);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialName']").val(ui.item.name);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialSpec']").val(ui.item.Model);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialUseUnit']").val(ui.item.unit);
	    	  /* $("input[name='outstockApplyDetails["+(tr)+"].materialPackUnit']").val(ui.item.materialPackUnit);*/
	    	   $("input[name='outstockApplyDetails["+(tr)+"].warehouse']").val(ui.item.HouseName);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].materialType']").val(ui.item.Type);
	    	   $("input[name='outstockApplyDetails["+(tr)+"].unitscale']").val(ui.item.code);
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
	                    /*       materialPackUnit:item.unit,*/
	                           HouseName:item.houseName,
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
	

	function autoBillCode(){
        var unixtimestamp = new Date();
        var year = unixtimestamp.getFullYear();
        var month = "0" + (unixtimestamp.getMonth() + 1);
        var date = "0" + unixtimestamp.getDate();
        var hour = "0" + unixtimestamp.getHours();
        var minute = "0" + unixtimestamp.getMinutes();
        var second = "0" + unixtimestamp.getSeconds();
        var milliseconds = unixtimestamp.getMilliseconds();
        return "CKDH"+ year +  month.substring(month.length-2, month.length)   + date.substring(date.length-2, date.length)
             + hour.substring(hour.length-2, hour.length) 
            + minute.substring(minute.length-2, minute.length) 	
            + second.substring(second.length-2, second.length) + milliseconds;
	}

	function saveOutstockApply() {
		var materialcodes = $(".tablelist").find("input[class='unitscale']");
		var list = [];
		$(materialcodes).each(function(){
			list.push($(this).val());
		});
		var obj = {};
		var arr = [];
		for(var i = 0, len = list.length;i < len; i++)
		{
			var s = list[i];
			if (obj[s]) continue;
			else {
				obj[s] = s;
				arr.push(s);
			}
		}
		if(arr.length < materialcodes.size())
		{
			alert("你输入了重复的物料，请修改");
			return;
		}
		
		// 用于验证是否有效期管理物料校验的标识
		var flag1 = '0';
		var list = [];
		// 在提交的时候，便利的查询物料是否有效期

		for (var i = 0, len = $("#addTr").find("tr").length; i < len; i++) {
			var materialCode = $("#addTr").find("tr").eq(i).find("input").eq(1)
					.val();
			var useUnitNum = $("#addTr").find("tr").eq(i).find("input").eq(
					7).val();

			
			var packnumSumUrl = "outstock/selectUseUnitNumSumByMC?materialCode="
				+materialCode ;
			CommonUtils.getAjaxData({
				url : packnumSumUrl,
				type : 'GET'
			}, function(data) {
				if(data < useUnitNum)
				{
					list.push(materialCode);
					flag1 = "1";
				}
			});
		
		}
		
		// 对重复的物料编码进行了一次去重复的操作
		var obj = {};
		var arr = [];
		for (var i = 0, len = list.length; i < len; i++) {
			var s = list[i];
			if (obj[s])
				continue;
			else {
				obj[s] = s;
				arr.push(s);
			}
		}

		if (flag1 == "1") {
			alert("物料编码为: " + arr + " 物料库存数量不足，请重新输入。");
			return;
		}
		
		var productDrawNo = $("#productDrawNo").val();
		var planNum = $("#planNum").val();
		var type = $("#outstockType").val();
		if(type == "生产领料出库" || type == "生产补料出库")
		{
			if(productDrawNo == "" || planNum =="")
			{
				alert("产品图号和计划号为必填项");
				return;
			}
		}
		
		if (!$("#addForm").valid()) {
			return;
		}
		$("#loader").show();
		$.ajax({
			url : "outstock/addOutstockApply",
			type : "POST",
			data : $("#addForm").serialize(),
			async : true,
			cache : false,
			success : function(data) {
				$("#loader").hide();
				if (data == "success") {
					window.location.href = url_Pre
							+ "/outstock/toOutstockListJSP";
				}
			}
		});
	}
	function unitScaling(unit)
	{
		var materialCode = $(unit).parent().parent().parent().find("input[class='unitscale']").val();
		var num = $(unit).val();
		var packnumSumUrl = "outstock/selectPackUnitNumSumByMC?materialCode="
			+materialCode ;
		CommonUtils.getAjaxData({
			url : packnumSumUrl,
			type : 'GET'
		}, function(data) {
			if(data < num)
			{
				alert("库存中此物料的数量不足，请重新输入");
			}
		});
		
		var unitUrl = "instock/FillInMaterialUseAndUnit?materialCode="
			+materialCode ;
		CommonUtils.getAjaxData({
			url : unitUrl,
			type : 'GET'
		}, function(data) {
			_scaling = data.scaling;
			var resultNum = num * _scaling;
			$(unit).parent().parent().parent().find("input").eq(9).val(resultNum);
		});
	}
	
	function useUnitNumScaling(useUnitNum)
	{
		var materialCode = $(useUnitNum).parent().parent().parent().find("input[class='unitscale']").val();
		var num = $(useUnitNum).val();
		var packnumSumUrl = "outstock/selectUseUnitNumSumByMC?materialCode="
			+materialCode ;
		CommonUtils.getAjaxData({
			url : packnumSumUrl,
			type : 'GET'
		}, function(data) {
			if(data < num)
			{
				alert("库存中此物料数量不足，请重新输入");
			}
		});
		
	}
	module.init = init;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail;
	module.saveOutstockApply = saveOutstockApply;
	/*module.complement = complement;*/
	module.unitScaling = unitScaling;
	module.useUnitNumScaling = useUnitNumScaling;
	return module;
}($, window.Material || {}));
$(function() {
	outstockApplyAdd.init();
});
