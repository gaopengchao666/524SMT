window.TreeUtils = (function($,module){
	var _param = null, //树的参数对象 
	_idField = null, //id字段
	_pidField = null, //父id字段
	_rootId = null,	//根节点id
	_level = null, //层级
	_dblclickCallBack = null, //双击 或者确定按钮回调函数
	_closeCallBack = null, //关闭按钮或者取消按钮事件
	_code = null; //编码
	_name = null; //名称
	/**
	 * 根据配置 和 数据 生成树结构
	 */
	function getTreeData(data){
		
		var tree = $('<div>');
		var curIdArr = []; //当前树层级 id数
		var pidArrs = []; //所有节点的父节点集合
		//根目录节点
		$.each(data,function(){
			pidArrs.push(this[_pidField]);
			if (this[_pidField] == _rootId){
				curIdArr.push(this[_idField]);
				var dom = '<a id="'+ this[_idField]+'" name="'+ this[_code]+'" class="levelClassclass0 hasChildren"><span></span>'+this[_name]+'</a>';
				tree.append(dom);
			}
		});
		
		//树的层级
		_level = _level == 0 ? 3 : _level;
		//组装所有子节点
		for (var i = 1; i <= _level ; i++){	
			var arr = [];
			$.each(data,function(){
				//一  ：当前的父id 等于上一层的id
				//二 ：受其他条件影响,第一层父id 和 id相等
				if (curIdArr.indexOf(this[_pidField]) > -1 || (i == 1 && this[_pidField] == this[_idField])){
					var curUlSelect = tree.find("a[id='"+ this[_pidField] +"']");
					if (!curUlSelect.next().length){
						var ul = $('<ul>');
						curUlSelect.parent().append(ul);
					}
					arr.push(this[_idField]);
					var li = $('<li>');
					//如果有子节点 控制 节点样式
					var domClass = pidArrs.indexOf(this[_idField]) > -1 ? 'hasChildren' : 'noChildren';
					var dom = '<a id="'+ this[_idField]+'" name="'+ this[_code]+'" class="levelClassclass'+ i +' '+ domClass +'"><span></span>'+this[_name]+'</a>';
					li.append(dom);
					curUlSelect.next().append(li);
				}
			});
			curIdArr = arr;
		}
		return tree;
	}
	
	
	function treeCss(){
//		------------ 去掉所有菜单链接跳转 -------------
		$(".hasChildren").each(function(){	
			$(this).attr("href", "javascript:void(0)");
		});
		$(".noChildren").each(function(){	
			$(this).attr("href", "javascript:void(0)");
		});

//		------------------ 有子菜单标签 ------------------
		var level1 = $(".hasChildren");
		level1.addClass("menu_bgd_sub");
		iconToggle(level1);

//		------------------ 选中添加背景 ------------------
		$("#tree a").each(function(){
			$(this).addClass("menu_bgd_unselected");
		});

	}
	function iconToggle(el){
		el.each(function(){
			$(this).click(function(){
				if($(this).hasClass("menu_bgd_sub")){
					$(this).removeClass("menu_bgd_sub").addClass("menu_bgd_add");
				}else if($(this).hasClass("menu_bgd_add")){
					$(this).removeClass("menu_bgd_add").addClass("menu_bgd_sub");
				}
				$(this).next().slideToggle(300);
			});
		});
	}
	
	/**
	 * 显示树并绑定事件
	 */
	function showTreeBindEvent(tree){
		$("#tree").empty();
		$("#tree").append(tree);		
		treeCss();
		
		$(".menuMask").hide();
		
		//点击显示树
		$("#treeBtn").click( function () { 
			$(this).blur();
			$(".menuMask").show();
			$(".mask").show();
			$("label.error").css("display", "none");
		});		
		
		//树节点收缩 点击事件
		$("#tree a").click(function(){
			$("#tree a").each(function(){
				$(this).removeClass("menu_bgd_selected").addClass("menu_bgd_unselected");
			});	
			$(this).removeClass("menu_bgd_unselected").addClass("menu_bgd_selected");
		});
		
		//树节点  双击事件
		$("#tree a").dblclick(function(){
			showErrorLabel();
			doSelectedNode(this);
		});
		

		//关闭按钮事件
		$(".close_btn").click(function(){
			showErrorLabel();
			$(".menuMask").css("display", "none");
			$(".mask").css("display", "none");
			if (_closeCallBack){
				_closeCallBack();
			}
		});
		
		//确定按钮事件
		$(".sure").click(function(){
			showErrorLabel();
			doSelectedNode($(".menu_bgd_selected"));
		});
		//取消按钮事件
		$(".cancle").click(function(){
			showErrorLabel();
			$(".menuMask").css("display", "none");
			$(".mask").css("display", "none");
			if (_closeCallBack){
				_closeCallBack();
			}
		}); 
	}
	
	/**
	 * 显示错误提示label
	 */
	function showErrorLabel(){
		$.each($("label.error"),function(){
			if (!$(this).prev().val() || $(this).prev().hasClass("error")){
				$(this).css("display", "block");
			}
		});
	}
	
	/**
	 * 确定按钮 或者 双击选定节点处理
	 */
	function doSelectedNode(data){
		//如果点击是根目录 则返回
		if ($(data).hasClass("levelClassclass0")){
			return;
		}
		
		$(".menuMask").css("display", "none");
		$(".mask").css("display", "none");
		//回调函数
		if (_dblclickCallBack){
			_dblclickCallBack(data);
		}
	}
	

	/**
	 * 初始化函数
	 */
	function init(param){
		_param = param;
		_idField = _param.id;
		_pidField =  _param.pid;
		_rootId = _param.rootId;
		_name = _param.name;
		_code = _param.code || _param.name;
		_level = _param.level || 0;
		_dblclickCallBack = _param.callback;
		_closeCallBack = _param.closeCallback;
		CommonUtils.getAjaxData({url:_param.url,type:'GET',data:_param.data},function(data){
			if (data){
				//获取 树 结构
				var tree = getTreeData(data);
				//显示树 并 绑定事件
				showTreeBindEvent(tree);
			}
		});
	}
	
	module.init = init;
	return module;
}($,window.TreeUtils || {}));
