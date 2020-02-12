function updUserInfo() {
	if (!$("#addFrom").valid()) {
		return;
	}
	user = userInfoPck();
	$("#submit").prop("disabled",true);
	$.ajax({
		url : "user/" + userId + "/update",
		type : "POST",
		data : JSON.stringify(user),
		contentType : "application/json;charset=utf-8",
		cache : false,
		success : function(data) {
			if (data == "success") {
				//$("#submit").porp("disabled",false);
				window.location.href = "/user/userList";
			}
		}
	});
}
/**
 * 封装用户数据，进行提交保存
 */
function userInfoPck() {
	// 获取数据
	username = $.trim(document.getElementById("username").value);
	orgName = document.getElementById("orgName").value;
	email = document.getElementById("email").value;
	hiredate = document.getElementById("hiredate").value;
	phone = document.getElementById("phone").value;
	password = document.getElementById("password").value;
	politicsT = document.getElementsByName("politics");
	photoPath = document.getElementById("photoPath").value;
	groupString = "";
	politics = "";
	for (var i = 0; i < politicsT.length; i++) {
		if (politicsT[i].checked) {
			politics = politicsT[i].value;
		}
	}
	groupNamesT = document.getElementsByName("groupNames");
	for (var i = 0; i < groupNamesT.length; i++) {
		if (groupNamesT[i].checked) {
			groupString += groupNamesT[i].value + ";";
		}
	}
	if (email == "null" || email == null) {
		email = "";
	}
	if (phone == "null" || phone == null) {
		phone = "";
	}
	user = {
		"username" : username,
		"orgName" : orgName,
		"email" : email,
		"hiredate" : hiredate,
		"phone" : phone,
		"password" : password,
		"groupStrings" : groupString,
		"politics" : politics,
		"userId" : userId,
		"photoPath" : photoPath
	}
	if(user.hiredate==""){
		user.hiredate=null;
	}
	if(user.email==""){
		user.email=null;
	}
	if(user.phone==""){
		user.phone=null;
	}
	return user;
}
$(function() {

	userNameOld = $.trim(document.getElementById("username").value);

	var spans = $(".div1");
	for (var i = 0; i < spans.length; i++) {
		var childs = $(spans[i]).find("span");
		for (var j = 0; j < childs.length; j++) {
			childs[j].style.left = 10 + j * 140 + 'px';
		}
	}
	var spans = $("#div1").children();
	for (var i = 0; i < spans.length; i += 7) {
		for (var j = 0; j < 7; j++) {
			if (spans[i + j]) {
				spans[i + j].style.left = 10 + j * 150 + 'px';
				spans[i + j].style.top = 10 + i * 4 + 'px';
			}
		}
	}
	$(".input_checkBox").click(function() {
		$("#checkmenusisnull").text("");
	});
	/*$.ajax({
		type : 'POST',
		url : 'user/getUserMenus',
		cache : false,
		async : true,
		success : function(data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].menuId == "67" && data[i].menuLimited == "R") {
					document.getElementById("submit").style.display = "none";
				}
			}
		}
	});*/
	_validate = null;
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
	/**
	 * 用于校验邮箱是否合法的方法
	 * 
	 * @param userEmail
	 */
	$.validator.addMethod("okEmail",function registeredUserEmail(value, element) {
		if(value!=""){
			var filter = /^\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/;
			if (filter.test(value)) {
				return true;
			} else {
				return false;
			}
		}else{
			return true;
		}
	}, "");

	/**
	 * 用于校验手机号码是否合法的方法
	 * 
	 * @param userEmail
	 */
	$.validator.addMethod("okPhone", function registeredUserPhone(value, element) {
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
	}, "");
	// 不重复验证
	$.validator.addMethod("userIsExist", function(value, element) {
		var flag = 1;
		$.ajax({
			type : "GET",
			url : "/user/userIsExist2?userName=" + encodeURI(encodeURI($.trim(value))) + "&userNameOld="
					+ encodeURI(encodeURI($.trim(userNameOld))),
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
	_validate = $("#addFrom").validate({
		rules : {
			'username' : {
				userIsExist : true,
				required : true,
				isNull : true,
				maxlength : 255
			},
			'password' : {
				required : true,
				isNull : true,
				maxlength : 255
			},
			'email' : {
				okEmail : true
			},
			'phone' : {
				okPhone : true
			}
		},
		messages : {
			'username' : {
				userIsExist : "用户名重复",
				required : "用户名不能为空",
				isNull : "用户名不能为空",
				maxlength : "长度不超过255"
			},
			'password' : {
				required : "请输入该用户的密码以执行修改",
				isNull : "请输入该用户的密码以执行修改",
				maxlength : "长度不超过255"
			},
			'email' : {
				okEmail:"邮箱格式不正确"
			},
			'phone' : {
				okPhone:"电话号码格式不正确"
			}
		}
	});

});
