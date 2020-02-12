function checkOrgAddInfo() {
	//这个限制要根据脚本实际情况控制
	var orgId = document.getElementById("parentOrgId").value;
	if(orgId=="1"){
		alert("根级节点，限制修改");
		return
	}
	if (!$("#addFrom").valid()) {
		return;
	}
	$("#addFrom").submit();
}
$(function() {
	
	orgaCodeOld = document.getElementById("orgaCode").value;
	orgaNameOld = document.getElementById("orgaName").value;
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
	$.validator.addMethod("orgaIsExist", function(value, element) {
		var flag = 1;
		$.ajax({
			type : "GET",
			url : "organization/orgaIsExist?orgaCode=" + value+"&orgaCodeOld="+orgaCodeOld,
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
	$.validator.addMethod("orgNameIsExist",function(value,element){
		var flag = 1;
		$.ajax({
			type : "GET",
			url : "organization/orgNameIsExist?orgaName=" + encodeURI(encodeURI(value))+"&orgaNameOld="+encodeURI(encodeURI(orgaNameOld)),
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
	},"");
	//组织机构编码不能0开头
	$.validator.addMethod("zeroSt", function(value, element) {
		if(value.indexOf("0")==0||value.indexOf("0")=="0"){
			return false;
		}else{
			return true;
		}
	}, "");
	/*$.ajax({
		type : 'POST',
		url : 'user/getUserMenus',
		cache : false,
		async : true,
		success : function(data) {
			for(var i=0;i<data.length;i++){
				if(data[i].menuId =="69" &&data[i].menuLimited=="R"){
					document.getElementById("submit").style.display = "none";
				}
			}
		}
	});*/
	_validate = $("#addFrom").validate({
		rules : {
			'orgaCode' : {
				orgaIsExist:true,
				required : true,
				isNull : true,
				number : true,
				maxlength : 255,
				zeroSt:true
			},
			'orgaName' : {
				required : true,
				isNull : true,
				maxlength : 255,
				orgNameIsExist:true
			}
		},
		messages : {
			'orgaCode' : {
				orgaIsExist:"组织机构编码已存在",
				required : "编码不能为空",
				isNull : "编码不能为空",
				number : "必须为数字",
				maxlength : "长度不超过255",
				zeroSt:"不能以0开头"
			},
			'orgaName' : {
				required : "名称不能为空",
				isNull : "名称不能为空",
				maxlength : "长度不超过255",
				orgNameIsExist:"组织机构名称已存在"
			}
		}
	});
});
