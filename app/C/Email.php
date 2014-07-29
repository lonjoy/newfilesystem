<?php
/**
* @name      Email.php
* @describe  email操作类
* @author    qinqf
* @todo       
* @changelog  
*/

class C_Email extends C_Controller
{
    /**
    * 初始化操作
    *
    */
    function prepare($request)
    {
    }

    /**
    * 邮件移动操作
    * 
    */
    function doDefault() {
        $rs = $this->returnmsg(M_Email::moveemail($_REQUEST, $this->login_user_info));
        exit($rs);                                 
    }

    /**
    * 邮件移动操作
    * 
    */
    function doTosharedocument() {
        $rs = $this->returnmsg(M_Email::moveemailtoshare($_REQUEST, $this->login_user_info));
        exit($rs);                                 
    }

    /**
    * 验证邮件
    * 
    */
    function doCheckEmail(){
        @set_time_limit(0);
        if(!isset($_POST['userpasswordvalue']) || empty($_POST['userpasswordvalue'])){
            $rs['msg'] = '请输入邮箱密码！';
            $rs['success'] = false;
            exit($this->returnmsg($rs));
        }

        $emailaccount = $this->login_user_info;
        $emailaccount['emailpwd'] = $_POST['userpasswordvalue'];
        $maxPerAccount = intval($_POST['maillistnum']);
        $errAccounts = array();
        $err = $succ = $mailsReceived = 0;

        $result = M_Email::getmails($emailaccount, $err, $succ, $errAccounts, $mailsReceived, $maxPerAccount);
        extract($result);

        $errMessage = "";
        if ($succ > 0) {
            $result['success'] = true;
            $result['msg'] = 'success';
        }
        if ($err > 0){
            $result['success'] = false;
            $result['msg'] = '用户名或密码输入错误,请重新输入！';
        }

        exit($this->returnmsg($result));
    }


    function doMailList(){
        $rs = $this->returnmsg(M_Email::maillist($_REQUEST, $this->login_user_info));
        exit($rs);                                 
    }

}

