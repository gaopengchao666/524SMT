
/* 零部件信息管理 */
var setting = {
			view: {
				addHoverDom: false,
				removeHoverDom: false,
				selectedMulti: false
			},
			edit: {
				enable: false,
				editNameSelectAll: false,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeDrag: beforeDrag,
				beforeEditName: beforeEditName,
				beforeRemove: beforeRemove,
				beforeRename: beforeRename,
				onRemove: onRemove,
				onRename: onRename
			}
		};


		var log, className = "dark";
		function beforeDrag(treeId, treeNodes) {
			return false;
		}
		function beforeEditName(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("productTree");
			zTree.selectNode(treeNode);
			return confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？");
		}
		function beforeRemove(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("productTree");
			zTree.selectNode(treeNode);
			return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
		}
		function onRemove(e, treeId, treeNode) {
			showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
		}
		function beforeRename(treeId, treeNode, newName) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("productTree");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}
		function onRename(e, treeId, treeNode) {
			showLog("[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
		}
		function showRemoveBtn(treeId, treeNode) {
			return !treeNode.isFirstNode;
		}
		function showRenameBtn(treeId, treeNode) {
			return !treeNode.isLastNode;
		}
		function showLog(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		var newCount = 1;
		function addHoverDom(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.id).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.id
				+ "' title='add node' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.id);
			if (btn) btn.bind("click", function(){
				var zTree = $.fn.zTree.getZTreeObj("productTree");
				zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
				return false;
			});
		};
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.id).unbind().remove();
		};
		function selectAll() {
			var zTree = $.fn.zTree.getZTreeObj("productTree");
			zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
		}
		
		var zNodes =[
			{ id:1, pId:0, name:"产品1", open:true},
			{ id:11, pId:1, name:"零件 1-1"},
			{ id:12, pId:1, name:"零件 1-2"},
			{ id:13, pId:1, name:"零件 1-3"},
			{ id:2, pId:0, name:"产品 2", open:true},
			{ id:21, pId:2, name:"零件 2-1"},
			{ id:22, pId:2, name:"零件 2-2"},
			{ id:3, pId:0, name:"产品 3", open:true},
			{ id:31, pId:3, name:"零件 3-1"},
			{ id:32, pId:3, name:"零件 3-2"},
			{ id:33, pId:3, name:"零件 3-3"}
		];
		
		/* 初始化数据 */
		$(document).ready(function(){
			$.fn.zTree.init($("#productTree"), setting, zNodes);
			$("#selectAll").bind("click", selectAll);
			
		});
		
		/* 点击增加产品按钮 */
		function addProductParts(){
			window.location.href="partsInfoAdd.html";
		}

