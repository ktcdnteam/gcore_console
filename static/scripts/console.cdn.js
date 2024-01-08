var WebROOT        = "/";
var roleCSApiUrl = "/gwapi";
var g_account = null;//$.cookie("account");//"guitaru79@naver.com";
var g_domainid = null;//$.cookie("domainid");//4;
var g_timezoneoffset = null;//$.cookie("timezoneoffset");
var keycode_Enter       = 13;

var pattern = /[^(a-zA-Z0-9)]/;

$(document).ready(function() {
    $("#cs-public").hide();
    $("#nas").hide();
    $("#enstratus").hide();
    $("#cdn").hide();
    $("#DB").hide();
    $("#storage").hide();
    $("#ps").hide();
    $("#bs").hide();
    $("#vpx").hide();
    $("#vdi").hide();
    $("#sap").hide();
    $("#hpc").hide();

//    //set_BaseEvent();

//    //serviceList();

});

//청약정보 리스트
function serviceList() {
    //var memid        = $.cookie("memid");
    var params        = { command : "svcList" };
    $.ajax({
        url: WebROOT + "contractServlet",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            if (data.response.result == "0") {
                var list    = data.response.data;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].ordSvcStCd == "10") {
                        var svc_cd = list[i].serviceCD;

                        if (svc_cd == "S1820") {
                            $("#cs-public").show();
                            $("#vpx").show(); // server 청약자 SIS 기본 제공
                        } else if (svc_cd == "S2248") {
                            $("#nas").show();
                        } else if (svc_cd == "S1961") {
                            $("#enstratus").show();
                        } else if (svc_cd == "S1850") {
                            $("#cdn").show();
                        } else if (svc_cd == "S1823") {
                            $("#DB").show();
                        } else if (svc_cd == "S1853") {
                            $("#storage").show();
                        } else if (svc_cd == "S1824") {
                            $("#ps").show();
                        } else if (svc_cd == "S1851") {
                            $("#bs").show();
                        } else if (svc_cd == "S1879") {
                            $("#vpx").show();
                        } else if (svc_cd == "S1962") {
                            $("#vpx").show();
                        }else if (svc_cd == "S1963") {
                            $("#vpx").show();
                        }else if (svc_cd == "S2248") {
                            $("#vpx").show();
                        }else if (svc_cd == "S1960") {
                            $("#vdi").show();
                        }else if (svc_cd == "S2238") {
                            $("#vpx").show();
                        }else if (svc_cd == "S2247") {
                            $("#sap").show();
                        }else if (svc_cd == "S2249") {
                            $("#hpc").show();
                        }
                    }
                }
            }
            gnb('ucloud CDN', '서비스 리스트');
        }
    });
}
function set_BaseEvent()
{

    $("#button_lnb_list").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/cdn/console.cdn.list.html";
        return false;});
    $("#button_lnb_statistics").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/cdn/console.cdn.statistics.html";
        return false;});
    $("#button_lnb_streming_statistics").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/cdn/console.cdn.statistics.html";
        return false;});
    $("#button_top_service_intro").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/portal/ktcloudportal.epc.ucintro.cs.html";
        return false;});
    $("#button_top_service_info").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/portal/ktcloudportal.epc.productintro.cspublic.html";
        return false;});
    $("#button_top_service_request").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/portal/ktcloudportal.epc.productintro.cspublic.html";
        return false;});
    $("#button_top_contact").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/portal/portal.faq.html";
        return false;});
    $("#button_top_security").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/portal/ktcloudportal.epc.security.html";
        return false; });
    $("#button_top_developer_center").unbind("click").bind("click", function(e) {
        e.preventDefault;
        checkLoginHeaderConsole();
        return false;});
    $("#button_top_myinfo").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/portal/portal.myinfo.base.html";
        return false;});
    $("#button_top_faq").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/portal/portal.faq.html";
        return false;});
    $("#button_top_login").unbind("click").bind("click" , function(e){
        e.preventDefault;
        clear_cookie();
        return false;});
    $("#button_top_iaas").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/console/console.iaas.statistics.html";
        return false;});
    $("#button_top_nas").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/nassvc/console.nas.list.html";
        return false; });
    $("#button_top_enstratus").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/console/console.iaas.enstratus.html";
        return false; });
    $("#button_top_dbaas").unbind("click").bind("click" , function(e){
        e.preventDefault;
        window.location.href="/dbservice/console.rdbaas.home.html";
        return false;});
    $("#button_top_ss").unbind("click").bind("click" , function(e){
        window.location.href="/storage/console.ss.list.html";
        });
    $("#button_top_ps").unbind("click").bind("click" , function(e){
        window.location.href="/ps/console.ps.manage.html";
        });
    $("#button_top_vpx").unbind("click").bind("click" , function(e) {
        window.location.href="/vpx/console.vpx.list.html";
        });
    $("#button_top_bs").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/bs/console.bs.list.html";
        return false; });
    $("#button_top_vdi").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/vdi/console.vdi.home.html";
        return false; });
    $("#button_top_sap").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/sap/console.sap.cloudserver.html";
        return false; });

    $("#button_top_hpc").unbind("click").bind("click" , function(e) {
        e.preventDefault;
        window.location.href="/hpc/console.hpc.csserver.html";
        return false; });

    $("#button_lnb_home").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/console/console.iaas.statistics.html";
        return false;});
    $("#button_lnb_cs").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/console/console.iaas.csserver.html";
        return false;});
    $("#button_lnb_storage").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/console/console.iaas.csvolume.html";
        return false;});
    $("#button_lnb_volume").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/console/console.iaas.csvolume.html";
        return false;});
    $("#button_lnb_snapshot").unbind("click").bind("click" , function(e){e.preventDefault;
        //임시 막는다
    showdlgiass_Msg("알림","서비스 준비중입니다.","");
        //window.location.href="/console/console.iaas.cssnapshot.html";
        return false;});
    $("#button_lnb_network").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/console/console.iaas.network.html";
        return false;});
    $("#button_lnb_event").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/console/console.iaas.event.html"
        return false;});
    $("#down_menu").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/portal/portal.file_tap1.html"
        return false;});

    //하단영역 추가
    $("#btn_CS_center").unbind("click").bind("click" , function(e){e.preventDefault;
    window.location.href="/portal/portal.faq.html";
    return false;});

    $("#btn_agreement").unbind("click").bind("click" , function(e){e.preventDefault;
    window.location.href="/portal/ktcloudportal.epc.agreement.html";
    return false;});

    $("#btn_policy").unbind("click").bind("click" , function(e){e.preventDefault;
    window.location.href="/portal/ktcloudportal.epc.policy.html";
    return false;});

    $("#btn_lnb_csCenter").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/portal/qnaWrite.do";
    return false;});

    $("#btn_home").unbind("click").bind("click" , function(e){e.preventDefault;
        window.location.href="/";
    return false;});

    //계산기
    $("#btn_lnb_calculator").unbind("click").bind("click" , function(e){e.preventDefault;
    window.open('/portal/p_pay_calcul.html','calcul','toolbar=no,statusbar=no,location=no,scrollbars=no,resizable=yes,width=1024,height=750');
    return false;});
}

function clear_cookie(){
    logoutldap();
}

//function loginCloudStock_console(str1, str2, url) {
//    var array1 = [];
//    var username = encodeURIComponent(str1);
//    array1.push("&username="+username);
//
//
//    /*var password = $.md5(encodeURIComponent(str2));
//    array1.push("&password="+password);*/
//    str2 = "EPC_USER";
//    //str2 = "ROOT";
//
//    if (str2 == "ROOT") array1.push("&domain="+encodeURIComponent("/"));
//    else  array1.push("&domain="+encodeURIComponent(str2));
//
//    $.ajax({
//        url: roleCSApiUrl,
//        data: "command=login"+array1.join("")+"&response=json",
//        dataType: "json",
//        success: function(json) {
//            var mySession      = $.cookie('JSESSIONID');
//            g_account        = json.loginresponse.account;
//            g_domainid       = json.loginresponse.domainid;
//            var timezone       = json.loginresponse.timezone;
//            g_timezoneoffset = json.loginresponse.timezoneoffset;
//
//            var networkType= null;
//            var hypervisorType= null;
//            var directattachnetworkgroupsenabled= null;
//            var directAttachedUntaggedEnabled= null;
//
//            if (json.loginresponse.networktype != null)
//                networkType = json.loginresponse.networktype;
//
//            if (json.loginresponse.hypervisortype != null)
//                hypervisorType = json.loginresponse.hypervisortype;
//
//            if (json.loginresponse.directattachnetworkgroupsenabled != null)
//                directattachnetworkgroupsenabled = json.loginresponse.directattachnetworkgroupsenabled;
//
//            if (json.loginresponse.directattacheduntaggedenabled != null)
//                directAttachedUntaggedEnabled = json.loginresponse.directattacheduntaggedenabled;
//
//            $.cookie('networktype', networkType ,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('hypervisortype', hypervisorType,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('account', g_account,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('domainid', g_domainid,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('timezoneoffset', g_timezoneoffset,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('timezone', timezone,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('directattachnetworkgroupsenabled', directattachnetworkgroupsenabled,{ expires: 0, path : WebROOT, secure : true});
//            $.cookie('directattacheduntaggedenabled', directAttachedUntaggedEnabled,{ expires: 0, path : WebROOT, secure : true});
//
//            //showTabCloudManagerHome();
//            window.location.href=url;
//        },
//        error: function(XMLHttpResponse) {
//            //showdlgiass_Msg("클라우드cs 인증 실패","클라우드cs 인증중에 에러가 발생하였습니다.", "잠시 후 다시 시도해 주시기바랍니다.");
//            //에러처리
//        }
//    });
//
//}

function showdlgiass_Msg(sTitle, sText1, sText2) {
    try {
        var strDlg = "";
        var dlgForm = $("#dialog_Msg");

        /*activateDialog($("#dialog_Instancesservice_Msg").dialog({
            open: function(event, ui)
            {$(this).css("padding","0").parent().css("padding","0")},
            width:477,
            autoOpen: false,
            modal: true,
            resizable:false,
            zIndex: 2000
        }));*/

        $("#dialog_Msg").dialog({
            width: 477,
            autoOpen: false,
            modal: true,
            resizable:false,
            draggable:false,
            zIndex: 2000
        });
        $("#dialog_Msg").siblings().remove();
        $("#dialog_Msg").css("padding" , "0");
        $("#dialog_Msg").parent().css("padding" , "0");

        dlgForm.dialog("open");

        dlgForm.find("#dlg_Msg_title").text(sTitle);
        dlgForm.find("#dlg_text1").text(sText1);
        dlgForm.find("#dlg_text2").text(sText2);


        dlgForm.find("#btn_Msg_top_close").unbind("click").bind("click", function(e) {
            e.preventDefault();
            dlgForm.dialog("close");
            return false;
        });

        dlgForm.find("#btn_MsgOK").unbind("click").bind("click", function(e) {
            e.preventDefault();
            dlgForm.dialog("close");
            return false;
        });
    } catch (err) {

    }

}

function getQueryString(name) {
    try
    {
        var hu = window.location.search.substring(1);

        var gy = hu.split("&");
        for (var i=0;i<gy.length;i++) {
            var ft = gy[i].split("=");
            if (ft[0] == name) {
                return ft[1];
            }
        }
    }
    catch (e)
    {
    }

    return "";
}

function commify(n) {
      var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
      n += '';                          // 숫자를 문자열로 변환

      while (reg.test(n))
        n = n.replace(reg, '$1' + ',' + '$2');

      return n;
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













//20110127 추가 pjk
function showCCdlgError_Msg(sTitle, sText1, sText2, sText3) {
    try {
        var strDlg = "";
        var dlgForm = $("#dialog_Instancesservice_Msg");


        dlgForm.dialog("open");

        dlgForm.find("#dlg_Instancesservice_Msg_title").text(sTitle);
        dlgForm.find("#dlg_Instancesservice_text1").text(sText1);
        if( sText3 ) {
            dlgForm.find("#dlg_Instancesservice_text2").html(sText3);
        } else {
            dlgForm.find("#dlg_Instancesservice_text2").text(sText2);
        }


        dlgForm.find("#btn_Instancesservice_Msg_top_close").unbind("click").bind("click", function(e) {
            e.preventDefault();
            dlgForm.dialog("close");
            return false;
        });

        dlgForm.find("#btn_Instances_MsgOK").unbind("click").bind("click", function(e) {
            e.preventDefault();
            dlgForm.dialog("close");
            return false;
        });
    } catch (err) {

    }
}

//공통으로 빼야할 함수들

function getVmName(p_vmName, p_vmDisplayname) {
    if(p_vmDisplayname == null)
        return sanitizeXSS(p_vmName);
    var vmName = null;
    vmName = sanitizeXSS(p_vmDisplayname);
    return vmName;
}

function sanitizeXSS(val) {
    if(val == null)
        return val;
    val = val.replace(/</g, "&lt;");  //replace < whose unicode is \u003c
    val = val.replace(/>/g, "&gt;");  //replace > whose unicode is \u003e
    return val;
}

function convertBytes(bytes) {
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    } else if (bytes < 1024 * 1024 * 1024 * 1024) {
        return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
    } else {
        return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
    }
}

function convertMBytes(bytes) {
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " GB";
    } else {
        return (bytes / 1024 / 1024).toFixed(2) + " TB";
    }
}



function convertMHz(hz) {
    if (hz < 1000 * 1000) {
        return (hz / 1000).toFixed(2) + " GHz";
    } else {
        return (hz / 1000 / 1000).toFixed(2) + " THz";
    }
}

function showDateField(dateValue) {
    if (dateValue != null && dateValue.length > 0) {
        var disconnected = new Date();
        disconnected.setISO8601(dateValue);
        var showDate;
        if(g_timezoneoffset != null)
            showDate = disconnected.getTimePlusTimezoneOffset(g_timezoneoffset);
        else
            showDate = disconnected.format("m/d/Y H:i:s");

        return showDate;
    }

    return "";
}

function convertComma(price){

    if(price < 1000){
        return price;
    }else if(price < 1000000){
        var newprice = (price / 1000) + ",000";
        return newprice;
    }else {
        var newprice = (price / 1000000) + ",000,000";
        return newprice;
    }

}

// 영문, 숫자, 점(.), 콤마(,), 하이픈(-) 만 사용 가능
function CheckChar(str) {
    strarr = new Array(str.length);
    var flag = true;
    for (i=0; i<str.length; i++) {
        strarr[i] = str.charAt(i);
        if ( !( (strarr[i]>='a')&&(strarr[i]<='z')
                ||(strarr[i]>='A')&&(strarr[i]<='Z')
                ||(strarr[i]>='0')&&(strarr[i]<='9')
                ||(strarr[i]=='.')||(strarr[i]==',')||(strarr[i]=='-') ) ) {
            flag = false;
        }
    }

    if (flag) {
        return true;
    } else {
        return false;
    }
}