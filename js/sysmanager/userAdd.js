window.userAdd = (function($, module) {
	_validate = null;
	trInt = 0;// 记录行
	username = null;
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
		},"");

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
		// 不重复验证
		$.validator.addMethod("userIsExist", function(value, element) {
			value = encodeURI(encodeURI($.trim(value)));;
			var flag = 1;
			$.ajax({
				type : "GET",
				url : "user/userIsExist?userName=" + value,
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
				'userName' : {
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
					okEmail:true
				},
				'phone' : {
					okPhone:true
				},
				'groupNames' : {
					required : true
				},
				'photoPath' :{
					required : true
				}
			},
			messages : {
				'userName' : {
					userIsExist : "用户名重复",
					required : "用户名不能为空",
					isNull : "用户名不能为空",
					maxlength : "长度不超过255"
				},
				'password' : {
					required : "密码不能为空"
				},
				'email' : {
					okEmail:"邮箱格式不正确"
				},
				'phone' : {
					okPhone:"电话号码格式不正确"
				},
				'groupNames' : {
					required : "请选择用户组"
				},
				'photoPath' :{
					required : "请上传照片"
				}
			},
			errorPlacement:function(error,element){
				if(element.is(":radio")){
					error.appendTo(element.parents(".containerx"));
				}else{
					error.insertAfter(element);
				}
			}
		});
	}
	function saveUser() {

		if (!$("#addFrom").valid()) {
			return;
		}

		user = userInfoPck();
		$("#submit").prop("disabled",true);
		$.ajax({
			url : "user/addd",
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
		username = $.trim(document.getElementById("userName").value);
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
		if(email==""||email=="null"||email==null){
			email="";
		}
		if(phone==""||phone=="null"||phone==null){
			phone="";
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
			"photoPath" : photoPath
		}
		if(user.hiredate==""){
			user.hiredate=null;
		}
		return user;
	}
	module.init = init;
	module.saveUser = saveUser;
	return module;
}($, window.userAdd || {}));
$(function() {
	userAdd.init();
});
