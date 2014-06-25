<?php
/**
* @name      Log.php
* @describe  日志类
* @author    qinqf
* @todo       
* @changelog  
*/

class C_Menu extends C_Controller
{
    /**
    * 初始化操作
    *
    */
    function prepare($request)
    {
    }

    /**
    *  
    * 
    */
    function doDocmenu() {
        $rs = $this->returnmsg(M_Menu::docmenu());
        exit($rs);
    }


    function doGroupmenu(){
        $rs = $this->returnmsg(M_Menu::groupmenu());
        exit($rs);
    }

    function doLogmenu(){
        $rs = $this->returnmsg(M_Menu::logmenu());
        exit($rs); 
    }

    function doGenerateDocmenu(){
        $rs = $this->returnmsg(M_Menu::generateDocmenu());
        exit($rs);
    }

    function doEmailmenu(){
        $rs = $this->returnmsg(M_Menu::emailmenu());
        exit($rs);
    }

}

