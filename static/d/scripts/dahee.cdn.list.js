
var svcNm_chk = false;
var svcDm_chk = false;
var org_svcNm_chk = false; 
var ori_hostNm_chk = false;
var referer_chk = false;
var ip_chk = false;
var geo_chk = false;
var certnmCheckYN = false;
var cors_chk = false;
var caching_chk = false;
var modifyYn = false;   // 수정화면 여부

var firstlistcheck         = false;
var org_protocol         = null;
var status                = {
        READY        : "0111",    //준비중
        START        : "0300",    //시작
        STOP        : "0400",    //정지
        QUIT        : "0500"    //해지
};

var org_sel         = "";                //원본서버 타입(create)
var update_org_sel     = "";                //원본서버 타입(update)
var storageUrl        = "";
var orgUri            = "";                // Storage 원본 URL
var urlOkNm = "";
var purge_nm = "";

var zcopy3_prefix = "3copy - ";
var zcopy2_prefix = "2copy - ";

var objLang = null;
var sortting = false;

var http_port_chk = true;
var selectedRow = "";
var sort_items = [];
/****************************************************
 * ONEVIEW 처리 START - 최웅(2013.05.23)
 ****************************************************/
var oneview_id =  getQueryString("oneview_id");
var oneview = false;
if(oneview_id!=""){
    oneview = true;
}
/****************************************************
 * ONEVIEW 처리 END
 ****************************************************/
var group_mem_sq = "";
var group_mem_nm = "";
var group_mem_id = "";

var origin_path_seq = 0;

//2021.08.23 코드아이 관련 수정
var lastSelectedServerName = "";
var lastSelectedServerName_update = "";
var needSsSelect = false;

// cdn3.0 고도화
let country_list = [];

let add_origin_request_headers = {};
let add_client_response_headers = {};

let applyCertiData = null;


$(document).ready(advcdnListReady);

function advcdnListReady(){
    if (url == "CDN_LIST"){
        set_CdnEvent();
        call_resourceList();
    }else if (url == "ORIGIN_GROUP"){
        set_OriginEvent();
        call_originList();
    }else if(url == "PURGE"){
        call_cdnPurge();
        console.log(url)
    }
    // ssList();
    selectBoxChang();
    setEventCheckbox();
}

function setPageCDNList(ok){
    if (ok){
        // cdn list
        $("#cdnListContent").show();
        $("#cdnModifyContent").hide();
    }else{
        // cdn 수정
        $("#cdnListContent").hide();
        $("#cdnModifyContent").show();
    }
}
function setEventCheckbox(){
    $("input:checkbox.chkbox").bind("change", function(){
        
        var chkbox = $(this);
        var label = chkbox.parent("label.m_chkwrap, label.chkwrap");
        
        if( chkbox.is(":checked") ){
            label.removeClass("on").addClass("on");
        }else{
            label.removeClass("on");
        }
        
    });
    
}
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

function ssList(){
    // if( !needSsSelect){     
    //     showLoadingBox();    // 로딩중 이미지
    // }

    $("#ssServer option").remove();
    var SSList    = $("#ssServer");
    
    var params    = {
            command        :     "getaccount",
            zcopy : $("#selectZcopy").val(),
            group_mem_sq : group_mem_sq
        };
        
    $.ajax({
        url : "/ssSvc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : function () {
            hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if (json.XmlRoot.info.code == "200") {
                $("#ssServer option").remove();
                
                var items = json.XmlRoot.svc.lists.contents;
                
                if(items != null && items.length > 0)
                {
                    for(var i = 0; i < items.length ; i++)
                    {
                        if(items[i].X_Container_Read == ".r:*"){
                            storageUrl = json.XmlRoot.info.storageUrl;
                            storageUrl = storageUrl.replace("_", "-");

                            var zcopy_suffix = "";
                            
                            var newOption = "";
                            
                            if($.cookie("encoder_fbox") != "" && $.cookie("encoder_fbox") == items[i].name) {
                                if(get_encoder_flag($("#selectZcopy").val(), items[i].name+zcopy_suffix) == "Y") {
                                    newOption = "<option selected >" + items[i].name + zcopy_suffix + "(Encoder)</option>";
                                } else {
                                    newOption = "<option selected>" + items[i].name + zcopy_suffix + "</option>";
                                }
                                
                                $.cookie('encoder_fbox', null, {path : WebROOT});
                            } else {
                                if(get_encoder_flag($("#selectZcopy").val(), items[i].name+zcopy_suffix) == "Y") {
                                    newOption = "<option>" + items[i].name + zcopy_suffix + "(Encoder)</option>";
                                } else {
                                    newOption = "<option>" + items[i].name + zcopy_suffix + "</option>";
                                }
                            }
                            
                            SSList.append(newOption);

                            SSList.find('option').eq(SSList.find('option').length-1).data('zcopy',$("#selectZcopy").val());
                            SSList.find('option').eq(SSList.find('option').length-1).data('backup',items[i].X_Container_Meta_Backup_Container_Name);
                        }
                    }
                    
                    if( needSsSelect ) {
                        var filename = $("#text_orgin").text().split("/")[1];
                        $("#ssServer option").each(function(){
                            if(this.text == filename){
                                $(this).attr("selected", "selected");
                            }
                        });
                        needSsSelect = false;
                    }
                }
                selectbox_design(SSList);
            }else{
                SSList.append("<option>목록 없음</option>");
                selectbox_design(SSList);
            }
        }
    });
}
function get_originGroupList(){
    selectbox_design($("#protocolBox"));
    $('option','#originGroupList').remove();
    $.ajax({
        url: "/cdn/origin_groups/name",
        type: "GET",
        data: null,
        dataType: "json",
        success: function(json) { 
            json.forEach(function (elem) {
                $('<option value="'+ elem.id +'" value1="'+ elem.sources[0].source+'">'+elem.name +'</option>').appendTo('#originGroupList');   
            })
            selectbox_design($("#originGroupList"));
        }
    });
}

// //message Box 보이기(로딩)
// function showLoadingBox( img_url ){
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
function call_resourceList(){
    // showLoadingBox();    // 로딩중 이미지
    
    $.ajax({
        url : "/cdn/list/all"
        , type : "GET"
        , data : {}
        , dataType : "json"
        , complete : function () {
            // hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if (json.status == "00") {
                list_CloudServer(json.data);
            }else{
                if(json.status == "99"){
                    showCommonNoLangErrorMsg("","CDN서비스 조회중 에러가 발생하였습니다."+ "<br />" +"관리자에게 문의하세요");
                }
            }
                
        }
    });
}
// 테이블 sort 처리 
function itemSort(data){
    data.forEach(function (elem) {
        // if (elem["reg_status"]){
        //     productListHTML += '<tr><td>' + elem["contract_id"] + '</td>'+
        //     '<td>' + elem["product_name"] + '</td>'+
        //     '<td>' + elem["plan"] + '</td>'+
        //     '<td>' + elem["total_amount"] + '</td>'+
        //     '<td>' + elem["unit"] + '</td>'+
        //     '<td>' + elem["commit"] + '</td>'+
        //     '<td>' + elem["price"] + '</td>'+
        //     '<td>' + elem["exc_price"] + '</td>'+
        //     '<td>' + elem["start_date"] + '-'+ elem["end_date"] + '</td>'+
        //     '<td>' + makeServiceRestartBtn(elem["product_name"], "수정", "success") + '</td></tr>';
        // } else {
        //     productListHTML += '<tr><td>' + elem["contract_id"] + '</td>'+
        //     '<td>' + elem["product_name"] + '</td>'+
        //     '<td>' + elem["plan"] + '</td>'+
        //     '<td></td>'+
        //     '<td>' + elem["unit"] + '</td>'+
        //     '<td></td>'+
        //     '<td></td>'+
        //     '<td></td>'+
        //     '<td></td>'+
        //     '<td>' + makeServiceRestartBtn(elem["product_name"], "등록", "primary") + '</td></tr>';
        // }
        // var tbodyDom = document.getElementById("productlist_tbody");
        // tbodyDom.innerHTML = productListHTML;

        // $(document).ready(function () {
        //     $('#productlist_table').DataTable( {
        //         "scrollX": true,
        //         "responsive": false,
        //         destroy: true,
        //     });
        // });
    })
   
}

function show_tooltip(objID, actionYN) {
    var destObj = null;

    destObj = $("#" + objID);

    var tooltip_dialog = $("#tooltip_div");

    if (tooltip_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div id="tooltip_div" class="btn_tooltip" style="display:none; "> ');
        arrHtml.push('        <ul class="depth_1">');
        arrHtml.push('            <li> ');
        arrHtml.push('                <dl class="depth_2"> ');
        arrHtml.push('                    <dd> ');
        arrHtml.push('                        <span id="tooltip_text"></span> ');
        arrHtml.push('                    </dd> ');
        arrHtml.push('                </dl> ');
        arrHtml.push('            </li> ');
        arrHtml.push('        </ul> ');
        arrHtml.push('    </div> ');
        $(arrHtml.join("")).appendTo("body");
        tooltip_dialog = $("#tooltip_div");
    }

    destObj.mouseover(function(){
        if(actionYN == "Y") {
            if(!destObj.hasClass("action_disabled") && !destObj.hasClass("action_disabled")) {
                return;
            }
        }

        //2023.03.23
        if(destObj.attr("tooltip_text")==""){
            return;
        }

        var x_position = destObj.offset().left;

        var y_position = destObj.offset().top;

        if(destObj.attr("id") == "set_menu_button") {
            y_position = destObj.offset().top + 40;
        }

        var current_url = location.href;

        if(!current_url.match("osserver")) {
            y_position = y_position + 60;
        }

        if (current_url.match("osnascertify")
            || current_url.match("osnasiqn")
            || current_url.match("osezml")) {
            y_position = y_position + 40;
        }

        tooltip_dialog.offset({top:y_position, left:x_position});
        tooltip_dialog.show();
        tooltip_dialog.find(".depth_2").show();

        tooltip_dialog.css('position', 'absolute');
        tooltip_dialog.css('width', '380px');
        tooltip_dialog.css('top', y_position + 'px');
        tooltip_dialog.css('left', x_position + 'px');
        tooltip_dialog.find("#tooltip_text").html(destObj.attr("tooltip_text"));
    });

    destObj.mouseleave(function(){
        tooltip_dialog.hide();
        tooltip_dialog.find(".depth_2").hide();
    });
}
//클릭
var tr_temp=null;
function tr_onclick_main_cdn(obj){
    if(tr_temp!=null){
        $(tr_temp).removeClass('on');
        $(tr_temp).addClass('off');
    }
    tr_temp=obj;
    $(obj).removeClass('off');
    $(obj).removeClass('over');
    $(obj).addClass('on');
}

function tr_onmouseover_cdn(obj){
    if( !$(obj).hasClass('on') ) {
        $(obj).removeClass('off');
        $(obj).addClass('over');
    }
}
function tr_onmouseout_cdn(obj){
    if( !$(obj).hasClass('on') ) {
        $(obj).removeClass('over');
        $(obj).addClass('off');
    }
}

function list_CloudServer(items){
    $(".tr_vmlist").remove();
    // show_tooltip("button_cdnDelete", "Y");
    if(items != null && items.length > 0){
        for(var i = 0; i < items.length ; i++){
                var vmList = $("#base_vmList").clone(true).addClass("tr_vmlist");
                // checkbox
                vmList.find("input:checkbox[name=contentsList]").val(items[i].id);
             
                //이름      
                if(items[i].description){
                    vmList.find("#text_vmDisplayText").text(items[i].description);
                    $("#text_selected_vmDisplayText").text(items[i].description); //하단 선택된 서비스
                }
                
                //상태는 확인 후 작업 필요 
                if (items[i].status == "active") { //사용
                    vmList.find("#img_vmState").html('<img src="/images/c_common/ico_state_use.png" alt="사용" class="mr5 vm" />사용').end();
                } else if (items[i].status == "suspended") {
                    vmList.find("#img_vmState").html('<img src="/images/c_common/ico_state_stop.png" alt="정지" class="mr5 vm" />정지').end();
                } else if(items[i].status == "processed") {
                    vmList.find("#img_vmState").html('<img src="/images/c_common/ico_state_process.png" class="mr5 vm" /> 준비중' ).end();
                }
                
                vmList.find("#text_vmServiceDomain").text(items[i].cname);
                vmList.find("#text_vmOriginGroup").text(items[i].originGroup_name);
         
                vmList.find("#button_vmConsoleView").text(items[i].created_str);
                
                // 항목변경 default 숨김메뉴
                vmList.find("#text_service_id").text(items[i].id); // 리스트-서비스 아이디
                vmList.find("#text_cdn_domain").text(items[i].svcdomain); // 리스트-CDN도메인
                vmList.find("#text_org_contents_server").text(items[i].origins); // 리스트-원본 컨텐츠 서버
                
                vmList.attr("id" , items[i].id);
                vmList.attr("status" , items[i].status);
                vmList.attr("domain" , items[i].cname);
                vmList.attr("origin_group" , items[i].originGroup);
                vmList.attr("service_name" , items[i].description);
                
                vmList.data("svc_type" ,"");
                vmList.data("id" ,"");
                vmList.data("name" ,"");
                vmList.data("state" ,"");
                vmList.data("created" ,"");
                vmList.data("domains" ,"");
                vmList.data("org_addr" ,"");
                vmList.data("org_name" ,"");
                vmList.data("svr_comment" ,"");
                vmList.data("servicename" ,"");
                vmList.data("auth_method_code" ,"");
                vmList.data("auth_method_param" ,"");
                vmList.data("org_url" ,"");
                vmList.data("zcopy" ,"");
                vmList.data("noneexist_referer" ,"");
                vmList.data("cors" ,"");
                vmList.data("usesslupstream" ,"");
                vmList.data("usetlssniupstream" ,"");
                vmList.data("originprotocol" ,"");
                
                vmList.data("addoriginrequestheaders" ,"");
                vmList.data("removeorigincachecontrolheader" ,"");
                vmList.data("negativettl" ,"");
                vmList.data("addclientresponseheaders" ,"");
                vmList.data("allowhttpmethod" ,"");
                vmList.data("allowcountrylist" ,"");
                vmList.data("denycountrylist" ,"");
                vmList.data("allowiplist" ,"");
                vmList.data("denyiplist" ,"");
                
                
                if(items[i].svctype){ vmList.data("svc_" , items[i].svctype);}
                if(items[i].svcname){ vmList.data("svc_name" , items[i].description);}
                if(items[i].useusersvcdomain){ vmList.data("useusersvcdomain" , items[i].useusersvcdomain);}
                if(items[i].svcdomain){ vmList.data("svc_domain" , items[i].svcdomain);}
                if(items[i].cdndomain){ vmList.data("cdn_domain" , items[i].cdndomain);}
                if(items[i].cdntype){ vmList.data("cdntype" , items[i].cdntype);}
                if(items[i].svcstatus){ vmList.data("state" , items[i].svcstatus);}
                if(items[i].created){ vmList.data("created" , items[i].created);}
                if(items[i].origins){ vmList.data("org_addr" , items[i].origins);}
                if(items[i].origins){ vmList.data("org_name" , items[i].originhostname);}
                if(items[i].originhostheader){ vmList.data("oheader" , items[i].originhostheader);}
                if(items[i].securetokensecret){ vmList.data("token" , items[i].securetokensecret);}
                if(items[i].sslprotocol){ vmList.data("sslprotocol" , items[i].sslprotocol);}
                if(items[i].cachettl){ vmList.data("cachettl" , items[i].cachettl);}
                if(items[i].gzip){ vmList.data("gzip" , items[i].gzip);}
                if(items[i].ignoreqeury){ vmList.data("ignoreqeury" , items[i].ignoreqeury);}
                if(items[i].referers){ vmList.data("referers" , items[i].referers);}
                if(items[i].description){ vmList.data("description" , items[i].description);}
                if(items[i].serviceprotocol){ vmList.data("serviceprotocol", items[i].serviceprotocol);}
                // if(items[i].certificatename){ vmList.data("certificate_name", items[i].certificatename);}
                if(items[i].allownoneexistreferer){ vmList.data("noneexist_referer", items[i].allownoneexistreferer);}
                if(items[i].corsalloworigin){ vmList.data("cors", items[i].corsalloworigin);}
                if(items[i].usesslupstream){ vmList.data("usesslupstream", items[i].usesslupstream);}
                if(items[i].usetlssniupstream){ vmList.data("usetlssniupstream", items[i].usetlssniupstream);}
                if(items[i].originprotocol){ vmList.data("originprotocol", items[i].originprotocol);}
                
                if(items[i].addoriginrequestheaders){ vmList.data("addoriginrequestheaders", items[i].addoriginrequestheaders);}
                if(items[i].removeorigincachecontrolheader){ vmList.data("removeorigincachecontrolheader", items[i].removeorigincachecontrolheader);}
                if(items[i].negativettl){ vmList.data("negativettl", items[i].negativettl);}
                if(items[i].addclientresponseheaders){ vmList.data("addclientresponseheaders", items[i].addclientresponseheaders);}
                if(items[i].allowhttpmethod){ vmList.data("allowhttpmethod", items[i].allowhttpmethod);}
                if(items[i].allowcountrylist){ vmList.data("allowcountrylist", items[i].allowcountrylist);}
                if(items[i].denycountrylist){ vmList.data("denycountrylist", items[i].denycountrylist);}
                if(items[i].allowiplist){ vmList.data("allowiplist", items[i].allowiplist);}
                if(items[i].denyiplist){ vmList.data("denyiplist", items[i].denyiplist);}
                
                
                $("#base_vmList").before(vmList.show());
                
                firstlistcheck = true;
            
                //oneview경우 행선택 표시
                if(oneview_id!=""){
                    if(oneview_id==items[i].svc_name){
                        $("#text_vmDisplayText", vmList).trigger("click");
                    }
                }
                
        }
        // 최상단 자동클릭
        if(oneview_id!=""){
            oneview_id="";
        }
        
        $("#div_nonelist").hide();
        $("#div_belist").show();
    }
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

function event_cdnClick(e){
    e.preventDefault();
    selectedRow = $(e.target).parents("tr");
    var selectedvm_id = selectedRow.attr("id");
    var selectedvm_name = selectedRow.attr("service_name");
    var selectedvm_status = selectedRow.attr("status");
    var selectedvm_origin_group = selectedRow.attr("origin_group");
    var selectedvm_domain = selectedRow.attr("domain");
    if(selectedvm_id == null) {
        return false;
    }
  
    selectedRow.data("id", selectedvm_id);
    selectedRow.data("service_name", selectedvm_name)
    selectedRow.data("status", selectedvm_status);
    selectedRow.data("domain", selectedvm_domain);
    selectedRow.data("origin_group", selectedvm_origin_group);
    // getApplyCertificates(selectedRow.data("id"));
    
    $("input:checkbox[name=contentsList]").prop("checked",false).change();
    selectedRow.find("input:checkbox[name=contentsList]").prop("checked",true).change();
        
    $("#button_cdnDetail").removeClass('action_disabled');
    $("#button_cdnModify").removeClass('action_disabled');
        // // 서비스명
        // if(selectedRow.data("svc_name")){
        //     $("#text_serviceName").text(selectedRow.data("svc_name"));
        //     $("#text_selected_vmDisplayText").text(selectedRow.data("svc_name"));        
        //     $("#step1_svcName").text(selectedRow.data("svc_name"));        
        // }
        setControl_Panel_CDN(selectedRow.data("status"));
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
function selectPortChang(){
    if ($("#use_default_port").prop("checked")){
        $("#step4_modify_header_value").hide();
        $("#step4_modify_header_value").val("");
    }else{
        $("#step4_modify_header_value").show();
        $("#step4_modify_header_value").val("");
    }
    // $("#contentsList1").unbind("click").bind("click" , alert("!"));
}
function selectBoxChang(){
    $("#org_select li span").each(function(i,e){
        if($(this).hasClass('on')){
            org_sel = $(this).attr('value');
        }
    });
    
    if("ss" == org_sel){
        $("#cdnCreateArea_ss_div").show();
        $("#cdnCreateArea_direct_div").hide();
        $("#cdnCreateArea_direct_div1").hide();
        $("#cdnCreateArea_direct_div2").hide();
        $("#cdnCreateArea_direct_div3").hide();
    }
    else{
        $("#cdnCreateArea_direct_div").show();
        $("#cdnCreateArea_direct_div1").show();
        $("#cdnCreateArea_direct_div2").show();
        $("#cdnCreateArea_direct_div3").show();
        $("#cdnCreateArea_ss_div").hide();
    }
}
function setControl_Panel_CDN(state){
    //11/16 설명창에 나오는 상태 이미지처리
        $("#div_info").find("#img_vmState").html(function(index , oldhtml) {
            if(state == "active") {            //사용
                return '<img src="/images/c_common/ico_state_use.png" class="mr5 vm" />사용';
            }else if(state == "suspended") {    //정지
                return '<img src="/images/c_common/ico_state_stop.png" class="mr5 vm" />정지';
            }else if(state == "processed") {        //준비중
                return '<img src="/images/c_common/ico_state_stop.png" class="mr5 vm" />' + objLang.in_preparation;
            }else {        //오류
                return '<img src="/images/c_common/ico_state_stop.png" class="mr5 vm" />오류';
            }
        });
        if(!selectedRow.find("input:checkbox[name=contentsList]").prop("checked")){
            $("#button_cdnStart").attr("class", "action action_disabled");
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action action_disabled");
            
        }else if(state == "active"){ // 사용중 상태
            //각 액션 버튼 셋팅
            $("#button_cdnStart").attr("class", "action action_disabled");
            $("#button_cdnStop").attr("class", "action");
            $("#button_cdnDelete").attr("class", "action action_disabled");

            $("#button_cdnStart").unbind("click"); 
            $("#button_cdnStop").unbind("click").bind("click" , button_cdnStop_event); 
            $("#button_cdnDelete").unbind("click");
            $("#button_cdnModify").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnModify(e);
                return false;
            });
            show_tooltip("button_cdnDelete", "Y");
            
        }else if(state == "suspended"){ // 정지상태
            //각 액션 버튼 셋팅        
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action");
            $("#button_cdnStart").attr("class", "action");

            $("#button_cdnStop").unbind("click"); 
            $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnDelete(e);
                return false;
            });
            $("#button_cdnStart").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnStart(e);
                return false;
            }); 
            $("#button_cdnModify").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnModify(e);
                return false;
            });

        } else if (state == "processed") {
            //각 액션 버튼 셋팅
            $("#button_cdnStart").attr("class", "action action_disabled");
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action");
            
            $("#button_cdnStart").unbind("click"); 
            $("#button_cdnStop").unbind("click"); 
            $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnDelete(e);
                return false;
            });
            $("#button_cdnModify").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnModify(e);
                return false;
            });
        } 
    
}
function setControl_Panel_Origin(){
    //11/16 설명창에 나오는 상태 이미지처리
    if(!selectedRow.find("input:checkbox[name=contentsList]").prop("checked")){
        $("#button_originUpdate").attr("class", "action action_disabled");
        $("#button_originDelete").attr("class", "action action_disabled");
        
    }else{ // 사용중 상태
        //각 액션 버튼 셋팅
        $("#button_originUpdate").attr("class", "action");
        $("#button_originDelete").attr("class", "action");

        $("#button_originUpdate").unbind("click").bind("click" , button_originUpdate_event); 
        $("#button_originDelete").unbind("click").bind("click" , button_originDelete_event); 
        show_tooltip("button_cdnDelete", "Y");
    }
}
function set_CdnEvent(){
    svcNm_chk = false;
    svcDm_chk = false;
    $("#green_svn_nm").hide();
    $("#red_svn_nm").hide();
    //sort
    
    //이름
    $("#view_svr_name").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_name");
    });
    //유형
    $("#view_svr_type").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_type");
    });
    //상태
    $("#view_svr_state").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_state");
    });
    //서비스도메인
    $("#view_svr_domain").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_domain");
    });
    //생성일시
    $("#view_svr_dttm").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_dttm");
    });
    //CDN 생성
    $("#button_cdnDeploy").unbind("click").bind("click" , function() {
        get_originGroupList();
        if($(this).hasClass("action_disabled")){
            return false;
        }
        var dlgForm = $("#dialog_CDN_Detail");
        commonDialogInit(dlgForm);
        dlgForm.dialog("open");

        // dlgForm.find("#purgePreCautions").removeClass("on");
        // dlgForm.find("#purgePreCautionsArea").removeClass("on");
        // $('#purge_domain').remove();
        // $('option','#purge_domain').remove();
        dlgForm.find($("#origin_type li span")).each(originTypeClick);

        function originTypeClick(){
            if($(this).attr('value') == "0"){
                $(this).attr('class', 'imgbn');
            }else{
                $(this).attr('class', 'imgbn on');
            }
        }
        dlgForm.find("#originListArea").show();
        dlgForm.find("#originCreateArea").hide();
        dlgForm.find("#originList").val("");
        // $('<option value="cdn_domain">'+cdn_domain+'</option>').appendTo('#purge_domain');
        // selectbox_design($("#purge_domain"));
        // dlgForm.find("#hardPurgeUse").prop("checked", false);
        
        // 팝업 주의사항 보기
        dlgForm.find("#purgePreCautions").unbind("click").bind("click" , precautionToggle);
            
    
        function precautionToggle(){
            dlgForm.find("#purgePreCautions").toggleClass("on");
            dlgForm.find("#purgePreCautionsArea").toggleClass("on");
        }
        
        dlgForm.find($("#origin_type li span")).unbind("click").bind("click", originTypeClick1);
    
        function originTypeClick1(){
            dlgForm.find("#originList").val("");
            $("#origin_type li span").each(originTypeClickSub);
            $(this).addClass('on');
            if($(this).attr('value') == "0"){
                dlgForm.find("#originListArea").hide();
                dlgForm.find("#originCreateArea").show();
            }else{
                dlgForm.find("#originListArea").show();
                dlgForm.find("#originCreateArea").hide();
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

            if(content.length>5000){
                $(this).val(content.substring(0,5000));
                // showCommonNoLangErrorMsg("", "최대 5000자 이내로 입력 가능합니다.");
                return;
            }
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

            //(둘째주) - 이미 등록되어있는 서비스명인지 체크로직 추가
            var param = {
                service_name : dlgForm.find("#service_name").val(),
                service_domain : dlgForm.find("#service_domain").val(),
                origin_id : 0,
                origin_url : '',
            };

            //서비스명 확인
            if (!CheckString(param.service_name)) {
                showCommonNoLangErrorMsg("", "서비스명을 확인해주세요. 영문,숫자만 가능합니다.(한글, 공백 입력불가)");
                return;
            }
            
            // //서비스도메인 확인
            // if (!CheckString(param.service_domain)) {
            //     console.log("!")
            //     showCommonNoLangErrorMsg("", "서비스 도메인을 입력해 주세요.");
            //     return;
            // }
            
            // Service Domain 입력값 유효성 체크
            if (!checkDomainOrIP(param.service_domain)) {
                //서비스도메인 확인
                if (param.service_domain == "") {
                    showCommonNoLangErrorMsg("", "서비스 도메인을 입력해 주세요.");
                    return;
                }
                showCommonNoLangErrorMsg("", "서비스 도메인을 확인해 주세요. " + param.service_domain + "은 도메인 형식에 맞지 않습니다.");
                return;
            }
            // Protocol
            var protocol = dlgForm.find("#protocolBox option:selected").val();

            // Origin 선택 및 유효성 체크
            if(origin_type == "1"){         //기존 Origin Group
                var $selectedOption = dlgForm.find("#originGroupList option:selected")
                var selectNum = $selectedOption.val();
                var selectValue1 = $selectedOption.attr('value1');
                
                param.origin_id = Number(selectNum);
                param.origin_url = selectValue1;
                param.originProtocol = protocol
                resourceCreate(param);
                dlgForm.dialog("close");
            }else if (origin_type == "0"){      //신규 Origin 추가
                if (originURLList == "") {
                    showCommonNoLangErrorMsg("", " 최소 1개 이상의 오리진 주소를 입력하세요.");
                    return;
                }
                var origin_arr = originURLList.split("\n");
                if(origin_arr.length == 5){
                    showCommonNoLangErrorMsg("", "한번에 최대 5개까지 입력 가능합니다.");
                    return;
                }
                for (var p = 0; p < origin_arr.length; p++) {
                    if(!checkDomainOrIP(origin_arr[p])){
                        showCommonNoLangErrorMsg("신규 Origin 추가", origin_arr[p] + "은 형식에 맞지 않습니다.Origin은 IP주소 또는 도메인 형식만 가능합니다.");
                        return;
                    }
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
                            param.originProtocol = protocol
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
    //CDN 시작
    $("#button_cdnStart").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        event_cdnStart(e);
        return false;
    }); 
    //CDN 정지
    $("#button_cdnStop").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        event_cdnStop(e);
        return false;
    }); 
    //CDN 삭제
    $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        event_cdnDelete(e);
        return false;
    });
    $("#button_cdnDetail").unbind("click").bind("click" , button_cdnDetail_event);
    $("#base_vmList").unbind("click").bind("click" , event_cdnClick);
}

//CDN 수정
function event_cdnModify(e){
    var mdfForm = $("#cdnModifyContent");
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("service_name")
    var svc_domain = selectedRow.data("domain")
    $("#cdnListContent").hide();
    $("#cdnModifyContent").show();
    mdfForm.find("#modify_svcName").text(svc_name);
    mdfForm.find("#service_name").text(svc_name);
    mdfForm.find("#service_domain").text(svc_domain);
}

//CDN 수정
function call_CDN_Modify (svc_id, svc_name) {
    var success_msg = svc_name + " 삭제 시작";
    process_toast_popup("CDN", success_msg, true);
    
    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />삭제중');
    $("#dialog_CDN_Delete").dialog("close");
    
    var delURL ="/cdn/resources/" + svc_id;
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
            }else{
                success_msg = svc_name + " 삭제 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
            setTimeout(() =>  call_resourceList(), 3000);
        }
    });

}

//CDN 삭제
function event_cdnDelete(e){
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("service_name")
    var el_dialog = $("#dialog_CDN_Delete"); 
    commonDialogInit(el_dialog);
    el_dialog.dialog("open");
    // var cdn_domain = selectedRow.data("domain");
    $("#dialog_CDN_Delete").find("#dialog_CDN_Delete_text1").text(svc_name);
    $("#button_VM_Delete_TopClose", el_dialog).unbind("click").bind("click" , cancelDelPop);
    $("#button_VM_Delete_Cancel", el_dialog).unbind("click").bind("click" , cancelDelPop);
    function cancelDelPop(){
        el_dialog.dialog("close");
    }
    $("#button_VM_Delete_OK", el_dialog).unbind("click").bind("click" , vmDelOK);
    function vmDelOK(){
        el_dialog.dialog("close");
        call_CDN_Delete(svc_id, svc_name);
        return false;
    }
}

//  CDN 삭제
function call_CDN_Delete (svc_id, svc_name) {
    var success_msg = svc_name + " 삭제 시작";
    process_toast_popup("CDN", success_msg, true);
    
    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />삭제중');
    $("#dialog_CDN_Delete").dialog("close");
    
    var delURL ="/cdn/resources/" + svc_id;
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
            }else{
                success_msg = svc_name + " 삭제 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
            setTimeout(() =>  call_resourceList(), 3000);
        }
    });

}
// CDN 정지 버튼
function button_cdnStop_event(e) {
    e.preventDefault();
    if($(this).hasClass("action_disabled")){
        return false;
    }
    event_cdnStop(e);
}

// CDN 정지
function event_cdnStop(e)
{
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("service_name")

    commonDialogInit($("#dialog_CDN_Stop"));
    $("#dialog_CDN_Stop").dialog("open");
    $("#dialog_CDN_Stop").find("#dialog_CDN_Stop_text1").text(svc_name);
    $("#dialog_CDN_Stop").find("#button_VM_Stop_TopClose").unbind("click").bind("click" , cancelStopPop);
    $("#dialog_CDN_Stop").find("#button_VM_Stop_Cancel").unbind("click").bind("click" , cancelStopPop);
    function cancelStopPop(){
        $("#dialog_CDN_Stop").dialog("close");
    }
    $("#dialog_CDN_Stop").find("#button_VM_Stop_OK").unbind("click").bind("click" , cdnStopClick);
    function cdnStopClick(){
        call_CDN_Stop(svc_id, svc_name);
        return false;
    }

}
// CDN 정지
function call_CDN_Stop(svc_id, svc_name){
    
    var success_msg = svc_name + " 정지 시작";
    add_noti_message("/console/d/osadvcdnlist", success_msg);
    process_toast_popup("CDN", success_msg, true);

    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />정지중');
    $("#dialog_CDN_Stop").dialog("close");
    var stopURL = "/cdn/stop/" + svc_id;
    $.ajax({
        url : stopURL
        , type : "PUT"
        // , contentType: "application/json"
        , data : null
        , dataType : "json"
        , success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if (json.status == "00") {
                success_msg = svc_name + " 정지 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
                
            }else{
                success_msg = svc_name + " 정지 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
            setTimeout(() =>  call_resourceList(), 3000);
        }
    });
}
// CDN 시작 
function event_cdnStart(e)
{
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("service_name")
    commonDialogInit($("#dialog_CDN_Start"));
    $("#dialog_CDN_Start").dialog("open");
    $("#dialog_CDN_Start").find("#dialog_CDN_Start_text1").text(svc_name);
    $("#dialog_CDN_Start").find("#button_VM_Start_TopClose").unbind("click").bind("click" , cancelCdnStart);
    $("#dialog_CDN_Start").find("#button_VM_Start_Cancel").unbind("click").bind("click" , cancelCdnStart);
    function cancelCdnStart(){
        $("#dialog_CDN_Start").dialog("close");
    }
    $("#dialog_CDN_Start").find("#button_VM_Start_OK").unbind("click").bind("click" , vmStartOK);
    function vmStartOK(){
        call_CDN_Start(svc_id, svc_name);
        return false;
    }
}
// CDN 시작
function call_CDN_Start(svc_id, svc_name){

    var success_msg = svc_name + " 시작 시작";
    add_noti_message("/console/d/osadvcdnlist", success_msg);
    process_toast_popup("CDN", success_msg, true);

    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />시작중');
    $("#dialog_CDN_Start").dialog("close");
    var startURL = "/cdn/start/" + svc_id;
    $.ajax({
        url : startURL
        , type : "PUT"
        // , contentType: "application/json"
        , data : null
        , dataType : "json"
        , success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if (json.status == "00") {
                success_msg = svc_name + " 시작 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
            }else{
                success_msg = svc_name + " 시작 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
            setTimeout(() =>  call_resourceList(), 3000);
        }
    });
}

// Purge
function call_cdnPurge(){
    $('option','#purge_domain').remove();
    $.ajax({
        url : "/cdn/list/all"
        , type : "GET"
        , data : {}
        , dataType : "json"
        , complete : function () {
            // hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if (json.status == "00") {
                json.data.forEach(function (elem) {
                    console.log(elem.status);
                    if (elem.status == "active"){
                        $('<option value="'+ elem.id +'">'+elem.cname +'</option>').appendTo('#purge_domain');   
                        selectbox_design($("#purge_domain"));
                    }
                })
            }else{
                if(json.status == "99"){
                    showCommonNoLangErrorMsg("CDN서비스 조회","CDN서비스 조회중 에러가 발생하였습니다."+ "<br />" +"관리자에게 문의하세요");
                    
                }
            }
                
        }
    });
    var purgeForm = $("#cdnPurge");
    var svc_id ="";

    // purgeForm.find("#purge_svcName").text(svc_name);
    purgeForm.find("#purgePreCautions").removeClass("on");
    purgeForm.find("#purgePreCautionsArea").removeClass("on");
    // $('#purge_domain').remove();
    // $('option','#purge_domain').remove();
    purgeForm.find($("#purge_type li span")).each(purgeTypeClick);
    function purgeTypeClick(){
        if($(this).attr('value') !== "0"){
            $(this).attr('class', 'imgbn');
        }else {
            $(this).attr('class', 'imgbn on');
        }
    }
    purgeForm.find("#purgeURLarea").hide();
    purgeForm.find("#purge_file").val("");
    // $('<option value="cdn_domain">'+cdn_domain+'</option>').appendTo('#purge_domain');
    // selectbox_design($("#purge_domain"));
    // dlgForm.find("#hardPurgeUse").prop("checked", false);
    
    // 팝업 주의사항 보기
    purgeForm.find("#purgePreCautions").unbind("click").bind("click" , precautionToggle);
        

    function precautionToggle(){
        purgeForm.find("#purgePreCautions").toggleClass("on");
        purgeForm.find("#purgePreCautionsArea").toggleClass("on");
    }
    
    purgeForm.find($("#purge_type li span")).unbind("click").bind("click", purgeTypeClick1);

    function purgeTypeClick1(){
        purgeForm.find("#purge_file").val("");
        $("#purge_type li span").each(purgeTypeClickSub);
        $(this).addClass('on');
        if($(this).attr('value') !== "0"){
            purgeForm.find("#purgeURLarea").show();
            if ($(this).attr('value') == "1"){
                $("#purge_file").attr("placeholder",  "/image/test001.jpg\n/image/test002.jpg");
            }else{
                $("#purge_file").attr("placeholder", "/cdn/*\n/cdn/images/*.jpg");
            }
        }else{
            purgeForm.find("#purgeURLarea").hide();
            $("#purgeURLarea").val("");
        }
        
    }

    function purgeTypeClickSub(){
        $(this).removeClass('on');
    }
     
    purgeForm.find("#btn_PurgeCancel_TOP").unbind("click").bind("click", cancelTopPurgePop);
    purgeForm.find("#btn_PurgeCancel").unbind("click").bind("click", cancelTopPurgePop);

    function cancelTopPurgePop(){
        purgeForm.dialog("close");
    }
    
    $("#purge_file").keyup(function (e){
        var content = $(this).val();

        if(content.length>5000){
            $(this).val(content.substring(0,5000));
            showCommonNoLangErrorMsg("", "최대 5000자 이내로 입력 가능합니다.");
            return;
        }
    });
    
    //Purge 퍼튼 클릭
    purgeForm.find("#btn_PurgeOk").unbind("click").bind("click", purgeOK); 
    function purgeOK(){
        var purgeurl = purgeForm.find("#purge_file").val();
        var purge_type =null;
        $("#purge_type li span").each(getPurgeType);
        function getPurgeType(){
            if($(this).hasClass('on')){
                purge_type = $(this).attr('value');
                
            }
        }

        if(purge_type !== "0"){
            //파일지정 선택
            var purge_arr = trim(purgeurl.split("\n"));
            for (var i=0; i < purge_arr.length ; i++) {
                if (purge_arr[i] == "") showCommonNoLangErrorMsg("", "Purge할 URL을 확인해주세요.");
                return;
            }

            if(purge_arr.length > 30){
                showCommonNoLangErrorMsg("", "URL/패턴 Purge시, 한번에 최대 30개 파일입력 가능합니다.");
                return;
            }
        }
      
        //purge_type 
        // 0: 전체, 1 : URL, 2: 패턴
        var selectedValue = purgeForm.find("#purge_domain").val();
        var svc_doamin = $("#purge_domain option:selected").text();
        var params = {id : selectedValue}
        if (purge_type == 1){
           params.urls = purge_arr;
        }else if(purge_type == 2){
            params.paths = purge_arr;
        }else{
           params.urls = [];
        }
        
        $("#purge_OkUrl").empty();
        $("#purge_FailUrl").empty();
        
        // purge API svc_type 필수값 추가
        urlOkNm = "";
        var success_msg = svc_doamin + " purge 시작";
        add_noti_message("/console/d/osadvcdnlist", success_msg);
        process_toast_popup("CDN", success_msg, true);
        $.ajax({
            url : "/cdn/resources/purge"
            , type : "POST"
            , contentType: "application/json"
            , data : JSON.stringify(params)
            , dataType : "json"
            , success : function(json) {
                if(json.status == "29") { /* IAM 사용자 정책 처리 */
                    commonErrorMessage("29");
                    return;
                }
                if(json.status == '00'){
                    success_msg = svc_doamin + " purge 성공";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, true);
                }else{
                    success_msg = svc_doamin + " purge 실패";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, false);
                }
                setTimeout(() =>  call_resourceList(), 3000);
            }
            ,error: function(XMLHttpResponse) {
                success_msg = svc_doamin + " purge 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
        });    
    }
}

//CDN 생성
function resourceCreate(param){
    if (param.origin_id === 0 || param.origin_url === ''){
        success_msg = " CDN 생성 실패 - origin group 생성 오류";
        add_noti_message("/cdn/list", success_msg);
        process_toast_popup("CDN", success_msg, false);
    }

    $.ajax({
        url : "/cdn/resources",
        type : "POST",
        contentType: "application/json",
        data : JSON.stringify(param),
        dataType : "json",
        success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }   
            if ( json.status == '00'){
                success_msg = param.service_name + " 생성 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
                setTimeout(() =>  call_resourceList(), 3000);
            }else{
                success_msg = param.service_name + " 생성 실패 (" + json.data + ")";
                add_noti_message("/cdn/list", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
            setTimeout(() =>  call_resourceList(), 3000);
        }
        // ,error: function(json) {
        //         success_msg = param.service_name + " 생성 실패";
        //         add_noti_message("/cdn/list", success_msg);
        //         process_toast_popup("CDN", success_msg, false);
        // }
    }); 
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
                console.log("!")
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
            //  (첫주) origin은 최초 하나 이상 등록하셔야 합니다.  

            
            // var originURLList = dlgForm.find("#originList").val();
            // var origin_type =null;
            // $("#origin_type li span").each(getOriginType);
            // function getOriginType(){
            //     if($(this).hasClass('on')){
            //         origin_type = $(this).attr('value');
            //     }
            // }
            // //23.12.15 멈춤
            // var param = {
            //     service_name : dlgForm.find("#origin_name").val(),
            //     service_domain : dlgForm.find("#service_domain").val(),
            //     origin_id : 0,
            //     origin_url : '',
            // };
            // if(origin_type == "1"){
            //     var $selectedOption = dlgForm.find("#originGroupList option:selected")
            //     var selectNum = $selectedOption.val();
            //     var selectValue1 = $selectedOption.attr('value1');
                
            //     param.origin_id = Number(selectNum);
            //     param.origin_url = selectValue1;
            //     resourceCreate(param);
            //     dlgForm.dialog("close");
            // }else if (origin_type == "0"){
            //     if (originURLList == "") {
            //         showCommonNoLangErrorMsg("Origin 확인", " 최소 1개 이상의 오리진 주소를 입력하세요.");
            //         return;
            //     }
            //     var origin_arr = originURLList.split("\n");
            //     if(origin_arr.length > 5){
            //         showCommonNoLangErrorMsg("", "한번에 최대 5개까지 입력 가능합니다.");
            //         return;
            //     }
            //     // var userurl = "";
            //     // for (var p = 0; p < origin_arr.length; p++) {
            //     //     var temp_arr = origin_arr[p].split(".");
    
            //     //      var temp = null;
            //     //     if(temp_arr.length >= 2) {
            //     //         temp = temp_arr[temp_arr.length-1].toLowerCase();
            //     //     }
                    
            //     //     userurl =userurl + origin_arr[p];
            //     //     if (origin_arr.length > p+1){
            //     //         userurl = userurl +",";
            //     //     }
            //     // }
            //     var params = {name: dlgForm.find("#origin_name").val(), origins : origin_arr };
            //     $.ajax({
            //         url : "/cdn/origin_group",
            //         type : "POST",
            //         contentType: "application/json",
            //         data : JSON.stringify(params),
            //         dataType : "json",
            //         success : function(json) {
            //             if(json.status == "29") { /* IAM 사용자 정책 처리 */
            //                 commonErrorMessage("29");
            //                 return;
            //             }   
            //             if ( json.status == '00'){
            //                 param.origin_id = json.data.id;
            //                 param.origin_url = json.data.sources[0].source;
            //                 resourceCreate(param);
            //                 dlgForm.dialog("close");
            //             }
            //         },error: function(XMLHttpResponse) {
            //             var resp = JSON.parse(XMLHttpResponse.responseText);
            //             success_msg = param.service_name + " 생성 실패 (" + resp.data + ")";
            //             add_noti_message("/cdn/list", success_msg);
            //             process_toast_popup("CDN", success_msg, false);
            //         }
            //     }); 
            // }
            // $("#purge_OkUrl").empty();
            // $("#purge_FailUrl").empty();
        }
    });
    $("#button_cdnDetail").unbind("click").bind("click" , button_cdnDetail_event);
    $("#base_vmList").unbind("click").bind("click" , event_originClick);
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
    event_originUpdate(e);
}

// CDN Update
function event_originUpdate(e){
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("service_name")

    if($(this).hasClass("action_disabled")){
        return false;
    }
    var dlgForm = $("#dialog_cdnPurge");
    commonDialogInit(dlgForm);
    dlgForm.dialog("open");
    var svc_name = selectedRow.data("service_name");
    var cdn_domain = selectedRow.data("domain");
    var svc_id = selectedRow.data("id");

    dlgForm.find("#purge_svcName").text(svc_name);
    dlgForm.find("#purge_domain").text(cdn_domain);
    dlgForm.find("#purgePreCautions").removeClass("on");
    dlgForm.find("#purgePreCautionsArea").removeClass("on");
    // $('#purge_domain').remove();
    // $('option','#purge_domain').remove();
    dlgForm.find($("#purge_type li span")).each(purgeTypeClick);
    function purgeTypeClick(){
        if($(this).attr('value') == "0"){
            $(this).attr('class', 'imgbn');
        }else{
            $(this).attr('class', 'imgbn on');
        }
    }
    dlgForm.find("#purgeURLarea").show();
    dlgForm.find("#purge_file").val("");
    // $('<option value="cdn_domain">'+cdn_domain+'</option>').appendTo('#purge_domain');
    // selectbox_design($("#purge_domain"));
    // dlgForm.find("#hardPurgeUse").prop("checked", false);
    
    // 팝업 주의사항 보기
    dlgForm.find("#purgePreCautions").unbind("click").bind("click" , precautionToggle);
        

    function precautionToggle(){
        dlgForm.find("#purgePreCautions").toggleClass("on");
        dlgForm.find("#purgePreCautionsArea").toggleClass("on");
    }
    
    dlgForm.find($("#purge_type li span")).unbind("click").bind("click", purgeTypeClick1);

    function purgeTypeClick1(){
        dlgForm.find("#purge_file").val("");
        $("#purge_type li span").each(purgeTypeClickSub);
        $(this).addClass('on');
        if($(this).attr('value') == "0"){
            dlgForm.find("#purgeURLarea").hide();
        }else{
            dlgForm.find("#purgeURLarea").show();
        }
    }

    function purgeTypeClickSub(){
        $(this).removeClass('on');
    }
        
    dlgForm.find("#btn_PurgeCancel_TOP").unbind("click").bind("click", cancelTopPurgePop);
    dlgForm.find("#btn_PurgeCancel").unbind("click").bind("click", cancelTopPurgePop);

    function cancelTopPurgePop(){
        dlgForm.dialog("close");
    }
    
    $("#purge_file").keyup(function (e){
        var content = $(this).val();

        if(content.length>5000){
            $(this).val(content.substring(0,5000));
            showCommonNoLangErrorMsg("", "최대 5000자 이내로 입력 가능합니다.");
            return;
        }
    });
    
    //Purge 퍼튼 클릭
    dlgForm.find("#btn_PurgeOk").unbind("click").bind("click", purgeOK); 
    function purgeOK(){
        var purgeurl = dlgForm.find("#purge_file").val();
        var purge_type =null;
        $("#purge_type li span").each(getPurgeType);
        function getPurgeType(){
            if($(this).hasClass('on')){
                purge_type = $(this).attr('value');
            }
        }
        var hard_purge_yn = $("#hardPurgeUse").is(":checked");
        
        if(purge_type == "1"){
            //파일지정 선택
            if (purgeurl == "") {
                showCommonNoLangErrorMsg("파일명 확인", "파일명을 입력해주세요.");
                return;
            }
            purge_type = "no";
        }else{
            purge_type = "yes";
        }
        
        if(!hard_purge_yn){
            hard_purge_yn = "no";
        }else{
            hard_purge_yn = "yes";
        }
        
        var purge_arr = purgeurl.split("\n");
        if(purge_arr.length > 30){
            showCommonNoLangErrorMsg("", "URL단위 Purge시, 한번에 최대 30개 파일입력 가능합니다.");
            return;
        }
        
        $("#purge_OkUrl").empty();
        $("#purge_FailUrl").empty();
        
        for (var p = 0; p < purge_arr.length; p++) {
            var temp_arr = purge_arr[p].split(".");

//----- Start 2011. 10. 18 commented by shcho
                var temp = null;
                            
            if(temp_arr.length >= 2) {
                temp = temp_arr[temp_arr.length-1].toLowerCase();
            }
            
//----- Start 2011. 10. 18 commented by shcho
            //스트리밍, 다운로드 모두 같은 url 전송
        }
        
        // purge API svc_type 필수값 추가
        urlOkNm = "";
        dlgForm.dialog("close");
        var success_msg = selectedRow.data("svc_name") + " purge 시작";
        add_noti_message("/console/d/osadvcdnlist", success_msg);
        process_toast_popup("CDN", success_msg, true);
        var params = {id : svc_id, hardPurge: hard_purge_yn, purgeAll : purge_type, urls : purge_arr};
        $.ajax({
            url : "/cdn/resources/purge"
            , type : "POST"
            , contentType: "application/json"
            , data : JSON.stringify(params)
            , dataType : "json"
            , success : function(json) {
                if(json.status == "29") { /* IAM 사용자 정책 처리 */
                    commonErrorMessage("29");
                    return;
                }
                if(json.status == '00'){
                    success_msg = selectedRow.data("svc_name") + " purge 성공";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, true);
                    setTimeout(() =>  call_originList(), 3000);
                }else{
                    success_msg = selectedRow.data("svc_name") + " purge 실패";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, false);
                }
            }
            ,error: function(XMLHttpResponse) {
                success_msg = selectedRow.data("svc_name") + " purge 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
        });    
    }
}

// 새로 추가 (첫주)
function checkDomainOrIP(str) {
    // IPv4 주소 검사용 정규식
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // 도메인 이름 검사용 정규식
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

    return ipPattern.test(str) || domainPattern.test(str);
}

// 새로 추가 (첫주)
function checkPort(port) {
    //0~65535 사이의 정수
    const portPattern = /^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3}|0)$/;

    return portPattern.test(port);
}


// 한글이나 공백을 포함하지 않는 정규 표현식
function CheckString(str) {
    const pattern = /^[a-zA-Z0-9]+$/;

    // 주어진 문자열이 해당 패턴에 부합하는지 검사
    return pattern.test(str);
}
// CDN Update
function call_CDN_Stop(svc_id, svc_name){
    var success_msg = svc_name + " 수정 시작";
    add_noti_message("/console/d/osadvcdnlist", success_msg);
    process_toast_popup("CDN", success_msg, true);

    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />정지중');
    $("#dialog_CDN_Stop").dialog("close");
    var stopURL = "/cdn/stop/" + svc_id;
    $.ajax({
        url : stopURL
        , type : "PUT"
        , data : null
        , dataType : "json"
        , success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if (json.status == "00") {
                success_msg = svc_name + " 정지 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
            }else{
                success_msg = svc_name + " 정지 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
            setTimeout(() =>  call_resourceList(), 3000);
        }
    });
}

function process_toast_popup(toast_title, toast_contents, success_yn) {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000
    };

    toast_title = sanitizeXSS(toast_title);
    toast_contents = sanitizeXSS(toast_contents);
    if(success_yn) {
        toastr.success("", toast_title + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + toast_contents);
    } else {
        toastr.error("", toast_title + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + toast_contents);
    }
}
function set_noti_message_count() {
    noti_cnt = get_noti_message().length;

    $("#noti_message_box").show();

    if(noti_cnt == 0) {
        $("#noti_count").hide();
    } else {
        $("#noti_count").show();
        $("#noti_count").text(noti_cnt);
    }
}
function get_noti_message() {
    var noti_data = sessionStorage.getItem("os_console_noti");
    var console_noti_lists = [];

    if(noti_data) {
        console_noti_lists = JSON.parse(noti_data);
    }

    return console_noti_lists;
}
function add_noti_message(resource_url, result_message) {
    var console_noti_lists = [];

    var obj_id        = new Date().getTime();
    var event_time    = "2023-12-18 14:30:50";

    var new_noti = new Object();
    new_noti.url        = resource_url;
    new_noti.message    = result_message;
    new_noti.id        = obj_id;
    new_noti.time        = event_time;

    //Getters
    var storedData = sessionStorage.getItem("os_console_noti");

    if(storedData) {
        console_noti_lists = JSON.parse(storedData);
    }

    console_noti_lists.splice(0, 0, new_noti);

    sessionStorage.removeItem("os_console_noti");

    sessionStorage.setItem("os_console_noti",  JSON.stringify(console_noti_lists));

    set_noti_message_count();
    set_notice_lists();
}
function set_notice_lists() {
    $("#noti_alm_tbody").find('tr').remove();
    var noti_html = '<tr class="pop_tst_t notice_clss">';
    noti_html += '<td><img src="/images/coni/Toast_Info.svg" alt="공지" />공지</td>';
    noti_html += '<td><img src="/images/coni/toast_new.svg" alt="new" />' + '주의'+ '</td>';
    noti_html += '</tr>';
    noti_html += '<tr class="pop_tst_c notice_clss">';
    noti_html += '<td colspan="3"><p>' + '경고' + '</p></td>';
    noti_html += '</tr>';

    $("#noti_alm_tbody").append(noti_html);
}

function set_scroll() {
    // 테이블 헤더의 높이는 정상 42임. 42보다 작게해서 스크롤이 생기도록함(colResizible 관련 크기 조정을 위해서).
    if(check_y_scroll()) {
        $("#headTableDiv").height(41);
    }else{
        if($("#table_head_area").height() == 42){
            $("#headTableDiv").height(43);
        }else{
            setTimeout(function(){
                $("#headTableDiv").height($("#table_head_area").height());
            }, 1000);
        }
    }
    // 상단테이블과 하단테이블의 스크롤이 동일하게 되도록 설정
    document.getElementById("headTableDiv").scrollLeft = document.getElementById("dtailTableDiv").scrollLeft;
}
function button_cdnDetail_event(e){
    e.preventDefault();
    if($(this).hasClass("action_disabled")){
        return false;
    }
    event_cdnDetail(e);
}

function set_all_tooltip() {
    var destElements = document.getElementsByClassName("tooltip_obj");

    for(var i=0; i<destElements.length; i++) {
        show_tooltip(destElements[i].id, "N");
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


//공통 에러 팝업 메세지 
//portal.common.popup.js
function showCommonNoLangErrorMsg(title_cls, msg_cls, close_function){
    
    $("#dialogCommonErrorMsg").remove();
    var el_dialog = $("#dialogCommonErrorMsg");
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg" style="width:500px;top:auto !important; display:none;"> ');
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX" onclick="CloseErrorMsg()"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push('    <div class="body"> ');
        arrHtml.push('    <div class="con ac"> ');
        arrHtml.push('    <p class="box_txtl ac mt20" id="commonErrMsgDesc"></p> ');
        arrHtml.push('    <div class="btn_box mt40"> ');
        arrHtml.push('    <div> ');
        arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" onclick="CloseErrorMsg()">확인</a></div> ');
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
    // //확인버튼
    // var returnVal = get_console_messages("txt_lang_confirm");
    // $("#commonErrChk").html(returnVal); 
    //다국어 적용 end
    
    el_dialog.dialog("open");
    // add_active_popup(el_dialog.attr("id"));
    
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

function CloseErrorMsg(){
    $("#dialogCommonErrorMsg").remove();
}

//공백제거
function trim(val) {
    if(val == null) {
        return null;
    }
    
    return val.replace(/^\s*/, "").replace(/\s*$/, "");
}