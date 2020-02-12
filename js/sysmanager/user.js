window.UserList = (function($, module) {

	/**
	 * 初始化
	 */
	function init() {
		// getUserMeuns();
		initPageInfo();
	}
	/**
	 * 初始化分页信息
	 */
	function initPageInfo() {
		// 更新page信息
		var url = 'user/users';
		CommonUtils.getAjaxData({
			url : url,
			type : 'GET'
		}, function(data) {
			PageUtils.refreshPageInfo({
				element : 'userPage',
				url : url,
				callback : showUser
			}, data['page']);
			showUser(data);
		});
	}
	/**
	 * 初始化可编辑权限信息
	 */
	function getUserMeuns() {
		$
				.ajax({
					type : 'POST',
					url : 'user/getUserMenus',
					cache : false,
					async : true,
					success : function(data) {
						for (var i = 0; i < data.length; i++) {
							if (data[i].menuId == "67"
									&& data[i].menuLimited == "R") {
								document.getElementById("operate_area").style.display = "none";
							}
						}
					}
				});
	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		$("input[type='checkbox']").on("click", function() {
			setDeleteIsUsed();
		});
	}

	/**
	 * 删除按钮是否可用
	 */
	function setDeleteIsUsed() {
		var checks = $("input[type='checkbox']:checked");
		if (checks == '' || checks.length == 0) {
			$("#delCheck").attr("disabled", true);
		} else {
			$("#delCheck").attr("disabled", false);
		}
	}

	// 显示盘点计划
	function showUser(datass) {

		var _UserList = $("#userList");
		_UserList.html("");
		datas = datass["userList"]
		$
				.each(
						datas,
						function(item, obj) {
							if (obj.username != "admin") {

								var dom = "";
								dom += "<tr class='contentText list_list'>";
								dom += "<td style='width : 50px !important;' align='center'><input type='checkbox' class='input_checkBox' name='ids' id='"
										+ obj.userId
										+ "' value='"
										+ obj.userId
										+ "'/></td>";
								if (menuLimited) {
									dom += "<td><a class='cursor' href='user/"
											+ obj.userId + "/update'>"
											+ obj.username + "</a></td>";
								} else {
									dom += "<td><a class='cursor' href='user/"
											+ obj.userId + "/update'>"
											+ obj.username + "</a></td>";
								}

								dom += "<td>" + obj.orgName + "</td>";
								dom += "<td>" + obj.groupStrings + "</td>";
								dom += "<td>" + obj.phone + "</td>";
								dom += "<td>" + obj.email + "</td>";
								dom += "<td style='text-align:center;'><img onclick='printImage("
										+ obj.userId
										+ ")' src='img/button/printer.png'/><div id='userQR"
										+ obj.userId
										+ "' style='display: none;'></div></td>"
								dom += "</tr>";
								_UserList.append(dom);
							}
						});
		/* $("tbody tr:odd").css("background", "#EBF5FF"); */
		// ie8隔行变色
		CommonUtils.ie8TrChangeColor();
	}
	// 添加物料
	function addUser() {
		window.location.href = "user/add";
	}
	// 删除物料
	function delUsers() {
		var list = [];
		var checks = $("input[name='ids']:checked");
		$.each(checks, function(index, obj) {
			list.push(obj.id);
		});
		if (!list.length > 0) {
			alert("请选择要删除的内容!!");
			return;
		}
		/*
		 * var del = confirm("确定删除?"); if (!del) { return; }
		 */
		confirm("确定要删除吗?", function(data) {
			if (data) {
				$.ajax({
					type : 'POST',
					url : 'user/delUser',
					cache : false,
					data : JSON.stringify(list),
					contentType : 'application/json; charset=utf-8',
					async : true,
					success : function(data) {
						if (data == 'success') {
							// alert("删除成功");
						} else if (data == "error") {
							alert("有计划被使用：无法删除!!!");
						} else {
							alert("错误");
						}
						var current = PageUtils._currentPage['userPage'];
						PageUtils.pageClick(current, 'userPage');
					}
				});
			}
		});
	}

	/**
	 * 更新物料
	 */
	/*
	 * function updCheck(check_id) { window.location.href = basePath +
	 * "check/toCheck?check_id=" + check_id; }
	 */

	module.init = init;
	module.delUsers = delUsers;
	module.addUser = addUser;
	return module;
}($, window.UserList || {}));
$(function() {
	UserList.init();
});
