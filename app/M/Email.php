<?php
/**
* @name      M_Email.php
* @describe  Email操作类
* @author    qinqf
* @todo       
* @changelog  
*/
require_once APP_PATH.'/Libs/PEAR/Net/POP3.php';
require APP_PATH.'/Libs/classes/mail/EncodingConverter.class.php';
include APP_PATH.'/Libs/classes/mail/mime_parser.class.php';
class M_Email extends M_Model
{
    static $db;
    static $document_table = 'fs_tree';
    static $share_document_table = 'fs_share_tree';
    static $mail_content_table = 'fs_mail_contents';
    static $mail_datas_table = 'fs_mail_datas';
    static $log_table = 'fs_log';
    /*** 初始化操作 */
    public static function init(){
        self::$db = parent::init();     
    }

    /**
    * Email附件操作
    * 
    */
    public static function moveemail($data, $login_user_info) {
        self::init();
        set_time_limit(0);
        $emailtreepathvalue = isset($data['emailtreepathvalue']) ? $data['emailtreepathvalue'] : '';
        $emailtreepathid = isset($data['emailtreepathid']) ? $data['emailtreepathid'] : '';  //父级目录ID
        $fs_is_share = isset($data['fs_is_share']) ? $data['fs_is_share'] : 0;
        $emailmsgid = isset($data['emailmsgid']) ? $data['emailmsgid'] : '';
        $emailuidl = isset($data['emailuidl']) ? $data['emailuidl'] : '';
        $emailsubject = !empty($data['emailsubject']) ? $data['emailsubject'] : '无主题';
        $useremail = $login_user_info['u_email'];
        $password = isset($data['password']) ? $data['password'] : '';
        if(!$emailtreepathvalue){
            $rs['msg'] = '操作失败！';
            $rs['success'] = false;
            return $rs;
        }
        #开始下载EMAIL文件
        global $base_path;
        $oldmailpath = APP_PATH . '/POP3/tmp/' . $useremail . DS . $emailmsgid;

        $url = $base_path . 'POP3/test.php?op=save&id='.$emailmsgid.'&user='.$useremail.'&pass='.$password;
        /*
        if(function_exists('curl_init')){
        $ch = curl_init ();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_TIMEOUT, $timeOut );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, TRUE );
        $content = curl_exec ( $ch );
        curl_close($ch);
        }else
        */
        #判断附件已经下载过，如果已经下载则直接进行文件移动操作，否则，下载移动
        if(!is_dir($oldmailpath) || ZF_Libs_IOFile::judge_empty_dir($oldmailpath)){
            $opts = array( 
            'http' => array( 
            'method'=>"GET", 
            'header'=>"Content-Type: text/html; charset=utf-8" 
            ) 
            ); 
            $timeOut = 360;
            $context = stream_context_create($opts); 
            if(function_exists('curl_init')){
                $ch = curl_init ();
                curl_setopt ( $ch, CURLOPT_URL, $url );
                curl_setopt ( $ch, CURLOPT_HEADER, 0 );
                curl_setopt ( $ch, CURLOPT_TIMEOUT, $timeOut );
                curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, TRUE );
                $content = curl_exec ( $ch );
                curl_close($ch);
            }elseif(function_exists('file_get_contents')){
                $content = @file_get_contents($url);
            }else{
                $rs['msg'] = '请检查环境配置！';
                $rs['success'] = false;
                return $rs;
            }
        }else{
            $content = json_encode(array('status'=>'ok'));
        }

        if(false!==$content){
            $res = json_decode($content);
            if(!empty($res->status) && $res->status == 'ok'){
                #下载成功在父级目录（$emailtreepathid）中建立子目录 【目录编号为自动编号， 目录名为邮件标题】
                #1、获取自动编号目录ID
                //$maxid = intval(M_Document::getMaxfilecode(array('fs_parent'=>$emailtreepathid))) + 1;
                $sql = "select * from " . self::$document_table . " where fs_name='email{$emailmsgid}' and fs_parent='{$emailtreepathid}' limit 1";
                $record = self::$db->get_col($sql);
                if(!$record){
                    $newhashname = parent::hashname($emailmsgid);
                    $newmailpath = PROJECT_DOC_PATH.M_Document::splitdocpath(M_Document::getParentpath($emailtreepathid)) . DS . $newhashname;
                    if(ZF_Libs_IOFile::mkdir($newmailpath)){ #创建目录成功，开始拷贝文件
                        $fs_code = $emailtreepathvalue . '-' . "email{$emailmsgid}";
                        #在数据库中插入新创建的目录
                        $time = date('Y-m-d H:i:s');
                        $sql = "insert into " . self::$document_table . " set 
                        fs_name='email{$emailmsgid}',
                        fs_parent='{$emailtreepathid}',
                        fs_isdir='1',
                        fs_group='{$login_user_info['u_parent']}',
                        fs_user='{$login_user_info['u_id']}',
                        fs_create='{$time}',
                        fs_intro='{$emailsubject}',
                        fs_hashname='{$newhashname}',
                        fs_code='{$fs_code}',
                        fs_is_share='{$fs_is_share}'";

                        if(self::$db->query($sql)){
                            $parent_insertid = self::$db->last_insert_id();
                            /*对目录的fs_id_path进行设置， 方便在前端进行目录树的展开和收缩*/
                            if(!empty($record['fs_id_path'])){
                                $fs_id_path = $record['fs_id_path'] . '-' . $parent_insertid;
                            }else{
                                $fs_id_path = substr(M_Document::getFileIdpath($parent_insertid), 1);
                            }
                            $sql = "update ". self::$document_table . " set fs_id_path='{$fs_id_path}' where fs_id='{$parent_insertid}'";
                            self::$db->query($sql);

                            #记录文件操作日志
                            $doclog = array('fs_id'=>$parent_insertid, 'fs_name'=>'email'.$emailmsgid, 'fs_hashname'=>$newhashname, 'fs_intro'=>$emailsubject, 'fs_size'=>'', 'fs_type'=>'', 'log_user'=>$login_user_info['u_id'], 'log_type'=>0, 'log_lastname'=>'email'.$emailmsgid);
                            M_Log::doclog($doclog);
                            #记录系统操作日志
                            M_Log::systemlog(array('login_user_name'=>$login_user_info['u_name'], 'login_user_email'=>$login_user_info['u_email'], 'desc'=>'创建目录 '.substr(M_Document::getFilenamepath($parent_insertid), 1).'（'.$emailsubject.'）  操作成功！'));


                            #插入数据库中成功, 开始向创建的目录中移动文件 
                            $oldDir = $oldmailpath;
                            $aimDir = $newmailpath;

                            /*移动文件时对文件进行编号*/
                            $aimDir = str_replace('', '/', $aimDir); 
                            $aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/'; 
                            $oldDir = str_replace('', '/', $oldDir); 
                            $oldDir = substr($oldDir, -1) == '/' ? $oldDir : $oldDir . '/'; 
                            if (!is_dir($oldDir)) { 
                                $rs['msg'] = '原文件目录不存在';
                                $rs['success'] = false;
                                return $rs;
                            } 
                            if (!file_exists($aimDir)) { 
                                $rs['msg'] = '目标文件目录不存在';
                                $rs['success'] = false;
                                return $rs; 
                            } 
                            $dirHandle = opendir($oldDir); 
                            while (false !== ($file = readdir($dirHandle))) {
                                if ($file == '.' || $file == '..') { 
                                    continue; 
                                }
                                if (!is_dir($oldDir . $file)) {
                                    $size = filesize($oldDir . $file);
                                    #开始对目标文件进行编号和hashname添加
                                    $filehashname = parent::hashname($file);
                                    $filetype = substr($file, strrpos($file, '.')+1);
                                    if($filetype == 'eml'){
                                        $fileintro = $emailsubject;
                                    }else{
                                        $fileinfo = trim(self::decode_mime_string($file));
                                        $info  =  pathinfo ($fileinfo); 
                                        $fileintro = $info['filename'];
                                        $filetype = $info['extension'];
                                    }

                                    $aimFile = $aimDir . $filehashname . '.' . $filetype;
                                    if(copy($oldDir . $file, $aimFile)){
                                        #操作成功， 进行插入数据库文件操作

                                        $last_arr = M_Document::getMaxfilecode(array('fs_parent'=>$parent_insertid));
                                        $maxfileid = $last_arr['data']+1;
                                        $time = date('Y-m-d H:i:s');
                                        $sql = "insert into " . self::$document_table . " set 
                                        fs_name='{$maxfileid}',
                                        fs_parent='{$parent_insertid}',
                                        fs_isdir='0',
                                        fs_group='{$login_user_info['u_parent']}',
                                        fs_user='{$login_user_info['u_id']}',
                                        fs_create='{$time}',
                                        fs_intro='{$fileintro}',
                                        fs_type='{$filetype}',
                                        fs_size='{$size}',
                                        fs_hashname='{$filehashname}',
                                        fs_is_share='{$fs_is_share}'";
                                        if(self::$db->query($sql)){
                                            $insertid = self::$db->last_insert_id();
                                            $rs['msg'] = '操作成功！';
                                            $rs['success'] = true;
                                            #记录文件操作日志
                                            $doclog = array('fs_id'=>$insertid, 'fs_name'=>$maxfileid, 'fs_hashname'=>$filehashname, 'fs_intro'=>$fileintro, 'fs_size'=>$size, 'fs_type'=>$filetype, 'log_user'=>$login_user_info['u_id'], 'log_type'=>0, 'log_lastname'=>$maxfileid);
                                            M_Log::doclog($doclog);
                                            #记录系统操作日志
                                            M_Log::systemlog(array('login_user_name'=>$login_user_info['u_name'], 'login_user_email'=>$login_user_info['u_email'], 'desc'=>'在目录 '.substr(M_Document::getFilenamepath($parent_insertid), 1).'（'.$emailsubject.'） 下创建文件'.substr(M_Document::getFilenamepath($insertid), 1).' 操作成功！'));
                                        }else{
                                            $rs['msg'] = '操作失败！';
                                            $rs['success'] = false;
                                        }
                                    } else {
                                        $rs['msg'] = '复制操作失败！';
                                        $rs['success'] = false;
                                    } 
                                }
                            } 
                            closedir($dirHandle);
                            return $rs;
                        }else{
                            $rs['msg'] = '插入数据库操作失败！';
                            $rs['success'] = false;
                            return $rs;
                        }

                    }else{
                        $rs['msg'] = '创建目录失败！';
                        $rs['success'] = false;
                        return $rs;
                    }
                }else{
                    $rs['msg'] = '邮件目录已存在！';
                    $rs['success'] = false;
                    return $rs;
                }

            }else{
                $rs['msg'] = '用户名密码错误！';
                $rs['success'] = false;
                return $rs;
            }

        }else{
            $rs['msg'] = '附件下载失败！';
            $rs['success'] = false;
            return $rs; 
        }
    }


    /**
    * put your comment there...
    * 
    * @param string $string
    * @return string
    */
    public static function decode_mime_string($string){
        if(($pos = strpos($string,"=?")) === false) return $string;
        while(!($pos === false)) {
            $newresult .= substr($string,0,$pos);
            $string = substr($string,$pos+2,strlen($string));
            $intpos = strpos($string,"?");
            $charset = substr($string,0,$intpos);
            $enctype = strtolower(substr($string,$intpos+1,1));
            $string = substr($string,$intpos+3,strlen($string));
            $endpos = strpos($string,"?=");
            $mystring = substr($string,0,$endpos);
            $string = substr($string,$endpos+2,strlen($string));
            if($enctype == "q") {
                $mystring = str_replace("_"," ",$mystring);
                $mystring = self::decode_qp($mystring);
            } else if ($enctype == "b")
                    $mystring = base64_decode($mystring);
                $newresult .= $mystring;
            $pos = strpos($string,"=?");
        }
        return mb_convert_encoding($newresult.$string, 'utf-8', $charset);
        //return $newresult.$string;
    }


    /**
    * put your comment there...
    * 
    * @param string $text
    * @return string
    */
    public static function decode_qp($text) {
        $text = quoted_printable_decode($text);
        /*
        $text = str_replace("\r","",$text);
        $text = ereg_replace("=\n", "", $text);
        $text = str_replace("\n","\r\n",$text);
        */
        $text = ereg_replace("=\r", "\r", $text);
        return $text;
    }


    /**
    * Email附件操作
    * 
    */
    public static function moveemailtoshare($data, $login_user_info) {
        self::init();
        set_time_limit(0);
        $emailtreepathvalue = isset($data['emailtreepathvalue']) ? $data['emailtreepathvalue'] : '';
        $emailtreepathid = isset($data['emailtreepathid']) ? $data['emailtreepathid'] : '';  //父级目录ID
        $emailmsgid = isset($data['emailmsgid']) ? $data['emailmsgid'] : '';
        $emailuidl = isset($data['emailuidl']) ? $data['emailuidl'] : '';
        $emailsubject = !empty($data['emailsubject']) ? $data['emailsubject'] : '无主题';
        $useremail = $login_user_info['u_email'];
        $password = isset($data['password']) ? $data['password'] : '';
        if(!$emailtreepathvalue){
            $rs['msg'] = '操作失败！';
            $rs['success'] = false;
            return $rs;
        }

        #判断目标目录是否是登陆用户可以操作的
        $haspower = M_Sharedocument::checksharedocpower($emailtreepathid, $login_user_info);
        if(false===$haspower){
            $rs['msg'] = '无权限操作此目录！';
            $rs['success'] = false;
            return $rs;
        }


        #开始下载EMAIL文件
        global $base_path;
        $oldmailpath = APP_PATH . '/POP3/tmp/' . $useremail . DS . $emailmsgid;

        $url = $base_path . 'POP3/test.php?op=save&id='.$emailmsgid.'&user='.$useremail.'&pass='.$password;
        #判断附件已经下载过，如果已经下载则直接进行文件移动操作，否则，下载移动
        if(!is_dir($oldmailpath) || ZF_Libs_IOFile::judge_empty_dir($oldmailpath)){
            $opts = array( 
            'http' => array( 
            'method'=>"GET", 
            'header'=>"Content-Type: text/html; charset=utf-8" 
            ) 
            ); 
            $timeOut = 360;
            $context = stream_context_create($opts); 
            if(function_exists('curl_init')){
                $ch = curl_init ();
                curl_setopt ( $ch, CURLOPT_URL, $url );
                curl_setopt ( $ch, CURLOPT_HEADER, 0 );
                curl_setopt ( $ch, CURLOPT_TIMEOUT, $timeOut );
                curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, TRUE );
                $content = curl_exec ( $ch );
                curl_close($ch);
            }elseif(function_exists('file_get_contents')){
                $content = @file_get_contents($url);
            }else{
                $rs['msg'] = '请检查环境配置！';
                $rs['success'] = false;
                return $rs;
            }
        }else{
            $content = json_encode(array('status'=>'ok'));
        }

        if(false!==$content){
            $res = json_decode($content);
            if(!empty($res->status) && $res->status == 'ok'){
                #下载成功在父级目录（$emailtreepathid）中建立子目录 【目录编号为自动编号， 目录名为邮件标题】
                #1、获取自动编号目录ID
                //$maxid = intval(M_Document::getMaxfilecode(array('fs_parent'=>$emailtreepathid))) + 1;
                $sql = "select * from " . self::$share_document_table . " where fs_name='email{$emailmsgid}' and fs_parent='{$emailtreepathid}' limit 1";
                $record = self::$db->get_col($sql);
                if(!$record){
                    $newhashname = parent::hashname($emailmsgid);
                    $newmailpath = PROJECT_DOC_PATH.M_Sharedocument::splitdocpath(M_Sharedocument::getParentpath($emailtreepathid)) . DS . $newhashname;
                    if(ZF_Libs_IOFile::mkdir($newmailpath)){ #创建目录成功，开始拷贝文件
                        $fs_code = $emailtreepathvalue . '-' . "email{$emailmsgid}";
                        #在数据库中插入新创建的目录
                        $time = date('Y-m-d H:i:s');
                        $sql = "insert into " . self::$share_document_table . " set 
                        fs_name='email{$emailmsgid}',
                        fs_parent='{$emailtreepathid}',
                        fs_isdir='1',
                        fs_group='{$login_user_info['u_parent']}',
                        fs_user='{$login_user_info['u_id']}',
                        fs_create='{$time}',
                        fs_intro='{$emailsubject}',
                        fs_hashname='{$newhashname}',
                        fs_code='{$fs_code}'";

                        if(self::$db->query($sql)){
                            $parent_insertid = self::$db->last_insert_id();

                            /*对目录的fs_id_path进行设置， 方便在前端进行目录树的展开和收缩*/
                            if(!empty($record['fs_id_path'])){
                                $fs_id_path = $record['fs_id_path'] . '-' . $parent_insertid;
                            }else{
                                $fs_id_path = substr(M_Sharedocument::getFileIdpath($parent_insertid), 1);
                            }
                            $sql = "update ". self::$share_document_table . " set fs_id_path='{$fs_id_path}' where fs_id='{$parent_insertid}'";
                            self::$db->query($sql);

                            #记录系统操作日志
                            M_Log::systemlog(array('login_user_name'=>$login_user_info['u_name'], 'login_user_email'=>$login_user_info['u_email'], 'desc'=>'创建共享目录 '.substr(M_Sharedocument::getFilenamepath($parent_insertid), 1).'（'.$emailsubject.'）  操作成功！'));


                            #插入数据库中成功, 开始向创建的目录中移动文件 
                            $oldDir = $oldmailpath;
                            $aimDir = $newmailpath;

                            /*移动文件时对文件进行编号*/
                            $aimDir = str_replace('', '/', $aimDir); 
                            $aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/'; 
                            $oldDir = str_replace('', '/', $oldDir); 
                            $oldDir = substr($oldDir, -1) == '/' ? $oldDir : $oldDir . '/'; 
                            if (!is_dir($oldDir)) { 
                                $rs['msg'] = '原文件目录不存在';
                                $rs['success'] = false;
                                return $rs;
                            } 
                            if (!file_exists($aimDir)) { 
                                $rs['msg'] = '目标文件目录不存在';
                                $rs['success'] = false;
                                return $rs; 
                            } 
                            $dirHandle = opendir($oldDir); 
                            while (false !== ($file = readdir($dirHandle))) {
                                if ($file == '.' || $file == '..') { 
                                    continue; 
                                }
                                if (!is_dir($oldDir . $file)) {
                                    $size = filesize($oldDir . $file);
                                    #开始对目标文件进行编号和hashname添加
                                    $filehashname = parent::hashname($file);
                                    $filetype = substr($file, strrpos($file, '.')+1);
                                    if($filetype == 'eml'){
                                        $fileintro = $emailsubject;
                                    }else{
                                        $fileinfo = trim(self::decode_mime_string($file));
                                        $info  =  pathinfo ($fileinfo); 
                                        $fileintro = $info['filename'];
                                        $filetype = $info['extension'];
                                    }

                                    $aimFile = $aimDir . $filehashname . '.' . $filetype;
                                    if(copy($oldDir . $file, $aimFile)){
                                        #操作成功， 进行插入数据库文件操作

                                        $last_arr = M_Sharedocument::getMaxfilecode(array('fs_parent'=>$parent_insertid));
                                        $maxfileid = $last_arr['data']+1;
                                        $time = date('Y-m-d H:i:s');
                                        $sql = "insert into " . self::$share_document_table . " set 
                                        fs_name='{$maxfileid}',
                                        fs_parent='{$parent_insertid}',
                                        fs_isdir='0',
                                        fs_group='{$login_user_info['u_parent']}',
                                        fs_user='{$login_user_info['u_id']}',
                                        fs_create='{$time}',
                                        fs_intro='{$fileintro}',
                                        fs_type='{$filetype}',
                                        fs_size='{$size}',
                                        fs_hashname='{$filehashname}'";
                                        if(self::$db->query($sql)){
                                            $insertid = self::$db->last_insert_id();
                                            $rs['msg'] = '操作成功！';
                                            $rs['success'] = true;
                                            #记录系统操作日志
                                            M_Log::systemlog(array('login_user_name'=>$login_user_info['u_name'], 'login_user_email'=>$login_user_info['u_email'], 'desc'=>'在共享目录 '.substr(M_Sharedocument::getFilenamepath($parent_insertid), 1).'（'.$emailsubject.'） 下共享文件'.substr(M_Sharedocument::getFilenamepath($insertid), 1).' 操作成功！'));
                                        }else{
                                            $rs['msg'] = '操作失败！';
                                            $rs['success'] = false;
                                        }
                                    } else {
                                        $rs['msg'] = '复制操作失败！';
                                        $rs['success'] = false;
                                    } 
                                }
                            } 
                            closedir($dirHandle);
                            return $rs;
                        }else{
                            $rs['msg'] = '插入数据库操作失败！';
                            $rs['success'] = false;
                            return $rs;
                        }

                    }else{
                        $rs['msg'] = '创建目录失败！';
                        $rs['success'] = false;
                        return $rs;
                    }
                }else{
                    $rs['msg'] = '邮件目录已存在！';
                    $rs['success'] = false;
                    return $rs;
                }

            }else{
                $rs['msg'] = '用户名密码错误！';
                $rs['success'] = false;
                return $rs;
            }

        }else{
            $rs['msg'] = '附件下载失败！';
            $rs['success'] = false;
            return $rs; 
        }
    }

    /********************************************20140727********************************************/
    public static function getmails($account = null, $err, $succ, $errAccounts, $mailsReceived, $maxPerAccount=10) {
        //why
        $old_memory_limit = ini_get('memory_limit');
        ini_set('memory_limit', '192M');

        $err = 0;
        $succ = 0;
        $errAccounts = array();
        $mailsReceived = 0;
        if (isset($account)) {
            try {
                $isImap = false;
                if (!$isImap) {
                    $mailsReceived += self::getNewPOP3Mails($account, $maxPerAccount);
                } else {
                    $mailsReceived += self::getNewImapMails($account, $maxPerAccount);
                }
                $succ++;
            } catch(Exception $e) {
                $errAccounts[$err]["accountName"] = $account['u_email'];
                $errAccounts[$err]["message"] = $e->getMessage();
                $err++;
            }
        }

        ini_set('memory_limit', $old_memory_limit);
        $ret = array(
        'err' => $err,
        'succ' => $succ,
        'errAccounts' => $errAccounts,
        'mailsReceived' => $mailsReceived
        );
        return $ret;
    }

    /**
    * Gets all new mails from a given mail account
    *
    * @param MailAccount $account
    * @return array
    */
    private static function getNewPOP3Mails($account=array(), $max = 0) {
        //require_once APP_PATH.'/Libs/PEAR/Net/IMAP.php';
        $pop3 = new Net_POP3();
        $received = 0;
        $mail_server = 'pop.126.com';//EMAIL_SERVER;
        // Connect to mail server
        $pop3->connect($mail_server);
        $account['u_email'] = 'qqf1223@126.com';

        if (PEAR::isError($ret=$pop3->login($account['u_email'], $account['emailpwd'], 'USER'))) {
            //$ret->getMessage(); //-ERR Unable to log on
            $result['success'] = false;
            $result['msg'] = '用户名或密码输入错误,请重新输入！';
            exit(json_encode($result));
        }

        $mailsToGet = array();
        $summary = $pop3->getListing();

        $uids = self::getUidsFromAccount($account['u_id']);
        //error_log(var_export($uids, true)."\r\n",  3, 'xxx');
        //error_log(var_export($summary, true)."\r\n",  3, 'xxx');
        $summary = array_reverse($summary, true);
        $i = 0;
        foreach ($summary as $k => $info) {
            if($i == $max){break;}
            if (!in_array($info['uidl'], $uids ,true)) {
                $mailsToGet[] = $k;
            }
            $i++;
        }
        if ($max == 0){
            $toGet = count($mailsToGet);
        }else{
            $toGet = min(count($mailsToGet), $max);
        }

        // fetch newer mails first
        //$mailsToGet = array_reverse($mailsToGet, true);
        $checked = 0;
        //error_log(var_export($mailsToGet, true)."\r\n",  3, 'xxx');
        foreach ($mailsToGet as $idx) {
            if ($toGet <= $checked) break;
            $content = $pop3->getMsg($idx+1); // message index is 1..N
            if ($content != '') {
                $uid = $summary[$idx]['uidl'];
                try {//save data
                    error_log($idx."\r\n",  3, 'xxx');
                    $stop_checking = self::SaveMail($content, $account, $uid);
                    $received++;
                    if ($stop_checking) break;
                } catch (Exception $e) {
                    $e->getMessage();
                    //log
                }
                unset($content);
                $checked++;
            }
        }
        $pop3->disconnect();

        return $received;
    }

    public static function maillist($data, $login_user_info){
        $limit = intval($data['maillistnum']);
        self::init();
        // Get all variables from request
        $sql = "select * from (select * from ". self::$mail_content_table . " where user_id={$login_user_info['u_id']} order by received_date desc limit $limit) as c left join ".self::$mail_datas_table . " as d on d.id=c.object_id";
        $result = self::$db->get_results($sql);
        return $result;
    }

    public static function getUidsFromAccount($user_id){
        self::init();
        self::$mail_content_table;
        $sql = "select uid from ".self::$mail_content_table." where user_id={$user_id}";
        $rows = self::$db->get_results($sql);
        $uids = array();
        if (is_array($rows)) {
            foreach ($rows as $row) {
                $uids[] = $row['uid'];
            }
        }
        return $uids;
    }


    public static function SaveMail($content, $account, $uidl, $state = 0, $imap_folder_name = '', $read = null) {
        try {
            self::init();
            $saveData = array();
            $saveData['content']['account_email'] = $account['u_email'];
            $saveData['content']['user_id'] = $account['u_id'];
            if (strpos($content, '+OK ') > 0) $content = substr($content, strpos($content, '+OK '));
            self::parseMail($content, $decoded, $parsedMail, $warnings);

            $encoding = isset($parsedMail['Encoding']) ? $parsedMail['Encoding']: 'UTF-8';
            $enc_conv = EncodingConverter::instance();

            $to_addresses = self::getAddresses($parsedMail["To"]);

            $from = self::getAddresses($parsedMail["From"]);

            $message_id = self::getHeaderValueFromContent($content, "Message-ID");
            $in_reply_to_id = self::getHeaderValueFromContent($content, "In-Reply-To");

            $uid = trim($uidl);
            if (str_starts_with($uid, '<') && str_ends_with($uid, '>')) {
                $uid = utf8_substr($uid, 1, utf8_strlen($uid, $encoding) - 2, $encoding);
            }
            if ($uid == '') {
                $uid = trim($message_id);
                if ($uid == '') {
                    $uid = isset($parsedMail['Subject']) ? $parsedMail['Subject'] : 'MISSING UID';
                }
                if (str_starts_with($uid, '<') && str_ends_with($uid, '>')) {
                    $uid = utf8_substr($uid, 1, utf8_strlen($uid, $encoding) - 2, $encoding);
                }
            }
            // do not save duplicate emails
            if (self::mailRecordExists($account['u_id'], $uid)) {
                return;
            }

            if (!$from) {
                $parsedMail["From"] = self::getFromAddressFromContent($content);
                $from = isset($parsedMail["From"][0]['address']) ? $parsedMail["From"][0]['address'] : '';
            }

            /*
            $from_spam_junk_folder = strpos(strtolower($imap_folder_name), 'spam') !== FALSE 
            || strpos(strtolower($imap_folder_name), 'junk')  !== FALSE
            || strpos(strtolower($imap_folder_name), 'trash') !== FALSE;

            $user_id = $account['u_id'];
            $max_spam_level = user_config_option('max_spam_level', null, $user_id);
            if ($max_spam_level < 0) $max_spam_level = 0;
            $mail_spam_level = strlen(trim( array_var($decoded[0]['Headers'], 'x-spam-level:', '') ));
            // if max_spam_level >= 10 then nothing goes to junk folder
            $spam_in_subject = false;
            if (config_option('check_spam_in_subject')) {
            $spam_in_subject = strpos_utf(strtoupper(array_var($parsedMail, 'Subject')), "**SPAM**") !== false;
            }
            if (($max_spam_level < 10 && ($mail_spam_level > $max_spam_level || $from_spam_junk_folder)) || $spam_in_subject) {
            $state = 4; // send to Junk folder
            }

            //if you are in the table spam MailSpamFilters
            $spam_email = MailSpamFilters::getFrom($account->getId(),$from);
            if($spam_email) {
            $state = 0;
            if($spam_email[0]->getSpamState() == "spam") {
            $state = 4;
            }
            } else {
            if ($state == 0) {
            if ($from == $account->getEmailAddress()) {
            if (strpos($to_addresses, $from) !== FALSE) $state = 5; //Show in inbox and sent folders
            else $state = 1; //Show only in sent folder
            }
            }
            }
            */
            if (!isset($parsedMail['Subject'])) $parsedMail['Subject'] = '';
            $state = 0;
            //$mail = new MailContent();
            //$mail->setAccountId($account->getId());
            //$mail->setState($state);
            //$mail->setImapFolderName($imap_folder_name);
            $saveData['content']['from'] = $from;
            //$mail->setFrom($from);
            $cc = trim(self::getAddresses($parsedMail["Cc"]));
            if ($cc == '' && $decoded[0] && $decoded[0]['Headers']) {
                $cc = isset($decoded[0]['Headers']['cc:']) ? $decoded[0]['Headers']['cc:'] : '';
            }
            $saveData['data']['cc'] = $cc;
            //$mail->setCc($cc);

            $from_name = trim($parsedMail['From'][0]['name']);        
            $from_encoding = detect_encoding($from_name);    

            if ($from_name == ''){
                $from_name = $from;
            } elseif (strtoupper($encoding) =='KOI8-R' || strtoupper($encoding) =='CP866' || $from_encoding != 'UTF-8' || !$enc_conv->isUtf8RegExp($from_name)){ //KOI8-R and CP866 are Russian encodings which PHP does not detect
                $utf8_from = $enc_conv->convert($encoding, 'UTF-8', $from_name);

                if ($enc_conv->hasError()) {
                    $utf8_from = utf8_encode($from_name);
                }
                $utf8_from = utf8_safe($utf8_from);
                $from_name = $utf8_from;
                $saveData['content']['from_name'] = $utf8_from;
                //$mail->setFromName($utf8_from);
            }

            $subject_aux = $parsedMail['Subject'];
            $subject_encoding = detect_encoding($subject_aux);

            $subject_multipart_encoding = isset($parsedMail['SubjectEncoding']) ? $parsedMail['SubjectEncoding'] : strtoupper($encoding);

            if ($subject_multipart_encoding != 'UTF-8' && ($subject_multipart_encoding =='KOI8-R' || $subject_multipart_encoding =='CP866' || $subject_encoding != 'UTF-8' || !$enc_conv->isUtf8RegExp($subject_aux))){ //KOI8-R and CP866 are Russian encodings which PHP does not detect
                $utf8_subject = $enc_conv->convert($subject_multipart_encoding, 'UTF-8', $subject_aux);

                if ($enc_conv->hasError()) {
                    $utf8_subject = utf8_encode($subject_aux);
                }
                $utf8_subject = utf8_safe($utf8_subject);
                $saveData['data']['subject'] = $utf8_subject; 
                //$mail->setSubject($utf8_subject);
            } else {
                $utf8_subject = utf8_safe($subject_aux);
                $saveData['data']['subject'] = $utf8_subject; 
                //$mail->setSubject($utf8_subject);
            }

            $saveData['data']['to'] = $to_addresses;
            //$mail->setTo($to_addresses);
            $sent_timestamp = false;
            if (array_key_exists("Date", $parsedMail)) {
                $sent_timestamp = strtotime($parsedMail["Date"]);
            }
            if ($sent_timestamp === false || $sent_timestamp === -1 || $sent_timestamp === 0) {
                //$mail->setSentDate(DateTimeValueLib::now());
                $saveData['content']['sent_date'] = date('Y-m-d H:i:s');
            } else {
                $saveData['content']['sent_date'] = date('Y-m-d H:i:s', $sent_timestamp);
                //$mail->setSentDate(new DateTimeValue($sent_timestamp));
            }

            $received_timestamp = false;
            if (array_key_exists("Received", $parsedMail) && $parsedMail["Received"]) {
                $received_timestamp = strtotime($parsedMail["Received"]);
            }

            if ($received_timestamp === false || $received_timestamp === -1 || $received_timestamp === 0) {
                $saveData['content']['received_date'] = date('Y-m-d H:i:s', $sent_timestamp);
                //$mail->setReceivedDate($mail->getSentDate());
            } else {
                $saveData['content']['received_date'] = date('Y-m-d H:i:s', $received_timestamp);
                //$mail->setReceivedDate(new DateTimeValue($received_timestamp));
                //if ($state == 5 && $mail->getSentDate()->getTimestamp() > $received_timestamp)
                //$mail->setReceivedDate($mail->getSentDate());
            }

            //===============================================qinqf========================continue;
            $saveData['content']['size'] = strlen($content);
            //$mail->setSize(strlen($content));
            $hasAttachments = intval(!empty($parsedMail["Attachments"]));
            $saveData['content']['has_attachments'] = $hasAttachments;
            //$mail->setHasAttachments(!empty($parsedMail["Attachments"]));

            //$mail->setCreatedOn(new DateTimeValue(time()));
            //$mail->setCreatedById($account->getContactId());
            //$mail->setAccountEmail($account->getEmail());
            $saveData['content']['message_id'] = $message_id;
            //$mail->setMessageId($message_id);
            $saveData['content']['in_reply_to_id'] = $in_reply_to_id;
            //$mail->setInReplyToId($in_reply_to_id);
            $saveData['content']['uid'] = $uid;
            //$mail->setUid($uid);
            $type = isset($parsedMail['Type'])?$parsedMail['Type']:'text';

            switch($type) {
                case 'html':
                    $data_var = isset($parsedMail['Data']) ? $parsedMail['Data'] : '';
                    $utf8_body = $enc_conv->convert($encoding, 'UTF-8', $data_var);
                    //Solve bad syntax styles outlook if it exists
                    if(substr_count($utf8_body, "<style>") != substr_count($utf8_body, "</style>") && substr_count($utf8_body, "/* Font Definitions */") >= 1) {
                        $p1 = strpos($utf8_body, "/* Font Definitions */", 0);
                        $utf8_body1 = substr($utf8_body, 0, $p1);
                        $p0 = strrpos($utf8_body1, "</style>");
                        $html_content = ($p0 >= 0 ? substr($utf8_body1, 0, $p0) : $utf8_body1) . substr($utf8_body, $p1);

                        $utf8_body = str_replace_first("/* Font Definitions */","<style>", $utf8_body);
                    }
                    if ($enc_conv->hasError()) $utf8_body = utf8_encode($data_var);
                    $utf8_body = utf8_safe($utf8_body);
                    $saveData['data']['body_html'] = $utf8_body;
                    //$mail->setBodyHtml($utf8_body);
                    break;
                case 'text':
                    $data_var = isset($parsedMail['Data']) ? $parsedMail['Data'] : ''; 
                    $utf8_body = $enc_conv->convert($encoding, 'UTF-8', $data_var);
                    if ($enc_conv->hasError()) $utf8_body = utf8_encode($data_var);
                    $utf8_body = utf8_safe($utf8_body);
                    $saveData['data']['body_plain'] = $utf8_body;
                    //$mail->setBodyPlain($utf8_body);
                    break;
                case 'delivery-status':
                    $Response_var = isset($parsedMail['Response']) ? $parsedMail['Response'] : '';
                    $utf8_body = $enc_conv->convert($encoding, 'UTF-8', $Response_var);
                    if ($enc_conv->hasError()) $utf8_body = utf8_encode($Response_var);
                    $utf8_body = utf8_safe($utf8_body);
                    $saveData['data']['body_plain'] = $utf8_body;
                    //$mail->setBodyPlain($utf8_body);
                    break;
                default: 
                    $FileDisposition_var = isset($parsedMail['FileDisposition']) ? $parsedMail['FileDisposition'] : '';
                    if ($FileDisposition_var == 'inline') {
                        $attachs = isset($parsedMail['Attachments']) ? $parsedMail['Attachments'] : array();
                        $attached_body = "";
                        foreach ($attachs as $k => $attach) {
                            if ($attach['Type'] == 'html' || $attach['Type'] == 'text') {
                                $attached_body .= $enc_conv->convert($attach['Encoding'], 'UTF-8', $attach['Data']);
                            }
                        }
                        $saveData['data']['body_html'] = $utf8_body;
                        //$mail->setBodyHtml($attached_body);
                    } else if (isset($parsedMail['FileName'])) {
                            // content-type is a file type => set as it has attachments, they will be parsed when viewing email
                            $saveData['content']['has_attachments'] = true;
                            //$mail->setHasAttachments(true);
                        }
                        break;
            }

            if (isset($parsedMail['Alternative'])) {
                foreach ($parsedMail['Alternative'] as $alt) {
                    if ($alt['Type'] == 'html' || $alt['Type'] == 'text') {
                        $encoding_var = isset($alt['Encoding']) ? $alt['Encoding'] : 'UTF-8'; 
                        $Data_var2 = isset($alt['Data']) ? $alt['Data'] : '';
                        $body = $enc_conv->convert($encoding_var,'UTF-8', $Data_var2);
                        if ($enc_conv->hasError()) $body = utf8_encode($Data_var2);

                        // remove large white spaces
                        //$exploded = preg_split("/[\s]+/", $body, -1, PREG_SPLIT_NO_EMPTY);
                        //$body = implode(" ", $exploded);

                        // remove html comments
                        $body = preg_replace('/<!--.*-->/i', '', $body);
                    }
                    $body = utf8_safe($body);
                    if ($alt['Type'] == 'html') {
                        $saveData['data']['body_html'] = $body;
                        //$mail->setBodyHtml($body);
                    } else if ($alt['Type'] == 'text') {
                            $plain = html_to_text(html_entity_decode($body, null, "UTF-8"));
                            $saveData['data']['body_plain'] = $plain;
                            //$mail->setBodyPlain($plain);
                        }
                        // other alternative parts (like images) are not saved in database.
                }
            }
            /*
            $repository_id = self::SaveContentToFilesystem($mail->getUid(), $content);
            $mail->setContentFileId($repository_id);
            */
            // Conversation
            /*
            //check if exists a conversation for this mail
            if ($in_reply_to_id != "" && $message_id != "") {
            $conv_mail = MailContents::findOne(array("conditions" => "`account_id`=".$account->getId()." AND (`message_id` = '$in_reply_to_id' OR `in_reply_to_id` = '$message_id')"));

            //check if this mail is in two diferent conversations and fixit
            if($conv_mail){
            $other_conv_mail = MailContents::findOne(array("conditions" => "`account_id`=".$account->getId()." AND `conversation_id` != ".$conv_mail->getConversationId()." AND (`message_id` = '$in_reply_to_id' OR `in_reply_to_id` = '$message_id')"));
            if($other_conv_mail){
            $other_conv = MailContents::findAll(array("conditions" => "`account_id`=".$account->getId()." AND `conversation_id` = ".$other_conv_mail->getConversationId()));
            if($other_conv){
            foreach ($other_conv as $mail_con) {
            $mail_con->setConversationId($conv_mail->getConversationId());
            $mail_con->save();
            }
            }
            }                    
            }

            } elseif ($in_reply_to_id != ""){
            $conv_mail = MailContents::findOne(array("conditions" => "`account_id`=".$account->getId()." AND `message_id` = '$in_reply_to_id'"));
            } elseif ($message_id != ""){
            $conv_mail = MailContents::findOne(array("conditions" => "`account_id`=".$account->getId()." AND `in_reply_to_id` = '$message_id'"));
            } 

            if ($conv_mail instanceof MailContent) {
            $conv_id = $conv_mail->getConversationId();
            }else{
            $conv_id = MailContents::getNextConversationId($account->getId());
            }

            $mail->setConversationId($conv_id);
            */
            //$mail->save();

            /*
            // CLASSIFY RECEIVED MAIL WITH THE CONVERSATION
            $classified_with_conversation = false;
            $member_ids = array();
            if (user_config_option('classify_mail_with_conversation', null, $account->getContactId()) && isset($conv_mail) && $conv_mail instanceof MailContent) {
            $member_ids = array_merge($member_ids, $conv_mail->getMemberIds());
            $classified_with_conversation = true;
            }

            // CLASSIFY MAILS IF THE ACCOUNT HAS A DIMENSION MEMBER AND NOT CLASSIFIED WITH CONVERSATION
            $account_owner = Contacts::findById($account->getContactId());
            if ($account->getMemberId() != 0 && !$classified_with_conversation) {
            $member = $account->getMember() ;
            if ($member && $member instanceof Member ) {
            $member_ids[] = $member->getId();
            }
            }

            if (count($member_ids) > 0) {
            $members = Members::instance()->findAll(array('conditions' => 'id IN ('.implode(',', $member_ids).')'));
            $mail->addToMembers($members, true);

            $mail_controller = new MailController();
            $mail_controller->do_classify_mail($mail, $member_ids, null, false);
            }

            $user = Contacts::findById($account->getContactId());
            if ($user instanceof Contact) {
            $mail->subscribeUser($user);
            }

            $mail->addToSharingTable();
            $mail->orderConversation();

            //if email is from an imap account copy the state (read/unread) from the server
            if(!is_null($read)){
            $mail->setIsRead($account->getContactId(), $read);
            }
            // to apply email rules
            $null = null;
            Hook::fire('after_mail_download', $mail, $null);

            DB::commit();
            */
            //insert to database table
            $content_str = $data_str = ''; 
            if(!empty($saveData)){
                if(!empty($saveData['content'])){
                    foreach($saveData['content'] as $ck=>$cv){
                        $content_str .= '`' . $ck . '`=\'' . mysql_escape_string($cv) .'\',';
                    }
                }
                if(!empty($saveData['data'])){
                    foreach($saveData['data'] as $dk=>$dv){
                        $data_str .= '`' . $dk . '`=\'' . mysql_escape_string($dv) .'\',';
                    }
                }
            }
            $content_str = substr($content_str, 0, -1);
            $data_str = substr($data_str, 0, -1);
            if($content_str && $data_str){
                $sql = "insert into " . self::$mail_content_table ." set ".$content_str;
                $rsc = self::$db->query($sql);
                //error_log(var_export($rsc, true)."\r\n", 3, 'xxx');
                if($rsc){
                    $idc = self::$db->last_insert_id();
                    $sql = "insert into " . self::$mail_datas_table ." set ".$data_str .", id=$idc";
                    //error_log($sql."\r\n", 3, 'xxx');
                    $rsd = self::$db->query($sql);
                }
            }
        } catch(Exception $e) {
            $ret = null;
            Hook::fire('on_save_mail_error', array('content' => $content, 'account' => $account, 'exception' => $e), $ret);

            Logger::log($e->__toString());
            DB::rollback();
            if (FileRepository::isInRepository($repository_id)) {
                FileRepository::deleteFile($repository_id);
            }
            if (strpos($e->getMessage(), "Query failed with message 'Got a packet bigger than 'max_allowed_packet' bytes'") === false) {
                throw $e;
            }
        }
        unset($parsedMail);
        //error_log(var_export($saveData, true)."\r\n", 3, 'xxx' );
        return false;
    }


    public  function parseMail(&$message, &$decoded, &$results, &$warnings) {
        $mime = new mime_parser_class;
        $mime->mbox = 0;
        $mime->decode_bodies = 1;
        $mime->ignore_syntax_errors = 1;

        $parameters=array('Data'=>$message);

        if($mime->Decode($parameters, $decoded)) {
            for($msg = 0; $msg < count($decoded); $msg++) {
                if (isset($decoded[$msg]['Headers'])) {
                    $headers = $decoded[$msg]['Headers'];
                    $address_hdr = array('to:', 'cc:', 'bcc:');
                    foreach ($address_hdr as $hdr) {
                        if (isset($headers[$hdr]) && strpos($headers[$hdr], ';') !== false) {
                            $headers[$hdr] = str_replace(';', ',', $headers[$hdr]);
                            if (str_ends_with($headers[$hdr], ',')) $headers[$hdr] = substr($headers[$hdr], 0, -1);
                            $decoded[$msg]['Headers'] = $headers;
                        }
                    }
                }
                $mime->Analyze($decoded[$msg], $results);
            }
            for($warning = 0, Reset($mime->warnings); $warning < count($mime->warnings); Next($mime->warnings), $warning++) {
                $w = Key($mime->warnings);
                $warnings[$warning] = 'Warning: '. $mime->warnings[$w]. ' at position '. $w. "\n";
            }
        }
    }

    public function getAddresses($field) {
        $f = '';
        if ($field) {
            foreach($field as $add) {
                if (!empty($f))
                    $f = $f . ', ';
                $address = trim($add["address"]);
                if (strpos($address, ' '))
                    $address = substr($address,0,strpos($address, ' '));
                $f = $f . $address;
            }
        }
        return $f;
    }

    private function getHeaderValueFromContent($content, $headerName) {
        if (stripos($content, $headerName) !== FALSE && stripos($content, $headerName) == 0) {
            $ini = 0;
        } else {
            $ini = stripos($content, "\n$headerName");
            if ($ini === FALSE) return "";
        }

        $ini = stripos($content, ":", $ini);
        if ($ini === FALSE) return "";
        $ini++;
        $end = stripos($content, "\n", $ini);
        $res = trim(substr($content, $ini, $end - $ini));

        return $res;
    }

    private function mailRecordExists($user_id=0, $uidl=''){
        self::init();
        $sql = "select * from ".self::$mail_content_table." where user_id={$user_id} and uid='{$uidl}'";
        $rs = self::$db->get_row($sql);
        if($rs){
            return true;
        }else{
            return false;
        }
    }

    private function getFromAddressFromContent($content) {
        $address = array(array('name' => '', 'address' => ''));
        if (strpos($content, 'From') !== false) {
            $ini = strpos($content, 'From');
            if ($ini !== false) {
                $str = substr($content, $ini, strpos($content, ">", $ini) - $ini);
                $ini = strpos($str, ":") + 1;
                $address[0]['name'] = trim(substr($str, $ini, strpos($str, "<") - $ini));
                $address[0]['address'] = trim(substr($str, strpos($str, "<") + 1));
            }
        }
        return $address;
    }
}

