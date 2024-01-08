var WebROOT = "/";
var roleCSApiUrl = "/gwapi";
var pattern = /[^(a-zA-Z0-9)]/;
var pattern_dedi = /[^(a-zA-Z0-9\-)]/;
var mem_dedicate_id = null;


$(document).ready(function() {    
    
    //console_sesscheck();    //로그인되어있는지 체크
    /*if(window.name == "ucloud_console")
        dupLoginSessionCr();*/
    
    /*if(typeof menu_id != "undefined"){ 
        savelogging(menu_id, menu_nm);    //logging
    }*/
    
    //setTimerSessionJobId();

});

//로그인되어있는지 체크
function console_sesscheck() {
    var result;
    $.ajax({
        url:"/sesscheck",
        type: "POST",
        dataType: "json",
        async:false,
        success: function(json) {
            var cd = json.cd ;
            var se = json.se ;
            var srr = json.srr ;
            if( se ) {
                var u = encodeURIComponent(window.location);
                se = encodeURIComponent(se);

                if(window.name == "ucloud_console") {    // 콘솔창인 경우 랜딩페이지로 감
                    window.location.href    = WebROOT + "console/landing?e="+se+"&u="+u;
                } else {
                    window.location.href    = WebROOT + "portal/portal.loginpagee.html?e="+se+"&u="+u;
                }
                result = "STOP";
                $.holdReady(true);
            }
            else if( cd && cd == "y" ) {
                var u = encodeURIComponent(window.location);
                //131022 기호진 세션종료후 접근시 안내메시지팝업

                if(window.name == "ucloud_console") {    // 콘솔창인 경우 랜딩페이지로 감
                    showCommonLangErrorMsg("txt_lang_logout", "txt_lang_logout_detail", function(){window.location.href    = WebROOT + "console/landing?u="+u+"&srr="+srr;});
                } else {
                    showCommonLangErrorMsg("txt_lang_logout", "txt_lang_logout_detail", function(){window.location.href    = WebROOT + "portal/portal.loginpage.html?u="+u+"&srr="+srr;});
                }

                result = "STOP";
                $.holdReady(true);
            }
        }            
    });
    return result;
}

//logging
function savelogging(menu_id, menu_nm){

    if(typeof menu_id == "undefined"){ 
        return;
    }
    //20160616 클릭시 로그 insert 제외 항목 추가
    if(menu_id =="18" || menu_id =="99" || menu_id =="189" || menu_id =="205" || menu_id =="206"){
        return;
    }

    // menuid
    var menuid=menu_id;

    // memsq
    var memsq = null;

    memsq = $.cookie("memsq");
    
    if ($.cookie("memsq") == null) {
        memsq = "NOT_LOGIN";
    }
    
    // 고객 browser 정보(IE, chrome, firefox, opera, safari에 준함 / 기타 브라우저 other browser 처리)
    var browserName = null;
    var browserVersion = null;
    var browserInfo = "";
    var agent1 = "";
    var agent2 = "";
    var splitAgent = [];
    var userAgent = navigator.userAgent;

    if(userAgent.indexOf("MSIE") > -1){
        agent1 = userAgent.substring(userAgent.indexOf("MSIE"));
        agent2 = agent1.substring(0, agent1.indexOf(";")); 
        splitAgent = agent2.split(" ");

        browserName = "InternetExplorer";
        browserVersion = splitAgent[1];
    }
    else if(userAgent.indexOf("Firefox") > -1){
        agent1 = userAgent.substring(userAgent.indexOf("Firefox")); 
        splitAgent = agent1.split("/");

        browserName = splitAgent[0];
        browserVersion = splitAgent[1];
    }
    else if(userAgent.indexOf("Opera") > -1){
        agent1 = userAgent.substring(userAgent.indexOf("Opera"));
        agent2 = agent1.substring(0, agent1.indexOf(" ")); 
        splitAgent = agent2.split("/");

        browserName = splitAgent[0];
        browserVersion = splitAgent[1];
    }
    else if(userAgent.indexOf("Safari") > -1){
        if(userAgent.indexOf("Chrome") > -1){
            agent1 = userAgent.substring(userAgent.indexOf("Chrome"));
            agent2 = agent1.substring(0, agent1.indexOf(" ")); 
            splitAgent = agent2.split("/");

            browserName = splitAgent[0];
            browserVersion = splitAgent[1];
        }
        else if(userAgent.indexOf("Version") > -1){
            agent1 = userAgent.substring(userAgent.indexOf("Version"));
            agent2 = agent1.substring(0, agent1.indexOf(" ")); 
            splitAgent = agent2.split("/");

            browserName = "Safari";
            browserVersion = splitAgent[1];
        }

    }
    else{

        browserName = "Other Browser";
        browserVersion = "Other Version";
    }

    browserInfo = browserName + " " + browserVersion;


    // title
    var title = menu_nm;


    var params  = {
            command : "savelogging"
                , menuid : menuid
                , memsq : memsq
                , browserInfo : browserInfo
                , title : title
    };
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data : params ,
        dataType: "json",
        async : false
    });
}

//javascript parameter get value
function getQueryString(name) {
    var hu = window.location.search.substring(1);

    var gy = hu.split("&");
    for (var i=0;i<gy.length;i++) {
        var ft = gy[i].split("=");
        if (ft[0] == name) {
            return ft[1];
        }
    }
    return "";
}

//20101213  기수추가 i6.0체크
function ie6_guide_con(){
     var agt=navigator.userAgent.toLowerCase();
     if(agt.indexOf("msie 6") != -1){  //일단 msie 6 호환성 버전이라는 소리임, 7.0, 8.0도 포함
       agt = agt.substr(50); //앞단에 있는 실제 버전 주소를 지워버림
       if(agt.indexOf("msie") == -1){  //이건 진짜 6.0임. 나머지는 다른버전임
        return true;
       };
     };
     return false;
};

//사용자의 zone 정보
function getUserZones(memsq) {
    /*
    var result;
    var data = "command=getZoneInfo";
    if(memsq != null && memsq != ""){
        data += "&memsq="+memsq;
    }else{
        data += "&memsq="+$.cookie("memsq");
    }
    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: data,
        dataType: "json",
        async:false,
        success: function(json) {
            result = json.data;
        }        
    });
    //2021.09.28 captainPark d 플랫폼에서는 사용하지 않는 데이터이지만 사용하는 곳이 많아서 사이드이펙트 방지를 위해 임시로 샘플데이터 생성하여 리턴
    var result = new Array();
    var data = {
            default_yn: "Y"
        ,    nas_type: "1"
        ,    reg_dttm: "2014-06-12 22:34:22.0"
        ,    zone_nm: "KOR-Central A"
        ,    zone_sq: "eceb5d65-6571-4696-875f-5a17949f3317"
    };
    result.push(data);
    return result;
    */
    return osZoneList;
}

//오늘날짜설정 가져오기
function getToday(){
    var now = "";
    var giYear = "";
    var giMonth = "";
    var giDay = "";

    $.ajax({
        url: "/bizMecaInfo",
        type: "POST",
        data: "command=serverTime&dtFormat=yyyyMMdd",
        dataType: "json",
        async : false,
        success: function(json) {
            now = json.time;
            giYear = now.substring(0,4);
            giMonth = now.substring(4,6);
            giDay = now.substring(6,8);
    
        },            
        error: function(XMLHttpResponse) {
            showCommonNoLangErrorMsg("통신에러","서버와의 연결에 실패했습니다.");
            return;
        }                            
    });
    return giYear + "년 " + giMonth + "월 " + giDay + "일 ";
}

//숫자에 콤마(,) 붙이기
function commify(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환

    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}

//입력값검사
function hanCheck2(Ev, type){ 
    
    var checkPattern;
    
    switch (type){
        case 1 : //알파벳 숫자, 하이픈(-), 언더바(_), 점(.) 만 가능//알파벳 만 가능
            checkPattern = /[^\.a-zA-Z0-9\-\_]/;
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
    }
    
    if(Ev.value.match(checkPattern)) {
        Ev.value = Ev.value.replace(checkPattern,"");
    }
}

//공백제거
function trim(val) {
    if(val == null) {
        return null;
    }
    
    return val.replace(/^\s*/, "").replace(/\s*$/, "");
}

//글자길이 체크
function strLenCnt(obj){
    return obj.length;    
}

/***************************************
 * 팝업 닫기 포커스 처리 START - 최웅 (2013.04.15)
 ***************************************/
var fObj = null;
function setFocusObj(obj){
    fObj = obj;
}

function setFocusOfClose(focusName){
    if(focusName==null || focusName == ""){
        if(fObj!=null){
            var tagName = fObj.tagName.toUpperCase();
            if(tagName!="SPAN" && tagName!="DIV"){
                $(fObj).focus();
            }else{
                $(fObj).find('a:visible').focus();
            }
        }
    }else{
        $("#"+focusName).find('a:visible').focus();
    }
    fObj = null;
}
/***************************************
 * 팝업 포커스 처리 END
 ***************************************/

function Cut_Str( sTargetStr , nMaxLen ) {
    var sTmpStr, sTmpChar, sDestStr;
    var nOriginLen = 0;
    var nStrLength = 0;
    var sDestStr = "";
    sTmpStr = new String(sTargetStr);
    nOriginLen = sTmpStr.length;

    for ( var i=0 ; i < nOriginLen ; i++ ) {
        sTmpChar = sTmpStr.charAt(i);

        if (escape(sTmpChar).length > 4) {
            nStrLength = nStrLength + 2;
        } else if (sTmpChar!='\r') {
            nStrLength ++;
        }

        if (nStrLength <= nMaxLen) {
            sDestStr = sDestStr + sTmpChar;
        } else {
            break;
        }
    }
    return sDestStr;
}

//job id check
function setTimerSessionJobId() {
        
    if( typeof $("body").everyTime != "function" ) {
        return;
    }
    
    var timerKey        = "createServerJob";
    
    if(!sessionStorage.getItem("recentResource") && !sessionStorage.getItem("scale_change") 
            && !sessionStorage.getItem("scale_change_ai") && !sessionStorage.getItem("restoreVm")){
        return;
    }
    
    var timerSec = 10000;
    //2022.01.04 captainPark aiAccelerator 서버 생성일 경우에는 20초마다 서버목록을 재조회한다.
    if ( sessionStorage.getItem("DEPTH1") == "aiAccelerator" )  {
        timerSec = 20000;
    }
    $("body").everyTime(
        timerSec,
        timerKey,
        function() {
            $.ajax({
                url: "/osSvcSvrPrc"
                , type: "POST"
                , data: {
                    command : "listServerOS",
                    multi_stack_id : sessionStorage.getItem("svrstackid"),
                    group_mem_sq : $.cookie("groupmemsq")
                }
                , dataType: "json"
                , success: function(json) {
                    
                    var items = json.data.servers;
                    
                    for(var i=0; i< items.length; i++) {
                        if(sessionStorage.getItem("recentResource")){
                            if(items[i].name == sessionStorage.getItem("recentResource")){
                                if(items[i].status != "BULID"){
                                    $("body").stopTime(timerKey);
                                    setTimeout(call_vmList, 5000);
                                    var success_msg =  sessionStorage.getItem("recentResource") + "서버 생성 성공";
                                    process_toast_popup("서버 생성", success_msg, true);
                                    add_noti_message("/console/d/osserver", success_msg);
                                    sessionStorage.removeItem('recentResource');
                                    sessionStorage.removeItem('svrstackid');
                                    return;
                                }
                            }else {
                                continue;
                            }
                        }else if(sessionStorage.getItem("scale_change")){
                            if(items[i].name == sessionStorage.getItem("scale_change")){
                                if(items[i].status != "RESIZE" && items[i].status != "VERIFY_RESIZE"){
                                    $("body").stopTime(timerKey);
                                    setTimeout(call_vmList, 3000);
                                    var success_msg =  sessionStorage.getItem("scale_change") + "사양변경 성공";
                                    //process_toast_popup("SERVER", success_msg, true);
                                    add_noti_message("/console/d/osserver", success_msg);
                                    sessionStorage.removeItem('scale_change');
                                    sessionStorage.removeItem('svrstackid');
                                    return;
                                }
                            }else {
                                continue;
                            }
                        }else if(sessionStorage.getItem("scale_change_ai")){
                            if(items[i].name == sessionStorage.getItem("scale_change_ai")){
                                if(items[i].status != "RESIZE" && items[i].status != "VERIFY_RESIZE"){
                                    $("body").stopTime(timerKey);
                                    setTimeout(call_vmList, 3000);
                                    var success_msg =  sessionStorage.getItem("scale_change_ai") + " AI가속기 사양변경 성공";
                                    //process_toast_popup("SERVER", success_msg, true);
                                    add_noti_message("/console/d/osserver", success_msg);
                                    sessionStorage.removeItem('scale_change_ai');
                                    sessionStorage.removeItem('svrstackid');
                                    return;
                                }
                            }else {
                                continue;
                            }
                        }else if(sessionStorage.getItem("restoreVm")){
                            if(items[i].name == sessionStorage.getItem("restoreVm")){
                                if(items[i].name == sessionStorage.getItem("restoreVm")){
                                    $("body").stopTime(timerKey);
                                    setTimeout(call_vmList, 3000);
                                    
                                    
                                    var success_msg =  sessionStorage.getItem("restoreVm") + "OS 초기화 성공";
                                    process_toast_popup("OS 초기화", success_msg, true);
                                    add_noti_message("/console/d/osserver", success_msg);
                                    sessionStorage.removeItem('restoreVm');
                                    return;
                                }
                            }else {
                                continue;
                            }
                        }
                    }
                    
                }
                , error: function(XMLHttpResponse) {                           
                    $("body").stopTime(timerKey);
                }                        
            });
        },
        0
    );
}

//숫자 콤마(,)붙이기
function setNumberComma( num ) {
    
    var num1    = "";
    var num2    = "";
    var sReturn    = "";
    
    if (typeof num == "number") {
        num    = "" + num;
    }
    
    if (num.indexOf(".") == -1) {
        num1    = num;
    }
    else {
        num1    = num.split(".")[0];
        num2    = num.split(".")[1];
    }
    
    var len    = num1.length;
    var cnt    = 0;
    var c    = "";
    
    for (var i = len-1; i >= 0; i--) {
        c    = num1.charAt(i);
        
        if (c >= '0' && c <= '9') {
            
            if ( cnt > 0 && cnt % 3 == 0) {
                sReturn    = "," + sReturn;
            }
            
            sReturn    = c + sReturn ;
            cnt++;
        }
        else {
            return num;
        }
    }
    if (num2 != "") {
        sReturn += "." + num2;
    }
    
    return sReturn;
}

//테이블 엑셀로 저장
function excelsave(table, file_name){
    var frm;
    frm = $('#frmExcel'); 
    frm.attr("action","/console/console.excel.jsp");
    $("#ex_filename").val(file_name);
    
    var val     = "";
    var th        = "";
    $("#" + table).find('tr').each (function() {
        $(this).find('th').each (function() {
            if($(this).css("display") != "none"&& !$(this).hasClass("noExcel")){
                th += "<td>";
                th += $(this).text();
                th += "</td>";
            }
        });
    }); 
    
    if(th != ""){    //th가 있을 경우
        val = "<tr>" + th + "</tr>";
    }

    $("#" + table).find('tr').each (function() {
        var td = "";
        if($(this).css('display') != 'none'){
            $(this).find('td').each (function() {
                if($(this).css("display") != "none" && !$(this).hasClass("noExcel")){
                    
                    if($(this).html() != null && $(this).html().indexOf('■excelHtml■') > -1 ){
                        td += "<td>";
                        td += $(this).html();
                        td += "</td>";
                    }else{
                        td += "<td>";
                        td += $(this).text();
                        td += "</td>";
                    }

                }
            }); 
        }        
        if(td != ""){    //td가 있을경우
            val += "<tr>" + td + "</tr>";
        }
    }); 
    
    $("#ex_table").val(val);
    frm.submit();
}

// 20230704 멀티팝업 엑셀저장 추가
function multiExcelsave(table, file_name){
    var frm;
    frm = $('#frmExcel');
    frm.attr("action", "/console/console.excel.jsp");
    $("#ex_filename").val(file_name);

    var val = "";

    $("#" + table).find('table').each(function(){

        let val1 = "";
        if($(this).attr('id').indexOf('Excel') > -1){  //신청정보 제외한 테이블만 엑셀에 나타내기 위함

            let th = "";
            let pTitle = $(this).attr('id').replace("Excel", "") + "Title";

            //테이블명 출력
            // val1 변수 선언, val에 val1저장하는 형태
            val1 = "<tr><td>" + $("#"+pTitle).text()+ "</td></tr>";

            /*기존과 동일*/
            $(this).find('th').each(function(){
                if($(this).css("display")!="none"&&!$(this).hasClass("noExcel")){
                    th += "<td>";
                    th += $(this).text();
                    th += "</td>";
                }
            });

            if(th !=""){
                val1 += "<tr>" + th + "</tr>";
            }

            $(this).find('tr').each (function() {
                var td = "";
                if($(this).css('display') !='none'){
                    $(this).find("td").each (function() {
                        if($(this).css("display")!= "none" && !$(this).hasClass("noExcel")){

                            if($(this).html()!= null && $(this).html().indexOf('■excelHtml■') > -1) {
                                td += "<td>";
                                td += $(this).html();
                                td += "</td>";
                            }else {
                                td += "<td>";
                                td += $(this).text();
                                td += "</td>";
                            }
                        }
                    });
                }

                if(td != ""){    //td가 있을경우
                    val1 += "<tr>" + td + "</tr>";
                }
            });

            val += val1;

            if(val != ""){
                val += "<tr></tr>";
            }
        }
    });

    $("#ex_table").val(val);
    frm.submit();
}

/**********************************************************************
 * 생성 후 바로 포트포워딩 설정 할 수 있도록 프로세스 수정 START - 최웅(2013.10.16)
 **********************************************************************/
function go_network(group_mem_sq,group_mem_nm,selected_vm, selected_zoneid){
//    var menu_id = 234;
//    var menu_nm = "포트 포워딩 설정 버튼";
//    savelogging(menu_id, menu_nm);
//    var url = "/console/console.iaas.network.html?group_mem_sq="+group_mem_sq+"&group_mem_nm="+encodeURIComponent(group_mem_nm)+"&selected_vm="+selected_vm+"&selected_zone="+selected_zoneid;
    var url = "/console/networklist?group_mem_sq=&group_mem_nm=&selected_vm="+selected_vm+"&selected_zone="+selected_zoneid;
    window.location.href=url;
}
/**********************************************************************
 * 생성 후 바로 포트포워딩 설정 할 수 있도록 프로세스 수정 END
 **********************************************************************/

function get_dedicate_id(svcId) {    
    $.ajax({
        url: "/waf/controller/getDedicateId.do",
        async:false,
        type: "POST",
        data: "memSq=" + svcId,
        dataType: "json",
        success: function(json) {
            mem_dedicate_id = json.dediid;
            
            if(!mem_dedicate_id) {
                mem_dedicate_id = "";
            }
        },            
        error: function(XMLHttpResponse) {    
            alert("error get_dedicate_id");
        }                            
    });
}

function validateString(label, field, errMsgField, isOptional) {  
    var isValid = true;
    var errMsg = "";
    var value = field.val();     
    if (isOptional!=true && (value == null || value.length == 0)) {     //required field   
        errMsg = label + " 을(를) 입력하셔야 합니다. ";       
        isValid = false;        
    }     
    else if (value!=null && value.length >= 255) {        
        errMsg = label + " 은(는) 최대 255자 이상 입력하실수 없습니다.";       
        isValid = false;        
    }     
    else if(isOptional!=true ) {
        if((value != null || value.length > 0))
        {
            if(value.indexOf('"')!=-1)
            {
                errMsg = "쌍따옴표는 사용할수 없습니다.";
                isValid = false;
            }
        }
    }
    showError(isValid, field, errMsgField, errMsg);
    return isValid;
}

function validateEmail(label, field, errMsgField, isOptional) {  
    var isValid = true;
    var errMsg = "";
    var value = field.val();     
    
    var regExp= /[0-9a-zA-Z][_0-9a-zA-Z]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,}$/;
//    var regExp= /[0-9a-zA-Z][_0-9a-zA-Z]*@[_0-9a-zA-Z]+(\.[_0-9a-zA-Z-]+){1,2}$/;
        
    if(!value.match(regExp)){
        errMsg = "옳지 않은 이메일 형식입니다.";
        isValid = false;
    }
        
    if(value.indexOf('+') != -1) {
        errMsg = "이메일은 +가 포함될 수 없습니다.";
        isValid = false;
    }
    
    showError(isValid, field, errMsgField, errMsg);    
    return isValid;
}
//validateEmail_Login functions - EPC 로그인 이메일형식체크 로그인시 오류 발생하여 수정
function validateEmail_Login(label, field, errMsgField, isOptional) {  
    var isValid = true;
    var errMsg = "";
    var value = field.val();     
    
    var regExp= /[0-9a-zA-Z][_0-9a-zA-Z]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,}$/;
//    var regExp= /[0-9a-zA-Z][_0-9a-zA-Z]*@[_0-9a-zA-Z]+(\.[_0-9a-zA-Z-]+){1,2}$/;
        
    if(!value.match(regExp)){
        errMsg = "옳지 않은 이메일 형식입니다.";
        isValid = false;
    }
        
    showError(isValid, field, errMsgField, errMsg);    
    return isValid;
}

function showError(isValid, field, errMsgField, errMsg) {    
    if(isValid) {
        errMsgField.text("").hide();
        field.addClass("text").removeClass("error_text");
    }
    else {
        errMsgField.text(errMsg).show();
        field.removeClass("text").addClass("error_text");    
    }
}

function get_domain_name() {
    var param = {command : "getDomainName"/*, memid : mem_id 2018_memid_세션처리_kjs_0718*/};
    var rtrn_val = "";
    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: param,
        dataType: "json",
        async : false,
        success: function(json) {
            if( json.data) {
                rtrn_val = json.data.domain_name;
            }
        }            
    });
    
    return rtrn_val;
}

//local storage 값으로 리스트 노출 

//체크박스 모두 체크
function chkAll(obj,chkname){
  if($(obj).parent("label").is( ".on" )){   
    $("input[name='"+chkname+"']").prop("checked", false);
    $("input[name='"+chkname+"']").parent("label.chkwrap").removeClass("on");   
  }else{
    $("input[name='"+chkname+"']").prop("checked", true);
    $("input[name='"+chkname+"']").parent("label.chkwrap").removeClass("on").addClass("on");;
  }
}

function commonSanitizeXSS(val) {
    if(val == null) {
        return val;
    }
    val = val.replace(/</g, "&lt;");  //replace < whose unicode is \u003c    
    val = val.replace(/>/g, "&gt;");  //replace > whose unicode is \u003e 
    return val;
}
