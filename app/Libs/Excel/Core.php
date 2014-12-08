<?php
/**
 * cakephp Framework
 *
 * excel导出
 *
 * @Author  wangxudong<wangxudong@haibian.com>
 * @version $Id: Core.php 1032 2013-12-26 08:37:08Z wangxudong $
**/
include 'PHPExcel.php';
//include 'PHPExcel/Writer/Excel2007.php';
include 'PHPExcel/Writer/Excel5.php';

class Excel_Core {
    public $objPHPExcel = null;
    public $objWriter = null;
    public $objActSheet = null;
    
    public function __construct() {
        $this->objPHPExcel = new PHPExcel(); // 创建处理对象实例
        $this->objWriter = new PHPExcel_Writer_Excel5($this->objPHPExcel); // 创建文件格式写入对象实例
        $this->objActSheet = $this->objPHPExcel->getActiveSheet(); 
    }
    
    /*
     *  @brief 设置文档基本属性
     *  @param $res array(
     *      'setCreator' => '',
     *      'setLastModifiedBy' => '',
     *      'setTitle' => '',
     *      'setSubject' => '',
     *      'setDescription' => '',
     *      'setKeywords' => '',
     *      'setCategory' => '',
     * )
     */
    public function setProperties($res){
        if(!is_array($res)){
            return $this;
        }
        $objProps = $this->objPHPExcel->getProperties(); 
        foreach($res as $k => $v){
            $objProps->{$k}($v);
        }
        return $this;
    }
    
    /**
     * @brief 设置sheet
     * @param type $index 
     */
    public function setActiveSheet($index = 0){
        $this->objPHPExcel->setActiveSheetIndex($index);      
        
        return $this;
    }
    
    /**
     * @brief 设置当前sheet名称
     * @param type $name
     */
    public function setSheetName($name = ''){
        $this->objActSheet->setTitle($name);
        
        return $this;
    }
    
    /**
     * @brief 设置宽度
     * @param type $res = array(
     *      'A' => 10,
     *      ...
     * )
     */
    public function setWidth($res){
        if(!is_array($res)){
            return $this;
        }
        
        foreach($res as $k => $v){
            $this->objActSheet->getColumnDimension($k)->setWidth($v); 
        }
        
        return $this;
    }
    
    /**
     * @brief 设置高度
     * @param type $res array(
     *      '1' => 10,
     *      ...
     * )
     */
    public function setHeight($res){
        if(!is_array($res)){
            return $this;
        }
        
        foreach($res as $k => $v){
            $this->objActSheet->getRowDimension($k)->setRowHeight($v); 
        }
        
        return $this;        
    }
   
    /**
     * @brief 设置单元格的值
     * @param type $res = array(
     *      'A1' => ''
     *      'B1' => ''
     * )
     */
    public function setValue($res){
        if(!is_array($res)){
            return $this;
        }
        
        foreach($res as $key => $val){
            foreach($val as $k => $v){
                $this->objActSheet->setCellValue($k, $v);
            }
        }
        
        return $this;
    }
    
    /**
     * @brief 合并单元格
     * @param $key  
     */
    public function mergeCells($key){
        $this->objActSheet->mergeCells($key);
        return $this;
    }
    
    /**
     * @brief 设置样式
     * @param type $res = array(
     *      'A1'=array(
     *          'align' => '',//optional
     *          'font' => '',//字体
     *          'size' => '',//字体大小
     *          'bold' => true/false, //是否加粗
     *      )
     * )
     */
    public function setStyle($res){
        if(!is_array($res)){
            return $this;
        }
        foreach($res as $k => $v){
            $objStyleA1 = $this->objActSheet->getStyle($k);      
            $objStyleA1->getAlignment()->setHorizontal(isset($v['align'])?$v['align']:PHPExcel_Style_Alignment::HORIZONTAL_LEFT);  
            $objFontA1 = $objStyleA1->getFont();      
            $objFontA1->setName(isset($v['font'])?$v['font']:'宋体');      
            $objFontA1->setSize(isset($v['size'])?$v['size']:12);    
            $objFontA1->setBold(isset($v['bold'])?$v['bold']:false);              
        }
            
        return $this;
    }
    
    /**
     * @brief 设置边框
     * @param type $res = array(
     *  'A1:B1' => array(
     *      'style' = thin
     * )
     * )
     */
    public function setBorder($res){
        if(!is_array($res)){
            return $this;
        }
        foreach($res as $k => $v){
            $style = isset($v['style']) ? $v['style'] : PHPExcel_Style_Border::BORDER_THIN;
            
            $this->objActSheet->getStyle($k)->getBorders()->getTop()->setBorderStyle($style); 
            $this->objActSheet->getStyle($k)->getBorders()->getLeft()->setBorderStyle($style);
            $this->objActSheet->getStyle($k)->getBorders()->getBottom()->setBorderStyle($style);
            $this->objActSheet->getStyle($k)->getBorders()->getRight()->setBorderStyle($style);
        }
            
        return $this;        
    }
    /**
     * 
     * @param type $filename
     */
    public function out($filename, $saveForNet=true){
        $encoded_filename = urlencode($filename);
        $encoded_filename = str_replace("+", "%20", $encoded_filename);
        
        $exttype = '.xls';

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control:must-revalidate, post-check=0, pre-check=0");
        header("Content-Type:application/force-download");
        header("Content-Type:application/vnd.ms-execl");
        header("Content-Type:application/octet-stream");
        header("Content-Type:application/download");        
        
        
//        header('Content-Disposition:attachment;filename='.$outputFileName);
        header("Content-Transfer-Encoding:binary");
        if($saveForNet){
            $ua = $_SERVER["HTTP_USER_AGENT"];
            if(preg_match("/MSIE/", $ua)) {
                header('Content-Disposition: attachment; filename="'.$encoded_filename.$exttype.'"');
            }else if(preg_match("/Firefox/", $ua)) {
                header('Content-Disposition: attachment; filename*="'.$filename.$exttype.'"');
            }else{
                header('Content-Disposition: attachment; filename="'.iconv('utf-8','gb2312//IGNORE',$filename).$exttype.'"');
            }        

            $this->objWriter->save('php://output');      
        }else{
            $filePath = HB_DATA_DIRS.'credit/'.$filename.$exttype;
            $this->objWriter->save($filePath);      
        }         
    }

}
