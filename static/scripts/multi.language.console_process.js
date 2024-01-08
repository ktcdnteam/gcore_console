/* console page별 메시지 id를 지정한다
 *  page명 : [messageid_1, messageid_2,....]
 *  해당 page명은 실제 message의 다국어를 처리하기 위한 load_console_message function의 입력값이 됨.
 */
//var message_list = {
//        "index" : ["conEntBtn", "arch_example", "arch_example_desc", "arch_example_detail", "succ_example", "latest_news"],
//        "csserver" : ["em_svr_name", "button_vmSearch", "svr_noti_1", "none_info_toggle", "svr_noti_2", "svr_bottm_tab",
//                      "view_svr_name", "view_svr_distinct", "view_svr_os", "view_svr_spec", "view_svr_state", "view_svr_console",
//                      "button_vmHA", "button_vmScale", "button_vmCip", "button_vmCip_unlink", "button_vmStart", "button_vmStop", "button_vmReboot", "button_vmPassword", "button_vmRestore", "button_vmDelete",
//                      "bottom_console_tip"],
//        "page3" : ["conEntBtn", "arch_example", "arch_example_desc", "arch_example_detail", "succ_example", "latest_news"]
//};

/* message(다국어) 파일의 우치를 지정함
 * popup인 경우 /message_resource/popup/
 * portal인 경우 /message_resource/portal/(예정) 형태로 됨.
 * 해당 디렉토리 밑에는 각 page별 다국어 메시지 파일이 들어 있다(현재는 국문과 영문)
 */

var common_map          = null;
var page_map          = null;
var common_popup_map = null;
var page_popup_map     = null;

function load_console_messages(page_name) {
    var dest_path = "/message_resource/console/";
    var dest_lang = get_lang_cookie();
       
    if(dest_lang == null) {
        dest_lang = "ko";
    } else if(dest_lang == "en") {
        dest_lang = "en";
    } else {
        dest_lang = "ko";
    }

    //공통
    $.i18n.properties({
        name: "common",    // 다국어를 처리할 대상 page
        path: dest_path,    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            common_map = $.i18n.map;
            for (var k in $.i18n.map){
                if (typeof $.i18n.map[k] !== 'function') {
                    var dest_id = k;
                    var dest_val = $.i18n.map[k];
                    dest_id = "." + dest_id;
                    if($('td').find(dest_id).length > 0){
                        $(dest_id).html(dest_val);
                    } else if($(dest_id).find('img').length > 0 || $(dest_id).find('span').length > 0){
                        //alt value 변경
                        set_alt($(dest_id), dest_val, "Y");
                        //title vlaue 변경
                        set_title($(dest_id), dest_val, "Y");
                    } else{
                        $(dest_id).text(dest_val);
                        $(dest_id).html(dest_val);
                        //$(dest_id).show();
                        
                        //title vlaue 변경
                        set_title($(dest_id), dest_val);
                        
                        //alt value 변경
                        set_alt($(dest_id), dest_val);
                        
                        //label value 변경
                        set_label($(dest_id),dest_val);
                    }
                }
            }
        }
    });
    
    //각 페이지
    $.i18n.properties({
        name: page_name,    // 다국어를 처리할 대상 page
        path: dest_path,    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            page_map = $.i18n.map;
            for (var k in $.i18n.map){
                if (typeof $.i18n.map[k] !== 'function') {

                    var dest_id = k;
                    var dest_val = $.i18n.map[k];
                    dest_id = "." + dest_id;
                    
                    if($('td').find(dest_id).length > 0){
                        $(dest_id).html(dest_val);
                    } else if($(dest_id).find('img').length > 0) {
                        //alt value 변경
                        set_alt($(dest_id), dest_val, "Y");
                        //title vlaue 변경
                        set_title($(dest_id), dest_val, "Y");
                    } else if($(dest_id).find('span').length > 0){
                        $(dest_id).text(dest_val);
                        $(dest_id).html(dest_val);
                        
                        set_alt($(dest_id), dest_val, "Y");
                        //title vlaue 변경
                        set_title($(dest_id), dest_val, "Y");
                    } else if($(dest_id).attr('placeholder')){
                        $(dest_id).attr('placeholder', dest_val);
                        set_title($(dest_id), dest_val, "Y");
                    } else{
                        $(dest_id).text(dest_val);
                        $(dest_id).html(dest_val);
                        //$(dest_id).show();
                        
                        //title vlaue 변경
                        set_title($(dest_id), dest_val);
                        
                        //alt value 변경
                        set_alt($(dest_id), dest_val);
                        
                        //label value 변경
                        set_label($(dest_id),dest_val);
                    }
                }
            }
        }
    });
    
    
    dest_path = "/message_resource/popup/";
    
    //페이지팝업
    $.i18n.properties({
        name: page_name + "_errmsg_popup",    // 다국어를 처리할 대상 page
        path: dest_path,                    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            page_popup_map = $.i18n.map;
        }
    });
}

function load_popup_messages(){
    
    var dest_path = "/message_resource/popup/";
    var dest_lang = get_lang_cookie();
       
    if(dest_lang == null) {
        dest_lang = "ko";
    } else if(dest_lang == "en") {
        dest_lang = "en";
    } else {
        dest_lang = "ko";
    }
    
    //공통팝업
    $.i18n.properties({
        name: "common_errmsg_popup",    // 다국어를 처리할 대상 page
        path: dest_path,                // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            common_popup_map = $.i18n.map;
        }
    });
    
}

//해당단어의 message(값) return
//page_name 파일명
//des_word 찾으려는 단어의 ID
function get_console_messages(dest_word){

    var dest_val = "";
    
    try{
        dest_val = common_map[dest_word];
        return dest_val;
    }catch(e){    
    }
    
    try{
        if(dest_val == ""){
            dest_val = page_map[dest_word];
            return dest_val;
        }
    }catch(e){    
    }
    
    try{
        if(dest_val == ""){
            dest_val = common_popup_map[dest_word];
            return dest_val;
        }
    }catch(e){    
    }
    
    try{
        if(dest_val == ""){
            dest_val = page_popup_map[dest_word];
            return dest_val;
        }
    }catch(e){    
    }
    
    
    return dest_val;
}

//title vlaue 변경
//type가 Y인 경우 ===> title이 무조건 보여도 상관없는 경우 ex. 이미지, anchor
function set_title(dest_id, dest_val, type){
    //title이 있다면 change...
    if(type == "Y" || $(dest_id).attr('title')){
        $(dest_id).attr('title',dest_val);
        //document.getElementsByClassName(dest_id).title = dest_val;
    }
}

//alt vlaue 변경
//type가 Y인 경우 ===> alt가 무조건 보여도 상관없는 경우 ex. 이미지, anchor
function set_alt(dest_id, dest_val, type){
    //title이 있다면 change...
    if(type == "Y" || $(dest_id).attr('alt')){
        $(dest_id).attr('alt',dest_val);
        //document.getElementsByClassName(dest_id).title = dest_val;
    }
}

//label vlaue 변경
function set_label(dest_id, dest_val){
    if($(dest_id).is("label")){
        try{
            $(dest_id).innerText = dest_val;
        } catch(err){
        }
        
        try{
            $(dest_id).innerContent = dest_val;
        } catch(err){
        }
        
        try{
            $(dest_id).innerHTML = dest_val;
        } catch(err){
        }
    }
}




function get_word_messages(dest_word) {
    var dest_path = "/message_resource/word/";
    var dest_lang = get_lang_cookie();
    var dest_file = "word";
    
    if(dest_lang == null) {
        dest_lang = "ko";
    } else if(dest_lang == "en") {
        dest_lang = "en";
    } else {
        dest_lang = "ko";
    }
    
    var return_word = "";
    
    $.i18n.properties({
        name: dest_file,    // 다국어를 처리할 대상 page
        path: dest_path,    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
               return_word = $.i18n.prop(dest_word);
        }
    });
    
    return return_word;
}

function set_word_messages(dest_msg_id, dest_obj) {
    var dest_path = "/message_resource/word/";
    var dest_lang = get_lang_cookie();
    var dest_file = "word";
    
    if(dest_lang == null) {
        dest_lang = "ko";
    } else if(dest_lang == "en") {
        dest_lang = "en";
    } else {
        dest_lang = "ko";
    }
    
    // message_id와 tag명이 같은 경우
    if(dest_obj == null) {
        var obj_name = "#" + dest_msg_id;
        dest_obj = $(obj_name);
    }
    
    $.i18n.properties({
        name: dest_file,    // 다국어를 처리할 대상 page
        path: dest_path,    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            dest_obj.html($.i18n.prop(dest_msg_id));
            $(dest_obj).show();
        }
    });
}

function set_title_messages(dest_msg_id) {
    var dest_path = "/message_resource/word/";
    var dest_lang = get_lang_cookie();
    var dest_file = "word";
    
    if(dest_lang == null) {
        dest_lang = "ko";
    } else if(dest_lang == "en") {
        dest_lang = "en";
    } else {
        dest_lang = "ko";
    }

    $.i18n.properties({
        name: dest_file,    // 다국어를 처리할 대상 page
        path: dest_path,    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            document.getElementById(dest_msg_id).title = $.i18n.prop(dest_msg_id + "_title");
        }
    });
}

function set_label_messages(dest_msg_id) {
    var dest_path = "/message_resource/word/";
    var dest_lang = get_lang_cookie();
    var dest_file = "word";
    
    if(dest_lang == null) {
        dest_lang = "ko";
    } else if(dest_lang == "en") {
        dest_lang = "en";
    } else {
        dest_lang = "ko";
    }

    $.i18n.properties({
        name: dest_file,    // 다국어를 처리할 대상 page
        path: dest_path,    // 다국어 메시지가 들어 있는 디렉토리
        mode: 'both',
        cache:true,
        language: dest_lang,// 사용자가 선택한 언어
        callback: function() {
            try{
                document.getElementById(dest_msg_id).innerText = $.i18n.prop(dest_msg_id);
            } catch(err){
            }
            
            try{
                document.getElementById(dest_msg_id).innerContent = $.i18n.prop(dest_msg_id);
            } catch(err){
            }
            
            try{
                document.getElementById(dest_msg_id).innerHTML = $.i18n.prop(dest_msg_id);
            } catch(err){
            }
        }
    });
}