//2015.07.07 김소영
//showCommonLangErrorMsg() : 경고성 팝업(드래그 불가)
//showCommonLangErrorBoldMsg() : 경고성 팝업(드래그 불가)
//showCommonMsg() : 일반 팝업(드래그 가능) : 임시로 드래그 기능 막음
$(document).ready(function() {
    load_popup_messages();
});

//공통 에러 팝업 메세지
//title_cls, msg_cls : 다국어 properties ID 값을 읽어와서 뿌림
function showCommonLangErrorMsg(title_cls, msg_cls, close_function, setting_function){
    
    $("#dialogCommonErrorMsg").remove();
    var el_dialog = $("#dialogCommonErrorMsg");
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg" style="width:500px !important;  top:auto !important; display:none;">');
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push('    <div class="body"> ');
        arrHtml.push('    <div class="con"> ');
        arrHtml.push('    <div id="commonErrMsgDesc" class="pop_sub_tit ac" ' + msg_cls + '"></div> ');
        arrHtml.push('    </div></div> ');
        arrHtml.push('    <div class="btn_box mt40"> ');
        if(get_lang_cookie() == "en") {
            arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#" class="">Check</a></div> ');
        }else{            
            arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#" class="">확인</a></div> ');
        }
        arrHtml.push('    </div> ');
        
        $(arrHtml.join("")).appendTo("body");
        
        el_dialog = $("#dialogCommonErrorMsg");
    }

    var opt    = {};
    
    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }
    
    commonDialogInit(el_dialog, opt);
    
    //다국어 적용  start
    //title
    var returnVal = get_console_messages(title_cls);
    if ( returnVal == "" || returnVal == undefined )    {
        returnVal = title_cls;
    }
    $("#commonErrMsgTitle").html(returnVal); 
    //msg
    returnVal = get_console_messages(msg_cls);
    if ( returnVal == "" || returnVal == undefined )    {
        returnVal = msg_cls;
    }
    $("#commonErrMsgDesc").html(returnVal); 
    //다국어 적용 end
    
    el_dialog.dialog("open");
    
    if (typeof setting_function == "function"){
        setting_function();
    }
    
    $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        
        if (typeof close_function == "function"){
            close_function();
        }
    });
    
    $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
    });
}

//공통 에러 팝업 메세지
function showCommonNoLangErrorMsg(title_cls, msg_cls, close_function){
    
    $("#dialogCommonErrorMsg").remove();
    var el_dialog = $("#dialogCommonErrorMsg");
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg" style="width:500px;top:auto !important; display:none;"> ');
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push('    <div class="body"> ');
        arrHtml.push('    <div class="con ac"> ');
        arrHtml.push('    <p class="box_txtl ac mt20" id="commonErrMsgDesc"></p> ');
        arrHtml.push('    <div class="btn_box mt40"> ');
        arrHtml.push('    <div> ');
        arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#">확인</a></div> ');
        arrHtml.push('    </div></div></div></div></div> ');
        
        $(arrHtml.join("")).appendTo("body");
        
        el_dialog = $("#dialogCommonErrorMsg");
    }

    var opt    = {};
    
    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }
    
    commonDialogInit(el_dialog, opt);
    
    //msg
    $("#commonErrMsgDesc").html(msg_cls); 
    //확인버튼
    var returnVal = get_console_messages("txt_lang_confirm");
    $("#commonErrChk").html(returnVal); 
    //다국어 적용 end
    
    el_dialog.dialog("open");
    add_active_popup(el_dialog.attr("id"));
    
    el_dialog.keydown(press_enter)
    function press_enter(key) {
        if (key.keyCode == 13){
            el_dialog.dialog("close");
        }
    }
    
    $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        
        if (typeof close_function == "function"){
            close_function();
        }
    });
    $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
    });
}


//공통 팝업 메세지showCCdlgError_Msg
function showCommonLangErrorBoldMsg(title_cls, msg_cls, msg_bold_cls ,close_function, setting_function){
    
    $("#dialogCommonErrorMsg2").remove();
    var el_dialog = $("#dialogCommonErrorMsg2");
    
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg2" style="width:447px !important;  top:auto !important; display:none;">');
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push('    <div class="body"> ');
        arrHtml.push('    <div class="con ac"> ');
        arrHtml.push('    <div id="commonErrMsgDesc2" class="pop_sub_tit ac' + msg_cls + '"></div> ');
        arrHtml.push('    <div id="commonErrpbold2" class="pop_sub_tit ac"><em id="commonErrBoldMsgDesc" class="' + msg_bold_cls + '"></em></div> ');
        arrHtml.push('    <div class="btn_box mt40"> ');
        arrHtml.push('    <div> ');
        if(get_lang_cookie() == "en") {
            arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#" class="">Check</a></div> ');
        }else{            
            arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#" class="">확인</a></div> ');
        }
        arrHtml.push('    </div></div></div></div></div> ');
                
        $(arrHtml.join("")).appendTo("body");
        
        el_dialog = $("#dialogCommonErrorMsg2");
    }

    var opt    = {};
    
    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }
    
    commonDialogInit(el_dialog, opt);
    
    //다국어 적용  start
    //title
    var returnVal = get_console_messages(title_cls);
    $("#commonErrMsgTitle2").html(returnVal); 
    //msg
    var returnVal = get_console_messages(msg_cls);
    $("#commonErrMsgDesc2").html(returnVal); 
    //bold msg
    if(msg_bold_cls != ""){
        var returnVal = get_console_messages(msg_bold_cls);
        $("#commonErrBoldMsgDesc").html(returnVal);
        $("#commonErrpbold2").show().css("display","");
    }else{
        $("#commonErrpbold2").hide();
    }
    //다국어 적용 end
    
    if (typeof setting_function == "function"){
        setting_function();
    }
    
    el_dialog.dialog("open");
    
    $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        
        if (typeof close_function == "function"){
            close_function();
        }
    });
    $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
    });
}

//공통 팝업 메세지showCCdlgError_Msg
function showCommonNoLangErrorBoldMsg(title_cls, msg_cls, msg_bold_cls ,close_function){
    
    $("#dialogCommonErrorMsg2").remove();
    var el_dialog = $("#dialogCommonErrorMsg2");
    
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg2" style="width:447px !important;  top:auto !important; display:none;">');
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push('    <div class="body"> ');
        arrHtml.push('    <div class="con"> ');
        arrHtml.push('    <div id="commonErrMsgDesc2" class="pop_sub_tit ac"></div> ');
        arrHtml.push('    <div id="commonErrpbold2" class="pop_sub_tit ac"><em id="commonErrBoldMsgDesc"></em></div> ');
        arrHtml.push('    </div></div> ');
        arrHtml.push('    <div class="btn_box mt40"> ');
        arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#" class="txt_lang_confirm">확인</a></div> ');
        arrHtml.push('    </div> ');
                
        $(arrHtml.join("")).appendTo("body");
        
        el_dialog = $("#dialogCommonErrorMsg2");
    }

    var opt    = {};
    
    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }
    
    commonDialogInit(el_dialog, opt);
    

    $("#commonErrMsgTitle2").html(title_cls); 
    //msg

    $("#commonErrMsgDesc2").html(msg_cls); 
    //bold msg
    if(msg_bold_cls != ""){
        $("#commonErrBoldMsgDesc").html(msg_bold_cls);
        $("#commonErrpbold2").show().css("display","");
    }else{
        $("#commonErrpbold2").hide();
    }
    //확인버튼
    var returnVal = get_console_messages("txt_lang_confirm");
    $("#commonErrChk").html(returnVal);
    //다국어 적용 end
    
    el_dialog.dialog("open");
    
    $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        
        if (typeof close_function == "function"){
            close_function();
        }
    });
    
    $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
    });
}

//공통 팝업 메세지
function showCommonMsg(el_dialog, page_name, close_function, setting_function){
    
    var opt    = {};
    
    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }
    
    commonDialogInit(el_dialog, opt);
    
    el_dialog.dialog("open");
    
    if (typeof setting_function == "function"){
        setting_function();
    }
    
    $(".commonMsgClose, .del", el_dialog).unbind("click").bind("click", function(e) {        //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        
        if (typeof close_function == "function"){
            close_function();
        }
    });
}

//기존 공통 메시지 처리
function commonErrorMessage( sCode, closeFnc ) {
    var closeFunction = closeFnc;
     //closeFunction = typeof(closeFnc) == 'Function' ? closeFnc : null; 
    
    switch (sCode) {
        case "00" :    // 정상처리
            break;
        // 20 ~ 29 : vm 관련 오류
        case "25" : //
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_not_proper_confition_for_deletion",closeFunction);
            //showCommonErrorMsg("", "삭제 가능한 상태가 아닙니다.", closeFunction);
            break;
        case "26" : //
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_not_cancellation_very_day",closeFunction);
            //showCommonErrorMsg("", "현재 상품은 <span style=\"color:#ff0000\">당일 해지</span>가 불가능 합니다.<br/>부득이하게 해지를 해야 할 경우에는 <br/>&quot;고객센터&quot; 내 &quot;문의하기&quot;에 요청해 주시기 바랍니다.", closeFunction);
            break;
        case "27" : //
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_no_billing_information",closeFunction);
            //showCommonErrorMsg("", "빌링 정보가 없습니다.<br/>관리자에게 문의하여 주세요.", closeFunction);
            break;
        case "28" : //
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_selected_resoucre_not_register_resoucre",closeFunction);
            //showCommonErrorMsg("", "생성완료 까지는 10~30분 정도 소요 될수 있습니다.<br/>잠시후 다시 시도해 주세요.<br/><br/>30분 이후에도 문제가 계속 발생할 경우<br/>관리자에게 문의하여 주세요.", closeFunction);
            //showCommonErrorMsg("", "선택한 자원(서버, Disk, IP 등)은 생성 완료 후<br/>포탈에 정보 등록이 되지 않은 상태입니다.<br/><a href='/portal/qnaWrite.do'><u>문의하기</u></a>로 연락 주시면 조치해 드리겠습니다.", closeFunction);
            break;
        case "29" : // VM account 불일치
//            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_do_not_authority_use_vm",closeFunction);
            showCommonNoLangErrorMsg("test","해당 자원 및 기능 사용권한이 없습니다.","");
            //showCommonErrorMsg("", "해당 VM을 사용할수 있는 권한이 없습니다.", closeFunction);
            break;
        case "30" : // VM 요금제 변경시 하루 1회 이상일때
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_change_rate_system_one_day",closeFunction);
            //showCommonErrorMsg("", "요금제 변경은 <span style=\"color:#ff0000\">하루 1회</span>만 가능합니다.<br/>익일 이후 변경하시길 바랍니다.", closeFunction);
            break;
        case "31" : // VM 요금제 변경시 prameter 오류
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_err_changing_rate_system",closeFunction);
            //showCommonErrorMsg("", "요금제 변경 작업중 오류가 발생했습니다.<br/>관리자에게 문의하여 주세요.", closeFunction);
            break;
        case "32" : // STRG 요금제 변경시 기본변경 불가
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_default_storage_not_changed",closeFunction);
            //showCommonErrorMsg("", "기본 제공된 스토리지는 변경할 수 없습니다.", closeFunction);
            break;
        case "33" : // IP 요금제 변경시 기본변경 불가
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_default_ip_not_changed",closeFunction);
            //showCommonErrorMsg("", "기본 제공된 IP는 변경할 수 없습니다.", closeFunction);
            break;
        case "34" : //
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_current_product_not_changed",closeFunction);
            //showCommonErrorMsg("", "현재 상품은 <span style=\"color:#ff0000\">당일 변경</span>이 불가능 합니다.<br/>부득이하게 변경을 해야 할 경우에는 <br/>&quot;고객센터&quot; 내 &quot;문의하기&quot;에 요청해 주시기 바랍니다.", closeFunction);
            break;
        case "35" : //
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_monitoring_server_not_exits",closeFunction);
            //showCommonErrorMsg("", "“모니터링 대상 서버가 존재하지 않습니다.<br/>서버 생성 후 이용가능합니다.”", closeFunction);
            break;
        // 90 ~ 99 공통 오류
        case "90" : // 로그인 필요
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_login_necessary",closeFunction);
            //showCommonErrorMsg("", "로그인이 필요 합니다.", closeFunction);
            document.location.href        = "/console/landing";
            break;
        case "91" : 
//            showCommonErrorMsg("청약정보 오류", "청약 정보가 없습니다.", function (){
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_no_service_requested",function (){document.location.href = "/console/landing";});
            //showCommonErrorMsg("", "신청한 서비스가 없습니다.", function (){
            //    document.location.href        = "/index.html";
            //});
            break;
        case "98" :
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_communication_is_not_smoothly",closeFunction);
            //showCommonErrorMsg("", "서버와의 통신이 원할하지 않습니다.<br/>잠시후 다시 시도해 주세요<br/><br/>문제가 계속 될경우 관리자에게 문의하여 주세요.", closeFunction);
            break;
        case "99" :
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_err_occured_during_operation",closeFunction);
            //showCommonErrorMsg("", "작업중 오류가 발생했습니다.<br/>관리자에게 문의하여 주세요.", closeFunction);
            break;
        case "434" :
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_destroy_vm_lb_binding",closeFunction);
            //showCommonErrorMsg("", "작업중 오류가 발생했습니다.<br/>관리자에게 문의하여 주세요.", closeFunction);
            break;
        case "484" :
//            showCommonErrorMsg("", "ucloud biz 정책 상, 자원생성개수를 다음과 같이 제한하였습니다.<br/>" +
//                                    "( 클라우드 서버 30개, Disk 60개, IP 30개 )<br/>추가 생성을 원하실 경우 고객센터(080-2580-005)로 문의 바랍니다.<br/>감사합니다", closeFunction);
//            showCCdlgError_Msg_new("안내 메시지", "고객 계정에서 생성 가능한 자원 한계를 초과하였습니다.<br><br>아래 문의하기로 요청 주시면 조정이 가능하오니, 참고하시기 바랍니다.<br><br><a href='/portal/qnaWrite.do'><u>문의하기 바로 가기</u></a>", closeFunction);
//            showCommonErrorMsg("안내 메시지", "고객 계정에서 생성 가능한 자원 한계를 초과하였습니다.<br><br>아래 문의하기로 요청 주시면 조정이 가능하오니, 참고하시기 바랍니다.<br><br><a href='/portal/qnaWrite.do'><u>문의하기 바로 가기</u></a>", closeFunction);
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_m2zone_disklimit2",closeFunction);
            break;            
        case "488" :
//            showCommonErrorMsg("", "ucloud biz 정책 상, 자원생성개수를 다음과 같이 제한하였습니다.<br/>" +
//                                    "( 클라우드 서버 30개, Disk 60개, IP 30개 )<br/>추가 생성을 원하실 경우 고객센터(080-2580-005)로 문의 바랍니다.<br/>감사합니다", closeFunction);
//            showCCdlgError_Msg_new("안내 메시지", "고객 계정에서 생성 가능한 자원 한계를 초과하였습니다.<br><br>아래 문의하기로 요청 주시면 조정이 가능하오니, 참고하시기 바랍니다.<br><br><a href='/portal/qnaWrite.do'><u>문의하기 바로 가기</u></a>", closeFunction);
//            showCommonErrorMsg("안내 메시지", "고객 계정에서 생성 가능한 자원 한계를 초과하였습니다.<br><br>아래 문의하기로 요청 주시면 조정이 가능하오니, 참고하시기 바랍니다.<br><br><a href='/portal/qnaWrite.do'><u>문의하기 바로 가기</u></a>", closeFunction);
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_m2zone_disklimit",closeFunction);
            break;    
        case "535" :            
        case "534" :
//            showCommonErrorMsg("", "ucloud biz 정책 상, 자원생성개수를 다음과 같이 제한하였습니다.<br/>" +
//                                    "( 클라우드 서버 30개, Disk 60개, IP 30개 )<br/>추가 생성을 원하실 경우 고객센터(080-2580-005)로 문의 바랍니다.<br/>감사합니다", closeFunction);
//            showCCdlgError_Msg_new("안내 메시지", "고객 계정에서 생성 가능한 자원 한계를 초과하였습니다.<br><br>아래 문의하기로 요청 주시면 조정이 가능하오니, 참고하시기 바랍니다.<br><br><a href='/portal/qnaWrite.do'><u>문의하기 바로 가기</u></a>", closeFunction);
//            showCommonErrorMsg("안내 메시지", "고객 계정에서 생성 가능한 자원 한계를 초과하였습니다.<br><br>아래 문의하기로 요청 주시면 조정이 가능하오니, 참고하시기 바랍니다.<br><br><a href='/portal/qnaWrite.do'><u>문의하기 바로 가기</u></a>", closeFunction);
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_limitation_resorce_not_created",closeFunction);
            break;
        case "536" :
//            showCCdlgError_Msg_new("안내 메시지", "동일한 스냅샷에 대한 디스크 생성 작업이 진행 중입니다.<br/>잠시 후 재 시도 해 주시기 바랍니다.", closeFunction);
//            showCommonErrorMsg("안내 메시지", "동일한 스냅샷에 대한 디스크 생성 작업이 진행 중입니다.<br/>잠시 후 재 시도 해 주시기 바랍니다.", closeFunction);
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_disk_creation_way_same_snapshot",closeFunction);
            break;            
        case "538" :
//            showCCdlgError_Msg_new("안내 메시지", "동일한 스냅샷에 대한 디스크 생성 작업이 진행 중입니다.<br/>잠시 후 재 시도 해 주시기 바랍니다.", closeFunction);
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_deletion_way",closeFunction);
            //showCommonErrorMsg("안내 메시지", "동일한 삭제 작업이 진행 중입니다.<br/>잠시 후 재 시도 해 주시기 바랍니다.", closeFunction);
            break;            
        case "601" : // KOR Seoul M2존의 최초 VM 생성시 네트워크 준비작업이 진행됩니다.<br/>약 10분 후 다시 시도해 주시기 바랍니다.
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_m2zone_networking",closeFunction);
            break;
        case "431" : // 현재 동일 호스트명의 VM이 존재하거나 완젼히 삭제되지 않았습니다.
            showCommonLangErrorMsg("txt_lang_guidance_message","txt_lang_hostname_duplicate",closeFunction);
            break;
        default :
            showCommonLangErrorMsg("txt_lang_non_registered_code","txt_lang_code_not_registered",closeFunction);
            //showCommonErrorMsg("미 등록코드", "[" + sCode + "] 등록되지 않은 코드 입니다.", closeFunction);
            break;
    }
}

//message box 디자인(로딩)
function makeLoadingBox()
{
    var arrHtml = [];

    $("#dialog_loading_box").remove();
    var wait = "잠시만 기다려주세요.";
    
    if(get_lang_cookie() == "en") {
        wait = "Please wait a moment.";
    }
    
    
    arrHtml.push("    <div id=\"dialog_loading_box\" class=\"popup popLoading ok_pbox01\" style=\"display:none;\" >");
//    arrHtml.push("        <img class='loading' src=\"../../images/common/loading_timer.gif\" alt=\"로딩 이미지\" />");
    arrHtml.push("    <svg style='width:236px;height:157px;' class='windy-cloud' viewBox='0 0 512 512'>    ");
    arrHtml.push("        <g class='cloud-wrap'>                                                                                                       ");
    arrHtml.push("            <path class='cloud' d='M417,166.1c-24-24.5-57.1-38.8-91.7-38.8c-34.6,0-67.7,14.2-91.7,38.8c-52.8,2.5-95,46.2-95,99.6     ");
    arrHtml.push("            c0,55,44.7,99.7,99.7,99.7c5.8,0,11.6-0.5,17.3-1.5c20.7,13.5,44.9,20.9,69.7,20.9c24.9,0,49.1-7.3,69.8-20.9                ");
    arrHtml.push("            c5.7,1,11.5,1.5,17.3,1.5c54.9,0,99.6-44.7,99.6-99.7C512,212.3,469.8,168.5,417,166.1z M412.4,333.3c-8.3,0-16.4-1.5-24-4.4 ");
    arrHtml.push("            c-17.5,15.2-39.8,23.8-63.1,23.8c-23.2,0-45.5-8.5-63-23.8c-7.6,2.9-15.8,4.4-24,4.4c-37.3,0-67.7-30.4-67.7-67.7            ");
    arrHtml.push("            c0-37.3,30.4-67.7,67.7-67.7c3.2,0,6.4,0.2,9.5,0.7c18.1-24.6,46.5-39.4,77.5-39.4c30.9,0,59.4,14.8,77.5,39.4               ");
    arrHtml.push("            c3.1-0.5,6.3-0.7,9.6-0.7c37.3,0,67.6,30.4,67.6,67.7C480,303,449.7,333.3,412.4,333.3z'></path>                            ");
    arrHtml.push("        </g>                                                                                                                         ");
    arrHtml.push("        <path class='wind-three' d='M144,352H16c-8.8,0-16,7.2-16,16s7.2,16,16,16h128c8.8,0,16-7.2,16-16S152.8,352,144,352z'></path>  ");
    arrHtml.push("        <path class='wind-two' d='M16,320h94c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,320,16,320z'></path>        ");
    arrHtml.push("        <path class='wind-one' d='M16,256h64c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,256,16,256z'></path>        ");
    arrHtml.push("    </svg>                                                                                                                           ");
//    arrHtml.push("        <p class=\"desc\">" + wait + "</p>");
    arrHtml.push("    </div>");
    
    jQuery(arrHtml.join("\n")).appendTo(jQuery("body"));
}

// //message Box 보이기(로딩)
// function showLoadingBox( img_url )
// {
//     var loadingBox = jQuery("#dialog_loading_box");
//     //if( loadingBox.html() == null) {
//         makeLoadingBox();
//         loadingBox = jQuery("#dialog_loading_box");
//     //}
        
//     loadingBox.dialog({ 
//         width : 490,
//         height : 260,
//         autoOpen : false,
//         modal : true,
//         resizable : false,
//         draggable:false,
//         zIndex : 2000,
//         closeOnEscape: false,
//         dialogClass : "border_0",
//         close : function (event, ui) {
//             //close:
//         }
//     });
//     $("#dialog_loading_box").siblings().remove();
//     $("#dialog_loading_box").css("padding" , "0");
//     $("#dialog_loading_box").parent().css("padding" , "0");

//     if( img_url != undefined && img_url != "" ) {
//         jQuery(".ok_pbox01 > img", loadingBox).attr("src", img_url);
//     }
    
//     jQuery(".ui-dialog-titlebar", loadingBox.parent()).hide();
//     loadingBox.removeClass('ui-dialog-content');
//     loadingBox.removeClass('ui-widget-content').parent().removeClass('ui-widget-content');
//     loadingBox.css('width','100vw').css('height','100vh');
//     var div_width = loadingBox.width()/2-50;
//     var div_height = loadingBox.height()/2-50;
//     //alert(div_width+", "+div_height);
//     //loadingBox.css("padding-left",div_width).css("padding-top",div_height);
//     loadingBox.dialog("open");
    
//     $(".ui-widget-overlay").css("background", "#fff").css("opacity", ".9").css("filter", "Alpha(Opacity=90)");
    
// }

//message box 디자인(로딩)
function makeMenuLoadingBox()
{
    var arrHtml = [];

    $("#dialog_menu_loading_box").remove();
    var wait = "잠시만 기다려주세요.";
    
    if(get_lang_cookie() == "en") {
        wait = "Please wait a moment.";
    }
    
    
    arrHtml.push("    <div id=\"dialog_menu_loading_box\" class=\"popup popLoading ok_pbox01\" style=\"display:none;\" >");
//    arrHtml.push("        <img class='loading' src=\"../../images/common/loading_timer.gif\" alt=\"로딩 이미지\" />");
    arrHtml.push("    <svg style='width:236px;height:157px;' class='windy-cloud' viewBox='0 0 512 512'>    ");
    arrHtml.push("        <g class='cloud-wrap'>                                                                                                       ");
    arrHtml.push("            <path class='cloud' d='M417,166.1c-24-24.5-57.1-38.8-91.7-38.8c-34.6,0-67.7,14.2-91.7,38.8c-52.8,2.5-95,46.2-95,99.6     ");
    arrHtml.push("            c0,55,44.7,99.7,99.7,99.7c5.8,0,11.6-0.5,17.3-1.5c20.7,13.5,44.9,20.9,69.7,20.9c24.9,0,49.1-7.3,69.8-20.9                ");
    arrHtml.push("            c5.7,1,11.5,1.5,17.3,1.5c54.9,0,99.6-44.7,99.6-99.7C512,212.3,469.8,168.5,417,166.1z M412.4,333.3c-8.3,0-16.4-1.5-24-4.4 ");
    arrHtml.push("            c-17.5,15.2-39.8,23.8-63.1,23.8c-23.2,0-45.5-8.5-63-23.8c-7.6,2.9-15.8,4.4-24,4.4c-37.3,0-67.7-30.4-67.7-67.7            ");
    arrHtml.push("            c0-37.3,30.4-67.7,67.7-67.7c3.2,0,6.4,0.2,9.5,0.7c18.1-24.6,46.5-39.4,77.5-39.4c30.9,0,59.4,14.8,77.5,39.4               ");
    arrHtml.push("            c3.1-0.5,6.3-0.7,9.6-0.7c37.3,0,67.6,30.4,67.6,67.7C480,303,449.7,333.3,412.4,333.3z'></path>                            ");
    arrHtml.push("        </g>                                                                                                                         ");
    arrHtml.push("        <path class='wind-three' d='M144,352H16c-8.8,0-16,7.2-16,16s7.2,16,16,16h128c8.8,0,16-7.2,16-16S152.8,352,144,352z'></path>  ");
    arrHtml.push("        <path class='wind-two' d='M16,320h94c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,320,16,320z'></path>        ");
    arrHtml.push("        <path class='wind-one' d='M16,256h64c8.8,0,16-7.2,16-16s-7.2-16-16-16H16c-8.8,0-16,7.2-16,16S7.2,256,16,256z'></path>        ");
    arrHtml.push("    </svg>                                                                                                                           ");
//    arrHtml.push("        <p class=\"desc\">" + wait + "</p>");
    arrHtml.push("    </div>");
    
    jQuery(arrHtml.join("\n")).appendTo(jQuery("body"));
}

//message Box 보이기(로딩)
function showMenuLoadingBox( img_url )
{
    var loadingBox = jQuery("#dialog_menu_loading_box");
    //if( loadingBox.html() == null) {
        makeMenuLoadingBox();
        loadingBox = jQuery("#dialog_menu_loading_box");
    //}
        
    loadingBox.dialog({ 
        width : 490,
        height : 260,
        autoOpen : false,
        modal : true,
        resizable : false,
        draggable:false,
        zIndex : 2000,
        closeOnEscape: false,
        dialogClass : "border_0",
        close : function (event, ui) {
            //close:
        }
    });
    $("#dialog_menu_loading_box").siblings().remove();
    $("#dialog_menu_loading_box").css("padding" , "0");
    $("#dialog_menu_loading_box").parent().css("padding" , "0");

    if( img_url != undefined && img_url != "" ) {
        jQuery(".ok_pbox01 > img", loadingBox).attr("src", img_url);
    }
    
    jQuery(".ui-dialog-titlebar", loadingBox.parent()).hide();
    loadingBox.removeClass('ui-dialog-content');
    loadingBox.removeClass('ui-widget-content').parent().removeClass('ui-widget-content');
    loadingBox.css('width','100vw').css('height','100vh');
    var div_width = loadingBox.width()/2-50;
    var div_height = loadingBox.height()/2-50;
    loadingBox.dialog("open");

    $(".ui-widget-overlay").css("background", "#fff").css("opacity", ".9").css("filter", "Alpha(Opacity=90)");
}

//message Box 숨기기(로딩)
function hideMenuLoadingBox()
{
    var loadingBox = jQuery("#dialog_menu_loading_box");
    loadingBox.dialog("close");
    
    if( $(".popup:visible").length > 0) {
        var maxzi_obj = null;
        $(".popup:visible").each(function(){ if( maxzi_obj == null) { maxzi_obj = $(this); } });
        if(maxzi_obj.attr('selffocus') != 'selffocus' ) {
            maxzi_obj.find("a:visible:first").focus();
        }
    }
}

//message Box 보이기(로딩)
function showMenuLoadingBox( img_url )
{
    var loadingBox = jQuery("#dialog_menu_loading_box");
    makeMenuLoadingBox();
    loadingBox = jQuery("#dialog_menu_loading_box");
        
    loadingBox.dialog({ 
        width : 490,
        height : 260,
        autoOpen : false,
        modal : true,
        resizable : false,
        draggable:false,
        zIndex : 2000,
        closeOnEscape: false,
        dialogClass : "border_0",
        close : function (event, ui) {
            //close:
        }
    });
    $("#dialog_menu_loading_box").siblings().remove();
    $("#dialog_menu_loading_box").css("padding" , "0");
    $("#dialog_menu_loading_box").parent().css("padding" , "0");

    if( img_url != undefined && img_url != "" ) {
        jQuery(".ok_pbox01 > img", loadingBox).attr("src", img_url);
    }
    
    jQuery(".ui-dialog-titlebar", loadingBox.parent()).hide();
    loadingBox.removeClass('ui-dialog-content');
    loadingBox.removeClass('ui-widget-content').parent().removeClass('ui-widget-content');
    loadingBox.css('width','100vw').css('height','100vh');
    var div_width = loadingBox.width()/2-50;
    var div_height = loadingBox.height()/2-50;
    //alert(div_width+", "+div_height);
    //loadingBox.css("padding-left",div_width).css("padding-top",div_height);
    loadingBox.dialog("open");

    $(".ui-widget-overlay").css("background", "#fff").css("opacity", ".9").css("filter", "Alpha(Opacity=90)");
}

//message Box 숨기기(로딩)
function hideMenuLoadingBox()
{
    var loadingBox = jQuery("#dialog_menu_loading_box");
    loadingBox.dialog("close");
    
    if( $(".popup:visible").length > 0) {
        var maxzi_obj = null;
        $(".popup:visible").each(function(){ if( maxzi_obj == null) { maxzi_obj = $(this); } });
        if(maxzi_obj.attr('selffocus') != 'selffocus' ) {
            maxzi_obj.find("a:visible:first").focus();
        }
    }
}

function makeLoadingBoxProgress()
{
    var arrHtml = [];
    $("#dialog_loading_box_progress").remove();
    var wait = "현재 진행 상태";
    var waitTitle = "요청하신 작업을 진행 중입니다.";
    
    if(get_lang_cookie() == "en") {
        wait = "Current status of progress";
        waitTitle = "요청하신 작업을 진행 중입니다.";
    }
    
    arrHtml.push("    <div id=\"dialog_loading_box_progress\" class=\"popup popLoading ok_pbox01\" style=\"display:none; background: black;" +
                                    "background:url('../../images/common/progress_back.png') no-repeat left top;\" >");
    arrHtml.push("        <div id=\"dialog_\" class=\"popup popLoading ok_pbox01 ac\" style=\"padding-top: 30px; margin:0 auto; width:229px;\" >");
    arrHtml.push("            <span class=\"\" style=\"font-size:14px; color:white;\">" + waitTitle + "</span>");
    arrHtml.push("        </div>");
    arrHtml.push("        <div id=\"dialog_loading\" class=\"popup popLoading ok_pbox01 mt10\" style=\"\">");
    arrHtml.push("            <div id=\"dialog_progress_bar_def\" class=\"popup popLoading ok_pbox01\" style=\"height:8px; width:100%;\">");
    arrHtml.push("                <div class=\"ac\" style=\"position: relative; border:1px solid #cfafaf; margin: 0 auto; width:229px; height:8px;\">");
    arrHtml.push("                    <div id=\"dialog_progress_bar_succ\" class=\"popup popLoading ok_pbox01\" style=\"position: absolute; height:8px; " +
                                                "width:100%; right:0px;    background:url('../../images/common/progress_bg.gif') no-repeat left top;\">");
    arrHtml.push("                    </div>");
    arrHtml.push("                    <img class='loading' src=\"../../images/common/progress_bar.gif\" alt=\"로딩 이미지\" />");
    arrHtml.push("                </div>");
    arrHtml.push("            </div>");
    arrHtml.push("        </div>");
    arrHtml.push("        <div id=\"dialog_loading_box_img\" class=\"popup popLoading ok_pbox01 ac mt10\" style=\"margin:0 auto; width:229px;\">");
    arrHtml.push("            <span class=\"\" style=\"font-size:13px; color:white;\">" + wait + "</span>");
    arrHtml.push("            <span class=\"ml5\" style=\"font-size:13px; color:white;\">:</span>");
    arrHtml.push("            <span id=\"dialog_percent\"class=\"ml5\" style=\"font-size:13px; color:white;\">0 %</span>");
    arrHtml.push("        </div>");
    arrHtml.push("    </div>");
    
    jQuery(arrHtml.join("\n")).appendTo(jQuery("body"));
}

//message Box 숨기기(로딩)
function hideLoadingBoxProgress()
{
    var loadingBox = jQuery("#dialog_loading_box_progress");
    loadingBox.dialog("close");
    
    if( $(".popup:visible").length > 0) {
        var maxzi_obj = null;
        $(".popup:visible").each(function(){ if( maxzi_obj == null ) { maxzi_obj = $(this); } });
        if(maxzi_obj.attr('selffocus') != 'selffocus' ) {
            maxzi_obj.find("a:visible:first").focus();
        }
    }
}

//message Box 보이기(로딩)
function showLoadingBoxProgress( img_url )
{
    makeLoadingBoxProgress();
    var loadingBox = $("#dialog_loading_box_progress");
        
    loadingBox.dialog({ 
        width : 337,
        height : 123,
        autoOpen : false,
        modal : true,
        resizable : false,
        draggable:false,
        zIndex : 2000,
        closeOnEscape: false,
        dialogClass : "border_0",
        close : function (event, ui) {
            //close:
        }
    });
    $("#dialog_loading_box_progress").siblings().remove();
    $("#dialog_loading_box_progress").css("padding" , "0");
    $("#dialog_loading_box_progress").parent().css("padding" , "0");

    if( img_url != undefined && img_url != "" ) {
        jQuery(".ok_pbox01 > img", loadingBox).attr("src", img_url);
    }
    
    jQuery(".ui-dialog-titlebar", loadingBox.parent()).hide();
    loadingBox.removeClass('ui-dialog-content');
    loadingBox.removeClass('ui-widget-content').parent().removeClass('ui-widget-content');
    loadingBox.css('width','490px').css('height','250px');
    var div_width = loadingBox.width()/2-80;
    var div_height = loadingBox.height()/2;
    loadingBox.dialog("open");
    
}

//message Box 숨기기(로딩)
function hideLoadingBox()
{
    var loadingBox = jQuery("#dialog_loading_box");
    loadingBox.dialog("close");
    
    if( $(".popup:visible").length > 0) {
        var maxzi_obj = null;
        $(".popup:visible").each(function(){ if( maxzi_obj == null) { maxzi_obj = $(this); } });
        if(maxzi_obj.attr('selffocus') != 'selffocus' ) {
            maxzi_obj.find("a:visible:first").focus();
        }
    }
}

//dialog 초기화
var eldialogwidth = 0;
function commonDialogInit( el_dialog , opt ) {

    eldialogwidth = el_dialog.width();
    
    function widthinit(){
        el_dialog.css("width",eldialogwidth);
    };
    
    if (opt == null){
        opt    = {};
    }
    
    if (typeof opt.close_function == "function" ) {
        
        el_dialog.dialog({ 
            width: el_dialog.width(),
            autoOpen: false,
            modal: true,
            resizable:false,
            zIndex: 100,
            close : opt.close_function,
            open : widthinit
        });
    }
    else {
        el_dialog.dialog({
            width: el_dialog.width(),
            autoOpen: false,
            modal: true,
            resizable:false,
            zIndex: 100,
            open: widthinit
        });
    }
    
    el_dialog.siblings().remove();
    el_dialog.css("padding" , "0");
    el_dialog.css("overflow","hidden");
    el_dialog.parent().css("padding" , "0");
    
    if (document.getElementById("headTableDiv") && document.getElementById("dtailTableDiv") && typeof set_scroll == 'function') {
        set_scroll();
    }
}

//콘솔 홈 dialog slide banner 초기화
var eldialogwidth = 0;
function commonDialogInit2( el_dialog , opt ) {

    eldialogwidth = el_dialog.width();
    
    function widthinit(){
        el_dialog.css("width",eldialogwidth);
    };
    
    if (opt == null){
        opt    = {};
    }
    
    if (typeof opt.close_function == "function" ) {
        
        el_dialog.dialog({ 
            width: el_dialog.width(),
            autoOpen: false,
            modal: true,
            resizable:false,
            zIndex: 2000,
            close : opt.close_function,
            open : widthinit,
            position: {my: 'center bottom', at: 'center bottom', of: window}
        });
    }
    else {
        el_dialog.dialog({
            width: el_dialog.width(),
            autoOpen: false,
            modal: true,
            resizable:false,
            zIndex: 2000,
            open: widthinit,
            position: {my: 'center bottom', at: 'center bottom', of: window}
        });
    }
    
    el_dialog.siblings().remove();
    el_dialog.css("padding" , "0");
    el_dialog.css("overflow","hidden");
    el_dialog.parent().css("padding" , "0");
}

function hidedlgYesNo_Msg() {
    if( $("#dialog_service_yn_renew").html() != null ) {
        $("#dialog_service_yn_renew").dialog("close");
    }
}


function showdlgYesNo_Msg(sTitle, sText1, sText2, noFunc, yesFunc, noCap, yesCap) {
    
    makeShowdlgYesNo_MsgPop(sTitle, sText1, sText2, yesCap, noCap);
    
    var dlgForm = $("#dialog_service_yn_renew");
    
    dlgForm.find("#btn_yn_top_close").unbind("click").bind("click", function(e) {
        e.preventDefault();
        dlgForm.dialog("close"); 
    });
    dlgForm.find("#btnCheck_No, .del").unbind("click").bind("click", function(e) {
        e.preventDefault();
        if (typeof noFunc == "function") {
            noFunc();
        }
    });
    dlgForm.find("#btnCheck_Yes").unbind("click").bind("click", function(e) {
        e.preventDefault();
        if (typeof yesFunc == "function") {
            yesFunc();
        }
    });
    
    dlgForm.dialog("open");
}

function makeShowdlgYesNo_MsgPop(title_cls, msg_cls1, msg_cls2, yesCap, noCap) {
        
        //팝업 div ID 설정
        var el_dialog = $("#dialog_service_yn_renew");
        
        //현재 팝업이 존재 하지 않을 경우
        if( $("#dialog_service_yn_renew").html() == null ) {
            var arrHtml = [];
            
            arrHtml.push("    <div class=\"popUp\" id=\"dialog_service_yn_renew\"style=\"width:447px !important;  top:auto !important;\"> <!-- pop_frame --> <!--width, top 조절 -->");
            arrHtml.push("        <div class=\"head htpop clfix\">");
            arrHtml.push('        <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
            arrHtml.push("        </div>");
            arrHtml.push("        <div class=\"body\">");
            arrHtml.push("            <div class=\"con\">");
            arrHtml.push('                <p id="sText1" class="box_txt ac ' +msg_cls1+' "></p>');
            arrHtml.push('                <p id="sText2" class="box_txt ac ' +msg_cls2+' "></p>');
            arrHtml.push("        </div>");
            arrHtml.push("    </div>");
            arrHtml.push("<div class=\"btn_box\">");
            arrHtml.push("<div class=\"pop_btn_left\"><a id=\"btnCheck_No\" href=\"#\" class=\"txt_lang_cancel\">취소</a></div>  <!--class=\"pop_btn_left dim\" dim css 추가 -->");
            arrHtml.push("<div class=\"pop_btn_right\"><a id=\"btnCheck_Yes\" href=\"#\" class=\"txt_lang_confirm\">확인</a></div>");
            arrHtml.push("</div>");
            arrHtml.push("<!-- app_default_ol -->");        
            arrHtml.push("</div>");

            $(arrHtml.join("\n")).appendTo($("body"));
        }
        
            el_dialog = $("#dialog_service_yn_renew");
            
            //Dummy 클릭 이벤트 처리
            $(".btn_dummy").unbind("click").bind("click", function(e) {
                e.preventDefault();
            });
            
            $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
                e.preventDefault();
                el_dialog.dialog("close");
            });
            
            //타이틀 다국어 처리
            var returnVal = get_console_messages(title_cls);
            $("#sTitle").html(returnVal);

            //텍스트 내용 다국어 처리
            var returnVal = get_console_messages(msg_cls1);
            $("#sText1").html(returnVal);     

            var returnVal = get_console_messages(msg_cls2);
            $("#sText2").html(returnVal);     

            //확인 버튼 다국어 처리
            var returnVal = get_console_messages("txt_lang_confirm");
            $("#btnCheck_Yes").html(returnVal);     

            //취소 버튼 다국어 처리
            var returnVal = get_console_messages("txt_lang_cancel");
            $("#btnCheck_No").html(returnVal);     

            var opt    = {};
            
            if (typeof close_function == "function") {
                opt.close_function    = close_function;
            }
            
            commonDialogInit(el_dialog, opt);
                
}


//공통 메시지 popup
function showPopupWithDelay(title, msg, popup_delay, refresh_delay) {

    // 1초 있다 팝업을 띄움
    var timerKey        = "nojob";

    $("body").everyTime(
            popup_delay,
            timerKey,
            function() {
                $("body").stopTime(timerKey);

                var strDlg = "";
                var el_dialog = $("#dialogCommonErrorMsg3");
                if(el_dialog.html() == null){
                    var arrHtml        = [];
                    arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg3" style="width:467px !important;  top:auto !important; display:none;">');
                    arrHtml.push('    <div class="head htpop clfix">');
                    arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
                    arrHtml.push('    </div> ');
                    arrHtml.push('    <div class="body"> ');
                    arrHtml.push('    <div class="con"> ');
                    arrHtml.push('    <p class="pop_sub_tit ac"><p id="dialogCommonErrorMsg_msg" class="pop_sub_tit ac">-</p></p>');
                    arrHtml.push('    </div></div> ');
                    arrHtml.push('    <div class="btn_box"> ');
                    arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="chkcheck" href="#" class="txt_lang_confirm">확인</a></div> ');
                    arrHtml.push('    </div> ');
                    
                    $(arrHtml.join("")).appendTo("body");
                    
                    el_dialog = $("#dialogCommonErrorMsg3");
                }
                
                var opt    = {};
                
                if (typeof close_function == "function") {
                    opt.close_function    = close_function;
                }
                
                $("#dialogCommonErrorMsg_title", el_dialog).html(title);
                $("#dialogCommonErrorMsg_msg", el_dialog).html(msg);
                var rtnchk = "확인";
                if(get_lang_cookie() == "en") {
                    rtnchk = "Check";
                }
                $("#chkcheck").text(rtnchk);
                
                showCommonMsg(el_dialog, "csserver");
                
                $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
                    e.preventDefault();
                    el_dialog.dialog("close");
                    
                    if (typeof close_function == "function"){
                        close_function();
                    }
                });
                
                $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
                    e.preventDefault();
                    el_dialog.dialog("close");
                });
                
                $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {
                        e.preventDefault();

                    el_dialog.dialog("close");

                    timerKey        = "jobDelay";

                    $("body").everyTime(
                            refresh_delay,
                            timerKey,
                            function() {
                                $("body").stopTime(timerKey);
                                
                                if(title == "클라우드서버 생성 확인") {
                                    call_vmList();
                                } else if(title == "Disk 추가 확인") {
                                    list_Volume();
                                } else if(title == "IP 추가 확인") {
                                    call_ipList();
                                } else if(title == "공개 이미지 서버 생성 확인") {
                                    window.location.href="/console/serverlist";
                                } else if(title == "나의 이미지 서버 생성 확인") {
                                    window.location.href="/console/serverlist";
                                } else if(title == "서버 이미지 서버 생성 확인") {
                                    window.location.href="/console/serverlist";
                                }
                                
                                return false;
                            },
                            0
                    );
                });

            },
            0
    );
}

//공통메세지 - 다국어 처리 ver
function showPopupWithDelayLang(title, msg, popup_delay, refresh_delay) {

    // 1초 있다 팝업을 띄움
    var timerKey        = "nojob";

    $("body").everyTime(
            popup_delay,
            timerKey,
            function() {
                $("body").stopTime(timerKey);

                var strDlg = "";
                var el_dialog = $("#dialogCommonErrorMsg45");
                if(el_dialog.html() == null){
                    var arrHtml        = [];
                    arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg45" style="width:467px !important;  top:auto !important; display:none;">');
                    arrHtml.push('    <div class="head htpop clfix">');
                    arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
                    arrHtml.push('    </div> ');
                    arrHtml.push('    <div class="body"> ');
                    arrHtml.push('    <div class="con"> ');
                    arrHtml.push('    <p class="pop_sub_tit ac"><p id="dialogCommonErrorMsg_msg" class="pop_sub_tit ac">-</p></p>');
                    arrHtml.push('    </div></div> ');
                    arrHtml.push('    <div class="btn_box mt40"> ');
                    arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="checklangconfirm" href="#" class="txt_lang_confirm">확인</a></div> ');
                    arrHtml.push('    </div> ');
                    
                    $(arrHtml.join("")).appendTo("body");
                    
                    el_dialog = $("#dialogCommonErrorMsg45");
                }
                
                var opt    = {};
                
                if (typeof close_function == "function") {
                    opt.close_function    = close_function;
                }
                
                var rtn = get_console_messages(title);
                var rtn2 =get_console_messages(msg);
                var rtn3 = get_console_messages("txt_lang_confirm");
                
                $("#dialogCommonErrorMsg_title", el_dialog).html(rtn);
                $("#dialogCommonErrorMsg_msg", el_dialog).html(rtn2);
                var rtnchk = "확인";
                if(get_lang_cookie() == "en") {
                    rtnchk = "Check";
                }
                $("#checklangconfirm", el_dialog).text(rtnchk);
                
                showCommonMsg(el_dialog, "csserver");
                
                $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
                    e.preventDefault();
                    el_dialog.dialog("close");
                    
                    if (typeof close_function == "function"){
                        close_function();
                    }
                });
                
                $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
                    e.preventDefault();
                    el_dialog.dialog("close");
                });
                
                $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {
                        e.preventDefault();

                    el_dialog.dialog("close");

                    timerKey        = "jobDelay";
                    
                    $("body").everyTime(
                            refresh_delay,
                            timerKey,
                            function() {
                                $("body").stopTime(timerKey);
                                
                                if(title == "클라우드서버 생성 확인") {
                                    call_vmList();
                                } else if(title == "lang_f_add_disk_confrim_tle") {
                                    list_Volume();
                                } else if(title == "IP 추가 확인") {
                                    call_ipList();
                                } else if(title == "스냅샷 Disk 생성 확인") {
                                    //disk
                                } else if(title == "lang_server_creation_machinee") {
                                    window.location.href="/console/serverlist";
                                } else if(title == "lang_server_creation_myimage") {
                                    window.location.href="/console/serverlist";
                                } else if(title == "서버 이미지 서버 생성 확인") {
                                    window.location.href="/console/serverlist";
                                }
                                
                                return false;
                            },
                            0
                    );
                });
                         
            },  
            0 
    );  
}

//title_cls, msg_cls : 다국어 properties ID 값을 읽어와서 뿌림
function showCommonMsgRenewal(msg_cls, msg_cls1,msg_cls2, close_function, setting_function){
    
    $("#dialogCommonErrorMsg").remove();
    var el_dialog = $("#dialogCommonErrorMsg");
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('<div class="popUp" id="dialogCommonErrorMsg" style="width:500px;height:248px;top:auto !important;  display:none;">');
        arrHtml.push(' <div class="head htpop clfix">');
        arrHtml.push('    <h1><!--타이틀--> <span class="del"><a href="#" ><img src="/images/coni/Cancel.svg" alt="" /></a></span></h1> ');
        arrHtml.push('    </div>   ');
        arrHtml.push('     <div class="body"> ');
        arrHtml.push('       <div class="con"> ');
        arrHtml.push('        <p class="box_txtl ac"><span>' +msg_cls+ '</span>'+msg_cls1+'</p>');
        arrHtml.push('            <div class="btn_box twobtn mt60"> ');
        arrHtml.push('                <div>');
        arrHtml.push('                    <div class="pop_btn_left btnl_secondary" id= "commonMsgClose"><a href="#">취소</a></div>  ');
        arrHtml.push('                    <div class="pop_btn_right btnl_primary" id= "commonMsgOk"><a href="#">'+msg_cls2+'</a></div> ');
        arrHtml.push('                </div> ');
        arrHtml.push('            </div> ');
        arrHtml.push('        </div> ');
        arrHtml.push('    </div> ');
        arrHtml.push('</div> ');
        
        $(arrHtml.join("")).appendTo("body");
        
        el_dialog = $("#dialogCommonErrorMsg");
    }

    var opt    = {};
    
    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }
    
    commonDialogInit(el_dialog, opt);
    
    //다국어 적용  start
    //title
    var returnVal = get_console_messages(msg_cls1);
    $("#commonErrMsgTitle").html(returnVal); 
    //msg
    var returnVal = get_console_messages(msg_cls);
    $("#commonErrMsgDesc").html(returnVal); 
    //다국어 적용 end
    
    el_dialog.dialog("open");
    add_active_popup("dialogCommonErrorMsg");
    
    $("#commonMsgClose, .del", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        hideLoadingBox();
        el_dialog.dialog("close");
        
        if (typeof close_function == "function"){
            close_function();
        }
    });
    $("#commonMsgOk", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        
        if (typeof setting_function == "function"){
            setting_function();
        }
    });
    
    $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
    });
}

function showHACuserData(msg_cls, msg_cls1,msg_cls2, close_function, setting_function){

    $("#dialogCommonErrorMsg").remove();
    var el_dialog = $("#dialogCommonErrorMsg");
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('<div class="popUp" id="dialogCommonErrorMsg" style="width:500px;height:248px;top:auto !important;  display:none;">');
        arrHtml.push(' <div class="head htpop clfix">');
        arrHtml.push('    <h1><!--타이틀--> <span class="del"><a href="#" >  HAC UserData 문법 Sample   <img src="/images/coni/Cancel.svg" alt="" /></a></span></h1> ');
        arrHtml.push('    </div>   ');
        arrHtml.push('     <div class="body"> ');
        arrHtml.push('       <div class="con"> ');
        arrHtml.push('        <p class="box_txtl ac"><span>#cloud-config</p>');
        arrHtml.push('            <div class="btn_box twobtn mt60"> ');
        arrHtml.push('                <div>');
        arrHtml.push('                    <div class="pop_btn_left btnl_secondary" id= "commonMsgClose"><a href="#">취소</a></div>  ');
        arrHtml.push('                    <div class="pop_btn_right btnl_primary" id= "commonMsgOk"><a href="#">'+msg_cls2+'</a></div> ');
        arrHtml.push('                </div> ');
        arrHtml.push('            </div> ');
        arrHtml.push('        </div> ');
        arrHtml.push('    </div> ');
        arrHtml.push('</div> ');

        $(arrHtml.join("")).appendTo("body");

        el_dialog = $("#dialogCommonErrorMsg");
    }

    var opt    = {};

    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }

    commonDialogInit(el_dialog, opt);

    //다국어 적용  start
    //title
    var returnVal = get_console_messages(msg_cls1);
    $("#commonErrMsgTitle").html(returnVal);
    //msg
    var returnVal = get_console_messages(msg_cls);
    $("#commonErrMsgDesc").html(returnVal);
    //다국어 적용 end

    el_dialog.dialog("open");
    add_active_popup("dialogCommonErrorMsg");

    $("#commonMsgClose, .del", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");

        if (typeof close_function == "function"){
            close_function();
        }
    });
    $("#commonMsgOk", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");

        if (typeof setting_function == "function"){
            setting_function();
        }
    });

    $("#commonErrMsgCloseX", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
    });
}