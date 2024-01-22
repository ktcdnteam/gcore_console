function call_originList(){
    // showLoadingBox();    // 로딩중 이미지
    
    var params = {};
    params.command = "listCdn2";
    params.group_mem_sq = group_mem_sq;

    $.ajax({
        url : "/cdn/origin_groups/all"
        , type : "GET"
        , data : params
        , dataType : "json"
        , complete : function () {
            // hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            // if (json.status == "00") {
                list_OriginGroup(json);
            // }else{
                // if(json.status == "99"){
                    // showCommonNoLangErrorMsg("CDN서비스 조회","CDN서비스 조회중 에러가 발생하였습니다."+ "<br />" +"관리자에게 문의하세요");
                // }
            // }
                
        }
    });
}

function list_OriginGroup(items){
    $(".tr_origin_list").remove();
    // show_tooltip("button_cdnDelete", "Y");
    if(items != null && items.length > 0){
        for(var i = 0; i < items.length ; i++){
            var originList = $("#base_vmList").clone(true).addClass("tr_origin_list");
            // checkbox
            originList.find("input:checkbox[name=contentsList]").val(items[i].id);
            
            //이름      
            originList.find("#text_originDisplayText").text(items[i].name);
            $("#text_originDisplayText").text(items[i].name); //하단 선택된 서비스
            
            //origin
            var originText = '';
            if (items[i].sources.length > 0){
                for (var j=0; j < items[i].sources.length ; j++) {
                    originText += (j > 0)?'<br>':'';
                    originText += items[i].sources[j].source;
                }
            }
            originList.find("#text_originList").html(originText).end();


            // 사용중인 CDN서비스,상태
            var resourceText = '';
            if (items[i].has_related_resources && items[i].resource_info !== null){
                for (var j=0; j < items[i].resource_info.length ; j++) {
                    resourceText += (j > 0)?'<br>':'';
                    var status = items[i].resource_info[j].status
                    if (status == "active") { //사용
                        resourceText += '<img src="/images/c_common/ico_state_use.png" alt="사용" class="mr5 vm" />&nbsp;&nbsp'
                    } else if (status == "suspended") {
                        resourceText += '<img src="/images/c_common/ico_state_stop.png" alt="정지" class="mr5 vm" />&nbsp;&nbsp'
                    } else if(status == "processed") {
                        resourceText += '<img src="/images/c_common/ico_state_process.png" class="mr5 vm" />&nbsp;&nbsp'
                    }
                    resourceText += items[i].resource_info[j].description ;
                } 
            }
            originList.find("#text_resourceList").html(resourceText).end();
       
          
            originList.attr("id" , items[i].id);
            originList.attr("origin_name" , items[i].originGroup_name);
            
            originList.data("id" ,"");
            originList.data("origin_name" ,"");
         
            
            
            if(items[i].id){ originList.data("id" , items[i].id);}
            if(items[i].originGroup_name){ originList.data("origin_name" , items[i].originGroup_name);}
           
            
            $("#base_vmList").before(originList.show());
            
            firstlistcheck = true;
        
            //oneview경우 행선택 표시
            if(oneview_id!=""){
                if(oneview_id==items[i].svc_name){
                    $("#text_originDisplayText", originList).trigger("click");
                }
            }
                
        }
        // 최상단 자동클릭
        if(oneview_id!=""){
            oneview_id="";
        }
        
        $("#div_nonelist").hide();
    }
}

//Origin Event
function set_OriginEvent(){
    svcNm_chk = false;
    svcDm_chk = false;
    $("#green_svn_nm").hide();
    $("#red_svn_nm").hide();
    //sort
//     view_svr_name
// view_svr_origins
// view_svr_cdn


    //이름
    $("#view_svr_name").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_name");
    });
   

    //origin group 생성
    $("#button_originGroupDeploy").unbind("click").bind("click" , function(e) {
        if($(this).hasClass("action_disabled")){
            return false;
        }
        var dlgForm = $("#dialog_OriginGroup_Detail");
        commonDialogInit(dlgForm);
        dlgForm.dialog("open");

        dlgForm.find("#OriginGroupPreCautions").removeClass("on");
        dlgForm.find("#OriginGroupPreCautionsArea").removeClass("on");
        // $('#purge_domain').remove();
        // $('option','#purge_domain').remove();
        dlgForm.find($("#origin_type li span")).each(originTypeClick);

        function originTypeClick(){
            if($(this).attr('value') == "0"){
                $(this).attr('class', 'imgbn');
                dlgForm.find("#originCreateArea").hide();
            }else{
                $(this).attr('class', 'imgbn on');
                dlgForm.find("#originCreateArea").show();
            }
        }
        // dlgForm.find("#originList").val("");
        // $('<option value="cdn_domain">'+cdn_domain+'</option>').appendTo('#purge_domain');
        // selectbox_design($("#purge_domain"));
        // dlgForm.find("#hardPurgeUse").prop("checked", false);
        
        // 팝업 주의사항 보기
        dlgForm.find("#OriginGroupPreCautions").unbind("click").bind("click" , precautionToggle);
            
    
        function precautionToggle(){
            dlgForm.find("#OriginGroupPreCautions").toggleClass("on");
            dlgForm.find("#OriginGroupPreCautionsArea").toggleClass("on");
        }
        
        dlgForm.find($("#origin_type li span")).unbind("click").bind("click", originTypeClick1);
    
        function originTypeClick1(){
            dlgForm.find("#originList").val("");
            $("#origin_type li span").each(originTypeClickSub);
            $(this).addClass('on');
            if($(this).attr('value') == "0"){
                // dlgForm.find("#originListArea1").show();
                // dlgForm.find("#originCreateArea1").hide();
            }else{
                dlgForm.find("#originListArea1").hide();
                dlgForm.find("#originCreateArea1").show();
            }
        }
    
        function originTypeClickSub(){
            $(this).removeClass('on');
        }
         
        dlgForm.find("#btn_OriginCancel_TOP").unbind("click").bind("click", cancelTopOriginPop);
        dlgForm.find("#btn_OriginCancel").unbind("click").bind("click", cancelTopOriginPop);

        

        function cancelTopOriginPop(){
            dlgForm.dialog("close");
        }
        
        $("#originList").keyup(function (e){
            var content = $(this).val();

            // if(content.length>5000){
            //     $(this).val(content.substring(0,5000));
            //     // showCommonNoLangErrorMsg("", "최대 5000자 이내로 입력 가능합니다.");
            //     return;
            // }
        });
        
      
        
        // //수정 _ step4_set
        // $("span[name=ip_access_controll]").removeClass('on');
        // $("span[name=geo_access_controll]").removeClass('on');
        
        // dlgForm.find("#allow_http_method").children('li').find('.stat').removeClass('on');
        // dlgForm.find("#corsSet").children('li').find('.stat').removeClass('on');
        // dlgForm.find("#step4_modify_header").children('li').find('.stat').removeClass('on');
        // 1.3 버튼        
        // $('option','#step4_modify_header_action').remove();
        // selectbox_design($("#step4_modify_header_action"));
        selectbox_design($("#backup_box"));

        //step4 Modify Header
        $("#step4_modify_header li span").unbind("click").bind("click", function(e) {
            var dlgForm = $("#cdnCreateArea");
            dlgForm.find("#step4_modify_header li span").removeClass('on');
            $(this).addClass('on');
            let type = dlgForm.find("#step4_modify_header").find(".on").attr("value");

        });    
        //origin 추가
        $("#step4_modify_header_add").unbind("click").bind("click", function() {
            //초기화
            $("#step4_modify_header_name").attr("required", false);
            $("#step4_modify_header_value").attr("required", false);

            let backup = ($("#backup_box").val()== "Backup")?true:false;
            let originSource = $("#step4_modify_header_name").val();
            let originPort = $("#step4_modify_header_value").val();
            var enable =  $("#hardPurgeUse22").is(":checked")? "ON": "OFF";
             // (첫주) : 첫번째 필수 active, on 등록 // 도메인, 숫자 정규식
             if (Object.keys(add_client_response_headers).length === 0) {
                if (backup || $("#hardPurgeUse22").is(":checked") == false){
                    $("#modify_header_client_text_area").show();
                    $("#modify_header_client_red_text").text("처음 등록 될 오리진은 primary origin으로 설정됩니다. Active 및 Enable On 필수입니다.");
                    return false
                }
            }
            // originSource 입력값 유효성 체크
            if (originSource === "" || !checkDomainOrIP(originSource)) {
                $("#step4_modify_header_name").attr("required", true);
                $("#modify_header_client_text_area").show();
                $("#modify_header_client_red_text").text("IP주소 또는 도메인 형식만 가능합니다.");
                return false;
            }else{
                $("#step4_modify_header_name").attr("required", false);
            }

            $("#modify_header_client_text_area").hide();

            //use_default_port가 true이면서 origin port가 없을 때 
            if (!$("#use_default_port").prop("checked") && !checkPort(originPort)){
                $("#step4_modify_header_value").attr("required", true);
                $("#modify_header_client_red_text").text("포트 번호는 0부터 65535 사이의 정수여야 합니다.");
                return false;
            }else {
                $("#step4_modify_header_value").attr("required", false);
            }
            

            //저장 후 테이블 출력
            
            add_client_response_headers[originSource] = originPort;
            let base_modify_header = $("#step4_base_modify_header").clone().show();
            let base_modify_header_step5 = $("#step5_modify_header2_base").clone().attr('id', originSource).show(); // 최종화면
            
            $("#step4_modify_header_name").val('');
            $("#step4_modify_header_value").val('');
            
            base_modify_header.find("#text_step4_modify_header_action").text($("#backup_box").val());
            base_modify_header.find("#text_step4_modify_header_enable").text(enable);
            base_modify_header.find("#text_step4_modify_header_name").text(originSource);
            base_modify_header.find("#text_step4_modify_header_value").text(originPort);
            
            // base_modify_header_step5.find("#base_action").text($("#backup_box").val());
            // base_modify_header_step5.find("#base_enable").text(enable);
            // base_modify_header_step5.find("#base_name").text(originSource);
            // base_modify_header_step5.find("#base_value").text(originPort);
            
            console.log(add_client_response_headers);
            base_modify_header.find(".tablessh").bind("click", function() {
                let text_header_name = $(this).parent().parent().find("#text_step4_modify_header_name").text();
                delete add_client_response_headers[text_header_name];
                $(this).parent().parent().remove();
                $("#step5_modify_header_step4_div").find("#" + originSource).remove();
            });
            console.log(add_client_response_headers);
            $("#step5_modify_header2_base").before(base_modify_header_step5);
            $("#step4_base_modify_header").before(base_modify_header);
        });

        dlgForm.find("#btn_ResourceOk").unbind("click").bind("click", ResourceOK); 
        function ResourceOK(){
            var originURLList = dlgForm.find("#originList").val();
            var origin_type =null;
            $("#origin_type li span").each(getOriginType);
            function getOriginType(){
                if($(this).hasClass('on')){
                    origin_type = $(this).attr('value');
                }
            }
            //23.12.15 멈춤
            var param = {
                service_name : dlgForm.find("#service_name").val(),
                service_domain : dlgForm.find("#service_domain").val(),
                origin_id : 0,
                origin_url : '',

            };
            console.log("origin group에서 log찍히면 이부분 지우기. 복붙코드")
            if(origin_type == "1"){
                var $selectedOption = dlgForm.find("#originGroupList option:selected")
                var selectNum = $selectedOption.val();
                var selectValue1 = $selectedOption.attr('value1');
                
                param.origin_id = Number(selectNum);
                param.origin_url = selectValue1;
                resourceCreate(param);
                dlgForm.dialog("close");
            }else if (origin_type == "0"){
                if (originURLList == "") {
                    showCommonNoLangErrorMsg("Origin 확인", " 최소 1개 이상의 오리진 주소를 입력하세요.");
                    return;
                }
                var origin_arr = originURLList.split("\n");
                if(origin_arr.length > 5){
                    showCommonNoLangErrorMsg("", "한번에 최대 5개까지 입력 가능합니다.");
                    return;
                }
                var params = {origins : origin_arr};
                $.ajax({
                    url : "/cdn/origin_group",
                    type : "POST",
                    contentType: "application/json",
                    data : JSON.stringify(params),
                    dataType : "json",
                    success : function(json) {
                        if(json.status == "29") { /* IAM 사용자 정책 처리 */
                            commonErrorMessage("29");
                            return;
                        }   
                        if ( json.status == '00'){
                            param.origin_id = json.data.id;
                            param.origin_url = json.data.sources[0].source;
                            param.protocol = protocol;
                            resourceCreate(param);
                            dlgForm.dialog("close");
                        }
                    },error: function(XMLHttpResponse) {
                        var resp = JSON.parse(XMLHttpResponse.responseText);
                        success_msg = param.service_name + " 생성 실패 (" + resp.data + ")";
                        add_noti_message("/cdn/list", success_msg);
                        process_toast_popup("CDN", success_msg, false);
                    }
                }); 
            }
            $("#purge_OkUrl").empty();
            $("#purge_FailUrl").empty();
        }

        //Origin 수정
        $("#button_originUdate").unbind("click").bind("click" , function(e) {
            e.preventDefault();
            event_OriginUpdate(e);
            return false;
        }); 
        //Origin 삭제
        $("#button_originDelete").unbind("click").bind("click" , function(e) {
            e.preventDefault();
            event_originDelete(e);
            return false;
        });




        dlgForm.find("#btn_OriginOk").unbind("click").bind("click", OriginOK); 
        function OriginOK(){
            var originURLList = dlgForm.find("#originList").val();
            var origin_type =null;
            $("#origin_type li span").each(getOriginType);
            function getOriginType(){
                if($(this).hasClass('on')){
                    origin_type = $(this).attr('value');
                }
            }
            //23.12.15 멈춤
            var param = {
                service_name : dlgForm.find("#origin_name").val(),
                service_domain : dlgForm.find("#service_domain").val(),
                origin_id : 0,
                origin_url : '',
            };
            if(origin_type == "1"){
                var $selectedOption = dlgForm.find("#originGroupList option:selected")
                var selectNum = $selectedOption.val();
                var selectValue1 = $selectedOption.attr('value1');
                
                param.origin_id = Number(selectNum);
                param.origin_url = selectValue1;
                resourceCreate(param);
                dlgForm.dialog("close");
            }else if (origin_type == "0"){
                if (originURLList == "") {
                    showCommonNoLangErrorMsg("Origin 확인", " 최소 1개 이상의 오리진 주소를 입력하세요.");
                    return;
                }
                var origin_arr = originURLList.split("\n");
                if(origin_arr.length > 5){
                    showCommonNoLangErrorMsg("", "한번에 최대 5개까지 입력 가능합니다.");
                    return;
                }
               
                var params = {name: dlgForm.find("#origin_name").val(), origins : origin_arr };
                $.ajax({
                    url : "/cdn/origin_group",
                    type : "POST",
                    contentType: "application/json",
                    data : JSON.stringify(params),
                    dataType : "json",
                    success : function(json) {
                        if(json.status == "29") { /* IAM 사용자 정책 처리 */
                            commonErrorMessage("29");
                            return;
                        }   
                        if ( json.status == '00'){
                            param.origin_id = json.data.id;
                            param.origin_url = json.data.sources[0].source;
                            resourceCreate(param);
                            dlgForm.dialog("close");
                        }
                    },error: function(XMLHttpResponse) {
                        var resp = JSON.parse(XMLHttpResponse.responseText);
                        success_msg = param.service_name + " 생성 실패 (" + resp.data + ")";
                        add_noti_message("/cdn/list", success_msg);
                        process_toast_popup("CDN", success_msg, false);
                    }
                }); 
            }
            $("#purge_OkUrl").empty();
            $("#purge_FailUrl").empty();
        }
    });
    $("#button_cdnDetail").unbind("click").bind("click" , button_cdnDetail_event);
    $("#base_vmList").unbind("click").bind("click" , event_originClick);
}

function event_originClick(e){
    e.preventDefault();
    selectedRow = $(e.target).parents("tr");
    var selectedvm_id = selectedRow.attr("id");
    var selectedvm_name = selectedRow.attr("origin_name");
    if(selectedvm_id == null) {
        return false;
    }
  
    selectedRow.data("id", selectedvm_id);
    selectedRow.data("origin_name", selectedvm_name)

  
    $("input:checkbox[name=contentsList]").prop("checked",false).change();
        selectedRow.find("input:checkbox[name=contentsList]").prop("checked",true).change();
        
        $("#button_cdnDetail").removeClass('action_disabled');
        $("#button_cdnModify").removeClass('action_disabled');
    
    setControl_Panel_Origin();

}

function setControl_Panel_Origin(){
    //11/16 설명창에 나오는 상태 이미지처리
    // if(!selectedRow.find("input:checkbox[name=contentsList]").prop("checked")){
    //     $("#button_originUpdate").attr("class", "action action_disabled");
    //     $("#button_originDelete").attr("class", "action action_disabled");
        
    // }else{ // 사용중 상태
        //각 액션 버튼 셋팅
        $("#button_originUpdate").attr("class", "action");
        $("#button_originDelete").attr("class", "action");

        $("#button_originUpdate").unbind("click").bind("click" , button_originUpdate_event); 
        $("#button_originDelete").unbind("click").bind("click" , button_originDelete_event); 
        show_tooltip("button_cdnDelete", "Y");
    // }
}

// Origin 삭제
function button_originDelete_event(e) {
    e.preventDefault();
    if($(this).hasClass("action_disabled")){
        return false;
    }
    event_originDelete(e);
}

//Origin 삭제
function event_originDelete(e){
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("origin_name")
    var el_dialog = $("#dialog_Origin_Delete"); 
    commonDialogInit(el_dialog);
    el_dialog.dialog("open");
    // var cdn_domain = selectedRow.data("domain");
    $("#dialog_Origin_Delete").find("#dialog_Origin_Delete_text1").text(svc_name);
    $("#button_VM_Delete_TopClose", el_dialog).unbind("click").bind("click" , cancelDelPop);
    $("#button_VM_Delete_Cancel", el_dialog).unbind("click").bind("click" , cancelDelPop);
    function cancelDelPop(){
        el_dialog.dialog("close");
    }
    $("#button_VM_Delete_OK", el_dialog).unbind("click").bind("click" , vmDelOK);
    function vmDelOK(){
        el_dialog.dialog("close");
        call_Origin_Delete(svc_id, svc_name);
        return false;
    }
}

// Origin 삭제
function call_Origin_Delete (svc_id, svc_name) {
    var success_msg = svc_name + " 삭제 시작";
    process_toast_popup("CDN", success_msg, true);
    
    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />삭제중');
    // $("#dialog_CDN_Delete").dialog("close");
    var delURL ="/cdn/origin_groups/" + svc_id;
    $.ajax({
        url : delURL
        , type : "DELETE"
        , data : null
        , dataType : "json"
        , complete : function () {
            // hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if (json.status == "00") {
                success_msg = svc_name + " 삭제 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
                call_originList()
            }else{
                success_msg = svc_name + " 삭제 실패(" + json.data + ")";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
                call_originList()
            }
        }
    });

}

// Origin Update
function button_originUpdate_event(e) {
    e.preventDefault();
    if($(this).hasClass("action_disabled")){
        return false;
    }
    // event_originUpdate(e);
}