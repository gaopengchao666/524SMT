//function chenck() {
//	window.location.href="../../index.html";
//}
//登录按钮点击
$("#login").click(function(){
		var passWorld = $("#password").val();
		if(passWorld==""){
			$("#alertPassWord").html("密码不能为空");
			$("#alertPassWord").css("color","red");
			return;
			}

	//使用jquery表单提交
	$("#formSubmit").ajaxSubmit(function (data){
		if(data == "success"){
			window.location = "user/toIndex";
		}else{
			$("#alertPassWord").html("密码错误");
			$("#alertPassWord").css("color","red");	
		}
	});
});
$("#uname").focus(function(){
	$("#alertUserName").html("");
});
$("#password").focus(function(){
	$("#alertPassWord").html("");
});

//检测用户名是否存在
function checkUserName(){
	var userName = $("#uname").val();
	if(userName==""){
		$("#alertUserName").html("用户名不能为空");
		$("#alertUserName").css("color","red");
	}else{
		
		$.ajax({
			url : "user/userIsExsit",
			cache : false,
			data :{
				"userName" : userName
			},
			type : "GET",
			dataType : "text",
			success : function(data){
				if(data=="error"){
					$("#alertUserName").html("用户不存在");
					$("#alertUserName").css("color","red");
				}else{
					$("#alertUserName").html("");
				}
			}
			
		});
	}
}
//检测密码是否输入
function checkPassWord(){
	var passWorld = $("#password").val();
	if(passWorld==""){
		$("#alertPassWord").html("密码不能为空");
		$("#alertPassWord").css("color","red");
		}
}
//用户名输入框输入时删除用户名错误提示
function userNameChange(){
	$("#alertUserName").html("");
}
//密码输入框输入时删除密码错误提示
function passWordChange(){
	$("#alertPassWord").html("");
}
//重置按钮
$("#lReset").click(function(){
	$("#uname").val("");
	$("#password").val("");
	$("#uname")[0].focus();
});

