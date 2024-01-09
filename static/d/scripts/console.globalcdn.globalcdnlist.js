var property_chk = false;
var http_port_chk = true;
var https_port_chk = true;
var rule_arr = []; //기존 cdn 클릭 시, 데이터
var custom_rule_chk = false;
var add_rule_chk = false;
var add_rule_num = 0;
var child_rule_num = 0;
var message_id = [];
var property_status = "";
var cpcode = "";
var sort_items = "";
var globalcdnlist = "";
var notifyEmails = ["ktcdn@kt.com"];

// 조건 추가 시, 임시 저장
let temp_file_ex_list = [];
let temp_path_list = [];
let temp_ip_list = [];
let temp_token_file_ex_list = [];
let temp_token_path_list = [];

//개별 캐싱적책 criteria list
let caching_criteria_list = [];
const contentCachingList = [];

//ip 차단 criteria list
let ip_criteria_list = [];
const ipDenyList = [];

//token 접근제어 criteria list
let token_criteria_list = [];
let tokenAccessList = [];

let temp_detail_json = "";

var cpcode_create = "";

let custom_indexKey = "false";

//2021-08 코드아이
var WebROOT = "/";
$(document).ready(function(){
    // globalCDNAjax();
});
// function globalCDNAjax(){
//     set_console_default("globalcdn", "globalcdn", "globalcdn_list");
//     showLoadingBox();
//     editional_setting();
//     $.ajax({
//         url: "/console/globalcdn/globalList",
//         type: "POST",
//         dataType: "json",
//         complete : hideLoadingBox,
//         success: globalCDNAjaxSuccss
//     });

//     set_BtnEvent();

//     function globalCDNAjaxSuccss(data) {
//         if(data.error == "String index out of range: -1"){
//             var command = "목록 호출 오류";
//             return akamaiConnectionError(command);
//         }

//         if(data.result == "fail"){
//             return showCommonNoLangErrorMsg("알림","리스트 호출에 실패 하였습니다.<br/> 다시 시도해 주시기 바랍니다.");
//         }

//         sort_items = data.properties.items;
//         globalcdnlist = sort_items;
//         itemSort();
// //        chkStrage(); //storage 1.0 청약 여부 확인
//     }
// }

function set_BtnEvent(){
    $("#propertyAct").unbind("click").bind("click" , propertyAct);

    function propertyAct(e) {
        e.preventDefault();

        if($("#propertyAct").hasClass("action_disabled")){
            return;
        }

        event_cdnAct(e);
    }

    $("#propertyDeact").unbind("click").bind("click" , propertyDeact);

    function propertyDeact(e) {
        e.preventDefault();

        if($("#propertyDeact").hasClass("action_disabled")){
            return;
        }

        event_cdnDeact(e);
    }

    $("#propertyDetail").unbind("click").bind("click" , propertyDetail);

    function propertyDetail(e) {
        e.preventDefault();

        if(event.srcElement.className == ""){
            event_cdnDetail(e);
        }

        return false;
    }


    $("#propertyPurge").unbind("click").bind("click" , propertyPurge);

    function propertyPurge(e) {
        e.preventDefault();

        if(event.srcElement.className == ""){
            event_cdnPurge(e);}

        return false;
    }

    $("#button_search").unbind("click").bind("click" , clickSearch);
}

function event_cdnAct(e){
    e.preventDefault();

    var el_dialog        = $("#popUpAct");

    commonDialogInit(el_dialog);
    el_dialog.dialog("open");
    el_dialog.find("#button_VM_Start_TopClose").unbind("click")
        .bind("click" , btuVMStartTopClose);
    el_dialog.find("#button_VM_Start_Cancel").unbind("click")
        .bind("click" ,btnVMStartCancel);

    function btuVMStartTopClose(event){
        event.preventDefault();
        el_dialog.dialog("close");
    }

    function btnVMStartCancel(event){
        event.preventDefault();
        el_dialog.dialog("close");
    }
}

function event_cdnDeact(e){
    e.preventDefault();
    var el_dialog        = $("#popUpDeact");

    commonDialogInit(el_dialog);
    el_dialog.dialog("open");
    el_dialog.find("#button_VM_Start_TopClose").unbind("click")
        .bind("click" , btuVMStartTopClose);
    el_dialog.find("#button_VM_Stop_Cancel").unbind("click")
        .bind("click" , btnVMStartCancel);

    function btuVMStartTopClose(event){
        event.preventDefault();
        el_dialog.dialog("close");
    }

    function btnVMStartCancel(event){
        event.preventDefault();
        el_dialog.dialog("close");
    }
}

function event_cdnDetail(e){
    e.preventDefault();
    var el_dialog        = $("#popUpDetail");

    commonDialogInit(el_dialog);
    $(el_dialog).dialog("open");

    $(el_dialog).find("#button_CDN_Detail_TopClose").unbind("click").bind("click" , function(event){
        event.preventDefault();
        $(el_dialog).dialog("close");
    });
}

function event_cdnPurge(e){
    e.preventDefault();

    var el_dialog        = $("#popUpPurge");

    commonDialogInit(el_dialog);
    $(el_dialog).dialog("open");

    $(el_dialog).find("#button_CDN_Purge_Cancle").unbind("click").bind("click" , function(event){
        event.preventDefault();
        $(el_dialog).dialog("close");
    });
}

function event_cdnModify(e){
    e.preventDefault();
    var el_dialog        = $("#popUpModify");

    commonDialogInit(el_dialog);
    $(el_dialog).dialog("open");

    $(el_dialog).find("#button_CDN_Modify_Cancle").unbind("click").bind("click" , function(event){
        event.preventDefault();
        $(el_dialog).dialog("close");
    });
}

function listSearch(data){
    var searchName = $(data).find('a').text();

    $("#searchDiv").find("dl").removeClass('dp_on');
    $("#searchDiv").find("dl").addClass('dp_off');
    $("#sch_word").val("");
    $("#searchWord").append('<span onclick="clickSearch()" id="firstName" class="'+$(data).find("a").attr("class")+'">'
        +searchName+'<img style="vertical-align: middle;" src="../../images/c_common/pagination_next_01_sel.png"/></span>');

    $("#sch_word").removeAttr('onclick');
}

//검색 목록 START ==================================================================================================================
function clickSearch(){
    $("#tbody_cdnList").empty();
    var sch_word = $("#sel_sch_word").val();
    sch_word = sch_word.toUpperCase();
    var search_list = [];

    if(sch_word != ""){
        for(var i=0; i<globalcdnlist.length; i++){
            var propertyName = globalcdnlist[i].propertyName;
            propertyName = propertyName.toUpperCase();
            if(propertyName.indexOf(sch_word) > -1){
                search_list.push(globalcdnlist[i]);
            }
        }
    } else {
        search_list = globalcdnlist;
    }

    sort_items = search_list;

    for(i=0; i<sort_items.length; i++){
        var vs = sort_items[i].productionVersion == null ? sort_items[i].latestVersion : sort_items[i].productionVersion;
        var cdn_tr = $("#base_cdnList").clone(true).attr("id","cdn-"+sort_items[i].propertyId+"-" +vs).css("display","");
        cdn_tr.find("#akamai_property").text(sort_items[i].propertyName);
        var status = "";

        if(sort_items[i].status == "ACTIVE"){
            status = "<img src=\"/images/c_common/ico_state_use.png\" alt=\"사용\"/> 사용";
        } else if(sort_items[i].status == "INACTIVE" || sort_items[i].status == "DEACTIVATED") {
            status = "<img src=\"/images/c_common/ico_state_stop.png\" alt=\"사용\"/> 정지";
        } else if(sort_items[i].status == "PENDING"){
            status = "<img src=\"/images/c_common/ico_state_loading_02_bak.gif\" alt=\"사용\"/> 처리 중";
        } else {
            status = "<img src=\"/images/c_common/ico_state_loading_01_bak.gif\" alt=\"사용\"/> 정지 중";
        }

        cdn_tr.find("#akamai_status").html(status);
        cdn_tr.data("status", sort_items[i].status);
        cdn_tr.data("latestVersion", sort_items[i].latestVersion);

        if(sort_items[i].userhostname == null || sort_items[i].userhostname == ""){
            cdn_tr.find("#akamai_host").text("-");
        } else {
            cdn_tr.find("#akamai_host").text(sort_items[i].userhostname);
        }

        cdn_tr.find("#akamai_edge_host").text(sort_items[i].defaulthostname);
        cdn_tr.find("#akamai_regdttm").text(sort_items[i].regdttm);

        if(sort_items[i].productId == "prd_Download_Delivery"){
            cdn_tr.find("#akamai_service_type").text("Dowonload Delivery");
        }

        $("#tbody_cdnList").append(cdn_tr);
    }
}

//검색 목록 END ==================================================================================================================

/************************************************************************************************
 *     서비스명 sort 처리 START - 김만구 (2016.02.05)
 ************************************************************************************************/
// 테이블 sort 이벤트
function evnet_sort(data){
    var sort_id = $(data).attr("id");
    var sort_img = $("#"+sort_id).find("#sort_img");
    if(sort_img.css("display") != "none"){
        //내림차순 정렬
        if(sort_img.attr("src").indexOf("sort_up.gif")>-1){
            itemSort('desc', sort_id);
        }
        //오름차순 정렬
        else{
            itemSort('asc', sort_id);
        }
    }
}

// 테이블 sort 처리
function itemSort(orderby, sort_id){
    if(sort_items != null && sort_items.length > 1) {
        $("#table_property").find("#sort_img").attr("src","../../images/common/btn/sort_normal.gif");
        $("#table_status").find("#sort_img").attr("src","../../images/common/btn/sort_normal.gif");
        $("#table_host").find("#sort_img").attr("src","../../images/common/btn/sort_normal.gif");
        $("#table_property").find("#sort_img").show();
        $("#table_status").find("#sort_img").show();
        $("#table_host").find("#sort_img").show();
        $("#table_edge_host").find("#sort_img").show();
        $("#table_regdttm").find("#sort_img").show();

        //소트 안함
        if(orderby!=null){
            //오름차순
            if(orderby=="asc"){
                $("#"+sort_id).find("#sort_img").attr("src","../../images/common/btn/sort_up.gif");
                //서비스명
                if(sort_id=="table_property"){
                    for(var i = 0; i < sort_items.length-1 ; i++) {
                        for(var j = i+1; j < sort_items.length ; j++) {
                            if(sort_items[i].propertyName.toUpperCase() > sort_items[j].propertyName.toUpperCase()){
                                var temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                //서비스유형
                else if(sort_id=="table_status"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if(sort_items[i].status.toUpperCase() > sort_items[j].status.toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                //서비스도메인
                else if(sort_id=="table_host"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if((sort_items[i].userhostname).toUpperCase() > (sort_items[j].userhostname).toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                //글로벌 CDN 도메인
                else if(sort_id=="table_edge_host"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if((sort_items[i].defaulthostname).toUpperCase() > (sort_items[j].defaulthostname).toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                // 생성일시
                else if(sort_id=="table_regdttm"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if((sort_items[i].regdttm).toUpperCase() > (sort_items[j].regdttm).toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
            }
            //내림차순
            else{
                $("#"+sort_id).find("#sort_img").attr("src","../../images/common/btn/sort_down.gif");
                //서비스명
                if(sort_id=="table_property"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if(sort_items[i].propertyName.toUpperCase() < sort_items[j].propertyName.toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                //서비스 유형
                else if(sort_id=="table_status"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if(sort_items[i].status.toUpperCase() < sort_items[j].status.toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                //서비스 도메인
                else if(sort_id=="table_host"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if((sort_items[i].userhostname).toUpperCase() < (sort_items[j].userhostname).toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                //글로벌 CDN 도메인
                else if(sort_id=="table_edge_host"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if((sort_items[i].defaulthostname).toUpperCase() < (sort_items[j].defaulthostname).toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
                // 생성일시
                else if(sort_id=="table_regdttm"){
                    for(i = 0; i < sort_items.length-1 ; i++) {
                        for(j = i+1; j < sort_items.length ; j++) {
                            if((sort_items[i].regdttm).toUpperCase() < (sort_items[j].regdttm).toUpperCase()){
                                temp = sort_items[i];
                                sort_items[i] = sort_items[j];
                                sort_items[j] = temp;
                            }
                        }
                    }
                }
            }
        }
    }else{
        $("#view_svr_name").find("#sort_img").hide();
        $("#view_svr_os").find("#sort_img").hide();
        $("#view_svr_spec").find("#sort_img").hide();
    }

    globalCDNList();
}

function globalCDNList(){

    if(sort_items.length < 1){
        $("#div_nonelist").show();
        return false;
    }
    $("#tbody_cdnList").empty();
    for(var i=0; i<sort_items.length; i++){
        var vs = sort_items[i].productionVersion == null ? sort_items[i].latestVersion : sort_items[i].productionVersion;
        var cdn_tr = $("#base_cdnList").clone(true).attr("id","cdn-"+sort_items[i].propertyId+"-" +vs).css("display","");
        cdn_tr.find("#akamai_property").text(sort_items[i].propertyName);
        var status = "";
        if(sort_items[i].status == "ACTIVE"){
            status = "<img src=\"/images/c_common/ico_state_use.png\" alt=\"사용\"/> 사용";
        } else if(sort_items[i].status == "INACTIVE" || sort_items[i].status == "DEACTIVATED") {
            status = "<img src=\"/images/c_common/ico_state_stop.png\" alt=\"사용\"/> 정지";
        } else if(sort_items[i].status == "PENDING"){
            status = "<img src=\"/images/c_common/ico_state_loading_02_bak.gif\" alt=\"사용\"/> 처리 중";
        } else {
            status = "<img src=\"/images/c_common/ico_state_loading_01_bak.gif\" alt=\"사용\"/> 정지 중";
        }
        cdn_tr.find("#akamai_status").html(status);
        cdn_tr.data("status", sort_items[i].status);
        cdn_tr.data("latestVersion", sort_items[i].latestVersion);

        if(sort_items[i].userhostname == null || sort_items[i].userhostname == ""){
            cdn_tr.find("#akamai_host").text("-");
        } else {
            cdn_tr.find("#akamai_host").text(sort_items[i].userhostname);
        }
        cdn_tr.find("#akamai_edge_host").text(sort_items[i].defaulthostname);
        cdn_tr.find("#akamai_regdttm").text(sort_items[i].regdttm);
        if(sort_items[i].productId == "prd_Download_Delivery"){
            cdn_tr.find("#akamai_service_type").text("Dowonload Delivery");
        }
        $("#tbody_cdnList").append(cdn_tr);
    }
    // 다국어 메시지 처리 위한 페이지, 서비스명, 서비스별 페이지명 ==> portal.common.cr.js를 참조

    set_col_resize2();
}

function createGlobalCDN(){
    $("#div_non_create").hide();
    $("#div_create").show();
    $("#final_service_div").hide();
//    editional_setting();
}

function popUpAction(command){
    var etag = "";

    if(command == 'group_cancel'){
        $("#dialog_groupid").dialog("close");
        showLoadingBox();
        $.ajax({
            url: "/console/globalcdn/createGroupId",
            type: "POST",
            dataType: "json",
            success: function(data) {
                location.reload();
            }
        });
    } else if(command == "create_succ"){
        location.reload();
        $("#dialog_create_proerty").dialog("close");
    } else if(command == 'cancel_cl'){// 신청 취소 팝업 에서 "취소" 버튼
        $("#dialog_create_cancel").dialog("close");
    } else if(command == 'cancel_ok'){// 신청 취소 팝업 에서 "확인" 버튼
        location.reload();
    } else if(command == "modify_succ"){
        location.reload();
        $("#dialog_modify_property").dialog("close");
    } else if(command == "modify_succ_act"){
        location.reload();
        $("#dialog_modify_property_act").dialog("close");
    } else if(command == 'modify_cl'){// 수정 취소 팝업 에서 "취소" 버튼
        $("#dialog_modify_cancel").dialog("close");
    } else if(command == 'modify_ok'){// 수정 취소 팝업 에서 "확인" 버튼
        location.reload();
    } else if(command == "activation"){
        var property_vs = rule_arr.propertyVersion;
        var property_id =  rule_arr.propertyId;
        etag = rule_arr.etag;
        var rule_vs_up = {
            createFromVersion : property_vs,
            createFromVersionEtag : etag
        };

        $("#popUpAct").dialog("close");

        if(property_status == "DEACTIVATED"){
            deActivationANDactivation(rule_vs_up, property_id, property_vs);
        } else {
            var body = {
                acknowledgeAllWarnings: true,
                propertyVersion : property_vs,
                network : "PRODUCTION",
                activationType : "ACTIVATE",
                notifyEmails : notifyEmails
            };
            var params = {
                property_id : property_id,
                body : JSON.stringify(body),
                type : "ACTIVATE"
            };

            activationAction(params, property_id);
        }
    } else if(command == "cancel"){
        $("#popUpAct").dialog("close");
    } else if(command == "message_acti"){
        $("#dialog_message_activation").dialog("close");
    } else if(command == "message_cancel"){
        $("#dialog_message_activation").dialog("close");
    } else if(command == "deactivation"){
        $("#popUpDeact").dialog("close");
        property_id =  rule_arr.propertyId;
        property_vs = rule_arr.propertyVersion;
        etag = rule_arr.etag;
        rule_vs_up = {
            createFromVersion : property_vs,
            createFromVersionEtag : etag
        };
        deActivationProcess(rule_vs_up, property_vs, property_id);
    } else if(command == "decancel"){
        $("#popUpDeact").dialog("close");
        //purge
    }else if(command == "purge"){
        var objects = [];

        if($("#purge_all").hasClass("on")){
            objects.push(cpcode);
            body = {
                objects : objects
            };
        } else {
            var purge_add_url = $("#purge_div").children("span");

            purge_add_url.each(function(){
                objects.push($(this).find("span").text());
            });

            if(objects.length < 1){
                return showCommonNoLangErrorMsg("알림","URL을 입력해 주시기 바랍니다.");
            }

            body = {
                objects : objects
            };
        }

        var hard_purge_yn = $("#hardPurgeUse").is(":checked");

        if (!hard_purge_yn) {
            hard = "false";
        } else {
            hard = "true";
        }

        params = {
            body : JSON.stringify(body),
            hard : hard
        };

        params.property_id =  rule_arr.propertyId; /* IAM 사용자 정책 처리 */

        $("#popUpPurge").dialog("close");
        showLoadingBox();    // 로딩중 이미지

        $.ajax({
            url: "/console/globalcdn/postPurge",
            type: "POST",
            data: params,
            dataType: "json",
            complete : hideLoadingBox,
            success: function(data) {
                //$("#purge_div").empty();
                $("#purge_div").children("span").remove();
                $("#purge_text").val("");
                $("#purge_url_detail").hide();
                $("#purge_all").attr("class", "imgbn on");
                $("#purge_url").attr("class", "imgbn");

                if(data.result == "29") { /* IAM 사용자 정책 처리 */
                    commonErrorMessage("29");
                    return;
                }

                if(data.result == "fail"){
                    showCommonNoLangErrorMsg("Purge 실패","Purge 실패 하였습니다.");
                } else {
                    showCommonNoLangErrorMsg("Purge 성공","Purge 요청이 완료되었습니다.");
                }
            },
            error: function(XMLHttpResponse) {
                showCommonNoLangErrorMsg("Purge 실패","Purge 실패 하였습니다.");
            }
        });
    } else if(command == "purge_cancel"){
        $("#purge_div").children("span").remove();
        $("#popUpPurge").dialog("close");
        $("#purge_text").val("");
    }
}

function purgeUrlAdd(data){
    if($(data).val() == ""){
        return showCommonNoLangErrorMsg("알림","입력해 주시기 바랍니다.");
    }else{
        var temp_val = $(data).val();
        var temp_span = $("#purge_span").clone(true).attr("id", temp_val+"-purge_span").css("display","");
        temp_span.find("span").text(temp_val);
        $(data).before(temp_span);
        $(data).val("");

        $("#purge_text").attr("placeholder","URL을 입력해주세요.");
    }
}

function activationAction(params, property_id){
    showLoadingBox();    // 로딩중 이미지
    $.ajax({
        url: "/console/globalcdn/activation",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            hideLoadingBox();

            if(data.result == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }

            if(data.result == "fail"){
                if(data.error == "String index out of range: -1"){
                    process_toast_popup("CDN Global", "서버와 통신이 원활하지 않습니다.", false);
                }
                process_toast_popup("CDN Global", "서비스 생성 오류", false);
            } else {
                var pro_activation = sessionStorage.getItem("activation_pro");
                var property_list = "";
                property_list = property_id+","+pro_activation;
                sessionStorage.setItem("activation_pro", property_list);
                activationCheck();
                process_toast_popup("CDN Global", "서비스 Activation 요청 완료", true);
                location.reload();
            }
        },
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            process_toast_popup("CDN Global", "서비스 생성 오류", false);
        }
    });

    $("#dialog_activation").dialog("close");
}

function deActivationANDactivation(rule_vs_up, property_id, property_vs){
    var params = {
        ruleVsUp : JSON.stringify(rule_vs_up),
        property_id : property_id,
        request_type : "deactivate"    /* IAM 사용자 정책 처리 */
    }

    var latestVs = $("#tbody_cdnList tr.on").data("latestVersion");
    var updatedVs = parseInt(latestVs, 10)+1;
    showLoadingBox();

    $.ajax({
        url: "/console/globalcdn/propertyVsUpdate",
        type: "POST",
        data: params,
        dataType: "json",
        success: deActivationANDactivationAjax1,
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            process_toast_popup("CDN Global", "서비스 Deactivation 실패", false);
        }
    });

    function deActivationANDactivationAjax1(data) {
        if(data.result == "29") { /* IAM 사용자 정책 처리 */
            commonErrorMessage("29");
            return;
        }

        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                return process_toast_popup("CDN Global", "서비스 생성 오류", false);
            }

            return process_toast_popup("CDN Global", "서비스 Deactivation 실패", false);
        } else {
            params={
                property_id : property_id,
                property_vs : updatedVs
            }

            // CDN Global 기능 오류건 개발
            $.ajax({
                url: "/console/globalcdn/propertyDetail",
                type: "POST",
                async: true,
                data: params,
                dataType: "json",
                success: deActivationANDactivationAjax2,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    process_toast_popup("CDN Global", "서비스 Deactivation 실패", false);
                }
            });
        }
    }

    function deActivationANDactivationAjax2(data) {
        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                return process_toast_popup("CDN Global", "목록 호출 오류", false);
            }

            return process_toast_popup("CDN Global", "서비스 Deactivation 실패", false);
        } else {
            data.ruleFormat = 'v2022-06-28';
            detailRule = data;
            params={
                property_id : property_id,
                property_vs : updatedVs,
                detailRule : JSON.stringify(detailRule)
            }
            // rule update
            $.ajax({
                url: "/console/globalcdn/deactANDActivation",
                type: "POST",
                data: params,
                dataType: "json",
                success: deActivationANDactivationAjax3,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    process_toast_popup("CDN Global", "서비스 Deactivation 실패", false);
                }
            });
        }
    }

    function deActivationANDactivationAjax3(data) {
        data.ruleFormat = 'v2022-06-28';

        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                return  process_toast_popup("CDN Global", "목록 호출 오류", false);
            } else if(data.message == "detail"){
                return  process_toast_popup("CDN Global", "서비스 Deactivation 실패", false);
            }
        } else {
            var body = {
                acknowledgeAllWarnings : true,
                propertyVersion : updatedVs,
                network : "PRODUCTION",
                activationType : "ACTIVATE",
                notifyEmails : notifyEmails
            }
            params = {
                property_id : property_id,
                body : JSON.stringify(body),
                type : "ACTIVATE"
            }
            activationAction(params, property_id);
        }
    }
}

function deActivationProcess(rule_vs_up, property_vs, property_id){
    var params = {
        ruleVsUp : JSON.stringify(rule_vs_up),
        property_id : property_id
    }

    const latestVs = $("#tbody_cdnList tr.on").data("latestVersion");
    var updatedVs = parseInt(latestVs, 10)+1;

    showLoadingBox();

    $.ajax({
        url: "/console/globalcdn/propertyVsUpdate",
        type: "POST",
        data: params,
        dataType: "json",
        success: deActivationProcessAjax1,
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            rocess_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
        }
    });

    function deActivationProcessAjax1(data) {
        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                return process_toast_popup("CDN Global", "서비스 생성 오류", false);
            }

            return process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
        } else {
            params={
                property_id : property_id,
                property_vs : updatedVs
            }

            // CDN Global 기능 오류건 개발
            $.ajax({
                url: "/console/globalcdn/propertyDetail",
                type: "POST",
                async: true,
                data: params,
                dataType: "json",
                success: deActivationProcessAjax2,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
                }
            });
        }
    }

    function deActivationProcessAjax2(data) {
        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                return process_toast_popup("CDN Global", "목록 호출 오류", false);
            }

            return process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
        } else {
            var detailRule = data;
            detailRule.ruleFormat = "v2022-06-28";
            params={
                property_id : property_id,
                property_vs : updatedVs,
                detailRule : JSON.stringify(detailRule)
            }

            $.ajax({
                url: "/console/globalcdn/deActivation",
                type: "POST",
                data: params,
                dataType: "json",
                success: deActivationProcessAjax3,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
                }
            });
        }
    }

    function deActivationProcessAjax3(data) {
        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                return process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);

            } else if(data.message == "detail"){
                return process_toast_popup("CDN Global", "상세 정보 오류", false);
            }
        } else {
            var body = {
                acknowledgeAllWarnings: true,
                propertyVersion : updatedVs,
                network : "PRODUCTION",
                activationType : "ACTIVATE",
                notifyEmails : notifyEmails
            }

            params = {
                property_id : property_id,
                body : JSON.stringify(body),
                type : "DEACTIVATE"
            }

            deActivationAction(params, property_id, property_vs);
        }
    }
}

function deActivationAction(params, property_id, property_vs){
    $.ajax({
        url: "/console/globalcdn/activation",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            hideLoadingBox();
            if(data.result == "fail"){
                if(data.error == "String index out of range: -1"){
                    process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
                }
                process_toast_popup("CDN Global", "서비스 Activation 요청이 실패되었습니다. <br />다시 시도해 주시기 바랍니다.", false);
            } else {
                var pro_activation = sessionStorage.getItem("activation_pro");
                var property_list = "";
                property_list = property_id+","+pro_activation;
                sessionStorage.setItem("deactivation_pro", property_list);
                activationCheck();
                process_toast_popup("CDN Global", "서비스 Deactivation 요청 완료", true);
                location.reload();
            }
        },
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            process_toast_popup("CDN Global", "서비스 Activation 요청 실패", false);
        }
    });
}

function propertyClick(){
    if(property_chk){
        property_chk = false;
        $("#red_text").show();
        $("#green_text").hide();
    }
}

// 서비스명 중복 체크
function propertyChk(){

    var property_name = $("#property_name").val();
    var checkPattern = /[^\,\-\.a-zA-Z0-9]/;
    var nameLength = property_name.length;

    if(nameLength <= 20){
        $("#name_length").html(nameLength);
    }else {
        $("#name_length").html(20);
        $("#property_name").val($("#property_name").val().substring(0,20));
    }

    if(property_name == ""){
        $("#red_svn_nm").css("display", "");
        $("#red_svn_nm_2").css("display", "none");
        $("#property_name").attr("required", true);
    }else {
        $("#red_svn_nm").css("display", "none");

        if(property_name.match(checkPattern)) {
            $("#red_svn_nm_2").css("display", "");
            $("#red_svn_nm_3").css("display", "none");
            $("#property_name").attr("required", true);
        }else {
            $("#red_svn_nm_2").css("display", "none");
            $("#red_svn_nm_3").css("display", "none");
            $("#property_name").attr("required", false);
        }
    }

    var params = {
        property_name : property_name
    };

    //cdn 이름 중복검사!!!

    $.ajax({
        url: "/console/globalcdn/propertyCheck",
        type: "POST",
        data: params,
        success: function(data) {
            $("#green_text").hide();
            $("#red_text").hide();
            if(data == "Y"){
                $("#red_svn_nm_2").css("display", "none");
                $("#red_svn_nm_3").css("display", "none");
                $("#property_name").attr("required", false);
                property_chk = true;
            } else {
                $("#red_svn_nm_2").css("display", "none");
                $("#red_svn_nm_3").css("display", "");
                $("#property_name").attr("required", true);
                property_chk = false;
            }
        }
    });

    property_chk = true;
}

function autoHostname(command){
    if($("input:checkbox[id='"+command+"_host']").is(":checked")){
        $("#host_name_"+command).val("");
        $("#host_name_"+command).attr("disabled", "disabled");
    } else {
        $("#host_name_"+command).removeAttr("disabled");
    }
}






//서비스 도메인 입력값 유효성 검사
function serviceDomainInput(data){

    var service_domain ="#" +  $(data).attr("id");
    var service_domain_val = $(service_domain).val();

    var checkPattern = /[^\,\-\.a-zA-Z0-9]/;


    if(service_domain_val == ""){
        $(service_domain + "+.mt5 #service_domain_red").css("display", "");
        $(service_domain + "+.mt5 #service_domain_red_2").css("display", "none");
        $(service_domain).attr("required", true);


    }else {

        $(service_domain + "+.mt5 #service_domain_red").css("display", "none");

        if(service_domain_val.match(checkPattern)) {
            $(service_domain + "+.mt5 #service_domain_red_2").css("display", "");
            $(service_domain).attr("required", true);
        }else {
            $(service_domain + "+.mt5 #service_domain_red_2").css("display", "none");
            $(service_domain).attr("required", false);
        }
    }
}

//원본 서버 입력값 유효성 검사
function original_server_input(data) {
    var origin_hostname_create = "#" + $(data).attr("id");
    var origin_hostname_create_val = $(origin_hostname_create).val();
    var checkPattern = /[^\,\-\.a-zA-Z0-9]/;

    var expUrl = /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/;
    if(origin_hostname_create_val.indexOf("/") > -1){
        var ip_addr = origin_hostname_create_val.split("/")[0];
        var ipchk = expUrl.test(ip_addr);

    } else {
        ipchk = expUrl.test(origin_hostname_create_val);
    }

    if(origin_hostname_create_val == ""){
        $(origin_hostname_create).parent().find("#allsslcertfileName_red").css("display", "");
        $(origin_hostname_create).parent().find("#allsslcertfileName_red_2").css("display", "none");
        $(origin_hostname_create).parent().find("#allsslcertfileName_red_3").css("display", "none");
        $(origin_hostname_create).attr("required", true);
    }else {
        $(origin_hostname_create).parent().find("#allsslcertfileName_red").css("display", "none");
        if(origin_hostname_create_val.match(checkPattern)) {
            $(origin_hostname_create).parent().find("#allsslcertfileName_red_3").css("display", "none");
            $(origin_hostname_create).parent().find("#allsslcertfileName_red_2").css("display", "");
            $(origin_hostname_create).attr("required", true);
        } else if(ipchk){
            $(origin_hostname_create).parent().find("#allsslcertfileName_red_2").css("display", "none");
            $(origin_hostname_create).parent().find("#allsslcertfileName_red_3").css("display", "");
//	    	$(origin_hostname_create).attr("required", true);
        }else {
            $(origin_hostname_create).parent().find("#allsslcertfileName_red_2").css("display", "none");
            $(origin_hostname_create).parent().find("#allsslcertfileName_red_3").css("display", "none");
            $(origin_hostname_create).attr("required", false);
        }
    }
}



//CDN 도메인을 서비스 도메인으로 사용 토글버튼
function cdnDomain(data){

    var hostNameType = $(data).attr("id").split("_")[0];

    if(data.checked){
        $("#host_name_"+hostNameType).val('').attr("disabled", true).attr("required", false);
        $("#host_name_"+hostNameType+"+.mt5 #service_domain_red").css("display", "none");
        $("#host_name_"+hostNameType+"+.mt5 #service_domain_red_2").css("display", "none");

    }else{
        $("#host_name_"+hostNameType).attr("disabled", false);
        $("#host_name"+hostNameType).focus();
    }
}

function zoneChange(type, filename){
    var params    = {
        command        :     "getaccount",
        zcopy : $("#select_availability_"+type).val()
    };

    if($("#select_availability_"+type).val() === "2"){
        ss4List(type);
        $("#ss4_origin_path_" + type).show();
    }else {
        getFileboxList(params, type, filename);
        $("#ss4_origin_path_" + type).hide();
    }
}

function getFileboxList(params, type, filename){
    showLoadingBox();    // 로딩중 이미지

    $.ajax({
        url : "/ssSvc",
        type : "POST",
        data : params,
        dataType : "json",
        async : false,
        complete : hideLoadingBox, /*로딩중 이미지 닫기*/
        success : function(json) {
            var items = [];
            if((json.XmlRoot).hasOwnProperty('svc')){
                items = json.XmlRoot.svc.lists.contents;
            }
            var SSList    = $("#select_filebox_"+type);
            if(items != null && items.length > 0) {
                SSList.empty();
                for(var i = 0; i < items.length ; i++) {
                    if(items[i].X_Container_Read == ".r:*"){

                        var storageUrl = json.XmlRoot.info.storageUrl;
                        var stoUrl = storageUrl + ($("#select_availability_"+type).val()=="4"?".ssproxy2.ucloudbiz.olleh.com":$("#select_availability_"+type).val()=="2"?".ssjp1.ucloudbiz.olleh.com":".ssproxy.ucloudbiz.olleh.com");
                        var zcopy_suffix = "";
                        var newOption = "";

                        if($.cookie("encoder_fbox") != "" && $.cookie("encoder_fbox") == items[i].name) {
                            if(get_encoder_flag($("#select_availability_"+type).val(), items[i].name+zcopy_suffix) == "Y") {
                                newOption = "<option selected value='"+stoUrl+"'>" + items[i].name + zcopy_suffix + "(Encoder)</option>";
                            } else {
                                newOption = "<option selected value='"+stoUrl+"'>" + items[i].name + zcopy_suffix + "</option>";
                            }

                            $.cookie('encoder_fbox', null, {path : WebROOT});
                        } else {
                            if(get_encoder_flag($("#select_availability_"+type).val(), items[i].name+zcopy_suffix) == "Y") {
                                newOption = "<option value='"+stoUrl+"'>" + items[i].name + zcopy_suffix + "(Encoder)</option>";
                            } else {
                                newOption = "<option value='"+stoUrl+"'>" + items[i].name + zcopy_suffix + "</option>";
                            }
                        }
                        SSList.append(newOption);
                        SSList.find('option').eq(SSList.find('option').length-1).data('zcopy','3');
                        SSList.find('option').eq(SSList.find('option').length-1).data('backup',items[i].X_Container_Meta_Backup_Container_Name);
                    } else {
                        hideLoadingBox();
                        $("#origin_hostname_create").val("");
                        $("#origin_hostname_modify").val("");
                    }
                }

//                if(type == "modify"){
//                    $("#select_filebox_modify option").each(function(){
//                        if(this.text == filename){
//                            $(this).attr("selected", "selected");
//                        }
//                    })
//                }

                var select_filebox = $("#select_filebox_"+type).val();
                if($("#select_availability_" + type).val() === "3"){
                    var origin_hostaddr = select_filebox.split(".")[1]+"."+select_filebox.split(".")[2]+"."+select_filebox.split(".")[3]+"."+select_filebox.split(".")[4];
                    var origin_hostpath = "/v1/"+select_filebox.split(".")[0]+"/"+$("#select_filebox_"+type+" option:selected").text()+"/";
                }else {
                    var origin_hostaddr = "ssproxy2.ucloudbiz.olleh.com";
                }

                $("#origin_hostname_"+type).val(origin_hostaddr);
                $("#origin_hostname_path_"+type).val(origin_hostpath);
            }else {
                SSList.empty();
                SSList.append("<option>없음</option>");
            }
            selectbox_design(SSList);
        }
    });
}

function ss4List(type) {
    $("#ssServer option").remove();

    var params        = {
        command : "getUserNamespaceInfo" // Info
    };

    $.ajax({
        url: "/ss4Svc",
        type: "POST",
        data: params,
        dataType: "json",
        complete: hideLoadingBox, // 로딩중 이미지 닫기
        success: function(json) {

            var items = json.data;
            items = items.filter(item => item.namespaceName.indexOf('Public') > -1);
            var SSList    = $("#select_filebox_"+type);
            if(json.status === "00") {
                SSList.empty();
                var newOption = "";
                newOption = `<option selected value='${items[0].tenantName}'>${items[0].namespaceName}</option>`;
                SSList.append(newOption);

//                if(type == "modify"){
//                    $("#select_filebox_modify option").each(function(){
//                        if(this.text == filename){
//                            $(this).attr("selected", "selected");
//                        }
//                    })
//                }

            }else {
                SSList.empty();
                SSList.append("<option>없음</option>");
            }
            selectbox_design(SSList);


        }
    });
}


function fileboxChange(type){
    var select_filebox = $("#select_filebox_"+type).val();
    var origin_hostaddr = select_filebox.split(".")[1]+"."+select_filebox.split(".")[2]+"."+select_filebox.split(".")[3]+"."+select_filebox.split(".")[4];
    var origin_hostpath = "/v1/"+select_filebox.split(".")[0]+"/"+$("#select_filebox_"+type+" option:selected").text()+"/";
    $("#origin_hostname_"+type).val(origin_hostaddr);
    $("#origin_hostname_path_"+type).val(origin_hostpath);
}

function get_encoder_flag(dest_zcopy, dest_name) {
    var return_flag = "N";
    var params = {command:"get_encoder_flag", mem_sq:$.cookie("memsq"), zcopy:dest_zcopy, fboxname:dest_name};

    $.ajax({
        url : "/ssSvc",
        type : "POST",
        data : params,
        dataType : "json",
        async: false,
        success : function(json) {
            if(json.XmlRoot.info.code == "200") {
                if(json.XmlRoot.info.msg == "Y") {
                    return_flag = "Y";
                }
            }
        }
    });

    return return_flag;
}

// ********************************  파일박스 선택 END  *********************************

// 기본룰 커스터마이징 START ************************************************************************************



function radioTureClientIPtd(data){
    var modify = "";
    var type = $(data).children().first().find("input").attr("id");
    if(type.indexOf("modify") > -1){
        modify = "modifyid";
    }
    var true_ip_chk = JSON.parse($("input[name="+modify+"custom_true_ip]:checked").val());
    if(true_ip_chk){
        $("#"+modify+"client_tr").show();
    } else {
        $("#"+modify+"client_tr").hide();
    }
}

// 포트 유효성 체크
function httpChk(Ev){
    var checkPattern = /[^0-9]/;
    if(Ev.value.match(checkPattern)) {
        Ev.value = Ev.value.replace(checkPattern,"");
    }
    var httpPort = parseInt(Ev.value, 10);
    $(Ev).parent().find("#http_port_red").css("display", "none");
    if(httpPort == 72 || (httpPort >= 80 && httpPort <= 89) || httpPort == 443 || httpPort == 488 || httpPort == 591 || httpPort == 777
        || httpPort == 1080 || httpPort == 1088 || httpPort == 1111 || httpPort == 1443 || httpPort == 2080 || httpPort == 7001
        || httpPort == 7070 || httpPort == 7612 || httpPort == 7777 || (httpPort >= 8000 && httpPort <= 9001) || httpPort == 9090
        || (httpPort >= 9901 && httpPort <= 9908) || (httpPort >= 11080 && httpPort <= 11110)
        || (httpPort >= 12900 && httpPort <= 12949) || httpPort == 204110 || httpPort == 45002 || httpPort >= 65536){
        $(Ev).attr("required",false);
        $(Ev).parent().find("#http_port_red").css("display", "none");
        if($(Ev).attr("id").indexOf("http_port_") > -1){
            http_port_chk = true;
        }else if($(Ev).attr("id").indexOf("https_port_") > -1){
            https_port_chk = true;
        }
    } else {
        $(Ev).attr("required",true);
        $(Ev).parent().find("#http_port_red").css("display", "");
        if($(Ev).attr("id").indexOf("http_port_") > -1){
            http_port_chk = false;
        }else if($(Ev).attr("id").indexOf("https_port_") > -1){
            https_port_chk = false;
        }
    }
}

//고급 설정 파라미터 설정
function customDataSet(type, detailRule){
    custom_indexKey = "false";

    // 공통 캐싱 정책
    if($("#caching_rule_toggle_" + type).is(":checked")){
        custom_indexKey = "true";
        //최대 캐싱 기간
        let ttl_option = $("#caching_select_" + type).val() === null || $("#caching_select_" + type).val() === undefined?
            'd' : $("#caching_select_" + type).val();
//	    detailRule.rules.behaviors[6].options.ttl = $("#caching_input_" + type).val() + ttl_option;

        // 캐싱 옵션
        if($("#caching_option_" + type).parent().hasClass("on")){ // 캐싱 기간 설정
            cachingOption_val = "MAX_AGE";

            detailRule.rules.behaviors[6].options.behavior = "MAX_AGE";
            detailRule.rules.behaviors[6].options.ttl = $("#caching_input_" + type).val() + ttl_option;
        }else {// 오리진 서버의 Cache Control Header를 따름
            let options = {
                behavior: "CACHE_CONTROL",
                enhancedRfcSupport: false,
                honorPrivate: false,
                honorMustRevalidate: false,
                defaultTtl: "0s",
                cacheControlDirectives: ""
            };
            cachingOption_val = "CACHE_CONTROL";
            detailRule.rules.behaviors[6].options = options;
            detailRule.rules.behaviors[6].options.defaultTtl = $("#caching_input_" + type).val() + ttl_option;
        }

        // 캐시 서버의 오브젝트 전달 여부
        if($("#cache_server_" + type).parent().hasClass("on")){// 캐시 서버의 오브젝트 전달
            detailRule.rules.behaviors[6].options.mustRevalidate = false;
            cacheserver_val = false;
        }else {// 항상 오리진 서버에서 확인해서 전달
            detailRule.rules.behaviors[6].options.mustRevalidate = true;
            cacheserver_val = true;
        }
        //계층화된 캐싱
        if($("#caching_map_" + type).hasClass("on")){
            detailRule.rules.behaviors[7].options.tieredDistributionMap = "CH2";
            detailRule.rules.behaviors[7].options.enabled = true;
            cachingmap_val = "CH2"; // 계층화된 캐싱 맵
        }else if($("#caching_map2_" + type).hasClass("on")){
            detailRule.rules.behaviors[7].options.tieredDistributionMap = "CHAPAC";
            detailRule.rules.behaviors[7].options.enabled = true;
            cachingmap_val = "CHAPAC"; // 계층화된 캐싱 맵
        }else {
            detailRule.rules.behaviors[7].options.enabled = false;
            cachingmap_val = "none"; // 계층화된 캐싱 맵
        }
        // CDN Global 기능 오류건 개발
        //쿼리 파리미터 캐싱
        // type : create / modify
        // 예. query_para_create, query_para_modify
        if($("#query_para_" + type).hasClass("on")){
            detailRule.rules.behaviors[8].options.behavior = "INCLUDE_ALL_ALPHABETIZE_ORDER";
            querypara_val = "INCLUDE_ALL_ALPHABETIZE_ORDER"; // 쿼리 파라미터 캐시 - 정책
        }else {
            detailRule.rules.behaviors[8].options.behavior = "IGNORE_ALL";
            querypara_val = "IGNORE_ALL"; // 쿼리 파라미터 캐시 - 정책
        }
    }

    //대용량 파일 최적화 사용
    if($("#large_file_" + type).hasClass("on")){
        custom_indexKey = "true";
        detailRule.rules.children[0].behaviors[0].options.enabled = true;
    }else {
        detailRule.rules.children[0].behaviors[0].options.enabled = false;
    }

    //Last Mile 압축 사용
    if($("#compression_" + type).hasClass("on")){
        custom_indexKey = "true";
        detailRule.rules.children[1].criteria[0].options.matchCaseSensitive = true;
    }else {
        detailRule.rules.children[1].criteria[0].options.matchCaseSensitive = false;
    }

    return detailRule;
}
// 기본룰 커스터마이징 END ************************************************************************************

// 캐싱 정책 추가 START **************************************************************************************
//고급 설정 여러개 입력 시 enter 구분 func
function exPathAdd(data){
    if($(data).val() == ""){
        return showCommonNoLangErrorMsg("알림","입력해 주시기 바랍니다.");
    }

    var id_val = $(data).attr("id");
    var id_val_temp = $(data).parent().attr("id").split("_")[2];
    var expUrl = /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/;

    if(id_val == "ip_text_"+id_val_temp){ //ip 차단 여러개 입력 시
        var path_test = $("#ip_text_"+id_val_temp).val();
        if(path_test.indexOf("/") > -1){
            var ip_addr = path_test.split("/")[0];
            var ipchk = expUrl.test(ip_addr);
            if(!ipchk){
                showCommonNoLangErrorMsg("IP 입력 확인","IP를 정확히 입력해 주십시오.");
                $(data).val("");
                return;
            }
        } else {
            ipchk = expUrl.test(path_test);
            if(!ipchk){
                showCommonNoLangErrorMsg("IP 입력 확인","IP를 정확히 입력해 주십시오.");
                $(data).val("");
                return;
            }
        }
        temp_span = $("#base_create_caching_span").clone(true).css("display","").addClass("deny_ip_span_" + id_val_temp);
        let temp_val = $("#ip_text_"+id_val_temp).val().trim();
        temp_span.find("#create_caching_font").text(temp_val);
        $(data).before(temp_span);
        temp_ip_list.push(temp_val);

    } else if(id_val == "file_ex_text_" + id_val_temp) { //개별 캐싱 정책 추가(파일 확장자) 여러개 입력 시
        temp_span = $("#base_create_caching_span").clone(true).css("display","").addClass("caching_file_span_" + id_val_temp);
        let temp_val = $("#file_ex_text_" + id_val_temp).val().trim();
        temp_span.find("#create_caching_font").text(temp_val);
        $(data).before(temp_span);
        temp_file_ex_list.push(temp_val);

    } else if(id_val == "file_path_text_" + id_val_temp) {//개별 캐싱 정책 추가(경로) 여러개 입력 시
        temp_span = $("#base_create_caching_span").clone(true).css("display","").addClass("caching_path_span_" + id_val_temp);
        let temp_val = $("#file_path_text_" + id_val_temp).val().trim();
        temp_span.find("#create_caching_font").text(temp_val);
        $(data).before(temp_span);
        temp_path_list.push(temp_val);
    } else if(id_val == "token_ex_path_text_" + id_val_temp) { //Token 접근제어 추가(파일 확장자) 여러개 입력 시
        temp_span = $("#base_create_caching_span").clone(true).css("display","").addClass("token_file_span_" + id_val_temp);
        let temp_val = $("#token_ex_path_text_" + id_val_temp).val().trim();
        temp_span.find("#create_caching_font").text(temp_val);
        $(data).before(temp_span);
        temp_token_file_ex_list.push(temp_val);

    } else if(id_val == "token_file_path_text_" + id_val_temp) {//Token 접근제어 추가(경로) 여러개 입력 시
        temp_span = $("#base_create_caching_span").clone(true).css("display","").addClass("token_path_span_" + id_val_temp);
        let temp_val = $("#token_file_path_text_" + id_val_temp).val().trim();
        temp_span.find("#create_caching_font").text(temp_val);
        $(data).before(temp_span);
        temp_token_path_list.push(temp_val);
    }

    $(data).val("");
}

/// 개별캐싱정책 추가
function addDivCaching(data){
    //data == create, modify
    let caching_criteria = {
        name: "path",
        options: {}
    }

    let name = ""; // path, fileExtension
    let matchOperator = ""; // 캐싱 조건 IF/IF NOT

    let temp_td = $("#base_caching_list_" + data).clone().addClass("caching_list_" + data).show();
    let caching_if = $("#rule_section_caching2_" + data).val();
    temp_td.find("#caching_matchOperator").text(caching_if);

    let caching_name = $("#rule_section_caching_" + data).val();
    if(caching_name === "경로") {
        if(temp_path_list.length < 1) {
            return showCommonNoLangErrorMsg("알림","파일 경로를 입력해 주십시오.");
        }
        name = "path";
        let temp_value = "(경로)";
        for(let i=0; i<temp_path_list.length;i++){
            temp_value += temp_path_list[i] + ",";
        }
        temp_td.find("#cachingValue").text(temp_value);

        // option 값 - 경로 일때 normalize 추가
        let option = {
            matchOperator: "",
            matchCaseSensitive: false, //default
            values: []
        }

        if(caching_if === "IF") {
            matchOperator = "MATCHES_ONE_OF";
        }else {
            matchOperator = "DOES_NOT_MATCH_ONE_OF";
        }
        option.matchOperator = matchOperator;
        option.values = temp_path_list;// 캐싱 조건 대상

        caching_criteria.options = option;
        $(".caching_path_span_" + data).remove(); //기존 span 제거
        temp_path_list = []; //리스트 초기화
    }else {
        if(temp_file_ex_list.length < 1) {
            return showCommonNoLangErrorMsg("알림","파일 확장자를 입력해 주십시오.");
        }
        name = "fileExtension";
        let temp_value = "(파일 확장자)";
        for(let i=0; i<temp_file_ex_list.length;i++){
            temp_value += temp_file_ex_list[i] + ",";
        }
        temp_td.find("#cachingValue").text(temp_value);

        // option 값 - 경로 일때 normalize 추가
        let option = {
            matchOperator: "",
            matchCaseSensitive: false, //default
            values: []
//			normalize: false// default
        }

        if(caching_if === "IF") {
            matchOperator = "IS_ONE_OF";
        }else {
            matchOperator = "IS_NOT_ONE_OF";
        }

        option.matchOperator = matchOperator;
        option.values = temp_file_ex_list;// 캐싱 조건 대상

        caching_criteria.options = option;

        $(".caching_file_span_" + data).remove(); //기존 span 제거
        temp_file_ex_list = []; //리스트 초기화
    }

    caching_criteria.name = name;

    caching_criteria_list.push(caching_criteria);


    $("#individual_caching_list_" + data).append(temp_td);

}


function addRules(data){
    // data == create, modify
    if(caching_criteria_list.length < 1) {
        return showCommonNoLangErrorMsg("알림","캐싱 조건을 입력해 주십시오.");
    }
    // 개별 캐싱 정책 추가
    const contentCaching = {
        name: "Completely Static Content",
        children: [],
        behaviors: [{
            name: "caching",
            options: {}
        }],
        criteria: [],
        criteriaMustSatisfy: "all", // 현재 default
        comments: ""
    }
    let base_caching_rule = $("#base_caching_rule_" + data).clone().show();
    // 캐싱 옵션
    let temp_caching_option = "";
    if($("#add_caching_op_" + data).parent().hasClass('on')) { // 캐싱 기간 설정
        let options = {
            behavior: "MAX_AGE",
            mustRevalidate: false,
            ttl: "7d"
        };
        if($("#add_input_caching_" + data).val() === ''){
            return showCommonNoLangErrorMsg("알림","최대 캐싱 기간을 입력해 주십시오.");
        }
        options.behavior = "MAX_AGE";
        options.ttl = $("#add_input_caching_" + data).val() + $("#add_select_caching_" + data).val();
        contentCaching.behaviors[0].options = options;
        temp_caching_option += "캐싱 기간 설정 - " + options.ttl;
    }else { // 오리진 서버의 Cache Control Header를 따름
        let options = {
            behavior: "CACHE_CONTROL",
            mustRevalidate: false,
            enhancedRfcSupport: false,
            honorPrivate: false,
            honorMustRevalidate: false,
            defaultTtl: "0s",
            cacheControlDirectives: ""
        };
        options.behavior = "CACHE_CONTROL";
        options.defaultTtl = $("#add_input_caching_" + data).val() + $("#add_select_caching_" + data).val();
        contentCaching.behaviors[0].options = options;
        temp_caching_option += "오리진 서버의 Cache Control Header를 따름 - " + options.defaultTtl;
    }

    //캐시 서버의 오브젝트 전달 여부
    if($("#add_caching_ser2_" + data).parent().hasClass('on')){ // 항상 오리진 서버에서 확인해서 전달
        contentCaching.behaviors[0].options.mustRevalidate = true;
        temp_caching_option += ", 항상 오리진 서버에서 확인해서 전달";
    }else { // 캐시 서버의 오브젝트 전달
        contentCaching.behaviors[0].options.mustRevalidate = false;
        temp_caching_option += ", 캐시 서버의 오브젝트 전달";
    }

    base_caching_rule.find("#add_caching_option").text(temp_caching_option);


    let temp_criteria = "(AND)";
    for(let i=0;i<caching_criteria_list.length;i++) {
        if(caching_criteria_list[i].name === "fileExtension"){
            if(caching_criteria_list[i].options.matchOperator === "IS_ONE_OF") {
                temp_criteria += "IF ";
            }else {
                temp_criteria += "IF NOT ";
            }
            temp_criteria +=  "[파일 확장자]"
            let caching_value = caching_criteria_list[i].options.values;
            for(let i=0;i<caching_value.length;i++){
                temp_criteria += caching_value[i] + ", ";
            }
            temp_criteria +=  "/ "
        }else {
            if(caching_criteria_list[i].options.matchOperator === "MATCHES_ONE_OF") {
                temp_criteria += "IF ";
            }else {
                temp_criteria += "IF NOT ";
            }
            temp_criteria +=  "[경로]"

            let caching_value = caching_criteria_list[i].options.values;
            for(let i=0;i<caching_value.length;i++){
                temp_criteria += caching_value[i] + ", ";
            }
            temp_criteria +=  "/ "
        }
    }
    base_caching_rule.find("#rule_section_caching2").text(temp_criteria);

    contentCaching.criteria = caching_criteria_list;
    contentCachingList.push(contentCaching);
    caching_criteria_list = [];// 캐싱조건 리스트 초기화

    $(".caching_list_" + data).remove(); //캐싱조건 제거
    $("#base_caching_rule_" + data).parent().append(base_caching_rule);

}

/// IP 차단
function addDivIp(data){
    //data == create modify
    if(temp_ip_list.length < 1) {
        return showCommonNoLangErrorMsg("알림","클라이언트 IP를 입력해 주십시오.");
    }

    const ip_criteria = {
        name: "clientIp",
        options: {
            matchOperator: "IS_ONE_OF",
            useHeaders: false,
            values: []
        }
    }


    let matchOperator = ""; // 캐싱 조건 IF/IF NOT
    let value = []; // 캐싱 조건 대상

    let temp_td = $("#base_ip_list_"+data).clone().addClass("ip_list_"+data).show();
    let caching_if = $("#ip_if_" + data).val();
    temp_td.find("#ip_matchOperator").text(caching_if);
    if(caching_if === "IF") {
        matchOperator = "IS_ONE_OF";
    }else {
        matchOperator = "IS_NOT_ONE_OF";
    }


    let temp_value = "(AND)";
    value = temp_ip_list;
    for(let i=0; i<temp_ip_list.length;i++){
        temp_value += temp_ip_list[i] + ",";
    }
    temp_td.find("#ipValue").text(temp_value);
    $(".deny_ip_span_" + data).remove(); //기존 span 제거
    temp_ip_list = []; //리스트 초기화


    ip_criteria.options.matchOperator = matchOperator;
    ip_criteria.options.values = value;

    ip_criteria_list.push(ip_criteria);


    $("#block_ip_list_" + data).append(temp_td);

}

function addIPs(data){
    if(ip_criteria_list.length < 1) {
        return showCommonNoLangErrorMsg("알림","차단 조건을 입력해 주십시오.");
    }
    // 개별 캐싱 정책 추가
    // data == create / modify
    const denyByIp = {
        name: "Deny By Ip",
        children: [],
        behaviors: [{
            name: "denyAccess",
            options: {
                reason: "deny-by-ip",
                enabled: true
            }
        }],
        criteria: [],
        criteriaMustSatisfy: "any",
        comments: "List the locations that need to be denied"
    }

    let ip_rule_div = $("#ip_rule_div_" + data).clone().show();

    // 상태
    if($("#ip_deny_enable_"+data).parent().hasClass('on')) { // 허용
        denyByIp.behaviors[0].options.enabled = true;
        ip_rule_div.find("#clientIP_status_span_" + data).text("허용");
    }else { // 차단
        denyByIp.behaviors[0].options.enabled = false;
        ip_rule_div.find("#clientIP_status_span_" + data).text("차단");
    }

    // CDN Global 기능 오류건 개발
    //제어값

    var denyByIpBehaviorOptionsReason = isEmpty($("#ip_reason_" + data).val()) ? 'deny by-ip' : $("#ip_reason_" + data).val();

    ip_rule_div.find("#ip_rule_reason").text(denyByIpBehaviorOptionsReason);
    denyByIp.behaviors[0].options.reason =denyByIpBehaviorOptionsReason;

    let temp_criteria = "(AND)";
    for(let i=0;i<ip_criteria_list.length;i++) {
        if(ip_criteria_list[i].options.matchOperator === "IS_ONE_OF") {
            temp_criteria += "IF ";
        }else {
            temp_criteria += "IF NOT ";
        }
        let ip_value = ip_criteria_list[i].options.values;
        for(let i=0;i<ip_value.length;i++){
            temp_criteria += ip_value[i] + ", ";
        }
        temp_criteria +=  "/ "

    }
    ip_rule_div.find("#ip_div").text(temp_criteria);

    denyByIp.criteria = ip_criteria_list;
    ipDenyList.push(denyByIp);
    ip_criteria_list = [];// 캐싱조건 리스트 초기화

    $(".ip_list_" + data).remove(); //캐싱조건 제거
    $("#ip_rule_div_" + data).parent().append(ip_rule_div);

}

// CDN Global 기능 오류건 개발
function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true;
    } else {
        return false;
    }
}

/// Token 접근제어
function addDivToken(data){
    // data == create modify
    let token_criteria = {
        name: "path",
        options: {}
    }

    let name = ""; // path, fileExtension
    let matchOperator = ""; // 캐싱 조건 IF/IF NOT

    let temp_td = $("#base_token_list_" + data).clone().addClass("token_list_" + data).show();
    let caching_if = $("#rule_section_token2_" + data).val();
    temp_td.find("#token_matchOperator").text(caching_if);


    let caching_name = $("#rule_section_token_" + data).val();
    if(caching_name === "경로") {
        if(temp_token_path_list.length < 1) {
            return showCommonNoLangErrorMsg("알림","파일 경로를 입력해 주십시오.");
        }
        name = "path";
        let temp_value = "(경로)";
        for(let i=0; i<temp_token_path_list.length;i++){
            temp_value += temp_token_path_list[i] + ",";
        }
        temp_td.find("#tokenValue").text(temp_value);

        // option 값 - 경로 일때 normalize 추가
        let option = {
            matchOperator: "",
            matchCaseSensitive: false, //default
            values: [],
            normalize: false
        }

        if(caching_if === "IF") {
            matchOperator = "MATCHES_ONE_OF";
        }else {
            matchOperator = "DOES_NOT_MATCH_ONE_OF";
        }

        option.matchOperator = matchOperator;
        option.values = temp_token_path_list;// 캐싱 조건 대상

        token_criteria.options = option;

        $(".token_path_span_" + data).remove(); //기존 span 제거
        temp_token_path_list = []; //리스트 초기화
    }else {
        if(temp_token_file_ex_list.length < 1) {
            return showCommonNoLangErrorMsg("알림","파일 확장자를 입력해 주십시오.");
        }
        name = "fileExtension";
        let temp_value = "(파일 확장자)";
        for(let i=0; i<temp_token_file_ex_list.length;i++){
            temp_value += temp_token_file_ex_list[i] + ",";
        }
        temp_td.find("#tokenValue").text(temp_value);

        // option 값 - 경로 일때 normalize 추가
        let option = {
            matchOperator: "",
            matchCaseSensitive: false, //default
            values: []
        }

        if(caching_if === "IF") {
            matchOperator = "IS_ONE_OF";
        }else {
            matchOperator = "IS_NOT_ONE_OF";
        }

        option.matchOperator = matchOperator;
        option.values = temp_token_file_ex_list;// 캐싱 조건 대상

        token_criteria.options = option;
        $(".token_file_span_" + data).remove(); //기존 span 제거
        temp_token_file_ex_list = []; //리스트 초기화
    }

    token_criteria.name = name;
    token_criteria_list.push(token_criteria);


    $("#token_access_list_" + data).append(temp_td);

}


function addTokens(data){
    //data == create modify
    if(tokenAccessList.length > 1) {
        return false;
    }
    // 개별 캐싱 정책 추가
    const accessToken = {
        name: "Simple Cookie Token Based Protection",
        children: [],
        behaviors: [{
            name: "verifyTokenAuthorization",
            options: {
                failureResponse: true, //고정값
                location: "COOKIE",
                locationId: "__token__", //고정값
                key: "", //랜덤생성된 짝수 16진수
                useAdvanced: false //고정값
            }
        }],
        criteria: [],
        criteriaMustSatisfy: "all", // 현재 default
        comments: "Match on the existence of a Cookie based token and deny request"
    }
    // 캐싱 옵션
    let key = "";

    if($("#token_location1_" + data).hasClass('on')) {
        accessToken.behaviors[0].options.location = "COOKIE";
    }else if($("#token_location2_" + data).hasClass('on')) {
        accessToken.behaviors[0].options.location = "CLIENT_REQUEST_HEADER";
    }else {
        accessToken.behaviors[0].options.location = "QUERY_STRING";
    }

    if($("#token_movement1_" + data).hasClass('on')) {
        accessToken.behaviors[0].options.failureResponse = false;
    }else {
        accessToken.behaviors[0].options.failureResponse = true;
    }

    accessToken.criteria = token_criteria_list;
    accessToken.behaviors[0].options.key = key;
    tokenAccessList.push(accessToken);
    token_criteria_list = [];// 캐싱조건 리스트 초기화


}

// 삭제 기능들
function exPathDel(data){
    var value = $(data).parent();
    let index = value.index();

    if(value.hasClass("deny_ip_span_create")
        || value.hasClass("deny_ip_span_modify")) {
        temp_ip_list.splice(index,1);
    }else if(value.hasClass("caching_file_span_create")
        || value.hasClass("caching_file_span_modify")){
        temp_file_ex_list.splice(index,1);
    }else if(value.hasClass("caching_path_span_create")
        || value.hasClass( "caching_path_span_modify")) {
        temp_path_list.splice(index,1);
    }else if(value.hasClass("token_file_span_create")
        || value.hasClass("token_file_span_modify")) {
        temp_token_file_ex_list.splice(index,1);
    }else {
        temp_token_path_list.splice(index,1);
    }

    $(value).remove();
}

function delete_ip(data, type) {
    // 삭제 시 배열 데이터 삭제 - 종류별로
    let temp = $(data).parent().parent();
    let index = temp.index();
    if(temp.attr('id') === "base_caching_list_" + type) {
        caching_criteria_list.splice(index-1,1);
    }else if(temp.attr('id') === "base_ip_list_" + type){
        ip_criteria_list.splice(index-1,1);
    }else{
        token_criteria_list.splice(index-1,1);
    }
    temp.remove();
}

function ruleDelete(data, type){
    let div_id = $(data).parent().parent();
    let index = div_id.index();
    if(div_id.attr("id") === "base_caching_rule_" + type){
        contentCachingList.splice(index-1,1)
    }else if(div_id.attr("id") ==="ip_rule_div_" + type) {
        ipDenyList.splice(index-1,1)
    }else {
        tokenAccessList.splice(index-1,1)
    }
    div_id.remove();
}


function selectExPath(data){
    let last_id = $(data).attr("id").split("_")[3];
    let type = $(data).attr("id").split("_")[2];
    let val = $(data).val();

    if(type === "caching"){
        if(val == "파일 확장자"){
            $("#ex_div_"+last_id).show();
            $("#path_div_"+last_id).hide();
            $(data).parent().parent().removeClass("path").addClass("ex");
        } else {
            $("#ex_div_"+last_id).hide();
            $("#path_div_"+last_id).show();
            $(data).parent().parent().removeClass("ex").addClass("path");
        }
    }else { //token
        if(val == "파일 확장자"){
            $("#ex_div_"+last_id+"_token").show();
            $("#path_div_"+last_id+"_token").hide();
        } else {
            $("#ex_div_"+last_id+"_token").hide();
            $("#path_div_"+last_id+"_token").show();
        }
    }

}


function serviceNext(){
    var succ = dataCheck("create");
    if(succ != "success"){
        return null;
    }
    serviceCreate();
}

// 입력값 유효성 검사
function dataCheck(command){
    var property_name = "";         // 프로퍼티 이름
    var host_name = "";             // 호스트 명
    var origin_hostname = "";         // 오리진 서비스 도메인명

    var host_chk = "";

    let origin_path = $("#origin_path_" + command).val(); //오리진 경로
    let origin_path_last = origin_path.substring(origin_path.length-1, origin_path.length);
    if(command == "create"){
        property_name = $("#property_name").val(); // 프로퍼티 이름
        host_name = $("#host_name_create").val(); // 호스트 명

        if($("#sel_default_type_create li:first-child span").hasClass("on")){ //원본서버
            origin_hostname = $("#origin_hostname_create").val(); // 오리진 서비스 도메인명
        }else {
            origin_hostname = "ssproxy.ucloudbiz.olleh.com"; // 오리진 서비스 도메인명
            if($("#select_filebox_create").val() == "없음"){
                return showCommonNoLangErrorMsg("알림","파일 박스를 선택해 주십시오.");
            }
        }

        host_chk = $("input:checkbox[id='create_host']").is(":checked"); // cdn 도메인을 서비스 도메인으로 사용

        if($("#true_ip_create").parent().hasClass('on')){
            if($("#true_ip_header_create").children().val() == ""){
                return showCommonNoLangErrorMsg("알림","IP 헤더를 입력해 주십시오.");
            }

        }
    } else if(command == "modify"){
        property_name = "modify" // 프로퍼티 이름
        property_chk = true; // 중복체크
        host_name = $("#host_name_modify").val(); // 호스트 명
        if($("#sel_default_type_modify li:first-child span").hasClass("on")){ //원본서버
            origin_hostname = $("#origin_hostname_modify").val(); // 오리진 서비스 도메인명
        }else {
            origin_hostname = "ssproxy.ucloudbiz.olleh.com"; // 오리진 서비스 도메인명
            if($("#select_filebox_modify").val() == "없음"){
                return showCommonNoLangErrorMsg("알림","파일 박스를 선택해 주십시오.");
            }
        }

        host_chk = $("input:checkbox[id='modify_host']").is(":checked");

        if($("#true_ip_modify").parent().hasClass('on')){
            if($("#true_ip_header_modify").children().val() == ""){
                return showCommonNoLangErrorMsg("알림","IP 헤더를 입력해 주십시오.");
            }

        }
    }

    if(property_name == ""){
        return showCommonNoLangErrorMsg("알림","프로퍼티명을 입력해 주십시오.");
    }

    if(!property_chk){
        return showCommonNoLangErrorMsg("알림","중복된 서비스 명입니다.");
    }

    if(!host_chk){
        if(host_name == ""){
            return showCommonNoLangErrorMsg("알림","서비스 도메인을 입력해 주십시오.");
        }
    }

    if(origin_hostname == ""){
        return showCommonNoLangErrorMsg("알림","오리진 서비스 도메인명을 입력해 주십시오.");
    }
    if(!http_port_chk){
        return showCommonNoLangErrorMsg("알림","HTTP Port를 정확히 입력해 주십시오.");
    }

    if(!https_port_chk){
        return showCommonNoLangErrorMsg("알림","HTTPS Port를 정확히 입력해 주십시오.");
    }

    if(origin_path != "" && origin_path_last != '/') {
        return showCommonNoLangErrorMsg("알림","오리진 경로 말미에 '/'를 붙여주세요.");
    }

    if(custom_rule_chk){//고급 설정 체크
        if($("#chacing_rule_add_" + command).hasClass('on') && contentCachingList.length === 0){ //개별 캐싱 정책 추가
            return showCommonNoLangErrorMsg("알림","개별 캐싱 정책 조건을 추가해주세요.");
        }
        if($("#ip_block_" + command).hasClass('on') && ipDenyList.length === 0){ //개별 캐싱 정책 추가
            return showCommonNoLangErrorMsg("알림","IP 차단 조건을 추가해주세요.");
        }

//        if($("#token_access_" + command).hasClass('on') && token_criteria_list.length === 0){ //개별 캐싱 정책 추가
//            return showCommonNoLangErrorMsg("알림","Token 접근제어 차단 조건을 추가해주세요.");
//        }

    }

    return "success";
}

//서비스 생성 START
function serviceCreate(){
    // 프로퍼티 생성 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var select_product_id = "prd_Download_Delivery"; // 서비스 유형
    var property_name = $("#property_name").val(); // 프로퍼티 이름
    var body = {
        productId    : select_product_id,
        propertyName : property_name,
        ruleFormat : "v2022-06-28"
    }
    var params={
        body : JSON.stringify(body)
    }
    showLoadingBox();    // 로딩중 이미지

    var property_id = "";
    var detailRule = {};
    $.ajax({
        url: "/console/globalcdn/propertyCreate",
        type: "POST",
        data: params,
        dataType: "json",
        success: serviceCreateAjax1,
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
            location.reload();
        }
    });

    function serviceCreateAjax1(data) {
        if(data.result == "29") { /* IAM 사용자 정책 처리 */
            commonErrorMessage("29");
            return;
        }

        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "목록 호출 오류";
                return akamaiConnectionError(command);
            }
            showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
            location.reload();
        } else {
            // 프로 퍼티 아이디
            property_id = data.property_id;
            var result = Math.floor(Math.random() * 1000000)+100000;
            if(result>1000000){
                result = result - 100000;
            }
            var cpcodebody = {
                productId : "prd_Download_Delivery",
                cpcodeName : result+"cpname"
            }
            params={
                cpcodebody : JSON.stringify(cpcodebody),
                property_id : property_id
            }

            // Cpcode 생성  ************************************************************************
            $.ajax({
                url: "/console/globalcdn/cpcodeCreate",
                type: "POST",
                data: params,
                dataType: "json",
                success: serviceCreateAjax2,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
                    location.reload();
                }
            });
        }
    }

    function serviceCreateAjax2(data) {
        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "목록 호출 오류";
                return akamaiConnectionError(command);
            }
            showCommonNoLangErrorMsg("Cpcode 생성 실패","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
            location.reload();
        } else {

            cpcode_create = data.cpcode;
            params={
                property_id : property_id,
                property_vs : "1"

            }
            // CDN Global 기능 오류건 개발
            $.ajax({
                url: "/console/globalcdn/propertyDetail",
                type: "POST",
                async: true,
                data: params,
                dataType: "json",
                success: serviceCreateAjax3,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
                    location.reload();
                }
            });
        }
    }

    function serviceCreateAjax3(data) {
        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "목록 호출 오류";
                return akamaiConnectionError(command);
            } else if(data.message == "detail"){
                showCommonNoLangErrorMsg("상세 정보 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
                location.reload();
            }
        } else {
            detailRule = data;
//            detailRule.ruleFormat = "v2022-06-28";
            // 호스트 생성 및 저장 ---------------------------------------------------------------------------
            var host_name = $("#host_name_create").val(); // 호스트 명
            params={
                hostname : host_name,
                property_id : property_id,
                updateYN : "N",
                property_vs : "1",
                etag : detailRule.etag
            }

            $.ajax({
                url: "/console/globalcdn/setEdgeHostname",
                type: "POST",
                data: params,
                dataType: "json",
                success: serviceCreateAjax4,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
                    location.reload();
                }
            });
        }
    }

    function serviceCreateAjax4(data) {
        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "목록 호출 오류";
                return akamaiConnectionError(command);
            }
            showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
            location.reload();
        } else {
            //	detailRule = {  "accountId" : "act_AANA-3LEB68",  "contractId" : "ctr_M-1OUHPG3",  "groupId" : "grp_77820",  "propertyId" : "prp_855919",  "propertyName" : "jyktest1118",  "propertyVersion" : 1,  "etag" : "4e2896f08ba904f99a948b2ef2cc665d26fcaf2f",  "rules" : {    "name" : "default",    "children" : [ {      "name" : "Large File Optimization",      "children" : [ ],      "behaviors" : [ {        "name" : "largeFileOptimization",        "options" : {          "enabled" : true,          "enablePartialObjectCaching" : "NON_PARTIAL_OBJECT_CACHING"        }      } ],      "criteria" : [ {        "name" : "fileExtension",        "options" : {          "matchOperator" : "IS_ONE_OF",          "values" : [ "exe", "bz2", "dmg", "gz", "iso", "mov", "pkg", "tar", "tgz", "wmv", "wma", "zip", "webp", "jxr", "hdp", "wdp" ],          "matchCaseSensitive" : false        }      } ],      "criteriaMustSatisfy" : "all",      "comments" : ""    }, {      "name" : "Content Compression",      "children" : [ ],      "behaviors" : [ {        "name" : "gzipResponse",        "options" : {          "behavior" : "ALWAYS"        }      } ],      "criteria" : [ {        "name" : "contentType",        "options" : {          "matchOperator" : "IS_ONE_OF",          "values" : [ "text/html*", "text/css*", "application/x-javascript*", "application/javascript*" ],          "matchWildcard" : true,          "matchCaseSensitive" : false        }      } ],      "criteriaMustSatisfy" : "all",      "comments" : ""    }, {      "name" : "ServiceStopStart",      "children" : [ ],      "behaviors" : [ {        "name" : "denyAccess",        "options" : {          "reason" : "ServiceStopStart",          "enabled" : false        }      } ],      "criteria" : [ ],      "criteriaMustSatisfy" : "all",      "comments" : ""    } ],    "behaviors" : [ {      "name" : "origin",      "options" : {        "originType" : "CUSTOMER",        "hostname" : "www.kt.com",        "forwardHostHeader" : "REQUEST_HOST_HEADER",        "cacheKeyHostname" : "REQUEST_HOST_HEADER",        "compress" : false,        "enableTrueClientIp" : false,        "httpPort" : 80,        "httpsPort" : 443,        "verificationMode" : "PLATFORM_SETTINGS",        "originSni" : false,        "originCertificate" : "",        "ports" : ""      }    }, {      "name" : "cpCode",      "options" : {        "value" : {          "id" : 449373        }      }    }, {      "name" : "report",      "options" : {        "logHost" : true,        "logReferer" : true,        "logUserAgent" : true,        "logAcceptLanguage" : false,        "logCookies" : "OFF",        "logEdgeIP" : false,        "logXForwardedFor" : false,        "logCustomLogField" : false      }    }, {      "name" : "clientCharacteristics",      "options" : {        "country" : "UNKNOWN"      }    }, {      "name" : "originCharacteristics",      "options" : {        "country" : "UNKNOWN",        "authenticationMethod" : "AUTOMATIC",        "authenticationMethodTitle" : ""      }    }, {      "name" : "contentCharacteristicsDD",      "options" : {        "objectSize" : "UNKNOWN",        "popularityDistribution" : "UNKNOWN",        "catalogSize" : "UNKNOWN",        "contentType" : "UNKNOWN",        "optimizeOption" : false      }    }, {      "name" : "caching",      "options" : {        "behavior" : "MAX_AGE",        "mustRevalidate" : false,        "ttl" : "7d"      }    }, {      "name" : "tieredDistribution",      "options" : {        "enabled" : true,        "tieredDistributionMap" : "CH2"      }    }, {      "name" : "cacheKeyQueryParams",      "options" : {        "behavior" : "INCLUDE_ALL_PRESERVE_ORDER"      }    } ],    "options" : {      "is_secure" : false    },    "variables" : [ ],    "comments" : ""  },  "errors" : [ {    "type" : "https://problems.luna.akamaiapis.net/papi/v0/validation/generic_behavior_issue.cpcode_not_available",    "errorLocation" : "#/rules/behaviors/1/options/value",    "detail" : "The CP Code within `Content Provider Code` cannot be used with this property. If you just created this CP Code, please try again later. For more information see <a href=\"/dl/property-manager/property-manager-help/csh_lookup.html?id=PM_0030\" target=\"_blank\">Content Provider Codes</a>."  } ],  "warnings" : [ {    "type" : "https://problems.luna.akamaiapis.net/papi/v0/validation/generic_behavior_issue.td_enabled_message",    "errorLocation" : "#/rules/behaviors/7",    "detail" : "The product supports various best practices to improve Origin Offload including optimized Tiered Distribution. However, your Tiered Distribution settings will override those best practices. We strongly recommend removing the Tiered Distribution behavior from your configuration and instead selecting the use case options in the Origin Characteristics behavior."  }, {    "title" : "Unstable rule format",    "type" : "https://problems.luna.akamaiapis.net/papi/v0/unstable_rule_format",    "detail" : "This property is using `latest` rule format, which is designed to reflect interface changes immediately. We suggest converting the property to a stable rule format such as `v2022-10-18` to minimize the risk of interface changes breaking your API client program.",    "currentRuleFormat" : "latest",    "suggestedRuleFormat" : "v2022-10-18"  } ],  "ruleFormat" : "latest"};
            // rule 업데이트 ///////////////////////////////////////////////////////////////////////////////////

//            detailRule.rules.behaviors[0].options.forwardHostHeader = "ORIGIN_HOSTNAME";
//            detailRule.rules.behaviors[0].options.cacheKeyHostname = "ORIGIN_HOSTNAME";
            // default 가 이거임

            var origin_hostname = $("#origin_hostname_create").val(); // 직접입력 값
            let origin_httpPort = $("#http_port_create").val() === '' ? 80 : parseInt($("#http_port_create").val());
            let origin_httpsPort = $("#https_port_create").val() === '' ? 443 : parseInt($("#https_port_create").val());
//            var base_directory_create = "";
            let select_filebox = "";
            if($("#direct_input").hasClass("on")){// 오리진 서버
                //rules.origin 설정
                detailRule.rules.behaviors[0].options.originType = "CUSTOMER";
                detailRule.rules.behaviors[0].options.httpPort = origin_httpPort;
                detailRule.rules.behaviors[0].options.httpsPort = origin_httpsPort;
                select_filebox = $("#origin_path_create").val(); //원본경로
//                base_directory_create = origin_hostname;// 직접입력

            }else { // storage

                if($("#select_availability_create").val() === "2"){
                    detailRule.rules.behaviors[0].options.originType = "CUSTOMER";
                    origin_hostname = `${$("#select_filebox_create").val()}.obj-epc-1.ktcloud.com`;
                    select_filebox = `/${$("#select_filebox_create option:selected").text()}${$("#ss4_origin_path_input_create").val()}`;

                }else{
                    detailRule.rules.behaviors[0].options.originType = "CUSTOMER";
                    origin_hostname = $("#origin_hostname_create").val();
                    select_filebox = "/" + $("#select_filebox_create option:selected").text();
                }

            }

            detailRule.rules.behaviors[0].options.hostname = origin_hostname;

            //호스트 헤더 전달
            if($("#hostHeader_create").hasClass("on")){ // Incoming Host Header
                detailRule.rules.behaviors[0].options.forwardHostHeader = "REQUEST_HOST_HEADER";
                detailRule.rules.behaviors[0].options.cacheKeyHostname = "REQUEST_HOST_HEADER";

            }else { // Origin Hostname
                detailRule.rules.behaviors[0].options.forwardHostHeader = "ORIGIN_HOSTNAME";
                detailRule.rules.behaviors[0].options.cacheKeyHostname = "ORIGIN_HOSTNAME";
            }

            //Gzip 압축 지원
            if($("#gzip_create").parent().hasClass("on")){
                detailRule.rules.behaviors[0].options.compress = true;
            }else {
                detailRule.rules.behaviors[0].options.compress = false;
            }

            //실제 클라이언트 IP 헤더 지원
            if($("#true_ip_create").parent().hasClass("on")){
                detailRule.rules.behaviors[0].options.enableTrueClientIp = true;
                detailRule.rules.behaviors[0].options.trueClientIpHeader = $("#true_ip_header_create").children().val();
                detailRule.rules.behaviors[0].options.trueClientIpClientSetting = true;
            }else {
                detailRule.rules.behaviors[0].options.enableTrueClientIp = false;
            }


            // 오리진 요청 HTTP 프로토콜 다운그레이드
            if($("#protocol_downgrade1_create").parent().hasClass("on")){
                let downGrade = {
                    name: "allowHTTPSDowngrade",
                    options: {
                        enabled: true
                    }
                }
                detailRule.rules.behaviors.push(downGrade);
            }

            //대용량 파일 최적화 사용 --> default 가 true 라 고급설정 미설정 시 선택 되어 보임
            if(!$("#large_file_create").hasClass("on")){
                detailRule.rules.children[0].behaviors[0].options.enabled = false;
            }

            //HTTP Port
            httpport_val = $("#http_port_create").val(); // HTTP Port

            //고급 설정 정보
            var json_addrule = {indexKey : false};
            if(custom_rule_chk){
                detailRule = customDataSet('create', detailRule);
                json_addrule = addRuleDataSet('create');
            }else {
                custom_indexKey = "false";
            }
            // java 파일 변경 해야할 듯 script에서 default 값 수정하는 방향으로...
            params={
                property_id : property_id,
                detailRule : JSON.stringify(detailRule),
                cpcode : cpcode_create,
                indexKey : custom_indexKey,
                defaultHostname : origin_hostname,
                defaultHttpPort : origin_httpPort,
                filebox : select_filebox,
//                    jsonCustom : JSON.stringify(json_custom),
                jsonAddrule : JSON.stringify(json_addrule)
            }
            $.ajax({
                url: "/console/globalcdn/ruleUpdate",
                type: "POST",
                data: params,
                dataType: "json",
                success: serviceCreateAjax5,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
                    location.reload();
                }
            });
        }
    }

    function serviceCreateAjax5(data) {
        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "목록 호출 오류";
                return akamaiConnectionError(command);
            }
            showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
            location.reload();
        } else {
            setTimeout(function(){
                hideLoadingBox();
                location.reload();
            }, 1500);
        }
    }
}

//개별 캐싱 정책
function addRuleDataSet(command){
    let final_children_arr = [];
    let indexKey = false;

    tokenAccessList = [];
    addTokens(command);

    if($("#chacing_rule_add_" + command).hasClass("on") && contentCachingList.length > 0){
        contentCachingList.forEach((caching) => final_children_arr.push(caching));
        indexKey = true;
    }

    if($("#ip_block_" + command).hasClass("on") && ipDenyList.length > 0){
        ipDenyList.forEach((ip) => final_children_arr.push(ip));
        indexKey = true;
    }

    if($("#token_access_" + command).hasClass("on") && tokenAccessList.length > 0){
        tokenAccessList.forEach((token) => final_children_arr.push(token));
        indexKey = true;
    }

    if(indexKey === true) {custom_indexKey = "true"; };

    result_val = {
        indexKey : indexKey,
        child_body : final_children_arr
    };

    return result_val;
}
// 서비스 신청 END ----------------------------------------------------------------------------------------------------------------------------------------------

// 서비스 상세 정보 START --------------------------------------------------------------------------------------------------------------------------------------------
function actionBtnClick(data){
    if(data == "modify"){
        if(!$("#propertyModify").hasClass("f_gray")){
            $("#div_non_create").hide();
            $("#div_create").hide();
            $("#div_modify").show();
//            editional_setting();
            globalCDNModifyDiv(temp_detail_json);
        }
    } else if(data == "activation"){
        var dialogNm = $("#dialog_activation");
        showCommonMsg(dialogNm);
    } else if(data == "deactivation"){
        dialogNm = $("#dialog_deactivation");
        showCommonMsg(dialogNm);
    } else if(data == "purge"){
        dialogNm = $("#dialog_purge");
        showCommonMsg(dialogNm);
    }
}

function trClick(data){
    var property = $(data).find("#akamai_property").text();

    $(".box_txtl > span").text(property);
    add_rule_num = 0;
    child_rule_num = 0;

    $("input:checkbox[name='cdncheck']").attr("checked", false);
    $("#tbody_cdnList").find(".chkwrap").removeClass("on");
    $("#tbody_cdnList").find(".base_vmlist_st").removeClass("on");


    setTimeout(function(){
        $(data).find("input:checkbox[id='cdncheck']").attr("checked", true);
        $(data).find("#text_num").find("label").addClass("on");
    }, 100);

    $(data).addClass("on");
    globalCDNDetail(data);
}

//tr 클릭시 상세정보 팝업 내용
function globalCDNDetail(data){
    var property_id = $(data).attr("id").split("-")[1]; // ex) cdn-prp_282663-1
    var property_vs = $(data).attr("id").split("-")[2]; // ex) cdn-prp_282663-1
    var host_name = $(data).find("#akamai_host").text();
    var edge_host_name = $(data).find("#akamai_edge_host").text();
    var property_name = $(data).find("#akamai_property").text();
    property_status = $(data).data("status");

    // 화면 버튼 사용 가능 여부 설정
    $("#propertyAct").attr('class', "action action_disabled");
    $("#propertyDeact").attr('class', "action action_disabled");
    $("#propertyDetail").attr('class', "f_gray");
    $("#propertyModify").attr('class', "f_gray");
    $("#propertyPurge").attr('class', "f_gray");

    if(property_status == "ACTIVE"){
        $("#propertyDeact").attr('class', "action");
        $("#propertyDetail").attr('class', "");
        $("#propertyModify").attr('class', "");
        $("#propertyPurge").attr('class', "");
    } else if(property_status == "DEACTIVATED"
        || property_status == "INACTIVE") {
        $("#propertyAct").attr('class', "action");
        $("#propertyDetail").attr('class', "");
        $("#propertyModify").attr('class', "");
    } else {
        $("#propertyNo").removeClass("action_disabled");
    }
    $("#propertyDetail").attr('class', "");
    $("#propertyPurge").attr('class', "");
    var detail_custom = "";
    rule_arr = [];

    // 상세 정보 - 기본 정보 설정
    $("#detail_pro_name").text(property_name);
    $("#detail_host").text(host_name);
    $("#detail_edgehost").text(edge_host_name);

    // 서비스 변경 - 기본 정보 설정
    $("#span_property_modify").text(property_name);

    //서비스 도메인 없는 경우 > cdn 도메인 사용
    if(host_name == "-"){
        $("#host_name_modify").attr("disabled", "disabled");
        $("#host_name_modify").val("");
        $("#modify_host").attr("checked", "true");
        $("#default_host_name").val(""); // 변경 했는지 확인 하기 위해
    } else {
        $("#host_name_modify").val(host_name);
        $("#default_host_name").val(host_name); // 변경 했는지 확인 하기 위해
    }

    var params = {
        property_id : property_id,
        property_vs : property_vs
    };

    showLoadingBox();

    // CDN Global 기능 오류건 개발
    $.ajax({
        url : "/console/globalcdn/propertyDetail",
        type : "POST",
        async: true,
        data : params,
        dataType : "json",
        complete : hideLoadingBox, /*로딩중 이미지 닫기*/
        success : function(json) {
            if(json.result == "fail"){
                var command = "상세 정보 오류";
                return akamaiConnectionError(command);
            }

            rule_arr = json;
            var behaviors = json.rules.behaviors;

            for(var k=0; k<behaviors.length; k++){
                if(behaviors[k].name == "cpCode"){
                    cpcode = behaviors[k].options.value.id;
                }
            }

            detail_custom = json.rules.behaviors;

            temp_detail_json = json;
            globalCDNDetailDiv(json);
        }
    });
}

//popUp
function popUpDelete(e) {
    e.preventDefault();
    var el_dialog        = $("#popUpDel");
    commonDialogInit(el_dialog);
    el_dialog.dialog("open");
}

function globalCDNDetailDiv(json){
    let { behaviors, children } = json.rules;

    // 원본서버 - 직접입력 or Storage 구분하여 값 설정
    let originHostname = behaviors[0].options.hostname;
    let baseDirectory = behaviors.find(item => item.name === 'baseDirectory') || {};
    $("#detail_origin_span").text(originHostname); // 오리진 서비스 도메인명

    if ((originHostname.includes('.ucloudbiz.olleh.com')&& baseDirectory.options?.value.includes('v1/AUTH'))
        || originHostname.includes('.obj-epc-1.ktcloud.com')) {
        // Storage
        $("#detail_default_span").text("storage");
        $("#detail_origin_server_location").text(originHostname);
        $("#detail_origin_value_info").text("파일박스");
        if(baseDirectory.options.value.includes('Public')){
            $("#detail_origin_value").text(`${baseDirectory.options.value}(KOR-Central(Storage 4.0))`);
        }else {
            $("#detail_origin_value").text(`${baseDirectory.options.value.split('/')[3]}(${
                originHostname.includes('ssproxy2') ? 'KOR-Central(Storage 2.0)' : 'KOR-Central'})`);
        }

    } else {
        // 직접입력
        $("#detail_default_span").text("직접입력");
        $("#detail_origin_value_info").text("오리진 경로");
        $("#detail_origin_server_location").text(originHostname);
        $("#detail_origin_value").text(baseDirectory.options?.value || '-');
    }


    $("#detail_https_downgrade").text("사용 안 함");
    let detailSetFuns = {
        list: ['origin', 'allowHTTPSDowngrade', 'caching', 'tieredDistribution', 'cacheKeyQueryParams'],
        origin({ options }) {
            $("#detail_hostHeader").text(options.forwardHostHeader === 'REQUEST_HOST_HEADER' ?
                "Incoming Host Header" : "Origin Hostname");
            $("#detail_true_ip").text(options.enableTrueClientIp ? `사용(${options.trueClientIpHeader})` : '사용 안 함');
            $("#detail_gzip").text(options.compress ? "사용" : "사용 안 함");
            $("#detail_span_http").text(options.httpPort);
            $("#detail_span_https").text(options.httpsPort);
        },
        allowHTTPSDowngrade({ options }) {
            $("#detail_https_downgrade").text(options.enabled ? '사용' : "사용 안 함");
        },
        caching({ options }) {
            $("#detail_caching_op").text(options.behavior == "MAX_AGE" ?
                "캐싱 기간 설정" : "오리진 서버의 Cache Control Header를 따름");
            $("#detail_cache_server").html(options.mustRevalidate ?
                "항상 원본 서버에서 확인해서 전달" : "원본과의 통신이 어려운 경우 캐시 서버의 캐시 오브젝트 전달");

            let ttl = options.behavior == "MAX_AGE" ? options.ttl : options.defaultTtl;
            let ttlSelect = {
                d: ' Days',
                h: ' Hours',
                m: ' Minutes',
                s: ' Seconds'
            }
            $("#detail_caching_input_sel").text(ttl.replace(ttl.slice(-1), ttlSelect[ttl.slice(-1)]));
        },
        tieredDistribution({ options }) {
            $("#detail_caching_map").text(!options.enabled ? "국내 맵"
                : options.tieredDistributionMap == "CH2" ?
                    "글로벌 맵" : "아시아 태평양 맵");
        },
        cacheKeyQueryParams({ options }) {
            $("#detail_query_para").text(options.behavior == "INCLUDE_ALL_ALPHABETIZE_ORDER" ||  options.behavior == "INCLUDE_ALL_PRESERVE_ORDER"?
                "쿼리 파라미터를 포함하여 캐시" : "쿼리 파라미터를 무시하고 캐시");
        }
    };
    behaviors.forEach(item => {
        if (detailSetFuns.list.includes(item.name)) {
            detailSetFuns[item.name](item);
        }
    });
    children.forEach(item => {
        if(item.name === 'Large File Optimization'){
            if(item.behaviors[0].options.enabled){
                $("#detail_large_file").text("사용");
            }else {
                $("#detail_large_file").text("사용 안 함");
            }

        }else if(item.name === 'Content Compression'){
            if(item.criteria[0].options.matchCaseSensitive){
                $("#detail_compression").text("사용");
            }else {
                $("#detail_compression").text("사용 안 함");
            }
        }

    });
//    $("#detail_large_file").text((children.findIndex(item => item.name === 'Large File Optimization') > -1) ? "사용" : "사용 안 함");
//    $("#detail_compression").text((children.findIndex(item => item.name === 'Content Compression') > -1) ? "사용" : "사용 안 함");
    $("#detail_caching_rule").text((children.findIndex(item => item.name === 'Completely Static Content') > -1) ? "사용" : "사용 안 함");
    $("#detail_ip_deny").text((children.findIndex(item => item.name === 'Deny By Ip') > -1) ? "사용" : "사용 안 함");

    let tokenControl = children.find(item => item.name === 'Simple Cookie Token Based Protection');
    let tokenLocationInfo = {
        COOKIE: '쿠키',
        CLIENT_REQUEST_HEADER: '요청헤더',
        QUERY_STRING: '쿼리 문자열'
    }

    if (tokenControl) {
        $("#detail_token_use_YN").text('사용');
        if(tokenControl.behaviors[0].options.failureResponse){
            $("#detail_token_movement").text('검증 후 차단');
        }else {
            $("#detail_token_movement").text('단순 검증');
        }
        $("#detail_token_location").text(tokenLocationInfo[tokenControl.behaviors[0].options.location]);
        $("#detail_token_name").text(tokenControl.behaviors[0].options.locationId);
        $("#detail_token_encryption_key").text(tokenControl.behaviors[0].options.key);


        $("#detail_token_ex").text('');
        $("#detail_token_path").text('');
        tokenControl.criteria.forEach(item => {
            let temp_value = '';
            item.options.values.forEach(item => {temp_value += (item + ', ')})
            if(item.name === "path"){
                $("#detail_token_path").text(temp_value);
            }else {
                $("#detail_token_ex").text(temp_value);
            }
        });

    } else {
        $("#detail_token_use_YN").text('사용 안 함');
        $("#detail_token_movement").text('');
        $("#detail_token_location").text('');
        $("#detail_token_name").text('');
        $("#detail_token_encryption_key").text('');
        $("#detail_token_ex").text('');
        $("#detail_token_path").text('');
    }
}

// 서비스 변경
function globalCDNModifyDiv(json){
    let property_name = json.propertyName;
    // 이름
    $("#span_property_modify").text(property_name);

    let origin = json.rules.behaviors[0];
    let httpPort = origin.options.httpPort;
    // 서비스 도메인
    rule_arr = json;
    var behaviors = json.rules.behaviors;

    for(let k = 0; k < behaviors.length; k++) {
        if(behaviors[k].name == "cpCode"){
            cpcode = behaviors[k].options.value.id;
        }
    }

    let detail_custom = json.rules.behaviors || [];

    // 원본 서버
    let filebox_yn = detail_custom.find((item) => item.name == "baseDirectory");
    let filebox_index = detail_custom.indexOf(filebox_yn)
    if (filebox_yn && (detail_custom[filebox_index].options.value === "ssproxy.ucloudbiz.olleh.com")) { // storage
        $("#direct_content_modify").hide();
        $("#storage_content_modify").show();
        $("#sel_default_type_modify #direct_input").removeClass("on");
        $("#sel_default_type_modify #storage_input").addClass("on");

        // 파일박스 설정
        zoneChange("modify", detail_custom[0].options.value.split("/")[3] || '');
    } else { // 직접입력
        $("#direct_content_modify").show();
        $("#storage_content_modify").hide();
        $("#sel_default_type_modify #direct_input").addClass("on");
        $("#sel_default_type_modify #storage_input").removeClass("on");

        $("#origin_hostname_modify").val(detail_custom[0].options.hostname !== undefined ? detail_custom[0].options.hostname : '');
        if(filebox_yn){ // 원본 경로
            $("#origin_path_modify").val(detail_custom[filebox_index].options.value);
        }
    }

    //HTTP Port
    $("#http_port_modify").val(httpPort);

    // 오리진 서버 설정
    detail_custom.forEach((item) => {
        if (item.name == 'origin') {
            $("#origin_server_toggle_modify").attr("checked",true);
            $("#origin_server_content_modify").show();

            let forwardHostHeader = item.options.forwardHostHeader;
            let compress = item.options.compress;
            let enableTrueClientIp = item.options.enableTrueClientIp;
            let trueClientIpHeader = item.options.trueClientIpHeader;

            //호스트 헤더 전달
            if(forwardHostHeader === "ORIGIN_HOSTNAME") {
                $("#hostHeader_modify").removeClass('on');
                $("#hostHeader2_modify").addClass('on');
            }else {
                $("#hostHeader_modify").addClass('on');
                $("#hostHeader2_modify").removeClass('on');

            }
            //Gzip 압축 지원
            if(compress) {
                $("#gzip_modify").parent().addClass('on');
                $("#gzip2_modify").parent().removeClass('on');
            }else {
                $("#gzip2_modify").parent().addClass('on');
                $("#gzip_modify").parent().removeClass('on');

            }
            //실제 클라이언트 IP 헤더 지원
            if(enableTrueClientIp) {
                $("#true_ip_modify").parent().addClass('on');
                $("#true_ip2_modify").parent().removeClass('on');
                $("#true_ip_header_modify").show();
                $("#true_ip_header_modify").children("input").val(trueClientIpHeader);

            }else {
                $("#true_ip2_modify").parent().addClass('on');
                $("#true_ip_modify").parent().removeClass('on');
                $("#true_ip_header_modify").hide();
            }
            // 오리진 요청 HTTP 프로토콜 다운그레이드
        } else if (item.name == "allowHTTPSDowngrade") {
            if(item.options.enabled){
                $("#protocol_downgrade1_modify").parent().addClass('on');
                $("#protocol_downgrade2_modify").parent().removeClass('on');
            }else {
                $("#protocol_downgrade2_modify").parent().addClass('on');
                $("#protocol_downgrade1_modify").parent().removeClass('on');
            }
        }
    });

    // 고급 설정
    if(json.rules.comments != ""){
		custom_rule_chk = true;
        $("#highsetting_content_modify").attr("class", "depth_highsetting dp_on");
        $("#detail_setting_modify").css("background", "url(/images/coni/Advanced_pre.svg) no-repeat right 40%");


        let caching_toggle = false;
        detail_custom.forEach(item => {
            // 공통 캐싱 정책
            if (item.name == 'caching') {
                //캐싱 옵션
                let ttl = '';
                if(item.options.behavior === "MAX_AGE") {
                    $("#caching_option_modify").parent().addClass('on');
                    $("#caching_option2_modify").parent().removeClass('on');
                    //최대 캐싱 기간
                    ttl = item.options.ttl;
                    if(ttl != "7d"){
                        caching_toggle = true;
                    }

                }else {
                    $("#caching_option2_modify").parent().addClass('on');
                    $("#caching_option_modify").parent().removeClass('on');
//				$("#caching_input_modify").attr("disabled",true);
                    ttl = item.options.defaultTtl;
                    caching_toggle = true;
                }

                let ttl_num = ttl.substring(0,ttl.length-1);
                let ttl_unit = ttl.substring(-1);

                $("#caching_input_modify").val(ttl_num);
                $("#caching_select_modify").val(ttl_unit);
                //캐시 서버의 오브젝트 전달 여부
                if(item.options.mustRevalidate) {
                    $("#cache_server2_modify").parent().addClass('on');
                    $("#cache_server_modify").parent().removeClass('on');
                    caching_toggle = true;
                }else {
                    $("#cache_server_modify").parent().addClass('on');
                    $("#cache_server2_modify").parent().removeClass('on');
                }



                // 계층화된 캐싱
            } else if (item.name == 'tieredDistribution') {

                let behavior = item.options.tieredDistributionMap;

                //계층화된 캐싱 맵
                $("#caching_map_check li span").removeClass("on");
                if(item.options.enabled) {
                    caching_toggle = true;
                    if(behavior === "CH2") {
                        $("#caching_map_modify").addClass('on');
                    }else if(behavior === "CHAPAC") {
                        $("#caching_map2_modify").addClass('on');
                    }
                }else {//국내맵
                    $("#caching_map3_modify").addClass('on');
                }

                // 쿼리 파리미터 캐싱
            } else if (item.name == 'cacheKeyQueryParams') {
                //정책
                $("#query_parameter_check li span").removeClass("on");
                if(item.options.behavior === "INCLUDE_ALL_PRESERVE_ORDER") { // defualt 값
                    $("#query_para_modify").addClass('on');
//				caching_toggle = false;
                }else if (item.options.behavior === "INCLUDE_ALL_ALPHABETIZE_ORDER") {
                    $("#query_para_modify").addClass('on');
                    caching_toggle = true;
                }else {
                    $("#query_para2_modify").addClass('on');
                    caching_toggle = true;

                }
            }
        });

        if(caching_toggle){
            $("#caching_rule_toggle_modify").attr("checked",true);
            $("#caching_rule_content_modify").show();
        }


        let detail_custom_children = json.rules.children || [];

        detail_custom_children.forEach(item => {
            // 대용량 파일 최적화 사용
            if(item.name == 'Large File Optimization') {
                if(item.behaviors[0].options.enabled) {
                    $("#large_file_modify_toggle").attr("checked",true);
                    $("#large_file_content_modify").show();
                    $("#large_file_modify").parent().parent().find("span").removeClass("on");
                    $("#large_file_modify").addClass("on");
                }
                // Last Mile 압축 사용
            }else if(item.name == 'Content Compression') {
                if(item.criteria[0].options.matchCaseSensitive) {
                    $("#compression_modify_toggle").attr("checked",true);
                    $("#compression_content_modify").show();
                    $("#compression_modify").parent().parent().find("span").removeClass("on");
                    $("#compression_modify").addClass("on");
                }
                // 개별 캐싱 정책
            }else if(item.name == 'Completely Static Content'){
                $("#chacing_rule_add_toggle_modify").attr("checked",true);
                $("#chacing_rule_add_content_modify").show();
                $("#chacing_rule_add_modify").parent().parent().find("span").removeClass("on");
                $("#chacing_rule_add_modify").addClass("on");
                $("#chacing_rule_add_active_modify").show();


                contentCachingList.push(item);
                let base_caching_rule = $("#base_caching_rule_modify").clone().show();

                let caching_option = item.behaviors[0].options.behavior;
                let mustRevalidate = item.behaviors[0].options.mustRevalidate;
                let ttl = caching_option === "MAX_AGE" ? item.behaviors[0].options.ttl : item.behaviors[0].options.defaultTtl;

                let temp_caching_option = "";
                if(caching_option === "MAX_AGE"){
                    temp_caching_option += "캐싱 기간 설정 - " + ttl;
                }else {
                    temp_caching_option += "오리진 서버의 Cache Control Header를 따름 - " + ttl;
                }

                //캐시 서버의 오브젝트 전달 여부
                if(mustRevalidate){ // 항상 오리진 서버에서 확인해서 전달
                    temp_caching_option += ", 항상 오리진 서버에서 확인해서 전달";
                }else { // 캐시 서버의 오브젝트 전달
                    temp_caching_option += ", 캐시 서버의 오브젝트 전달";
                }

                let criteria = item.criteria;

                let temp_criteria = "(AND)";
                criteria.forEach((criteria_item) =>  {
                    if (criteria_item.name === "fileExtension") {
                        temp_criteria += "[파일 확장자]";
                        if (criteria_item.options.matchOperator === "IS_ONE_OF") {
                            temp_criteria += "IF ";
                        } else {
                            temp_criteria += "IF NOT ";
                        }
                    } else {
                        temp_criteria += "[경로]";
                        if (criteria_item.options.matchOperator === "MATCHES_ONE_OF") {
                            temp_criteria += "IF ";
                        } else {
                            temp_criteria += "IF NOT ";
                        }
                    }

                    criteria_item.options.values.forEach((value) => {
                        temp_criteria += value + ", "
                    });

                    temp_criteria += "/"
                });

                base_caching_rule.find("#rule_section_caching2").text(temp_criteria);
                base_caching_rule.find("#add_caching_option").text(temp_caching_option);


                $("#base_caching_rule_modify").parent().append(base_caching_rule);

                // IP 차단
            }else if(item.name == 'Deny By Ip'){
                $("#ip_block_toggle_modify").attr("checked",true);
                $("#ip_block_content_modify").show();
                $("#ip_block_modify").parent().parent().find("span").removeClass("on");
                $("#ip_block_modify").addClass("on");
                $("#ip_block_active_modify").show();
                ipDenyList.push(item);

                let ip_rule_div = $("#ip_rule_div_modify").clone().show();

                let enabled = item.behaviors[0].options.enabled;
                let reason = item.behaviors[0].options.reason;
                // 상태
                if(enabled) { // 허용
                    ip_rule_div.find("#clientIP_status_span_modify").text("허용");
                }else { // 차단
                    ip_rule_div.find("#clientIP_status_span_modify").text("차단");
                }

                //제어값
                ip_rule_div.find("#ip_rule_reason").text(reason);


                let temp_criteria = "(AND)";


                item.criteria.forEach((criteria_item)=>{
                    if(criteria_item.options.matchOperator === "IS_ONE_OF") {
                        temp_criteria += "IF ";
                    }else {
                        temp_criteria += "IF NOT ";
                    }
                    let ip_value = criteria_item.options.values;
                    ip_value.forEach((value)=>{
                        temp_criteria += value + ", ";
                    });
                    temp_criteria +=  "/ "

                })
                ip_rule_div.find("#ip_div").text(temp_criteria);

                $("#ip_rule_div_modify").parent().append(ip_rule_div);

                // Token 제어
            }else if(item.name == 'Simple Cookie Token Based Protection') {
                $("#token_access_toggle_modify").attr("checked",true);
                $("#token_access_content_modify").show();
                $("#token_access_modify").parent().parent().find("span").removeClass("on");
                $("#token_access_modify").addClass("on");
                $("#token_access_active_modify").show();
                let location = item.behaviors[0].options.location;
                let movement = item.behaviors[0].options.failureResponse;

                // 캐싱 옵션
                $("#token_location_ui_modify").find("span").removeClass('on');
                if(location === "COOKIE") {
                    $("#token_location1_modify").addClass('on');
                }else if(location === "CLIENT_REQUEST_HEADER") {
                    $("#token_location2_modify").addClass('on');
                }else {
                    $("#token_location3_modify").addClass('on');
                }

                $("#token_movement_ui_modify").find("span").removeClass('on');
                if(movement) {
                    $("#token_movement2_modify").addClass('on');
                }else {
                    $("#token_movement1_modify").addClass('on');
                }


                token_criteria_list = item.criteria;
                item.criteria.forEach((criteria_item) =>{
                    let temp_td = $("#base_token_list_modify").clone().addClass("token_list_modify").show();
                    let caching_if = "";
                    let temp_value = "";
                    if(criteria_item.name === "fileExtension"){
                        if(criteria_item.options.matchOperator === "IS_ONE_OF") {
                            caching_if += "IF ";
                        }else {
                            caching_if += "IF NOT ";
                        }
                        temp_value +=  "(파일 확장자)";

                    }else {
                        if(criteria_item.options.matchOperator === "MATCHES_ONE_OF") {
                            caching_if += "IF ";
                        }else {
                            caching_if += "IF NOT ";
                        }
                        temp_value +=  "(경로)";
                    }
                    let token_value = criteria_item.options.values;
                    token_value.forEach((value) =>{
                        temp_value += value + ", ";
                    });

                    temp_td.find("#token_matchOperator").text(caching_if);
                    temp_td.find("#tokenValue").text(temp_value);
                    $("#token_access_list_modify").append(temp_td);
                });

            }


        });
    }
    $("#btnModifyCancel").unbind("click").bind("click", e => {
        e.preventDefault();
        $("#div_modify").hide();
        $("#div_non_create").show();

        // 서비스 변경 창 초기화
    })
}

//서비스 상세 정보 END --------------------------------------------------------------------------------------------------------------------------------------------

// 서비스 수정 START             *********************************************-------------------------------------------------------------------------------
function serviceNextModify(){
    var succ = dataCheck("modify");
    if(succ != "success"){
        return null;
    }

    serviceModify();
}

//서비스 수정 START
function serviceModify(){
    var host_name = $("#host_name_modify").val(); // 호스트 명
    var property_id = rule_arr.propertyId;
    var property_vs = rule_arr.propertyVersion;
    var etag = rule_arr.etag;



    var rule_vs_up_data = {
        createFromVersion : property_vs,
        createFromVersionEtag : etag
    }
    var params={
        ruleVsUp : JSON.stringify(rule_vs_up_data),
        property_id : property_id
    }

    const latestVs = $("#tbody_cdnList tr.on").data("latestVersion");
    var updatedVs = parseInt(latestVs, 10)+1;

    showLoadingBox();    // 로딩중 이미지

    $.ajax({
        url: "/console/globalcdn/propertyVsUpdate",
        type: "POST",
        data: params,
        dataType: "json",
        success: serviceModifyAjax1,
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            showCommonNoLangErrorMsg("서비스 수정 오류","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
        }
    });

    function serviceModifyAjax1(data) {
        if(data.result == "29") { /* IAM 사용자 정책 처리 */
            hideLoadingBox();
            commonErrorMessage("29");
            return;
        }

        if(data.result == "fail"){
            hideLoadingBox();

            if(data.error == "String index out of range: -1"){
                var command = "목록 호출 오류";
                return akamaiConnectionError(command);
            }
            return showCommonNoLangErrorMsg("프로퍼티 생성 오류","서비스 생성 중 오류가 발생 하였습니다.<br>다시 시도해 주시기 바랍니다.");
        } else {
            property_vs = updatedVs
            params={
                property_id : property_id,
                property_vs : property_vs
            }
            // CDN Global 기능 오류건 개발
            $.ajax({
                url: "/console/globalcdn/propertyDetail",
                type: "POST",
                async: true,
                data: params,
                dataType: "json",
                success: serviceModifyAjax2,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    showCommonNoLangErrorMsg("서비스 수정 오류","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
                }
            });
        }
    }

    function serviceModifyAjax2(data) {
        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "서비스 수정 오류";
                return akamaiConnectionError(command);
            }
            return showCommonNoLangErrorMsg("서비스 수정 오류","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
        } else {
            var modify_detailRule = data;

            var origin_hostname = $("#origin_hostname_modify").val(); // 직접입력 값
            let origin_httpPort = $("#http_port_modify").val() === '' ? 80 : parseInt($("#http_port_modify").val());
            let origin_httpsPort = $("#https_port_modify").val() === '' ? 80 : parseInt($("#https_port_modify").val());
            let select_filebox = "";
            if($("#direct_input_modify").hasClass("on")){// 원본 서버
                //rules.origin 설정
                modify_detailRule.rules.behaviors[0].options.originType = "CUSTOMER";
                modify_detailRule.rules.behaviors[0].options.httpPort = origin_httpPort;
                modify_detailRule.rules.behaviors[0].options.httpsPort = origin_httpsPort;
                select_filebox = $("#origin_path_modify").val(); //원본경로

            }else {
                if($("#select_availability_modify").val() === "2"){
                    origin_hostname = `${$("#select_filebox_modify").val()}.obj-epc-1.ktcloud.com`;
                    modify_detailRule.rules.behaviors[0].options.originType = "CUSTOMER";
                    select_filebox = `/${$("#select_filebox_modify option:selected").text()}${$("#ss4_origin_path_input_modify").val()}`;

                }else{
                    origin_hostname = $("#origin_hostname_modify").val();
                    modify_detailRule.rules.behaviors[0].options.originType = "CUSTOMER";
                    select_filebox = "/" + $("#select_filebox_modify option:selected").text();
                }

            }

            modify_detailRule.rules.behaviors[0].options.hostname = origin_hostname;
            //호스트 헤더 전달
            if($("#hostHeader_modify").hasClass("on")){// Incoming Host Header
                modify_detailRule.rules.behaviors[0].options.forwardHostHeader = "REQUEST_HOST_HEADER";
                modify_detailRule.rules.behaviors[0].options.cacheKeyHostname = "REQUEST_HOST_HEADER";

            }else { // Origin Hostname
                modify_detailRule.rules.behaviors[0].options.forwardHostHeader = "ORIGIN_HOSTNAME";
                modify_detailRule.rules.behaviors[0].options.cacheKeyHostname = "ORIGIN_HOSTNAME";
            }

            //Gzip 압축 지원
            if($("#gzip_modify").parent().hasClass("on")){
                modify_detailRule.rules.behaviors[0].options.compress = true;
            }else {
                modify_detailRule.rules.behaviors[0].options.compress = false;
            }

            //실제 클라이언트 IP 헤더 지원
            if($("#true_ip_modify").parent().hasClass("on")){
                modify_detailRule.rules.behaviors[0].options.enableTrueClientIp = true;
                modify_detailRule.rules.behaviors[0].options.trueClientIpHeader = $("#true_ip_header_modify").children().val();
                modify_detailRule.rules.behaviors[0].options.trueClientIpClientSetting = true;
            }else {
                modify_detailRule.rules.behaviors[0].options.enableTrueClientIp = false;
                delete modify_detailRule.rules.behaviors[0].options.trueClientIpHeader;
                delete modify_detailRule.rules.behaviors[0].options.trueClientIpClientSetting;

            }


            // 오리진 요청 HTTP 프로토콜 다운그레이드
            if(modify_detailRule.rules.behaviors.find((item) => item.name == "allowHTTPSDowngrade")){
                let downgrade_yn = modify_detailRule.rules.behaviors.find((item) => item.name == "allowHTTPSDowngrade");
                let downgrade_index = modify_detailRule.rules.behaviors.indexOf(downgrade_yn)
                if($("#protocol_downgrade1_modify").parent().hasClass("on")){
                    modify_detailRule.rules.behaviors[downgrade_index].options.enabled = true;
                }else {
                    modify_detailRule.rules.behaviors[downgrade_index].options.enabled = false;
                }

            }else {
                if($("#protocol_downgrade1_modify").parent().hasClass("on")){
                    let downGrade = {
                        name: "allowHTTPSDowngrade",
                        options: {
                            enabled: true
                        }
                    }
                    modify_detailRule.rules.behaviors.push(downGrade);
                }
            }

            //대용량 파일 최적화 사용 --> default 가 true 라 고급설정 미설정 시 선택 되어 보임
            if(!$("#large_file_modify").hasClass("on")){
                modify_detailRule.rules.children[0].behaviors[0].options.enabled = false;
            }

            var json_addrule = {indexKey : false};
            if(custom_rule_chk){
                modify_detailRule = customDataSet('modify', modify_detailRule);
                json_addrule = addRuleDataSet('modify');
            }else {
                custom_indexKey = "false";
            }

            etag = data.etag;
//            data.ruleFormat = "v2022-06-28";
            params={
                body : JSON.stringify(modify_detailRule),
//                    jsonCustom : JSON.stringify(json_custom),
                jsonAddrule : JSON.stringify(json_addrule),
                defaultHostname : origin_hostname,
                defaultHttpPort : origin_httpPort,
                filebox : select_filebox,
                indexKey : custom_indexKey,
                property_id : property_id,
                property_vs : property_vs
            }
            $.ajax({
                url: "/console/globalcdn/propertyModify",
                type: "POST",
                data: params,
                dataType: "json",
                success: servideModifyAjax3,
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                    showCommonNoLangErrorMsg("서비스 수정 오류","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
                }
            });
        }
    }
    function servideModifyAjax3(data) {
        if(data.result == "fail"){
            hideLoadingBox();
            if(data.error == "String index out of range: -1"){
                var command = "서비스 수정 오류";
                return akamaiConnectionError(command);
            }
            return showCommonNoLangErrorMsg("서비스 수정 오류","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
        } else {
            if($("#default_host_name").val() != host_name){
                hostnameProcess(host_name, property_id, property_vs, etag);
            } else {
                activationProcess(property_id, property_vs);
            }
        }
    }
}

function hostnameProcess(host_name, property_id, property_vs, etag){
    var params = {
        property_id : property_id,
        property_vs : property_vs,
        hostname : host_name,
        etag : etag,
        updateYN : "Y"
    }
    $.ajax({
        url: "/console/globalcdn/setEdgeHostname",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            if(data.result == "fail"){
                hideLoadingBox();
                if(data.error == "String index out of range: -1"){
                    var command = "도메인 수정 오류";
                    akamaiConnectionError(command);
                    return "fail";
                }
                showCommonNoLangErrorMsg("도메인 수정 오류","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
                return "fail"
            } else {
                hideLoadingBox();
                location.reload();
            }
        },
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            return "fail";
        }
    });
}

function activationProcess(property_id, property_vs){
    if(property_status == "ACTIVE"){ // 서비스 상태가 'active'일 때만 activation 실행
        var body = {
            acknowledgeAllWarnings: true,
            propertyVersion : property_vs,
            network : "PRODUCTION",
            activationType : "ACTIVATE",
            notifyEmails : notifyEmails
        }
        var params = {
            property_id : property_id,
            body : JSON.stringify(body),
            type : "ACTIVATE"
        }
        activationModify(params);
    } else {
        hideLoadingBox();
        location.reload();
    }
}

function activationModify(params){
    $.ajax({
        url: "/console/globalcdn/activation",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            hideLoadingBox();
            if(data.result == "fail"){
                if(data.error == "String index out of range: -1"){
                    showCommonNoLangErrorMsg("서비스 생성 오류","서비스 Activation 요청 중 오류가 발생 하였습니다.");
                }
                showCommonNoLangErrorMsg("Activation 실패","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
            } else {
                hideLoadingBox();
                location.reload();
            }
        },
        error: function(XMLHttpResponse) {
            hideLoadingBox();
            showCommonNoLangErrorMsg("Activation 실패","서비스 수정 중 오류가 발생하였습니다.<br/> 관리자에게 문의 바랍니다.");
        }
    });
}
//서비스 수정 END                *********************************************-------------------------------------------------------------------------------

function activationCheck(){
    interval();
    var act_chk = setInterval(function(){
        var session = "";
        session = sessionStorage.getItem("activation_pro");
        if(session != ""){
            var activation_pro = "";
            var params = {property_id : session};
            $.ajax({
                url: "/console/globalcdn/activationChk",
                type: "POST",
                data: params,
                dataType: "json",
                success: function(data) {
                    var property_list = data;
                    var status = "";
                    for(var i=0; i<property_list.length; i++){
                        if(property_list[i].result == "fail"){
                            activation_pro = property_list[i].property_id + "," + activation_pro;
                        } else {
                            var property_vs = property_list[i].propertyVersion;
                            var property_st = property_list[i].productionStatus;
                            var property_id = property_list[i].propertyId;
                            var property_name = property_list[i].propertyName;
                            if(property_st == "ACTIVE"){
                                status = "<img src=\"/images/c_common/ico_state_use.png\" alt=\"사용\"/> 사용";
                                var rtn = "cccc Activation 성공하였습니다.";
                                rtn = rtn.replace("cccc", property_name);
                                var message = "[CDN Global] " + rtn;
                                add_noti_message("console/globalcdn/globalcdnlist", message);
                                $("#cdn-"+property_id+"-"+property_vs).data("status", "ACTIVE");
                            } else if(property_st == "DEACTIVATED") {
                                status = "<img src=\"/images/c_common/ico_state_stop.png\" alt=\"사용\"/> 정지";
                                rtn = "cccc Deactivation 성공하였습니다.";
                                rtn = rtn.replace("cccc", property_name);
                                message = "[CDN Global] " + rtn;
                                add_noti_message("console/globalcdn/globalcdnlist", message);
                                $("#cdn-"+property_id+"-"+property_vs).data("status", "DEACTIVATED");
                            } else if(property_st == "INACTIVE") {
                                status = "<img src=\"/images/c_common/ico_state_stop.png\" alt=\"사용\"/> 정지";
                            } else if(property_st == "PENDING"){
                                if(property_status == "DEACTIVATED"){
                                    property_vs = parseInt(property_vs, 10) - 1;
                                }
                                status = "<img src=\"/images/c_common/ico_state_loading_02_bak.gif\" alt=\"사용\"/> 처리 중";
                                activation_pro = property_id + "," + activation_pro;
                                $("#cdn-"+property_id+"-"+property_vs).data("status", "PENDING");
                            } else{
                                property_vs = parseInt(property_vs, 10) - 1;
                                status = "<img src=\"/images/c_common/ico_state_loading_01_bak.gif\" alt=\"사용\"/> 정지 중";
                                activation_pro = property_id + "," + activation_pro;
                                $("#cdn-"+property_id+"-"+property_vs).data("status", "DEPENDING");
                            }
                            $("#tbody_cdnList").find("#cdn-"+property_id+"-"+property_vs).find("#akamai_status").html(status);
                        }
                    }
                    sessionStorage.setItem("activation_pro", activation_pro);
                    if(activation_pro == ""){
                        clearInterval(act_chk);
                    }
                },
                error: function(XMLHttpResponse) {
                    hideLoadingBox();
                }
            });
        } else {
            clearInterval(act_chk);
        }
    }, 300000);
}

function interval(){
    var session = "";
    session = sessionStorage.getItem("activation_pro");
    var activation_pro = "";
    var params = {property_id : session};
    $.ajax({
        url: "/console/globalcdn/activationChk",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            var property_list = data;
            var status = "";
            for(var i=0; i<property_list.length; i++){
                if(property_list[i].result == "fail"){
                    activation_pro = property_list[i].property_id + "," + activation_pro;
                } else {
                    var property_vs = property_list[i].propertyVersion;
                    var property_st = property_list[i].productionStatus;
                    var property_id = property_list[i].propertyId;
                    var property_name = property_list[i].propertyName;
                    if(property_st == "ACTIVE"){
                        status = "<img src=\"/images/c_common/ico_state_use.png\" alt=\"사용\"/> 사용";
                        var rtn = "cccc Activation 성공하였습니다.";
                        rtn = rtn.replace("cccc", property_name);
                        var message = "[CDN Global] " + rtn;
                        add_noti_message("console/globalcdn/globalcdnlist", message);
                        $("#cdn-"+property_id+"-"+property_vs).data("status", "ACTIVE");
                    } else if(property_st == "DEACTIVATED") {
                        status = "<img src=\"/images/c_common/ico_state_stop.png\" alt=\"정지\"/> 정지";
                        rtn = "cccc Deactivation 성공하였습니다.";
                        rtn = rtn.replace("cccc", property_name);
                        message = "[CDN Global] " + rtn;
                        add_noti_message("console/globalcdn/globalcdnlist", message);

                        $("#cdn-"+property_id+"-"+property_vs).data("status", "DEACTIVATED");
                    } else if(property_st == "INACTIVE") {
                        status = "<img src=\"/images/c_common/ico_state_stop.png\" alt=\"정지\"/> 정지";
                    } else if(property_st == "PENDING"){
                        if(property_status == "DEACTIVATED"){
                            property_vs = parseInt(property_vs, 10) - 1;
                        }
                        status = "<img src=\"/images/c_common/ico_state_loading_02_bak.gif\" alt=\"처리중\"/> 처리 중";
                        activation_pro = property_id + "," + activation_pro;
                    } else{
                        property_vs = parseInt(property_vs, 10) - 1;
                        status = "<img src=\"/images/c_common/ico_state_loading_01_bak.gif\" alt=\"정지중\"/> 정지 중";
                        activation_pro = property_id + "," + activation_pro;
                    }
                    $("#tbody_cdnList").find("#cdn-"+property_id+"-"+property_vs).find("#akamai_status").html(status);
                }
            }
            sessionStorage.setItem("activation_pro", activation_pro);
        },
        error: function(XMLHttpResponse) {
            hideLoadingBox();
        }
    });
}

function akamaiConnectionError(command){
    return showCommonNoLangErrorMsg(command,"서버와 통신이 원활하지 않습니다.<br/>다시 시도해 주시기 바랍니다.");
}

// 키 입력제한 체크
function hanCheck(Ev, type){ //입력값검사
    var checkPattern;
    switch (type){
        case 1 : //알파벳 숫자, 하이픈(-), 언더바(_), 점(.) 만 가능//알파벳 만 가능
            checkPattern = /[^\.a-zA-Z0-9\-\_\/\*]/;
            break;
        case 2 : //알파벳, 숫자, 하이픈(-), 점(.), 콤마(,) 만 가능//알파벳 만 가능
            checkPattern = /[^\.a-zA-Z0-9\-\,]/;
            break;
        case 3 : //알파벳 만가능
            checkPattern = /[^a-zA-Z]/;
            break;
        case 4 : //숫자 만 가능
            checkPattern = /[^0-9]/;
            break;
        case 5 : //알파벳, 숫자 만 가능
            checkPattern = /[^a-zA-Z0-9]/;
            break;
        case 6 : //숫자, ".", "/"만 가능
            checkPattern = /[^0-9\/\.]/;
            break;
        case 7 : //숫자, ".", "/"만 가능
            checkPattern = /[^a-zA-Z0-9\/\.\-\_]/;
            break;
        case 8 : //숫자, ".", "/"만 가능
            checkPattern = /[^a-zA-Z0-9\/\~\`\!\@\#\$\%\^\&\*\(\)\-\-\+\=\|\\\[\{\]\}\?\"\'\:\;\.\<\>\,]/;
            break;
    }
    if(Ev.value.match(checkPattern)) {
        Ev.value = Ev.value.replace(checkPattern,"");
    }
}

function event_usable_port(data) {
    if ($(data).hasClass("action_disabled")) {
        return;
    }
    commonDialogInit($("#popup_usable_port"));
    $("#popup_usable_port").dialog("open");
    $("#popup_usable_port").find("#btn_usable_port_close").unbind("click").bind("click", closeDetailPop);
    $("#popup_usable_port").find(".del").unbind("click").bind("click", closeDetailPop);
    function closeDetailPop() {
        $("#popup_usable_port").dialog("close");
    }
}

//고급 설정 ui 기능
function editional_setting() {
    $("#purge_all").click(purge_all_click);
    function purge_all_click() {
        if(!$(this).hasClass("on")){
            $("#purge_all").attr("class", "imgbn on");
            $("#purge_url").attr("class", "imgbn");
            $("#purge_url_detail").css("display", "none");
        }
    }

    $("#purge_url").click(purge_url_click);
    function purge_url_click() {
        if(!$(this).hasClass("on")){
            $("#purge_all").attr("class", "imgbn");
            $("#purge_url").attr("class", "imgbn on");
            $("#purge_url_detail").css("display", "");
        }
    }

    $("#purgePreCautions").click(purge_precautions_click);
    function purge_precautions_click() {
        if($("#purgePreCautions_content").hasClass("on")){
            $("#purgePreCautions_content").attr("class", "pdescclick");
        }else {
            $("#purgePreCautions_content").attr("class", "pdescclick on");
        }
    }

    //고급 설정 버튼
    $("#detail_setting").click(detail_setting_click);
    function detail_setting_click(e) {
        e.preventDefault();
        if($("#highsetting_content").hasClass("dp_on")){
            $("#highsetting_content").attr("class", "depth_highsetting dp_off");
            $("#detail_setting").css("background", "url(/images/coni/Advanced_pre.svg) no-repeat right 40%");
            custom_rule_chk = false;
        }else {
            $("#highsetting_content").attr("class", "depth_highsetting dp_on");
            $("#detail_setting").css("background", "url(/images/coni/Advanced.svg) no-repeat right 40%");
            custom_rule_chk = true;
        }
    }

    //생성 고급설정 토글 버튼
    $(".md_switch").click(md_switch_click);
    function md_switch_click() {
        if($(this).children("input").is(":checked")){
            $(this).parent().parent().next("dd").css("display", "");
        }else{
            $(this).parent().parent().next("dd").css("display", "none");
        }
    }


    $("#detail_setting_modify").click(modify_detail_setting_click);
    function modify_detail_setting_click(e) {
        e.preventDefault();
        if($("#highsetting_content_modify").hasClass("dp_on")){
            $("#highsetting_content_modify").attr("class", "depth_highsetting dp_off");
            $("#detail_setting_modify").css("background", "url(/images/coni/Advanced_pre.svg) no-repeat right 40%");
            custom_rule_chk = false;
        }else {
            $("#highsetting_content_modify").attr("class", "depth_highsetting dp_on");
            $("#detail_setting_modify").css("background", "url(/images/coni/Advanced.svg) no-repeat right 40%");
            custom_rule_chk = true;
        }
    }

    //원본 서버 선택 버튼
    $("#sel_default_type_create li span").click(default_type_create_click);
    function default_type_create_click() {
        if(!$(this).hasClass("on")){
            if($(this).attr("id") == "storage_input"){
                $("#direct_content_create").hide();
                $("#origin_path_div_create").hide();
                $("#storage_content_create").show();
                var params    = {
                    command        :     "getaccount",
                    zcopy : $("#select_availability_create").val()
                };
                getFileboxList(params, 'create');

            }else {
                $("#storage_content_create").hide();
                $("#origin_path_div_create").show();
                $("#direct_content_create").show();
                $("#origin_hostname_create").val('');

            }

            $("#sel_default_type_create li span").removeClass("on");
            $(this).addClass("on");
        }
    }

    $("#sel_default_type_modify li span").click(default_type_modify_click);
    function default_type_modify_click() {
        if(!$(this).hasClass("on")){
            if($(this).attr("id") == "storage_input_modify"){
                $("#direct_content_modify").hide();
                $("#origin_path_div_modify").hide();
                $("#storage_content_modify").show();
                var params    = {
                    command        :     "getaccount",
                    zcopy : $("#select_availability_modify").val()
                };
                getFileboxList(params, 'modify');
            }else {
                $("#storage_content_modify").hide();
                $("#direct_content_modify").show();
                $("#origin_path_div_modify").show();

                // CDN Global 기능 오류건 개발
                // $("#origin_hostname_modify").val('');

            }

            $("#sel_default_type_modify li span").removeClass("on");
            $(this).addClass("on");
        }
    }


    // check box
    $(".custom_check_box li label").click(function() {
        if(!$(this).hasClass("on")){
            $(this).parent().parent().find("label").removeClass("on");
            $(this).addClass("on");
        }
    });

    //실제 클라이언트 ip헤더 지원 체크 박스
    $("#real_client_ip_check li label").click(real_client_ip_check);
    function real_client_ip_check(e) {
        e.preventDefault();
        if($(this).children().attr('id') === "true_ip_create") {
            $("#true_ip_header_create").show();
        }else {
            $("#true_ip_header_create").hide();

        }
        if(!$(this).hasClass("on")){
            $("#real_client_ip_check li label").removeClass("on");
            $(this).addClass("on");
        }
    }

    $("#real_client_ip_check_modify li label").click(function(e) {
        e.preventDefault();
        if($(this).children().attr('id') === "true_ip_modify") {
            $("#true_ip_header_modify").show();
        }else {
            $("#true_ip_header_modify").hide();
        }
        if(!$(this).hasClass("on")){
            $("#real_client_ip_check_modify li label").removeClass("on");
            $(this).addClass("on");
        }
    });


    $("#chacing_rule_add_ul_create li span").click(function(){
        if(!$(this).hasClass("on")){
            $("#chacing_rule_add_ul_create li span").removeClass("on");
            $(this).addClass("on");
            if($("#chacing_rule_add_create").hasClass("on")){
                $("#chacing_rule_add_active_create").show();
            }else {
                $("#chacing_rule_add_active_create").hide();
            }
        }

    });
    $("#chacing_rule_add_ul_modify li span").click(function(){
        if(!$(this).hasClass("on")){
            $("#chacing_rule_add_ul_modify li span").removeClass("on");
            $(this).addClass("on");
            if($("#chacing_rule_add_modify").hasClass("on")){
                $("#chacing_rule_add_active_modify").show();
            }else {
                $("#chacing_rule_add_active_modify").hide();
            }
        }

    });
    $("#ip_block_ul_create li span").click(function(){
        if(!$(this).hasClass("on")){
            $("#ip_block_ul_create li span").removeClass("on");
            $(this).addClass("on");
            if($("#ip_block_create").hasClass("on")){
                $("#ip_block_active_create").show();
            }else {
                $("#ip_block_active_create").hide();
            }
        }
    });

    $("#ip_block_ul_modify li span").click(function(){
        if(!$(this).hasClass("on")){
            $("#ip_block_ul_modify li span").removeClass("on");
            $(this).addClass("on");
            if($("#ip_block_modify").hasClass("on")){
                $("#ip_block_active_modify").show();
            }else {
                $("#ip_block_active_modify").hide();
            }
        }
    });

    $("#token_access_ul_create li span").click(function(){
        if(!$(this).hasClass("on")){
            $("#token_access_ul_create li span").removeClass("on");
            $(this).addClass("on");
            if($("#token_access_create").hasClass("on")){
                $("#token_access_active_create").show();
            }else {
                $("#token_access_active_create").hide();
            }
        }
    });

    $("#token_access_ul_modify li span").click(function(){
        if(!$(this).hasClass("on")){
            $("#token_access_ul_modify li span").removeClass("on");
            $(this).addClass("on");
            if($("#token_access_modify").hasClass("on")){
                $("#token_access_active_modify").show();
            }else {
                $("#token_access_active_modify").hide();
            }
        }
    });


}

function mouseEnter(obj) {
    if ($(".vm_searchArea").find("#sel_sch_word").css('display') == "none") {
        $(".vm_searchArea").addClass("bc_mint");
        $(".vm_searchArea").find("#sel_sch_word").css('display', '');
    }
}

function mouseLeave(obj) {
    if ($(".vm_searchArea").find("#sel_sch_word").css('display') == 'block') {
        var schWord = $(".vm_searchArea").find("#sel_sch_word").val();
        if (schWord == undefined || schWord == "") {
            $(".vm_searchArea").removeClass("bc_mint");
            $(".vm_searchArea").find("#sel_sch_word").css('display', 'none');
        }
    }
}