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
    }

};