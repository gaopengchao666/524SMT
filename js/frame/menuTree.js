window.menuTree = (function($, module) {

    function init() {
        // 默认第一个下拉
        $("#tree ul").first().css("display", "block");
        var h = document.documentElement.clientHeight;
        $(".wrap").css("height", h);
        $("#tree").css("height", h);

        $(document).ready(function() {
            $(".level2").click(function() {
            	if($(this).attr("name")=='9' || $(this).attr("name")=='72' || $(this).attr("name")=='73'){
	           		 $(this).attr("target", "_blank");
	           	}else{
	           		 $(this).attr("target", "welcomeFrame");
	           	}
                $(".menu_selected").removeClass("menu_selected");
                $(this).addClass("menu_selected");
            });
        });
    }

    function cssfn() {
        // ------------------ 一级菜单 ------------------
        var level1 = $(".level1");
        // ------------ 去掉一级菜单链接跳转 -------------
        $(".level1").each(function() {
            $(this).attr("href", "javascript:void(0)");
        });
        // -------------- 调用菜单收缩函数 ---------------
        iconToggle(level1);
        // ------------------ 菜单收缩 ------------------
        function iconToggle(el) {
            el.each(function() {
                $(this).click(function() {
                    $(this).next().slideToggle(300);
                    var arrow = $(this).children(0).children(0);
                    if (arrow.hasClass('arrow1')) {
                        arrow.removeClass("arrow1").addClass("arrow2");
                    } else {
                        arrow.removeClass("arrow2").addClass("arrow1");
                    }
                });
            });
        }
        // ------------------ 二级菜单span ------------------
        $(".level2 span").each(function() {
            $(this).addClass("left_file");
        });
        // ------------------ 菜单跳转 ------------------
        $(document).ready(function() {
            $(".level2").click(function() {
                if($(this).attr("name")=='9' || $(this).attr("name")=='72' || $(this).attr("name")=='73'){
            		 $(this).attr("target", "_blank");
            	}else{
            		 $(this).attr("target", "welcomeFrame");
            	}              
                $(".menu_selected").removeClass("menu_selected");
                $(this).addClass("menu_selected");
            });
        });
    }

    module.init = init;
    module.cssfn = cssfn;
    return module;
}($, window.menuTree || {}));
$(function() {
    menuTree.init();
});

function modelMenu(data, allMenus) {
    var menuId = data.menuId;
    var tree = $('div');

    var curIdArr = []; // 当前树层级 id数
    var firstDom = "";
    // 菜单树一级目录
    for (var i = 0; i < allMenus.length; i++) {
        if (allMenus[i].parentMenuId == menuId) {
            curIdArr.push(allMenus[i].menuId);
            var link = allMenus[i].menuUrl.indexOf('BQ206SMT') > -1 ? allMenus[i].menuUrl : basePath
                    + allMenus[i].menuUrl;
            if (allMenus[i].menuUrl == '#' || allMenus[i].menuUrl == '') {
                link = 'javascript:;';
            }
            var dom = '<a name="aa" id="' + allMenus[i].menuId + '" href="' + link
                    + '" class="level1"><span class="arrow_bg"><span class="arrow2"></span></span>'
                    + allMenus[i].menuName + '</a>';
            firstDom += dom;
            firstDom += '<ul></ul>';
        }
    }

    tree.innerHTML = firstDom;
    var select = $("#tree"); 
    select.html(tree.innerHTML);
    $("#tree a span span").first().removeClass("arrow2").addClass("arrow1");

    // 判断是否支持indexOf
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

    // 菜单树二级目录
    for (var i = 0; i < allMenus.length; i++) {
        if (curIdArr.indexOf(allMenus[i].parentMenuId) > -1) {
            var link = allMenus[i].menuUrl.indexOf('BQ206SMT') > -1 ? allMenus[i].menuUrl : basePath
                    + allMenus[i].menuUrl;
            if (allMenus[i].menuUrl == '#' || allMenus[i].menuUrl == '') {
                link = 'javascript:;';
            }
            var dom = '<li><a name="'+allMenus[i].menuId+'" id="' + allMenus[i].menuId + '" href="' + link
                    + '" class="level2"><span></span>' + allMenus[i].menuName + '</a></li>';
            var curUlSelect = $(select).find("a[id='" + allMenus[i].parentMenuId + "']");
            var html = curUlSelect.next().html() || '';
            html += dom;
            $(curUlSelect.next()).html(html);
        }
    }
    menuTree.init();
    menuTree.init();
    menuTree.cssfn();
    $("#tree ul a:eq(0)").addClass("menu_selected");
    //更新我的工作台提醒--如果是工作台
    if (data.menuId == 1){
        updateWorkBeach();
    }
}

/**
 * 更新工作台提醒
 */
function updateWorkBeach(){
    //我的待办事项提醒
    var backlogA = $("a[href$='queryBacklogs']");
    if (backlogA.length > 0){
        CommonUtils.getAjaxData({url:basePath + 'backlog/queryBacklogsCount',type:'get'},function(data){
            var spanElement = backlogA.find("span:eq(1)");
            if (data > 0){
                if (spanElement.length > 0){
                    spanElement.html(data);
                }
                else{
                    backlogA.html(backlogA.html() + '<span class="newsRemind">'+ data +'</span>')
                }
            }
            else{
                spanElement.remove();
            }
        });
    }
    //工作台 预警信息提醒
    var warningA = $("a[href$='queryWarningInfos']");
    if (warningA.length > 0){
        CommonUtils.getAjaxData({url:basePath + 'warning/queryWarningsCount',type:'get'},function(data){
            var spanElement = warningA.find("span:eq(1)");
            if (data > 0){
                if (spanElement.length > 0){
                    spanElement.html(data);
                }
                else{
                    warningA.html(warningA.html() + '<span class="newsRemind">'+ data +'</span>')
                }
            }
            else{
                warningA.find("span:eq(1)").remove();
            }
        });
    }
}