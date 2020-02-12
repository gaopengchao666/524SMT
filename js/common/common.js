window.CommonUtils = (function($, module) {
	/**
	 * 根据数据按照name规则填充form中的标准HTML输入框(包括input checkbox textarea,select),
	 * <p>
	 * 注意form中的checkbox需要预先填写被勾选后的值 <code><input type="checkbox"
	 * name="sopTeamInfo.isOwner" value="1"></code>
	 * "1"
	 * 就是预期需要与sopTeamInfo.isOwner比较的值,如果sopTeamInfo.isOwner的值是"1",则checkbox被勾选
	 * 
	 * @param form
	 *            form的id或jquery选择器获取到的form元素
	 * @param data
	 *            需要填充到form中的数据 json对象
	 * @param profix
	 *            前缀,输入框的名称的"."之前的部分,如果没有则不填
	 */
	function fillForm(form, data, profix) {
		var _$form = typeof form == "string" ? $("#" + form) : form;
		var _profix;
		// 如果用户填入前缀,则使用前缀构造名称,如果未填,名称前缀为""
		if (profix) {
			_profix = profix + ".";
		} else {
			_profix = "";
		}

		for ( var index in data) {
			var _$input = _$form.find(":input[name='" + _profix + index + "']");
			if (_$input.attr("type") == "checkbox") {
				_$input.attr("checked", _$input.val() == data[index]);
			} else {
				_$input.val(data[index]);
			}
		}
	}
	// 判空处理，如果值为null返回""
	function isNull(data) {
		if (data == null) {
			return ""
		} else {
			return data
		}
	}

	/**
	 * 序列化dom 中input/select 为对象 获取下拉框的 html
	 */
	function serializeToObject(form, profix) {
		var _$form = typeof form == "string" ? $("#" + form) : form;
		// 如果用户填入前缀,则使用前缀构造名称,如果未填,名称前缀为""
		var _profix;
		if (profix) {
			_profix = profix + ".";
		} else {
			_profix = "";
		}
		var o = {};
		if (profix) {
			$.each(_$form.find(":input[name^='" + _profix + "']"), function() {
				if (this.name.indexOf(_profix) > -1) {
					var name = this.name.split(_profix)[1];
					o[name] = this.value || '';
				}
			});
		} else {
			$.each(_$form.find(":input"),
					function() {
						var name = this.name.indexOf(".") > -1 ? this.name
								.split(".")[1] : this.name;
						if (name.length > 0) {
							o[name] = this.value || '';
						}
					});
		}

		return o;
	}

	/**
	 * ajax请求后台数据
	 */
	function getAjaxData(param, s_callback) {
		// 查询数据
		$.ajax({
			type : param.type,
			url : param.url,
			data : param.data,
			contentType : 'application/json; charset=utf-8',
			async : param.async || false,
			cache : false,
			success : function(data) {
				if (s_callback) {
					s_callback(data);
				}
			},
			error : function(data,data1,data2) {
			    if (data.responseText.indexOf("该事项已被处理") > -1){
			        alert(data.responseText);
			        // 更新待办事项状态
			        self.parent.menuFrame.updateWorkBeach();
			    }
			    else if ($("#loader").length > 0) {
					alert("后台报错");
					$("#loader").addClass("hidden");
				} else {
					alert("后台报错");
				}
			}
		});
	}

	/**
	 * 初始化方法
	 */
	function init() {
		bindEvent();

		adjustJsCompatibility();

		adjustBodyHeight();

	}

	/**
	 * 调整内容页面宽度
	 */
	function adjustBodyHeight() {
		var h = document.documentElement.clientHeight;
		$(".wrap").css("height", h);
	}

	/**
	 * ie8各行变色
	 */
	function ie8TrChangeColor() {
		// ie8隔行变色
		$(".tablelist tr:odd").css("background", "rgb(245, 245, 245)");
		$(".tablelist tr:even").css("background", "white");

		// hover每行 td 变色
		$(".info_area td").hover(function() {
			$(this).parent().children().addClass("td_hover");
		}, function() {
			$(this).parent().children().removeClass("td_hover");
		});
	}

	/**
	 * 判断Array是否支持 indexOf
	 */
	function adjustJsCompatibility() {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(elt /* , from */) {
				var len = this.length >>> 0;
				var from = Number(arguments[1]) || 0;
				from = (from < 0) ? Math.ceil(from) : Math.floor(from);
				if (from < 0)
					from += len;
				for (; from < len; from++) {
					if (from in this && this[from] === elt)
						return from;
				}
				return -1;
			};
		}
	}

	/**
	 * 绑定事件
	 */
	function bindEvent() {

		// 筛选按钮添加事件
		$(".btn_search").click(function(data) {
			// 分页id
			var pageId = $(".page_area").attr("id");
			// 筛选数据获取
			var paramData = serializeToObject($(".select_text"));
			// 分页参数 增加筛选条件
			$.each(PageUtils._pageParamArr, function() {
				if (this['element'] == pageId) {
					this['data'] = paramData;
				}
			});
			// 分页跳转第一页
			PageUtils.pageClick(1, pageId);
		});

		// 清除筛选条件
		$(".btn_clear").click(function() {
			$(".select_text").find(":input").val("");
			$(".select_text").find("select").prop('selectedIndex', 0);
			// 分页id
			var pageId = $(".page_area").attr("id");
			// 分页参数 增加筛选条件
			$.each(PageUtils._pageParamArr, function() {
				if (this['element'] == pageId) {
					this['data'] = "";
				}
			});
			// 分页跳转第一页
			PageUtils.pageClick(1, pageId);
		});

		// 表头空白处 点击全选事件
		$(".checkSelectAll").click(
				function() {
					var selectArr = $(this).parents("table").find(
							"input[type='checkbox']");
					var allSelectflag = true;
					$.each(selectArr, function() {
						if (!this.checked) {
							allSelectflag = false;
						}
					});
					selectArr.prop("checked", !allSelectflag);
				});

		// 重写弹出框 提示框
		window.alert = function alert(e, callback) {
			$("body")
					.append(
							"<div id='msg_mask'><div id='msg'><div id='msg_top'><img id='msg_img' src='../../img/button/hint1.png' />提示信息<span class='msg_close' id='msg_close'>×</span></div><div id='msg_cont'>"
									+ e
									+ "</div><div class='msg_close msg_btn' id='msg_clear'>确定</div></div></div>");
			$("#msg_clear").click(function() {
				$("#msg").remove();
				$("#msg_mask").remove();
				if (callback) {
					callback(true);
				}
			});

			$("#msg_cancle").click(function() {
				$("#msg").remove();
				$("#msg_mask").remove();
			});

			$("#msg_close").click(function() {
				$("#msg").remove();
				$("#msg_mask").remove();
			});
		}

		window.confirm = function confirm(e, callback) {
			$("body")
					.append(
							'<div id="msg_mask"><div id="msg"><div id="msg_top"><img id="msg_img" src="../../img/button/hint1.png" />提示信息<span class="msg_close" id="msg_close">×</span></div><div id="msg_cont">'
									+ e
									+ '</div><div class="msg_close msg_btn" id="msg_cancle">取消</div><div class="msg_close msg_btn" id="msg_clear1">确定</div></div></div>');
			// 确定
			$("#msg_clear1").click(function() {
				$("#msg").remove();
				$("#msg_mask").remove();
				if (callback) {
					callback(true);
				}
			});

			$("#msg_cancle").click(function() {
				$("#msg").remove();
				$("#msg_mask").remove();
			});

			$("#msg_close").click(function() {
				$("#msg").remove();
				$("#msg_mask").remove();
			});
		}
	}

	/**
	 * 扩展validate 校验方法
	 */
	function extendValidateMth() {
		// jQuery手机号校验
		jQuery.validator
				.addMethod(
						"isPhone",
						function(value, element) {
							var length = value.length;
							var mobile = /^(((13[0-9]{1})|(01[0-9]{1})|(02[0-9]{1})|(03[0-9]{1})|(04[0-9]{1})|(05[0-9]{1})|(06[0-9]{1})|(07[0-9]{1})|(08[0-9]{1})|(09[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
							return this.optional(element)
									|| (length == 11 && mobile.test(value));
						}, "请填写正确的手机号码");// 可以自定义默认提示信息
	}

	/**
	 * js深度拷贝对象方法
	 */
	function deepCopy(source) {
		var result = {};
		for ( var key in source) {
			result[key] = typeof source[key] === 'object' ? deepCoyp(source[key])
					: source[key];
		}
		return result;
	}
	function setDefaultDate() {
		var date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		month = (month.toString().length == 1) ? ("0" + month) : month;
		day = (day.toString().length == 1) ? ("0" + day) : day;

		return date.getFullYear() + "-" + month + "-" + day;
	}
	module.fillForm = fillForm;
	module.serializeToObject = serializeToObject;
	module.getAjaxData = getAjaxData;
	module.extendValidateMth = extendValidateMth;
	module.deepCopy = deepCopy;
	module.ie8TrChangeColor = ie8TrChangeColor;
	module.setDefaultDate = setDefaultDate;
	module.init = init;
	return module;
}($, window.CommonUtils || {}));
$(function() {
	CommonUtils.init();
});

window.PageUtils = (function($, module) {
	var _pageParamArr = [], // 分页参数数组,可以有多个分页情况
	_currentPage = {}; // 当前页

	/**
	 * 刷新分页页脚信息 用于异步
	 * 
	 * @param obj
	 *            选择元素id 或者 分页信息参数对象
	 * @param page
	 *            分页对象
	 */
	function refreshPageInfo(obj, page) {
		if (!obj || !page) {
			return;
		}

		var element = null;
		if (typeof obj == "object") {
			_pageParamArr.push(obj);
			element = obj['element'];
		} else {
			element = obj;
		}
		var _$element = typeof element == "string" ? $("#" + element) : element;
		var begin = 1;
		var end = page['totalPage'];
		_$element.html("");
		if (end == 0) {
			return;
		}
		// 分页汇总记录数 页数 每页条数
		var summaryHtml = "<div class='page_sum'>共<span class='page_number'>"
				+ end + "</span>页&emsp;每页 " + page.pageSize
				+ " 条&emsp;共<span class='info_sum'> " + page.totalRecord
				+ " </span>条记录</div>"
		// 分页页码HTML外层
		var pageNumberHtml = "<div class='page-pull-right async-page'>";

		var current = page['pageNo'];
		_currentPage[element] = current;
		var pageNoDisp = page['pageNoDisp'];
		var pageNoArr = pageNoDisp.split("|") || [];
		var pageDom = "";
		if (current != 1 && end != 0) {
			pageDom += "<button onclick='PageUtils.pageClick(1,this)'>首页</button>";
			pageDom += "<button onclick='PageUtils.pageClick(" + (current - 1)
					+ ",this)'><<</button>";
		} else {
			pageDom += "<button>首页</button>";
			pageDom += "<button><<</button>";
		}

		$
				.each(
						pageNoArr,
						function(i, index) {
							if (index == 0) {
								pageDom += "<label style='margin-right:3px;font-size: 10px; width: 20px; text-align: center;'>•••</label>";
							} else if (index != current) {
								pageDom += "<button onclick='PageUtils.pageClick("
										+ index
										+ ",this)'>"
										+ index
										+ "</button>";
							} else {
								pageDom += "<button class='select_page'>"
										+ index + "</button>";
							}
						});

		if (current < end && end != 0) {
			pageDom += "<button onclick='PageUtils.pageClick(" + (current + 1)
					+ ",this)'>>></button>";
			pageDom += "<button onclick='PageUtils.pageClick(" + end
					+ ",this)'>尾页</button>";
		} else {
			pageDom += "<button>>></button>";
			pageDom += "<button>尾页</button>";
		}
		var pageHtml = summaryHtml + pageNumberHtml + pageDom + "</div>";
		_$element.append(pageHtml);
	}

	/**
	 * 分页点击事件处理
	 */
	function pageClick(pNo, object) {
		// 分页元素id
		var elementId = typeof object == 'string' ? object : $(object).parent()
				.parent().attr("id");
		var param = {};
		$.each(_pageParamArr, function() {
			if (this['element'] == elementId) {
				param = this;
			}
		});

		var params = $.extend(param.data || {}, {
			'pageNo' : pNo
		});
		// 获取数据和 分页对象
		$("#loader").removeClass("hidden");
		CommonUtils.getAjaxData({
			url : param['url'],
			type : 'GET',
			data : params,
			async : 'true'
		}, function(data) {
			if (!data) {
				return;
			}
			// 刷新分页信息
			refreshPageInfo(param['element'], data['page']);

			// 刷新列表信息 回调函数
			$.each(_pageParamArr, function() {
				var callback = param['callback'];
				if (callback) {
					callback(data);
				}
				$("#loader").addClass("hidden");
			});
		});
	}
	module.refreshPageInfo = refreshPageInfo;
	module.pageClick = pageClick;
	module._currentPage = _currentPage;
	module._pageParamArr = _pageParamArr;
	return module;
}($, window.PageUtils || {}));
