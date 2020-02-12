$(function() {
	$.ajax({
		url : "userGroup/userGroupListss",
		type : "GET",
		datatype : "json",
		cache : false,
		success : function(UserGroup) {
			showUserGroup(UserGroup);
			showUserGroupPage(UserGroup);
		}
	});
});
/**
 * 初始化可编辑权限信息
 */
//getUserMeuns();
function getUserMeuns() {
	$.ajax({
		type : 'POST',
		url : 'user/getUserMenus',
		cache : false,
		async : true,
		success : function(data) {
			for(var i=0;i<data.length;i++){
				if(data[i].menuId =="68" &&data[i].menuLimited=="R"){
					document.getElementById("operate_area").style.display = "none";
				}
			}
		}
	});
}
function showUserGroup(UserGroup) {
	var _UserGroupList = $("#userGroupList");
	_UserGroupList.html("");
	var datas = eval(UserGroup["userGroupList"]);
	$
			.each(
					datas,
					function(item, obj) {
						var dom = "";
						dom += "<tr class='contentText list_list '>";
						if(obj.groupCode == "1000000001"
							|| obj.groupCode == "1000000002"
								|| obj.groupCode == "1000000003"
								|| obj.groupCode == "1000000004"
								|| obj.groupCode == "1000000005"
								|| obj.groupCode == "1000000006"
								|| obj.groupCode == "1000000007"
								|| obj.groupCode == "1000000008"
								|| obj.groupCode == "1000000009"){
							dom += "<td style='width : 50px !important;' align='center'><input type='checkbox' disabled='disabled' class='input_checkBox' name='ids' id='"
								+ obj.groupName
								+ "' value='"
								+ obj.groupCode
								+ "'/></td>";
							if(menuLimited){
								dom += "<td><a class='cursor' href='userGroup/"
									+ obj.groupCode + "/update'>" + obj.groupName
									+ "</a></td>";
							}else{
								dom += "<td><a class='cursor' href='userGroup/"
									+ obj.groupCode + "/update'>" + obj.groupName
									+ "</a></td>";
							}
						}else{
							dom += "<td style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"
								+ obj.groupName
								+ "' value='"
								+ obj.groupCode
								+ "'/></td>";
							if(menuLimited){
								dom += "<td><a class='cursor' href='userGroup/"
									+ obj.groupCode + "/update2'>" + obj.groupName
									+ "</a></td>";
							}else{
								dom += "<td><a class='cursor' href='userGroup/"
									+ obj.groupCode + "/update2'>" + obj.groupName
									+ "</a></td>";
							}
						}
						
						
						dom += "<td>" + obj.groupCode + "</td>";
						dom += "</tr>";
						_UserGroupList.append(dom);
					});
	/*$("tbody tr:odd").css("background", "#EBF5FF");*/
	// ie8隔行变色
    CommonUtils.ie8TrChangeColor();
}

function showUserGroupPage(UserGroup) {
	var url = 'userGroup/userGroupList';
	PageUtils.refreshPageInfo({
		element : 'userGroupPage',
		url : url,
		callback : showUserGroup
	}, UserGroup['page']);
}

function delUserGroup() {
	var list = [];
	var checks = $("input[name='ids']:checked");
	$.each(checks,
			function(index, obj) {
				if (obj.value == "1000000001"
						|| obj.value == "1000000002"
						|| obj.value == "1000000003"
						|| obj.value == "1000000004"
						|| obj.value == "1000000005"
						|| obj.value == "1000000006"
						|| obj.value == "1000000007"
						|| obj.value == "1000000008"
						|| obj.value == "1000000009") {
				} else {
					list.push(obj.id);
				}
			});
	if (!list.length > 0) {
		alert("请选择删除的行");
		return;
	}
	confirm("确定要删除吗?",function(data){
		if(data){
			$.ajax({
				type : 'POST',
				url : 'userGroup/delUserGroup',
				cache : false,
				data : JSON.stringify(list),
				contentType : 'application/json; charset=utf-8',
				async : true,
				success : function(data) {
					if (data == 'success') {
						//alert("删除完成！");
						$.ajax({
							url : "userGroup/userGroupListss",
							type : "GET",
							datatype : "json",
							cache : false,
							success : function(UserGroup) {
								showUserGroup(UserGroup);
								showUserGroupPage(UserGroup);
							}
						});
					} else {
						alert("用户组使用中，无法删除");
					}
					var current = PageUtils._currentPage['userGroupPage'];
					PageUtils.pageClick(current, 'userGroupPage');
				}
			});
		}});
}