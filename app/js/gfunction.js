var gfun={
    formatFileSize : function(size){
        if(!size){return '';}
        if (size>=1024*1024*1204){
            size = parseFloat(size/(1024*1024*1204)).toFixed(1)+'GB';
        }
        else if(size >= 1024*1024){
            size = parseFloat(size / (1024*1024)).toFixed(1) + 'MB';
        }
        else if(size >= 1024){
            size = parseFloat(size / 1024).toFixed(1) + 'KB';
        }
        else{
            size = parseFloat(size).toFixed(1) + 'B';
        }
        return size;
    },
    sicon:function(val){
        if(val){
            return '<img src="'+val+'">'; 
        }else{
            return '<img src="'+images_path+'folder.gif">';
        }
    },
    ishaspaper: function(val){
        var rcd = arguments[2];
        var isdir = rcd.get('fs_isdir');
        if(val=='1' && isdir=='0'){
            return '有';
        }else if(val=='0' && isdir=='0'){
            return '无'; 
        }else{
            return '';
        }
    },    
    isencrypt : function(val){
        if(val=='1'){
            return '<font color="red">已加密</font>';
        }else if(val=='0'){
            return '否'; 
        }else{
            return '';
        }
    },
    /* obj to json convert */
    Serialize:function(obj){ 
        switch(obj.constructor){     
            case Object:     
            var str = "{";     
            for(var o in obj){     
                str += o + ":" + Serialize(obj[o]) +",";     
            }     
            if(str.substr(str.length-1) == ",")     
                str = str.substr(0,str.length -1);     
            return str + "}";     
            break;     
            case Array:                 
            var str = "[";     
            for(var o in obj){     
                str += Serialize(obj[o]) +",";     
            }     
            if(str.substr(str.length-1) == ",")     
                str = str.substr(0,str.length -1);     
            return str + "]";     
            break;     
            case Boolean:     
                return "\"" + obj.toString() + "\"";     
                break;     
            case Date:     
                return "\"" + obj.toString() + "\"";     
                break;     
            case Function:     
                break;     
            case Number:     
                return "\"" + obj.toString() + "\"";     
                break;      
            case String:     
                return "\"" + obj.toString() + "\"";     
                break;         
        }   
    },
    getauth: function(){
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++)
            {
            var aCrumb = aCookie[i].split("=");
            if ('s_auth' == aCrumb[0]) 
                return unescape(aCrumb[1]);
        }
        return ""; 
    },    
    formatFiletype: function(suffix){
        var type = suffix.substr(1);
        var pic_type_arr = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'bmp'];    
        var video_type_arr = ['h264', '3gp', 'asx', 'avi', 'flv', 'mpg', 'mp4', 'mpeg', 'mkv', 'ogv', 'rm', 'rmvb', 'wmv', 'mov', 'divx', 'xvid'];    
        var audio_type_arr = ['mp3', 'wma', 'wav', 'ogg', 'ra']; 
        if(type=='pdf'){
            var rs = 'image/ico/16x16/pdf-icon.png';
        } else if(Ext.Array.contains(pic_type_arr, type)){
            var rs = 'image/ico/16x16/picture-icon.png';
        } else if(Ext.Array.contains(video_type_arr, type)){
            var rs = 'image/ico/16x16/video-icon.png';
        } else if(Ext.Array.contains(audio_type_arr, type)){
            var rs = 'image/ico/16x16/audio-icon.png';
        } else if(type=='ai'){
            var rs = 'image/ico/16x16/ai-icon.png';
        } else if(type=='doc'){
            var rs = 'image/ico/16x16/doc-icon.png';
        } else if(type=='docx'){
            var rs = 'image/ico/16x16/docx-icon.png';
        } else if(type=='dwg'){
            var rs = 'image/ico/16x16/dwg-icon.png';
        } else if(type=='ppt'){
            var rs = 'image/ico/16x16/ppt-icon.png';
        } else if(type=='pptx'){
            var rs = 'image/ico/16x16/pptx-icon.png';
        } else if(type=='psd'){
            var rs = 'image/ico/16x16/psd-icon.png';
        } else if(type=='rar'){
            var rs = 'image/ico/16x16/rar-icon.png';
        } else if(type=='swf'){
            var rs = 'image/ico/16x16/swf-icon.png';
        } else if(type=='xls'){
            var rs = 'image/ico/16x16/xls-icon.png';
        } else if(type=='xlsx'){
            var rs = 'image/ico/16x16/xlsx-icon.png';
        } else if(type=='zip'){
            var rs = 'image/ico/16x16/zip-icon.png';
        } else if(type=='7z'){
            var rs = 'image/ico/16x16/7z-icon.png';
        } else {
            var rs = 'image/templates.png';
        }
        if(arguments[1]=='url'){
            return rs;
        }else{
            return '<img src="'+rs+'">';   
        }
    },
    getusergrade:function(val){
        val=val.toString();
        pstr='';
        var p=val.split(',');
        for(var j=0;j<p.length;j++){
            if(p[j]==0){
                pstr+='普通组员,' 
            }else if(p[j]==1){
                pstr+='组文件管理员,' 
            }else if(p[j]==2){
                pstr+='工作组领导,'
            }else if(p[j]==3){
                pstr+='部门负责人,'
            }else if(p[j]==4){
                pstr+='项目部负责人,'
            }else if(p[j]==99){
                pstr+='系统管理员,'
            } else if(p[j]==98){
                pstr+='系统监察员,'
            } 
        }

        return pstr;
    },
    addpowersettingshow:function(){
        var ret=[];
        if(login_user.u_grade>90){
            ret = [{ boxLabel: '普通组员', name: 'grade[]', inputValue: '0'},{ boxLabel: '组文件管理员', name: 'grade[]', inputValue: '1'},{ boxLabel: '工作组领导', name: 'grade[]', inputValue: '2'},{ boxLabel: '部门负责人', name: 'grade[]', inputValue: '3'},{ boxLabel: '项目部负责人', name: 'grade[]', inputValue: '4' },{ boxLabel: '系统管理员', name: 'grade[]', inputValue: '99' },{ boxLabel: '系统监察员', name: 'grade[]', inputValue: '98' }];
        } else {
            ret=[{ boxLabel: '普通组员', name: 'grade[]', inputValue: '0'},{ boxLabel: '组文件管理员', name: 'grade[]', inputValue: '1'},{ boxLabel: '工作组领导', name: 'grade[]', inputValue: '2' }];
        }
        return ret;
    }

};