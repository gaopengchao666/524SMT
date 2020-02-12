window.inventorySupplyAdd = (function($, module) {
	_requestApplyForm = $("#addForm");
	_validate = null;
	var r = /^[1-9]+\d*$/;
	trInt=0;
	/**
	 * 初始化
	 */
	function init() {
		$("input[name='billCode']").val(autoBillCode());
		$("input[name='applyDateStr']").val(autoDate());
		bindEvent();
		query();
	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$.validator.addMethod("isIntLtZero", function(value, element) {
			return r.test(value);
		}, "整数必须大于0");
		//物料编码重复
		$.validator.addMethod("materialCodeMore", function(value, element) {
			var flag2 = 1;
			var ruleNames =  $("input[name$='.materialCode']");
			for(var i=0;i<ruleNames.length;i++){
				if(element.name != ruleNames[i].name &&ruleNames[i].value == value){
					flag2 = 0;
				}
			}
			if(flag2==1){
				return true;
			}else{
				return false;
			}
		}, "物料编码重复");
		_validate = _requestApplyForm.validate({
			rules : {
				'billCode' : {
					required : true,
					maxlength : 255
				},
				'creator' : {
					required : true,
					maxlength : 255
				},
				'requestPosition' : {
					required : true,
					maxlength : 255
				},
				'requestDateStr' : {
					required : true,
					maxlength : 255
				}
			},
			messages : {
				'billCode' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'creator' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'requestPosition' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				},
				'requestDateStr' : {
					required : "不能为空",
					maxlength : "长度不超过255"
				}
			}
		});
		validateDetail(_validate, 0);
	}
//查询安全库存补料
	function query() {
				$.ajax({
					url : "inventorySupply/getMaterialSupplyInfo",
					type : "GET",
					datatype : "json",
					cache : false,
					success : function(data) {
						showSupplyList(data);
					}
				});
			}
	// 显示安全库存补料详情
	function showSupplyList(data) {
		_CheckTab = $("#tablelist");
		_CheckTab.html("");
		$
				.each(
						data,
						function(item, obj) {
							trInt = $("#tablelist").find("tr").length;
							var dom = "";
							dom += "<tr class='contentText list_list'>";
							dom += "<td class='checkBox2item'><input type='checkbox' class='input_checkBox' ></td>";
							dom += "<td >" + (trInt+1) + "</td>";
							dom += "<td class='addRemind'><input type='text' name='inventorySupplyDetails["
									+ trInt
									+ "].materialCode'  value='"
									+ obj.materialCode + "'  readonly='readonly'></td>";
							dom += "<td class='addRemind'><input type='hidden' name='inventorySupplyDetails["
									+ trInt
									+ "].materialId' value='"
									+ obj.materialId + "'><input type='text' name='inventorySupplyDetails["
									+ trInt
									+ "].materialName' value='"
									+ obj.materialName + "' readonly='readonly'></td>";
							dom += "<td><input type='text' name='inventorySupplyDetails["
								+ trInt
								+ "].materialType' value='"
								+ obj.materialType + "' readonly='readonly'></td>";
							dom += "<td><input type='text' name='inventorySupplyDetails["
									+ trInt
									+ "].materialModel' value='"
									+ obj.materialModel + "' readonly='readonly'></td>";
							dom += "<td class='addRemind'><input type='text' name='inventorySupplyDetails["
									+ trInt
									+ "].requestQuantity' value=''></td>";
							dom += "<td><input type='text' name='inventorySupplyDetails["
									+ trInt
									+ "].unit' value='"
									+ obj.unit
									+ "' readonly='readonly'><input type='hidden' name='inventorySupplyDetails["
									+ trInt
									+ "].flag' value='1' readonly='readonly'></td>";
							dom += "</tr>";
							_CheckTab.append(dom);
							validateDetail(_validate, trInt);
						});
		
	}
	// -------- 增加明细 ---------
	function addDetail() {
		trInt = $("#tablelist").find("tr").length;
		var dom = "";
		dom += "<tr class='contentText list_list'>";
		dom += "<td class='checkBox2item'><input type='checkbox' class='input_checkBox' ></td>";
		dom += "<td >" + (trInt+1) + "</td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='inventorySupplyDetails["
				+ trInt
				+ "].materialCode' value=''></div></td>";// onchange='inventorySupplyAdd.complement(value,"+trInt+" )'
		dom += "<td><div  class='addRemind1'><input type='hidden'  name='inventorySupplyDetails["
				+ trInt + "].materialId' value=''><input type='text'  name='inventorySupplyDetails["
				+ trInt + "].materialName' value=''></div></td>";//readonly='readonly'
		dom += "<td><input type='text'  name='inventorySupplyDetails["
				+ trInt + "].materialType' value=''  readonly='readonly'></td>";
		dom += "<td><input type='text'  name='inventorySupplyDetails["
			+ trInt + "].materialModel' value=''  readonly='readonly'></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='inventorySupplyDetails[" + trInt
				+ "].requestQuantity' value='' onchange='inventorySupplyAdd.quzheng(value,"+trInt+" )'></div></td>";
		dom += "<td><input type='text' name='inventorySupplyDetails["
				+ trInt + "].unit' value='' readonly='readonly'><input type='hidden'  name='scaling"
				+ trInt + "' value=''></td>";
		dom += "</tr>";
		$("#tablelist").append(dom);

		// 入库单明细增加校验
		validateDetail(_validate, trInt);
		
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
		var tr=trInt;
		  //物料类型 自动联想 最大10条数据
		$("input[name='inventorySupplyDetails["+tr+"].materialName']").autocomplete({
			delay:500,
			focus:function(event,ui){
				 $("input[name='inventorySupplyDetails["+tr+"].materialId']").val(ui.item.id);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").val(ui.item.value);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").val(ui.item.code);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialModel']").val(ui.item.Model);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialType']").val(ui.item.Type);
		    	   $("input[name='inventorySupplyDetails["+tr+"].unit']").val(ui.item.unit);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").valid();
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").valid();
		    	   return false;
		       },
		   // 改变后清空
	       change:function(event,ui){
	    	   if(!ui.item){
	    	   	$("input[name='inventorySupplyDetails["+tr+"].materialId']").val(null);
	    	   	$("input[name='inventorySupplyDetails["+tr+"].materialName']").val(null);
	    	   	$("input[name='inventorySupplyDetails["+tr+"].materialCode']").val(null);
	    	   	$("input[name='inventorySupplyDetails["+tr+"].materialModel']").val(null);
	    	   	$("input[name='inventorySupplyDetails["+tr+"].materialType']").val(null);
	    	   	$("input[name='inventorySupplyDetails["+tr+"].unit']").val(null);
	    	   }
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialId']").val(ui.item.id);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").val(ui.item.value);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").val(ui.item.code);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialModel']").val(ui.item.Model);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialType']").val(ui.item.Type);
	    	   $("input[name='inventorySupplyDetails["+tr+"].unit']").val(ui.item.unit);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").valid();
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").valid();
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
	                           Type:item.materialType,
	                           unit:item.useUnit,
	                           id:item.materialId
	                       };
	                   }));
	           });
	       }
	    });
		 $("input[name='inventorySupplyDetails["+tr+"].materialCode']").autocomplete({
			 delay:500,
				change:function(event,ui){
					   if(!ui.item){
						   	$("input[name='inventorySupplyDetails["+tr+"].materialId']").val(null);
				    	   	$("input[name='inventorySupplyDetails["+tr+"].materialName']").val(null);
				    	   	$("input[name='inventorySupplyDetails["+tr+"].materialCode']").val(null);
				    	   	$("input[name='inventorySupplyDetails["+tr+"].materialModel']").val(null);
				    	   	$("input[name='inventorySupplyDetails["+tr+"].materialType']").val(null);
				    	   	$("input[name='inventorySupplyDetails["+tr+"].unit']").val(null);
					   }},
			focus:function(event,ui){
				$("input[name='inventorySupplyDetails["+tr+"].materialId']").val(ui.item.id);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").val(ui.item.name);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").val(ui.item.value);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialModel']").val(ui.item.Model);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialType']").val(ui.item.Type);
		    	   $("input[name='inventorySupplyDetails["+tr+"].unit']").val(ui.item.unit);
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").valid();
		    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").valid();
		    	   return false;
		       },
	       //选择后将 id赋值给隐藏域
	       select:function(event,ui){
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialId']").val(ui.item.id);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").val(ui.item.name);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").val(ui.item.value);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialModel']").val(ui.item.Model);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialType']").val(ui.item.Type);
	    	   $("input[name='inventorySupplyDetails["+tr+"].unit']").val(ui.item.unit);
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialName']").valid();
	    	   $("input[name='inventorySupplyDetails["+tr+"].materialCode']").valid();
	    		
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
	                           Type:item.materialType,
	                           unit:item.useUnit,
	                           id:item.materialId
	                       };
	                   }));
	           });
	       }
	    });
	}
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		//
		var materialCode = "inventorySupplyDetails[" + len+ "].materialCode";
		var materialName = "inventorySupplyDetails[" + len+ "].materialName";
		var requestQuantity = "inventorySupplyDetails[" + len+ "].requestQuantity";
		var rules = {};
		rules[materialCode] = {
			required : true,
			materialCodeMore : true
		};
		rules[materialName] = {
				required : true
			};
		
		rules[requestQuantity] = {
			required : true,
			isIntLtZero:true
		};
		
		$.extend(validate.settings.rules, rules);

		var message = {};
		message[materialCode] = {
			required : "物料编码不能为空",
			materialCodeMore : "物料编码重复"
		};
		message[materialName] = {
				required : "没有物料"
		};
		message[requestQuantity] = {
			required : "请求数量不可以为空",
			isIntLtZero:"请输入正整数"
		};
		$.extend(validate.settings.messages, message);
		//
	}
	// -------- 删除明细 ---------
	function deleteDetail() {
		var checks = $("input[type='checkbox']:checked");
		if (checks.length == 0) {
			$("#tablelist").find("tr:last").remove();
		} else {
			$.each(checks, function(item, obj) {
				$(obj).parent().parent().remove();
			});
		}
	}
	// -------- 保存 ---------
	function save() {
		if (!_requestApplyForm.valid()) {
			return;
		}
		$("#loader").show();
		// 校验详细
		$.ajax({
					url : "inventorySupply/addInventorySupply",
					type : "POST",
					data : $("#addForm").serialize(),
					async : false,
					cache : false,
					success : function(data) {
						$("#loader").hide();
						if (data == "success") {
						    //更新待办事项状态
					        self.parent.menuFrame.updateWorkBeach();
							window.location.href = urlPre+"inventorySupply/toInventorySupplyListJsp";
						}
					}
				});
		}
	//填写数量自动向上补全包装单位数量
	function quzheng(q,tr){
		var scaling=$("input[name='scaling" + tr+ "']").val();
		if(r.test(q)){
			$("input[name='scaling" + tr+ "']").val(Math.ceil(q/scaling));
		}
	}
	//生产单号
	function autoBillCode(){
        var unixtimestamp = new Date();
        var year = unixtimestamp.getFullYear();
        var month = "0" + (unixtimestamp.getMonth() + 1);
        var date = "0" + unixtimestamp.getDate();
        var hour = "0" + unixtimestamp.getHours();
        var minute = "0" + unixtimestamp.getMinutes();
        var second = "0" + unixtimestamp.getSeconds();
        var milliseconds="00"+unixtimestamp.getMilliseconds();
        return "AQKC"+ year +  month.substring(month.length-2, month.length)   + date.substring(date.length-2, date.length)
             + hour.substring(hour.length-2, hour.length) 
            + minute.substring(minute.length-2, minute.length) 	
            + second.substring(second.length-2, second.length)
            + milliseconds.substring(milliseconds.length-3, milliseconds.length);
	}
	function autoDate(){
        var unixtimestamp = new Date();
        var year = unixtimestamp.getFullYear();
        var month = "0" + (unixtimestamp.getMonth() + 1);
        var date = "0" + unixtimestamp.getDate();
        return year  +"-"+  month.substring(month.length-2, month.length) +"-"  + date.substring(date.length-2, date.length);
	};
	module.init = init;
	module.deleteDetail = deleteDetail;
	module.addDetail = addDetail;
	module.save = save;
	module.quzheng = quzheng;
	return module;
}($, window.inventorySupplyAdd || {}));
$(function() {
	inventorySupplyAdd.init();
});
