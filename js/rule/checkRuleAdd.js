window.checkRuleAdd = (function($, module) {

	warehouseList = null;
	listCheckPeople = null;
	listAuditPeople = null;
	_validate = null;
	trInt = 0;// 记录行
	function init() {
		queryWarehouse();
		getCheckPeople();
		getAuditPeople();
		addDetail();
		bindEvent();
	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$.validator.addMethod("ruleNameIsExist", function(value, element) {
			$.ajaxSetup({cache : false});
			value = encodeURI(encodeURI(jQuery.trim(value)));
			var flag1 = 1;
			var flag2 = 1;
			$.ajax({
				type : "GET",
				url : "checkRule/ruleNameIsExist?ruleName=" + value,
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
		$.validator.addMethod("houseIsExist", function(value, element) {
			$.ajaxSetup({cache : false});
			value = encodeURI(encodeURI(value));
			var flag1 = 1;
			var flag2 = 1;
			$.ajax({
				type : "GET",
				url : "checkRule/houseIsExist?checkWarehouseId=" + value,
				async : false,
				cache : false,
				success : function(data) {
					if (data == "has") {
						flag1 = 0;
					}
				}
			});
			var ruleNames = $("select[name$='.checkWarehouseId']");
			for (var i = 0; i < ruleNames.length; i++) {
				if (element.name != ruleNames[i].name
						&& ruleNames[i].value == value) {
					flag2 = 0;
				}
			}
			if (flag1 == 1 && flag2 == 1) {
				return true;
			} else {
				return false;
			}
		}, "");
		_validate = $("#addForm").validate({
			rules : {
				'checkRules[0].ruleName' : {
					required : true,
					maxlength : 255,
					ruleNameIsExist : true
				},
				'checkRules[0].checkWarehouseId' : {
					required : true,
					houseIsExist : true
				},
				'checkRules[0].checkPeople' : {
					required : true
				},
				'checkRules[0].auditPeople' : {
					required : true
				}
			},
			messages : {
				'checkRules[0].ruleName' : {
					required : "名称不能为空",
					maxlength : "长度不超过255",
					ruleNameIsExist : "名称不能重复"
				},
				'checkRules[0].checkWarehouseId' : {
					required : "仓库不为空",
					houseIsExist : "仓库不能重复"
				},
				'checkRules[0].checkPeople' : {
					required : "盘点人不为空"
				},
				'checkRules[0].auditPeople' : {
					required : "审核人不为空"
				}
			}
		});
	}
	// 追加校验
	function validateDetail(validate, len) {
		if (typeof len != 'number') {
			return;
		}
		var ruleName = "checkRules[" + len + "].ruleName";
		var warehouseId = "checkRules[" + len + "].checkWarehouseId";
		var checkPeople = "checkRules[" + len + "].checkPeople";
		var auditPeople = "checkRules[" + len + "].auditPeople";
		var rules = {};
		rules[ruleName] = {
			required : true,
			maxlength : 255,
			ruleNameIsExist : true
		};
		rules[warehouseId] = {
			required : true,
			houseIsExist : true
		};
		rules[checkPeople] = {
			required : true
		};
		rules[auditPeople] = {
			required : true
		};
		$.extend(validate.settings.rules, rules);
		var messages = {};
		messages[ruleName] = {
				required : "名称不能为空",
				maxlength : "长度不超过100",
				ruleNameIsExist : "名称不能重复"
		};
		messages[warehouseId] = {
			required : "仓库不能为空",
			houseIsExist : "仓库不能重复"

		};
		messages[checkPeople] = {
			required : "盘点人不能为空"

		};
		messages[auditPeople] = {
			required : "审核人不能为空"

		};

		$.extend(validate.settings.messages, messages);
	}
	function queryWarehouse() {
		$.ajax({
			url : "warehouse/queryAllWarehouseList",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				warehouseList = data;
			}

		});
	}
	// 查询盘点人
	function getCheckPeople() {
		$.ajax({
			url : "checkRule/getAllCheckPeople",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				listCheckPeople = data;
			}
		});
	}
	// 查询审核人
	function getAuditPeople() {
		$.ajax({
			url : "checkRule/getAllAuditPeople",
			type : "GET",
			datatype : "json",
			cache : false,
			async : false,
			success : function(data) {
				listAuditPeople = data;
			}
		});
	}
	// 添加select中仓库;
	function warehouseOption() {
		var appendoption = '';
		$.each(warehouseList, function(item, obj) {
			appendoption += "<option value ='" + obj.warehouseId + "'>"
					+ obj.houseName + "</option>";
		});
		return appendoption;
	}
	// 添加select中盘点人
	function checkPeopleOption() {
		var appendoption = '';
		$.each(listCheckPeople, function(item, obj) {
			appendoption += "<option value ='" + obj + "'>"
					+ obj + "</option>";
		});
		return appendoption;
	}
	// 添加select中的审批人
	function AuditPeopleOption() {
		var appendoption = '';
		$.each(listAuditPeople, function(item, obj) {
			appendoption += "<option value ='" + obj + "'>"
					+ obj + "</option>";
		});
		return appendoption;
	}
	function addDetail() {

		var dom = "<tr class='contentText list_list'>";
		dom += "<td><input type='checkbox'  class='input_checkBox'></td>";
		dom += "<td><div  class='addRemind1'><input type='text' name='checkRules[" + trInt
				+ "].ruleName' value=''/></div></td>";
		dom += "<td><div  class='addRemind1'><select name='checkRules[" + trInt
				+ "].checkWarehouseId'><option value=''>选择仓库</option><option value='0'>全部仓库</option>"
				+ warehouseOption() + "</select></div></td>";

		dom += "<td><div  class='addRemind1'><select name='checkRules["
				+ trInt
				+ "].checkRule'><option value='月度'>按月盘点</option><option value='季度'>按季盘点</option><option value='年度'>按年盘点</option></select></div></td>";

		dom += "<td><input type='text' name='checkRules[" + trInt
				+ "].createTimeStr' value='"+autoDate()+"' readonly='readonly'/></td>";
		dom += "<td><div  class='addRemind1'><select name='checkRules[" + trInt + "].checkPeople'>"
				+"<option value=''>选择盘点人</option><option value='库管员'>库管员</option>"
				+ checkPeopleOption() + "</select></div></td>";
		dom += "<td><div  class='addRemind1'><select name='checkRules[" + trInt + "].auditPeople'>"
				+"<option value=''>选择审核人</option><option value='车间主管'>车间主管</option>"
				+ AuditPeopleOption() + "</select></div></td></tr>";
		$("#addTr").append(dom);
		if (trInt != 0) {
			validateDetail(_validate, trInt);
		}
		trInt++;
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();

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

	function saveRule() {
		if (!$("#addForm").valid()) {
			return;
		}
		$.ajax({
			url : "checkRule/addCheckRule",
			type : "POST",
			data : $("#addForm").serialize(),
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = "/checkRule/toCheckRuleListJsp";
				}
			}
		});
	}
	function autoDate(){
        var unixtimestamp = new Date();
        var year = unixtimestamp.getFullYear();
        var month = "0" + (unixtimestamp.getMonth() + 1);
        var date = "0" + unixtimestamp.getDate();
        return year  +"-"+  month.substring(month.length-2, month.length) +"-"  + date.substring(date.length-2, date.length);
	};
	module.init = init;
	module.saveRule = saveRule;
	module.addDetail = addDetail;
	module.deleteDetail = deleteDetail
	return module;
}($, window.checkRuleAdd || {}));
$(function() {
	checkRuleAdd.init();
});