
	
	// 重新排序
	function sortTableTr(){
		var processTab = document.getElementById("processTable");
		var arr=[];
        for(var i=0;i<processTab.tBodies[0].rows.length;i++)
            arr[i]=processTab.tBodies[0].rows[i];
        arr.sort(function (tr1,tr2) {
            var n1=tr1.cells[1].childNodes[0].value;
            var n2=tr2.cells[1].childNodes[0].value;
            return n1-n2;
        });
        for(var i=0;i<arr.length;i++)
        {
        	processTab.tBodies[0].appendChild(arr[i]);
        }

	}
	
	//获取当前序号最大值+1
	function getMaxSerialNo(){
		var trList = $("#tablelist").find("tr");
		var len = $("#tablelist").find("tr").length;
		if(len > 0){
			var maxSerial = trList[len-1].cells[1].childNodes[0].value;
			if(null != maxSerial){
				return parseInt(maxSerial)+1;
			}
			return len;
		}
		return 1;
	}
	

	// -------- 增加明细 ---------
	function addDetail() {
		trInt = getMaxId();
		
		var dom = "";
		dom += "<tr class='contentText list_list' id='"+ (trInt) +"'>";
		dom += "<td class='checkBox2item'><input type='checkbox' class='input_checkBox' ></td>";
		dom += "<td ><input class='serialNo' id='serialNo"+ (trInt) +"' name = 'commonProessTemplates["+ (trInt) +"].serialNo' value='"+ getMaxSerialNo() +"' ><span style='color:red;' >*</span></td>";
		dom += "<td><div  class='addRemind1'><input class = "+ (trInt) +" type='text' name='commonProessTemplates[" + (trInt) + "].processCode' value=''><span style='color:red;' >*</span></div></td>";// onchange='inventorySupplyAdd.complement(value,"+trInt+" )'
		dom += "<td><div  class='addRemind1'><input class = "+ (trInt) +" type='text' name='commonProessTemplates[" + (trInt) + "].processName' value=''><span style='color:red;' >*</span></div></td>";// onchange='inventorySupplyAdd.complement(value,"+trInt+" )'
		dom += "<td class = 'fileupload'><div class='addRemind1 uploadImg2'><img onclick='uploadFile(this);' src='../../img/file/uploadFile.png'  /><input style='width:100%; display:none;' id = 'uploadfile"+ (trInt) +"' type='file' class = 'processfile' name = 'processfile' onchange ='fileUpload(this)'  value=''></div></td>";
		dom += "<td><div id = 'uploadFiles"+ (trInt) +"'  class='addRemind1'><input id = 'saveFileName"+ (trInt) +"' style = 'display:none;' name='commonProessTemplates[" + (trInt) + "].saveFileName' /> <input id = 'oriFileName"+ (trInt) +"' style = 'display:none;' name='commonProessTemplates[" + (trInt) + "].oriFileName' /> </div></td>";// onchange='inventorySupplyAdd.complement(value,"+trInt+" )'
		dom += "<td><div  class='addRemind1'><input type='text' name='commonProessTemplates[" + (trInt) + "].remark' value=''></div></td>";// onchange='inventorySupplyAdd.complement(value,"+trInt+" )'
		dom += "<td><input id='nextProcessId"+ (trInt) +"' type='hidden' name='commonProessTemplates[" + (trInt) + "].nextProcessId'/>" +
				"</td>";// onchange='inventorySupplyAdd.complement(value,"+trInt+" )'
		
		dom += "</tr>";
		$("#tablelist").append(dom);
		
        refrashOption();
	}
	
	// 图片点击
	function uploadFile(obj){
		$(obj).next().click();
	}
	
	function getMaxId(){
		var maxId = 0;
		var trList = $("#tablelist").find("tr");
		if(trList.length > 0){
			$.each(trList, function(index, obj){
				var id = parseInt($(obj).attr("id"));
				if(maxId < (id +1)){
					maxId = id + 1;
				}
			});
		}
		return maxId;
	}
	
	// 刷新option内容
	function refrashOption(){
		 // 更新option选项
        setNewestOptionHtml();
        //绑定上传事件
//        bindFileUpload();
        $(".nextProcessId").fSelect();

	}
	
	// 获取最新option选项内容 map， key值为行Id,value为option字符串
	function setNewestOptionHtml(){
		var serialEles = $(".serialNo");
		if(null != serialEles && serialEles.length > 0){

			$.each(serialEles, function(index, obj){
				var optionHtml = "<select multiple='multiple' class='nextProcessId' >";
				// 行下标的key
				var trKey = $.trim($(obj).parent().parent().attr("id"));
				// 获取选中的下一道工序的值 - 或者默认值
				var selectedArr = getDefaultNextProcess(trKey, index, serialEles);
					$.each(serialEles, function(index2, obj2){
						if(trKey != $.trim($(obj2).parent().parent().attr("id"))){
							if(containsEle(selectedArr, $(obj2).val())){
								
								optionHtml += "<option selected='selected' value='"+ $(obj2).val() +"'>"+ $(obj2).val() +"</option>";
							}else{
								
								optionHtml += "<option value='"+ $(obj2).val() +"'>"+ $(obj2).val() +"</option>";
							}
						}
					});
				optionHtml += "</select>";
				$("#nextProcessId" + trKey).next().remove();
				$("#nextProcessId" + trKey).parent().append(optionHtml);
			});
		}
	}
	
	function getDefaultNextProcess(trKey, index, serialEles){
		var selectedArr = [];
		var strVal = $("#nextProcessId" + trKey).val();
		if(null == strVal || "" == $.trim(strVal)){
			// 获取默认值
			// 不是最后一个
			if((index + 1) < serialEles.length){
				strVal = serialEles[index + 1].value;
				selectedArr.push(strVal);
			}
		}else{
			selectedArr = strVal.split(",");
		}
		return selectedArr;
	}
	
	// 数组中是否包含对应值
	function containsEle(selectedArr, eleVal){
		var containFlag = false;
		$.each(selectedArr, function(index, obj){
			if($.trim(obj) == $.trim(eleVal)){
				containFlag = true;
			}
		});
		return containFlag;
	}
