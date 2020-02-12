window.Organization = (function($, module) {

	function init() {
		// initOrganizeTree();
	}

	/**
	 * 初始化组织结构树
	 */
	function initOrganizeTree() {
		TreeUtils.init({
			id : 'orgId', // id字段
			pid : 'parentOrgId', // 父id字段
			rootId : -1, // 根节点的 id值
			name : 'orgaName', // 显示名称字段
			level : 3, // 需要几层树 目前样式支持3层 (不包括根节点)
			code : 'orgaCode',
			url : 'organization/queryOrganizationTree', // 获取 数据的地址
			callback : function(data) { // 双击选中 或者 确定按钮回调函数
				$("#orgId").val($(data).attr("id"));
				$("#treeBtn").val($(data).text());
				// $("#orgaCode").val($(data).attr("name"));
				directController.getAddOrga_code($(data).text(),
						function(datas) {
							$("#orgaCode").val(datas);
						});
			}
		});
	}

	function delOrganization() {
		var list = [];
		var checks = $("input[name='ids']:checked");
		$.each(checks, function(index, obj) {
			list.push(obj.id);
		});
		if (!list.length > 0) {
			alert("请选择要删除的机构!!");
			return;
		}
		/*
		 * var del = confirm("确定删除?"); if (!del) { return; }
		 */
		$.ajax({
			type : 'POST',
			url : 'organization/delOrganization',
			cache : false,
			data : JSON.stringify(list),
			contentType : 'application/json; charset=utf-8',
			async : true,
			success : function(data) {
				if (data == 'success') {
					alert("删除成功");
				} else if (data == "error") {
					alert("有计划被使用：无法删除!!!");
				} else {
					alert("错误");
				}

				var current = PageUtils._currentPage['organizationPage'];
				PageUtils.pageClick(current, 'organizationPage');
			}
		});
	}

	module.init = init;
	module.delOrganization = delOrganization;
	return module;
}($, window.Organization || {}));
$(function() {
	Organization.init();
	//$("#orgaCode").attr("readOnly", true);
	//$("#treeBtn").attr("readOnly", true);
});