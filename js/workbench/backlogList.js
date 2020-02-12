window.BacklogList = (function($, module) {
    _backlogRole = {
        '1' : '系统管理员',
        '2' : '车间主管',
        '3' : '工艺师',
        '4' : '库管员',
        '5' : '生产人员',
        '6' : '检验员'
    }, _backlogType = {
        '1' : '生产领料出库',
        '2' : '出库审批',
        '3' : '完成出库',
        '4' : '机损审批',
        '5' : '生产订单提醒',
        '6' : '未编辑工艺流程',
        '7' : '排产后生产准备',
        '8' : '返修处理',
        '9' : '盘点创建',
        '10' : '盘点审批',
        '11' : '盘点调整',
        '12' : '安全库存补料',
        '13' : '工位机损审批',
        '14' : '安全库存补料审批',
        '15' : '机损补料',
        '16' : '安全库存发送',
        '17' : '生产退料'
    };

    /**
     * 初始化
     */
    function init() {
        bindEvent();
        initPageInfo();
    }

    /**
     * 加载页面
     */
    function initPageInfo() {
        // 更新page信息
        var url = 'backlog/queryBacklogsByPage';
        CommonUtils.getAjaxData({
            url : url,
            type : 'GET'
        }, function(data) {
            PageUtils.refreshPageInfo({
                element : 'backlogPage',
                url : url,
                callback : showBacklog
            }, data['page']);
            showBacklog(data);
        });
        // 更新待办事项状态
        self.parent.menuFrame.updateWorkBeach();
    }

    /**
     * 绑定事件
     */
    function bindEvent() {
        // 开始时间
        $("input[name='createTime']").datepicker(
                {
                    dateFormat : 'yy-mm-dd',
                    changeYear : true,
                    changeMonth : true,
                    showOn : "button",
                    monthNamesShort : [ "January", "February", "March", "April", "May", "June", "July", "August",
                            "September", "October", "November", "December" ],
                    buttonImage : basePath + "img/button/calendar.png",
                    buttonImageOnly : false
                });
    }

    /**
     * 显示列表
     */
    function showBacklog(data) {
        // 显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format) {
            if (date) {
                return moment(date).format(format);
            }
            return '';
        };
        data['_backlogType'] = _backlogType;
        data['_backlogRole'] = _backlogRole;
        var html = template('backlogTemp', data);
        $("#backlogTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }

    /**
     * 更新待办事项状态
     */
    function updateStatus(id, type, url) {
        // 如果是生产退料 则只处理状态 不跳转
        if (type == 17) {
            CommonUtils.getAjaxData({
                url : basePath + 'backlog/updateBacklogStatus?id=' + id,
                type : 'get'
            }, function(data) {
                // 刷新当前分页数据
                var current = PageUtils._currentPage['backlogPage'];
                PageUtils.pageClick(current, 'backlogPage');
                self.parent.menuFrame.updateWorkBeach();
            })
            return;
        }
        var requestUrl = (type == 1 || type == 12) ? basePath + encodeURI(url) + '?id=' + id : basePath
                + encodeURI(url);
        window.location.href = requestUrl;// 目标跳转

    }
    /**
     * 更新待办事项状态
     */
    function updateStatus_bck(id, type, url) {
        // 生产领料出库 和 安全库存补料需要附带待办事项id
        var requestUrl = (type == 1 || type == 12) ? basePath + encodeURI(url) + '?id=' + id : basePath
                + encodeURI(url);
        window.location.href = requestUrl;
    }

    module.init = init;
    module.updateStatus = updateStatus;
    return module;
}($, window.BacklogList || {}));
$(function() {
    BacklogList.init();
});