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
    }
};