window.Organizations = (function($, module) {

	function init() {
		initPageInfo();
		//getUserMeuns();
	}
	function initPageInfo() {
		CommonUtils.getAjaxData({
			url : 'organization/organizations',
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'organizationPage',
				url : 'organization/organizations',
				callback : showOrganization
			}, data['page']);
			showOrganization(data);
		});
	}
	function getUserMeuns() {
		$.ajax({
			type : 'POST',
			url : 'user/getUserMenus',
			cache : false,
			async : true,
			success : function(data) {
				for(var i=0;i<data.length;i++){
					if(data[i].menuId =="69" &&data[i].menuLimited=="R"){
						document.getElementById("operate_area").style.display = "none";
					}
				}
			}
		});
	}
	function showOrganization(Organization) {
		var _OrganizationList = $("#organizationList");
		_OrganizationList.html("");
		var datas = eval(Organization["organizationList"]);
		var datas = Organization["organizationList"];
		$.each(
						datas,
						function(item, obj) {
							var dom = "";
							dom += "<tr class='contentText list_list '>";
							if(obj.parentOrgId=="1"){
								dom += "<td  style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"
									+ obj.orgId
									+ "' value='1"
								
									+ "'/></td>";
							}else{
								dom += "<td  style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"
									+ obj.orgId
									+ "' value='"
									+ obj.orgaCode
									+ "'/></td>";
							}
							if(menuLimited){
								dom += "<td><a class='cursor' href='organization/"
									+ obj.orgId
									+ "/update'>"
									+ obj.orgaName
									+ "</a></td>";
							}else{
								dom += "<td><a class='cursor' href='organization/"
									+ obj.orgId
									+ "/update'>"
									+ obj.orgaName
									+ "</a></td>";
							}
							
							dom += "<td>" + obj.orgaCode + "</td>";
							dom += "<td>" + obj.parOrgName + "</td>";
							dom += "</tr>";
							_OrganizationList.append(dom);
						});
		/*$("tbody tr:odd").css("background", "#EBF5FF");*/
		// ie8隔行变色
        CommonUtils.ie8TrChangeColor();
	}

	function delOrganization() {
		var list = [];
		var checks = $("input[name='ids']:checked");
		$.each(checks, function(index, obj) {
			if(obj.value=="1"){
				
			}else{
				list.push(obj.id);
			}
		});
		if (!list.length > 0) {
			if(checks.length>0){
				alert("所选的组织机构不可删除!!");
			}else{
				alert("请选择要删除的组织机构!!");
			}
				
			return;
		}
		confirm("确定要删除吗?",function(data){
			if(data){
				$.ajax({
					type : 'POST',
					url : 'organization/delOrganization',
					cache : false,
					data : JSON.stringify(list),
					contentType : 'application/json; charset=utf-8',
					async : true,
					success : function(data) {
						if (data == 'success') {
							//alert("删除成功");
						} else if (data == "othernot") {
							alert("组织机构数据正在被使用：无法删除!");
						} else {
							alert("系统错误");
						}
						var current = PageUtils._currentPage['organizationPage'];
						PageUtils.pageClick(current, 'organizationPage');
					}
				});
			}});
	}
	/**
	 * 异步查询仓库记录页数
	 */
	function showOrganizationPage(Organization) {
		var url = 'organization/organizations';
		PageUtils.refreshPageInfo({
			element : 'organizationPage',
			url : url,
			callback : showOrganization
		}, Organization['page']);
	}
	module.init = init;
	module.delOrganization = delOrganization;
	return module;
}($, window.Organizations || {}));
$(function() {
	Organizations.init();
});