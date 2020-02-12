window.userGroupUpd = (function($, module) {
	function init() {
		
		initSelectData();
		bindEvent();
		//getUserMeuns();
	}
	/*function getUserMeuns() {
		$.ajax({
			type : 'POST',
			url : 'user/getUserMenus',
			cache : false,
			async : true,
			success : function(data) {
				for(var i=0;i<data.length;i++){
					if(data[i].menuId =="68" &&data[i].menuLimited=="R"){
						document.getElementById("submit").style.display = "none";
					}
				}
			}
		});
	}*/
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		groupCodeOld = document.getElementById("groupCode").value;
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
				url : "userGroup/userGroupIsExist?groupCode=" + value+"&groupCodeOld="+groupCodeOld,
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
	 * 初始化已选数据
	 */
	function initSelectData() {
		usergroups;
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++) {
			for (var j = 0; j < usergroups.length; j++) {
				// 设置选中框
				if (inputs[i].id.split("_")[1] == usergroups[j].menuId
						&& inputs[i].id[inputs[i].id.length - 1] != "L") {
					inputs[i].checked = true;
				}
				// 设置Hidden值
				if (inputs[i].id.split("_")[1] == usergroups[j].menuId
						&& usergroups[j].menuLimited != ""
						&& usergroups[j].menuLimited != undefined) {
					if (usergroups[j].menuLimited == "W") {
						inputs[i].value = usergroups[j].menuLimited;
						if (!-[ 1, ]) {
							if (inputs[i].id.split("_")[0] != "S") {
								if(inputs[i].type!="hidden"){
								inputs[i].nextSibling.style.backgroundColor = 'red';
								inputs[i].nextSibling.style.padding = '2px';
								inputs[i].nextSibling.style.color = 'white';
								}
							}
						} else {
							if (inputs[i].id.split("_")[0] != "S") {
								if (inputs[i].nextElementSibling.id != null) {
									inputs[i].nextElementSibling.style.backgroundColor = 'red';
									inputs[i].nextElementSibling.style.padding = '2px';
									inputs[i].nextElementSibling.style.color = 'white';
								}
							}
						}
					} else if (usergroups[j].menuLimited == "R") {
						inputs[i].value = usergroups[j].menuLimited;
						if (!-[ 1, ]) {
							if(inputs[i].type!="hidden"){
								inputs[i].nextSibling.style.backgroundColor = 'green';
								inputs[i].nextSibling.style.padding = '2px';
								inputs[i].nextSibling.style.color = 'white';
							}
						} else {
							if (inputs[i].nextElementSibling.id != null) {
								inputs[i].nextElementSibling.style.backgroundColor = 'green';
								inputs[i].nextElementSibling.style.padding = '2px';
								inputs[i].nextElementSibling.style.color = 'white';
							}
						}
					}
				}
			}
		}
	}
	/**
	 * 获取修改项
	 */
	function getAllHasChange() {
		var groupIds = "";
		for (var i = 0; i < usergroups.length; i++) {
			groupIds += usergroups[i].groupId + ";";
		}
		return groupIds;
	}

	/**
	 * 获取选择框的值
	 */
	function getAllValue() {
		var inputs = document.getElementsByTagName("input");
		groupCode = "";
		var groupName = "";
		var fatherGroup =  "";
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
			tagThrees_v : tagThrees_v,
			changeIds : getAllHasChange()
		};
		return data;
	}
	function submit() {
		if(groupCode== "1000000001"
			|| groupCode == "1000000002"
				|| groupCode == "1000000003"
				|| groupCode == "1000000004"
				|| groupCode == "1000000005"
				|| groupCode == "1000000006"
				|| groupCode == "1000000007"
				|| groupCode == "1000000008"
				|| groupCode == "1000000009"){
			alert("被限制的用户组，无法进行修改")
			return
		}
		else{
			$.ajax({
				url : "userGroup/" + groupCode.value + "/update",
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
	}
	module.submit = submit;
	module.init = init;
	return module;
}($, window.userGroupUpd || {}));
$(function() {
	userGroupUpd.init();
});