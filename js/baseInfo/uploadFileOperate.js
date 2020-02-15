

// 点击预览
function previewFile(){
	$("#promptDiv").css("display", "none");
	var filePosition = getFilePosition();
	var oriFileName = getFileName();
	var saveFileName= getSaveFileName(oriFileName);
	delAttrId();
	if(isPreviewFileType(oriFileName)){
		
		window.open("/show/toPreviewPage?oriFileName=" + encodeURI(oriFileName) + "&saveFileName="+ encodeURI(saveFileName) +"&filePosition=" +encodeURI("/" + filePosition + "/"), 'newwindow');
	}else{
		alert("文件类型不支持预览！");
	}
}

// 判断是否为可预览文件类型
function isPreviewFileType(fileName){
	if(null != fileName){
		var fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
		if(-1 != ".png.jpg.gif.bmp.doc.docx.pdf.xls.ppt.xlsx.xlsm.pptx".indexOf(fileType.toLowerCase())){
			return true;
		}
	}
	return false;
}

// 根据源文件获取后端保存文件的名称
function getSaveFileName(oriFileName){
	var saveFileEle = $("#selectedNode").parent().children(":first");
	var saveFileValue = saveFileEle.val();
	var oriFileValue = saveFileEle.next().val();
	saveFileValueArr = saveFileValue.split(",");
	oriFileValueArr = oriFileValue.split(",");
	var delIndex = null;
	//删除源文件名的值完全匹配
	for(var i=0; i < oriFileValueArr.length; i++){
		if(oriFileName == oriFileValueArr[i]){
			delIndex = i;
			break;
		}
	}
	if(null != delIndex){
		return saveFileValueArr[delIndex];
	}
	return null;
	
}


// 删除上传文件
function delFile(){
	$("#promptDiv").css("display", "none");
	
	var oriFileName = getFileName();
	var saveFileName= getSaveFileName(oriFileName);
	var filePosition = getFilePosition();
	var processId =  getProcessId(filePosition);
	var pageFlag = $("#pageFlag").val();
	delProcessValue(oriFileName);

	// 自定已删除函数
	$.ajax({
		url:"/productTechnology/delUploadFile",
		type:"POST",
		data:{"oriFileName":oriFileName,"saveFileName":saveFileName,"filePosition":filePosition,"pageFlag":pageFlag, "id":processId},
		async:false,
		dataType:"text",
		success:function(resultData){
			if("success" == resultData){
				$("#selectedNode").remove();
				delAttrId();
			}
		},
		error:function(resultData){
			
		}
		
	});
}

function delProductFile(){
$("#promptDiv").css("display", "none");
	
	var oriFileName = getFileName();
	var saveFileName= getSaveFileName(oriFileName);
	var filePosition = getFilePosition();
	var id = $("#id").val();
	var pageFlag = $("#pageFlag").val();
	delProcessValue(oriFileName);

	// 自定已删除函数
	$.ajax({
		url:"/productInfo/delUploadFile",
		type:"POST",
		data:{"oriFileName":oriFileName,"saveFileName":saveFileName,"filePosition":filePosition,"pageFlag":pageFlag, "id":id},
		async:false,
		dataType:"text",
		success:function(resultData){
			if("success" == resultData){
				$("#selectedNode").remove();
				delAttrId();
			}
		},
		error:function(resultData){
			
		}
		
	});
}

// 当点击删除时，将productProessTemplates[0].processfile 对应的值删除
function delProcessValue(oriFileName){
	var saveFileEle = $("#selectedNode").parent().children(":first");
	var saveFileValue = saveFileEle.val();
	var oriFileValue = saveFileEle.next().val();
	saveFileValueArr = saveFileValue.split(",");
	oriFileValueArr = oriFileValue.split(",");
	
	//删除源文件名的值完全匹配
	for(var i=0; i < oriFileValueArr.length; i++){
		if(oriFileName == oriFileValueArr[i]){
			oriFileValueArr.splice(i,1);
			saveFileValueArr.splice(i,1);
		}
	}
	//删除后台文件名的值
	saveFileEle.val(saveFileValueArr.join(","));
	saveFileEle.next().val(oriFileValueArr.join(","));
}

//文件操作
function operateFile(rootNode){
	
	// 增加id属性
	$(rootNode).attr("id", "selectedNode");
	var divClass = $(rootNode).attr("class");
	// 权限
	if(-1 != divClass.indexOf("10")){
		//只读权限，直接预览
		previewFile();
	}else{
		//显示弹框
		$("#promptDiv").css("display", "block");
	}
	
	
}

// 根据class属性获取上传文件所属位置
function getFilePosition(){
	var divClass = $("#selectedNode").attr("class");
	if(-1 != divClass.indexOf("tempUpFiles")){
		return "tempUpFiles";
	}
	return "saveFiles";
}

//根据文件位置得到工序Id
//当工序文件位置在saveFiles是，表示已经是保存好的文件，所以会有ID，其他情况不存在id
function getProcessId(filePosition){
	if("saveFiles" == filePosition){
		var rootNode = $("#selectedNode").parent();
		var processId = getParentNodeAttr(rootNode,"id", "TR")
		if(null != processId){
			return processId;
		}
	}
	return -1;
}

//根据节点，获得父节点中具体的属性值
function getParentNodeAttr(rootNode,attrName, nodeName){
	var parentNode = rootNode.parent();
	if(nodeName == parentNode[0].tagName){
		var attrValue = parentNode.attr(attrName);
		if(null != attrValue){
			return attrValue;
		}else{
			return null;
		}
	}else{
		return getParentNodeAttr(parentNode,attrName, nodeName);
	}
}

// 获取源文件名称
function getFileName(){
	//通过id获取节点
	var selectedNode = document.getElementById("selectedNode");
	var oriFileName = $.trim($(selectedNode).text());
	return oriFileName;
}

// 删除节点id属性
function delAttrId(){
	$("#selectedNode").removeAttr("id");
}


//下载文件
function downloadFile(){
	$("#promptDiv").css("display", "none");
	var filePosition = getFilePosition();
	var oriFileName = getFileName();
	// 根据源文件名称获取后端保存文件名称
	var saveFileName = getSaveFileName(oriFileName);
	delAttrId();
	// 创建下载链接
	if(null != saveFileName){
		download(basePath + filePosition +"/" +saveFileName, oriFileName);
		/*downloadFileOperate(saveFileName, basePath + filePosition +"/" +saveFileName);*/
	}else{
		alert("文件不存在！");
	}
}

//下载文件操作
/*function downloadFileOperate(fileName, fileUrl){
	var eleLink = document.createElement("a");
	eleLink.download = fileName;
	eleLink.style.display = 'none';
	eleLink.href = fileUrl;
	document.body.appendChild(eleLink);
	eleLink.click();
	// 移除
	document.body.removeChild(eleLink);
}*/


/**
* 下载
* @param  {String} url 目标文件地址
* @param  {String} filename 想要保存的文件名称
*/
function download(url, filename) {

	getBlob(url, function (blob) {
		saveAs(blob, filename);
	});

};

/**

* 获取 blob
* @param  {String} url 目标文件地址
* @return {cb} 
*/

function getBlob(url, cb) {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';
	xhr.onload = function () {
		if (xhr.status === 200) {
			cb(xhr.response);
		}
	};
	xhr.send();

}

/**
* 保存
* @param  {Blob} blob     
* @param  {String} filename 想要保存的文件名称
*/

function saveAs(blob, filename) {
	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		var link = document.createElement('a');
		var body = document.querySelector('body');
		link.href = window.URL.createObjectURL(blob);
		link.download = filename;
		// fix Firefox
		link.style.display = 'none';
		body.appendChild(link);
		link.click();
		body.removeChild(link);
		window.URL.revokeObjectURL(link.href);
	};

}


//取消
function cancel(){
	//隐藏弹框
	$("#promptDiv").css("display", "none");
	//删除id
	delAttrId();
}



