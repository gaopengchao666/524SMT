window.userGroupAdd = (function($, module) {
	function init() {
		bindEvent();
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
			if ($.trim(value) == "" || value == null) {
				return false;
			} else {
				return true;
			}
		}, "");
		// 不重复验证
		$.validator.addMethod("userGroupIsExist", function(value, element) {
			var flag = 1;
			$.ajax({
				type : "GET",
				url : "userGroup/userGroupIsExist?groupCode=" + value+"&groupCodeOld=",
				async : false,
				success : function(data) {
					if (data == "nothave") {
						flag = 1;
					}
					if (data == "have") {
						flag = 0;
					}
				}
			});
			if (flag == 0) {
				return false;
			} else {
				return true;
			}
		}, "");
		//组织机构编码不能0开头
		$.validator.addMethod("zeroSt", function(value, element) {
			if(value.indexOf("0")==0||value.indexOf("0")=="0"){
				return false;
			}else{
				return true;
			}
		}, "");
		_validate = $("#addFrom").validate({
			rules : {
				'groupCode' : {
					userGroupIsExist:true,
					required : true,
					isNull : true,
					number : true,
					maxlength : 255,
					zeroSt:true
				},
				'groupName' : {
					required : true,
					isNull : true,
					maxlength : 255
				}
			},
			messages : {
				'groupCode' : {
					userGroupIsExist:"用户组编码重复",
					required : "编码不能为空",
					isNull : "编码不能为空",
					number : "必须为数字",
					maxlength : "长度不超过255",
					zeroSt:"不能以0开头"
				},
				'groupName' : {
					required : "用户组名不能为空",
					isNull : "用户组名不能为空",
					maxlength : "长度不超过255"
				}
			}
		});
	}
	/**
	 * 获取选择框的值
	 */
	function getAllValue() {
		var inputs = document.getElementsByTagName("input");
		var fatherGroup =  "";
		var groupCode = "";
		var groupName = "";
		var userGroupDesc = "";
		var tagTwos = "";// 二级权限，页签级别
		var tagThrees_h = "";// 三级权限，页面读写权限
		var tagThrees_v = "";// 三级权限，页面读写权限
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].id[0] == "S") {
				if (inputs[i].checked) {
					tagTwos += inputs[i].id + ";";
				}
			} else if (inputs[i].id[0] == "T"
					&& inputs[i].id[inputs[i].id.length - 1] != "L") {
				if (inputs[i].checked) {
					var value = document.getElementById(inputs[i].id + "_L").value
					tagThrees_h += inputs[i].id + "=" + value + ";";
				}
			} else if (inputs[i].id[inputs[i].id.length - 1] == "L") {
				if (inputs[i].value != "") {
					tagThrees_v += inputs[i].value + ";";
				}
			} else if (inputs[i].id == "groupCode") {
				groupCode = inputs[i].value;
			} else if (inputs[i].id == "groupName") {
				groupName = inputs[i].value;
			} else if (inputs[i].id == "userGroupDesc") {
				userGroupDesc = inputs[i].value;
			} 
		}
		userGroupDesc = document.getElementById("userGroupDesc").value;
		fatherGroup = document.getElementById("fatherGroup").value;
		var data = {
			groupCode : groupCode,
			groupName : groupName,
			fatherGroup :fatherGroup,
			userGroupDesc : userGroupDesc,
			tagTwos : tagTwos,
			tagThrees_h : tagThrees_h,
			tagThrees_v : tagThrees_v
		};
		return data;
	}
	function submit() {
		if (!$("#addFrom").valid()) {
			return;
		}
		if ($("input[type='checkbox']:checked").length == 0) {

			alert("菜单选项不可以为空，请勾选菜单");
			return;
		}
		$.ajax({
			url : "userGroup/add",
			type : "POST",
			data : JSON.stringify(getAllValue()),
			contentType : "application/json;charset=utf-8",
			cache : false,
			success : function(data) {
				if (data == "success") {
					window.location.href = "/userGroup/userGroupLists";
				}
			}
		});
	}
	module.submit = submit;
	module.init = init;
	return module;
}($, window.userGroupAdd || {}));
$(function() {
	userGroupAdd.init();
});