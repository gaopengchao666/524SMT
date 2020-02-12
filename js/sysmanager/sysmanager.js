$(function() {

	/**
	 异步查询用户列表
	 */
	/*$.ajax({
		url : "user/users",
		type : "GET",
		datatype : "json",
		success : function(User) {

			showUser(User);
			showUserPage(User);
		}
	});*/
	
	/*$.ajax({
		url : "organization/organizations",
		type : "GET",
		datatype : "json",
		success : function(Organization) {

			showOrganization(Organization);
			showOrganizationPage(Organization);
		}
	});*/
	
	/*$.ajax({
		url : "userGroup/userGroupList",
		type : "GET",
		datatype : "json",
		success : function(UserGroup) {

			showUserGroup(UserGroup);
			showUserGroupPage(UserGroup);
		}
	});*/
	
});


/*function showUser(User) {
	var _UserList = $("#userList");
	_UserList.html("");
	var datas = eval(User["userList"]);
	$.each(datas, function(item, obj) {
		var dom = "";
		dom += "<tr class='contentText list_list'>";
		dom += "<td style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"+obj.userId+"' value='"+ obj.userId +"'/></td>";
		dom += "<td><a class='handHover' href='user/"+ obj.userId +"/update'>"+ obj.username +"</a></td>";
		dom += "<td>"+obj.surname+"</td>";
		dom += "<td>"+obj.organization.orgaName+"</td>";
		dom += "<td>"+obj.groupString+"</td>";
		dom += "<td>"+obj.phone+"</td>";
		dom += "<td>"+obj.email+"</td>";
		dom += "<td><form action='user/updateState' method='post'><input class='state' name='userId' value='"+obj.userId+"'style='display: none;' /><input class='state' type='submit' name='state' value='"+obj.state+"' /></form></td>";
		dom += "</tr>";
		_UserList.append(dom);
	});
}


*//**
 * 异步查询用户列表页数
 *//*
function showUserPage(User) {
	var url = 'user/users';
	CommonUtils.getAjaxData({
		url : url,
		type : 'GET'
	}, function(User) {
		PageUtils.refreshPageInfo({
			element : 'userPage',
			url : url,
			callback : showUser
		}, User['page']);
	});

}*/

/*function showUserGroup(UserGroup) {
	var _UserGroupList = $("#userGroupList");
	_UserGroupList.html("");
	var datas = eval(UserGroup["userGroupList"]);
	$.each(datas, function(item, obj) {
		var dom = "";
		dom += "<tr class='contentText list_list'>";
		dom += "<td style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"+obj.groupName+"' value='"+ obj.groupName +"'/></td>";
		dom += "<td><a class='handHover' href='userGroup/"+ obj.groupCode +"/update'>"+ obj.groupName +"</a></td>";
		dom += "<td>"+obj.groupCode+"</td>";
		dom += "<td><form action='userGroup/updateState' method='post'><input class='state' name='groupCode' value='"+obj.groupCode+"'style='display: none;' /><input class='state' type='submit' name='groupState' value='"+obj.groupState+"' /></form></td>";
		dom += "</tr>";
		_UserGroupList.append(dom);
	});
}

function showUserGroupPage(UserGroup) {
	var url = 'userGroup/userGroupList';
	CommonUtils.getAjaxData({
		url : url,
		type : 'GET'
	}, function(UserGroup) {
		PageUtils.refreshPageInfo({
			element : 'userGroupPage',
			url : url,
			callback : showUserGroup
		}, UserGroup['page']);
	});

}
*/
/*function showOrganization(Organization) {
	var _OrganizationList = $("#organizationList");
	_OrganizationList.html("");
	var datas = eval(Organization["organizationList"]);
	$.each(datas, function(item, obj) {
		var dom = "";
		dom += "<tr class='contentText list_list'>";
		dom += "<td  style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"+obj.orgId+"' value='"+ obj.orgId +"'/></td>";
		dom += "<td><a class='handHover' href='organization/"+ obj.orgId +"/update'>"+ obj.orgaName +"</a></td>";
		dom += "<td>"+obj.orgaCode+"</td>";
		dom += "<td>"+obj.parOrgName+"</td>";
		dom += "<td>"+obj.orgaDesc+"</td>";
		dom += "<td><form action='organization/updateState' method='post'><input class='state' name='orgId' value='"+obj.orgId+"'style='display: none;' /><input class='state' type='submit' name='state' value='"+obj.state+"' /></form></td>";
		dom += "</tr>";
		_OrganizationList.append(dom);
	});
}


*//**
 * 异步查询仓库记录页数
 *//*
function showOrganizationPage(Organization) {
	var url = 'organization/organizations';
	CommonUtils.getAjaxData({
		url : url,
		type : 'GET'
	}, function(User) {
		PageUtils.refreshPageInfo({
			element : 'organizationPage',
			url : url,
			callback : showOrganization
		}, Organization['page']);
	});

}*/

/*//校验用户名称的方法
function checkregisteredUserName(){

	var userName = document.getElementById("userName").value;
	if(userName == ""){
		directController.checkregisteredUserName(" ",showUserMessage);
	}else{
		directController.checkregisteredUserName(userName,showUserMessage);
	}

}
//校验用户名称的回调方法
function showUserMessage(data){
	if(data == "请输入用户名")
	{
		document.getElementById("userName").focus();
	}else if(data == "您注册的用户名已经存在")
	{
		document.getElementById("userName").focus();
	}
	var checkUser =  document.getElementById("checkUser"); 
	checkUser.innerText = data;
	checkUser.style.color = "red";
}


//校验电话号码的方法
function checkphone(){

	var phone = document.getElementById("phone").value;
	if(phone == ""){
		directController.checkphone(" ",showphoneMessage);
	}else{
		directController.checkphone(phone,showphoneMessage);
	}

}
//校验电话号码的回调方法
function showphoneMessage(data){
	var checkPhone =  document.getElementById("checkPhone"); 
	checkPhone.innerText = data;
	checkPhone.style.color = "red";
}



//更新用户时校验用户名称的方法
function checkregisteredUpdateUserName(){

	var userId = document.getElementById("userId").value;
	var userName = document.getElementById("userName").value;
	var userData = [userName,userId];
	if(userName == ""){
		var userData = [" ",userId];
		directController.checkregisteredUpdateUserName(userData,showUpdateUserMessage);
	}else{
		directController.checkregisteredUpdateUserName(userData,showUpdateUserMessage);
	}

}
//更新用户时校验用户名称的回调方法
function showUpdateUserMessage(data){
	if(data == "请输入用户名")
	{
		document.getElementById("userName").focus();
	}else if(data == "您注册的用户名已经存在")
	{
		document.getElementById("userName").focus();
	}
	var checkUser =  document.getElementById("checkUser"); 
	checkUser.innerText = data;
	checkUser.style.color = "red";
}

//校验密码的方法
function rexCheckPassword(){
	var passWord = document.getElementById("passWord").value;
	if(passWord == "")
	{
		directController.rexCheckPassword(" " , showPassWordMessage);
	}else
	{
		directController.rexCheckPassword(passWord,showPassWordMessage);
	}

}
//校验密码的回调方法
function showPassWordMessage(data)
{
	if(data == "你输入的密码为空")
	{
		document.getElementById("passWord").focus();
	}else if(data == "密码格式或者长度不正确（6-20 位，字母、数字、字符）")
	{
		document.getElementById("passWord").focus();
	}
	var checkPass =  document.getElementById("checkPass"); 
	checkPass.innerText = data;
	checkPass.style.color = "red";
}
*/

/*//添加组织机构时校验组织机构的名称
function checkregisteredOrgName(){
	var orgaName = document.getElementById("orgaName").value;
	if(orgaName == "")
	{
		directController.checkregisteredOrgName(" " , showOrgNameMessage);
	}else
	{
		directController.checkregisteredOrgName(orgaName,showOrgNameMessage);
	}

}
//添加组织机构时校验组织机构回调函数
function showOrgNameMessage(data)
{
	if(data == "你输入的密码为空")
	{
		document.getElementById("orgaName").focus();
	}
	var checkOrg =  document.getElementById("checkOrg"); 
	checkOrg.innerText = data;
	checkOrg.style.color = "red";
}


//更新组织机构时对于组织机构名称的校验
function checkregisteredUpdateOrgName(){
	var orgaName = document.getElementById("orgaName").value;
	var orgId = document.getElementById("orgId").value;
	var orgData = [orgaName,orgId];
	if(orgaName == "")
	{
		var orgData = [" ",orgId];
		directController.checkregisteredUpdateOrgName(orgData, showUpdateOrgNameMessage);
	}else
	{
		directController.checkregisteredUpdateOrgName(orgData,showUpdateOrgNameMessage);
	}

}
//修改组织机构时校验组织机构名称的回调函数
function showUpdateOrgNameMessage(data)
{
	if(data == "你输入的密码为空")
	{
		document.getElementById("orgaName").focus();
	}
	var checkOrg =  document.getElementById("checkOrg"); 
	checkOrg.innerText = data;
	checkOrg.style.color = "red";
}
*/

/*//
function checkregisteredUserSurName(){
	var surname = document.getElementById("surname").value;
	if(surname == "")
	{
		directController.checkregisteredUserSurName(" " , showUserSurNameMessage);
	}else
	{
		directController.checkregisteredUserSurName(surname,showUserSurNameMessage);
	}

}
//
function showUserSurNameMessage(data)
{
	if(data == "你输入的密码为空")
	{
		document.getElementById("surname").focus();
	}
	var checkUserSurName =  document.getElementById("checkUserSurName"); 
	checkUserSurName.innerText = data;
	checkUserSurName.style.color = "red";
}
*/
/*//增加用户组时，对于用户组编码的校验
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
*/
//校验规则名称不可以为空的方法
function checkRuleName()
{
	var ruleName = document.getElementById("ruleName").value;
	if(ruleName == "")
	{
		directController.checkRuleName(" " , showRuleMessage);
	}
	else
	{
		directController.checkRuleName(ruleName,showRuleMessage);
	}
}

//校验规则名称不可以为空的回调方法
function showRuleMessage(data)
{
	if(data == "请输入规则名称")
	{
		document.getElementById("ruleName").focus();
	}
	var checkRuleName =  document.getElementById("checkRuleName"); 
	checkRuleName.innerText = data;
	checkRuleName.style.color = "red";
}

//更新规则名称不可以为空的方法
function updateRuleName()
{
	var ruleId = document.getElementById("ruleId").value;
	var ruleName = document.getElementById("ruleName").value;
	var ruleData = [ruleName,ruleId];
	if(ruleName == "")
	{
		var ruleData = [" ",ruleId];
		directController.updateRuleName(ruleData, showUpdateRuleMessage);
	}
	else
	{
		directController.updateRuleName(ruleData,showUpdateRuleMessage);
	}
}

//更新规则名称不可以为空的回调方法
function showUpdateRuleMessage(data)
{
	var UpdateRuleName =  document.getElementById("UpdateRuleName"); 
	UpdateRuleName.innerText = data;
	UpdateRuleName.style.color = "red";
}



/*//添加用户组名称的校验
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
	var groupId = document.getElementById("groupId").value;
	var groupName = document.getElementById("groupName").value;
	var groupData = [groupName,groupId];
	if(groupName == "")
	{
		var groupData = [" ",groupId];
		directController.checkregisteredUpdateUserGroupName(groupData, showUpdateUserGroupNameMessage);
	}
	else
	{
		directController.checkregisteredUpdateUserGroupName(groupData,showUpdateUserGroupNameMessage);
	}
}

//更新用户组名称的校验的回调函数
function showUpdateUserGroupNameMessage(data)
{
	var checkGroupName =  document.getElementById("checkGroupName"); 
	checkGroupName.innerText = data;
	checkGroupName.style.color = "red";
}*/


/*//添加用户的时候对于日期的校验
function checkregisteredHiredate()
{
	var hiredate = document.getElementById("hiredate").value;
	if(hiredate == "")
	{
		directController.checkregisteredHiredate(" " , showHiredateMessage);
	}
	else
	{
		directController.checkregisteredHiredate(hiredate,showHiredateMessage);
	}
}

//添加用户日历的校验的回调函数
function showHiredateMessage(data)
{
	var checkHiredate =  document.getElementById("checkHiredate"); 
	checkHiredate.innerText = data;
	checkHiredate.style.color = "red";
}*/

/*//校验规则描述不可以为空的方法
function checkRuleDesc()
{
	var ruleDesc = document.getElementById("ruleDesc").value;
	if(ruleDesc == "")
	{
		directController.checkRuleDesc(" " , showRuleDescMessage);
	}
	else
	{
		directController.checkRuleDesc(ruleDesc,showRuleDescMessage);
	}
}

//校验规则描述不可以为空的回调方法
function showRuleDescMessage(data)
{
	var checkRuleDesc =  document.getElementById("checkRuleDesc"); 
	checkRuleDesc.innerText = data;
	checkRuleDesc.style.color = "red";
}*/



/*//校验规则描述不可以为空的方法
function checkUserAddInfo()
{
	var userName = document.getElementById("userName").value;
	var orgName = document.getElementById("orgName").value;
	var email = document.getElementById("email").value;
	var surname = document.getElementById("surname").value;
	var phone = document.getElementById("phone").value;
	var password = document.getElementById("password").value;
	var hiredate = document.getElementById("hiredate").value;
	if(userName == "" || orgName == "" || email == "" || surname == "" || phone == "" || password == "" || groupNames == "" || hiredate == "")
	{
		directController.checkUserAddInfo(" " , showUserAddMessage);
	}
	else
	{
		directController.checkUserAddInfo(surname,showUserAddMessage);
	}
}*/

/*//校验规则描述不可以为空的回调方法
function showUserAddMessage(data)
{
	alert(data);
}*/


//全选
function iselect() { //其中函数字不能为select 其为JS保留字
	var ids = document.getElementsByName("ids");  //以Name获取所有多选框
	var all = document.getElementByIdx_x_x("all");
	for (var i = 0; i < ids.length; i++) {
		ids[i].checked = all.checked;
	}
}
//全选


function selectAll() {
	var ids = document.getElementsByName("ids");
	var idss = [];
	for (var i = 0; i < ids.length; i++) {
		ids[i].checked = true;
		idss[i] = ids[i].value;
	}
}
//批量删除用户的删除选择的项
function deleteSelect()
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
		directController.deleteSelect(idss,returnData);
	}
}
//批量删除用户的的回调函数
function returnData(data)
{
	var returnInfo =  document.getElementById("returnInfo"); 
	returnInfo.innerText = data;
	returnInfo.style.color = "red";
	window.location.reload();
	alert(data);
}
//批量删除组织机构的删除选择的项
function deleteOrgSelect()
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
		directController.deleteOrgSelect(idss,returnData);
	}
	
}
//批量删除组织机构的的回调函数
function returnData(data)
{
	var returnInfo =  document.getElementById("returnInfo"); 
    returnInfo.innerText = data;
    returnInfo.style.color = "red";
    window.location.reload();
	alert(data);
}
/*//批量删除用户组的删除选择的项
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
	
}*/

/*//检验邮箱的正则判断
function checkregisteredEmail()
{
	var email = document.getElementById("email");
	if(email == null)
	{
		directController.checkregisteredEmail(" " , showEmailMessage);
	}
	else
	{
		directController.checkregisteredEmail(email,showEmailMessage);
	}
}

//
function showEmailMessage(data)
{
	var checkEmail =  document.getElementById("checkEmail"); 
	checkEmail.innerText = data;
	checkEmail.style.color = "red";
}*/


//用户列表的搜索
function select_text()
{
	var username = document.getElementById("user.username");
	var orgaName = document.getElementById("user.organization.orgaName");
	var surname = document.getElementById("user.surname");
	var selectParam = [];
	selectParam[0] = username;
	selectParam[1] = orgaName;
	selectParam[2] = surname;
	if(selectParam.length == 0)
	{
		alert("请选择要搜索的参数");
	}
	else{
		directController.select_text(selectParam,returnSelectData);
	}
}
//用户列表的返回信息
function returnSelectData(data)
{
	
}

//批量删除用户的删除选择的项
function deleteRuleSelect()
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
		directController.deleteRuleDetail(idss,returnRuleData);
	}
}
//批量删除用户的的回调函数
function returnRuleData(data)
{
	var returnRuleData =  document.getElementById("returnRuleData"); 
	returnRuleData.innerText = data;
	returnRuleData.style.color = "red";
	window.location.reload();
	alert(data);
}

$(function(){
	var spans = $(".div1");
	for (var i = 0; i<spans.length; i++){
		var childs = $(spans[i]).find("span");
	    for (var j = 0; j<childs.length ;j++){
	    	childs[j].style.left = 10 + j*140 + 'px';
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
	var ischeck = "false";
	$("#checkMenusIsNull").click(function(){
		if($("input[type='checkbox']:checked").length==0)
		{
	/*		return "";
		}else
		{*/
			$("#checkMenusIsNull").attr("disabled", true);
			var checkmenusisnull =  document.getElementById("checkmenusisnull"); 
			checkmenusisnull.innerText = "菜单选项不可以为空，请勾选菜单";
			checkmenusisnull.style.color = "red";
		}
		/*if($("#groupCode").val() == "")
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
		}*/
		checkregisteredUserGroupName();
		checkregisteredUserGroupCode();
		$(".error").each(function(){
			if($(this).text() != ""){
				$("#checkMenusIsNull").attr("disabled", true);
			}
		});
		$("input").mouseout(function(){
			checkregisteredUserGroupName();
			checkregisteredUserGroupCode();
			ischeck = "true";
			$(".error").each(function(){
				
				if($(this).text() != ""){
					ischeck = "false";
				}
			});
			if(ischeck == "true")
			{
			   $("#checkMenusIsNull").attr("disabled", false);
			}
		});
		if(ischeck == "true")
		{
		   $("#checkMenusIsNull").attr("disabled", false);
		}
	});
	
	
	$("#checkUserIsNull").click(function(){
		checkregisteredHiredate();
		rexCheckPassword();
		checkphone();
		checkregisteredUserSurName();
		checkregisteredUserName();
		$(".error").each(function(){
			if($(this).text() != ""){
				$("#checkUserIsNull").attr("disabled", true);
			}
		});
		$("input").mouseout(function(){
			checkregisteredHiredate();
			rexCheckPassword();
			checkphone();
			checkregisteredUserSurName();
			checkregisteredUserName();
			ischeck = "true";
			$(".error").each(function(){
				
				if($(this).text() != ""){
					ischeck = "false";
				}
			});
			if(ischeck == "true")
			{
			   $("#checkUserIsNull").attr("disabled", false);
			}
		});
		if(ischeck == "true")
		{
		   $("#checkUserIsNull").attr("disabled", false);
		}
	});
});
