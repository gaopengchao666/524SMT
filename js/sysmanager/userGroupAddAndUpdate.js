//增加用户组时，对于用户组编码的校验
function checkregisteredUserGroupCode()
{
	var groupCode = document.getElementById("groupCode").value;
	if(groupCode == "")
	{
		directController.checkregisteredUserGroupCode(" " , showUserGroupCodeMessage);
	}else
	{
		directController.checkregisteredUserGroupCode(groupCode,showUserGroupCodeMessage);
	}
}

//校验用户组编码的回调函数
function showUserGroupCodeMessage(data)
{
	if(data == "你输入的用户组编码为空")
	{
		document.getElementById("groupCode").focus();
	}else if(data == "用户组的编码格式不正确（4到8位数字）")
	{
		document.getElementById("groupCode").focus();
	}
	var checkUserGroup =  document.getElementById("checkUserGroup"); 
	checkUserGroup.innerText = data;
	checkUserGroup.style.color = "red";
}


//更新用户组时，对于用户组编码的校验
function checkregisteredUpdateUserGroupCode()
{
	var groupId = document.getElementById("groupId").value;
	var groupCode = document.getElementById("groupCode").value;
	var groupData = [groupCode,groupId];
	if(groupCode == "")
	{
		var groupData = [" ",groupId];
		directController.checkregisteredUpdateUserGroupCode(groupData, showUpdateUserGroupCodeMessage);
	}else
	{
		directController.checkregisteredUpdateUserGroupCode(groupData,showUpdateUserGroupCodeMessage);
	}
}

//更新用户组编码的回调函数
function showUpdateUserGroupCodeMessage(data)
{
	if(data == "你输入的用户组编码为空")
	{
		document.getElementById("groupCode").focus();
	}else if(data == "用户组的编码格式不正确（4到8位数字）")
	{
		document.getElementById("groupCode").focus();
	}
	var checkUserGroup =  document.getElementById("checkUserGroup"); 
	checkUserGroup.innerText = data;
	checkUserGroup.style.color = "red";
}

//添加用户组名称的校验
function checkregisteredUserGroupName()
{
	var groupName = document.getElementById("groupName").value;
	if(groupName == "")
	{
		directController.checkregisteredUserGroupName(" " , showUserGroupNameMessage);
	}
	else
	{
		directController.checkregisteredUserGroupName(groupName,showUserGroupNameMessage);
	}
}

//添加用户组名称的校验回调方法
function showUserGroupNameMessage(data)
{
	var checkGroupName =  document.getElementById("checkGroupName"); 
	checkGroupName.innerText = data;
	checkGroupName.style.color = "red";
}


//更新用户组名称的校验
function checkregisteredUpdateUserGroupName()
{
	var groupId = $("#groupId").val();
	if (!groupId) {
		checkregisteredUserGroupName();
	} else {
		var groupName = $("#groupName").val();
		var groupData = [ groupName, groupId ];
		if (groupName == "") {
			var groupData = [" ",groupId];
			directController.checkregisteredUpdateUserGroupName(groupData, showUpdateUserGroupNameMessage);
		}
		else
		{
			directController.checkregisteredUpdateUserGroupName(groupData,showUpdateUserGroupNameMessage);
		}
	}
}


//更新用户组名称的校验的回调函数
function showUpdateUserGroupNameMessage(data)
{
	var checkGroupName =  document.getElementById("checkGroupName"); 
	checkGroupName.innerText = data;
	checkGroupName.style.color = "red";
}


//批量删除用户组的删除选择的项
function deleteUserGroupSelect()
{

	var ids = document.getElementsByName("ids");
	var idss = [];
			
	for (var i = 0; i < ids.length; i++) {	
		if(ids[i].checked){
			idss[i] = ids[i].value;
		}	
	}
	if(idss.length != 0)
	{
		directController.deleteUserGroupSelect(idss,returnUserGroupData);
	}
	
}
//批量删除用户组的回调函数
function returnUserGroupData(data)
{
	var returnInfo =  document.getElementById("returnUserGroupData"); 
    returnInfo.innerText = data;
    returnInfo.style.color = "red";
    window.location.reload();
	alert(data);
}

//根据用户组的名称批量删除用户组的删除选择的项
function deleteUserGroupByGroupName()
{

	var names = document.getElementsByName("names");
	var namess = [];
			
	for (var i = 0; i < names.length; i++) {	
		if(names[i].checked){
			namess[i] = names[i].value;
		}	
	}
	if(namess.length != 0)
	{
		directController.deleteUserGroupByGroupName(namess,returnUserGroupData);
	}
	
}

$(function(){
	var spans = $(".div1");
	for (var i = 0; i<spans.length; i++){
		var childs = $(spans[i]).find("span");
	    for (var j = 0; j<childs.length ;j++){
	    	childs[j].style.left = 10 + j*135 + 'px';
	    }
	}
	var spans = $("#div1").children();
	for (var i = 0; i<spans.length; i+=7){
	    for (var j = 0; j<7 ;j++){
	        spans[i+j].style.left = 10 + j*150 + 'px';
	        spans[i+j].style.top = 10 + i*4 + 'px';
	    }
	}
	
	//组织机构列表的上下级复选框之间的互相选择
	$(".input_checkBox").click(function(){
		$("#checkMenusIsNull").attr("disabled", false);
		var checkmenusisnull =  document.getElementById("checkmenusisnull"); 
		checkmenusisnull.innerText = "";
		var flag = $(this).prop("checked");
		$(this).parent().next("ul").find(".input_checkBox").prop("checked",flag);
		if (flag){
			$(this).parents("ul:first").prev().find(".input_checkBox:first").prop("checked",flag);
		}
	});
	/*$("#checkMenusIsNull").click(function(){
		if($("input[type='checkbox']:checked").length==0)
		{
			$("#checkMenusIsNull").attr("disabled", true);
			var checkmenusisnull =  document.getElementById("checkmenusisnull"); 
			checkmenusisnull.innerText = "菜单选项不可以为空，请勾选菜单";
			checkmenusisnull.style.color = "red";
		}
		if($("#groupCode").val() == "")
		{
			var checkUserGroup =  document.getElementById("checkUserGroup"); 
			checkUserGroup.innerText = "用户组编码不可以为空";
			checkUserGroup.style.color = "red";
		}
		if($("#groupName").val() == "")
		{
			var checkGroupName =  document.getElementById("checkGroupName"); 
			checkGroupName.innerText = "用户组名称不可以为空";
			checkGroupName.style.color = "red";
			return;
		}
	});*/
	
});
function checkUserGroupAddInfo() {
	var groupCode = $("#groupCode").val();
	if (!groupCode) {
		checkregisteredUserGroupCode();
		return;
	}
	var groupName = $("#groupName").val();
	if (!groupName) {
		groupName();
		return;
	}
	
	if ($("input[type='checkbox']:checked").length == 0) {

		var checkmenusisnull = $("#checkmenusisnull");
		checkmenusisnull.text("菜单选项不可以为空，请勾选菜单");
		checkmenusisnull.css("color","red");
		return;
	}
	
	if ($("#checkGroupName").text() != "" || $("#checkUserGroup").text() != "" ||$("#checkmenusisnull").text() != "" ) {
	           alert("输入有错");
	return;
    }
	$("#addFrom").submit();
}
