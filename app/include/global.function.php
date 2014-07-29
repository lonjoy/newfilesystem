<?php
/**
 * Replace first $search_for with $replace_with in $in. If $search_for is not found
 * original $in string will be returned...
 *
 * @access public
 * @param string $search_for Search for this string
 * @param string $replace_with Replace it with this value
 * @param string $in Haystack
 * @return string
 */
function str_replace_first($search_for, $replace_with, $in) {
    $pos = strpos($in, $search_for);
    if($pos === false) {
        return $in;
    } else {
        return substr($in, 0, $pos) . $replace_with . substr($in, $pos + strlen($search_for), strlen($in));
    } // if
} // str_replace_first
  /**
 * String ends with something
 *
 * This function will return true only if input string ends with
 * niddle
 *
 * @param string $string Input string
 * @param string $needdle Needle string
 * @return boolean
 */
function str_ends_with($string, $needdle) {
    return substr($string, strlen($string) - strlen($needdle), strlen($needdle)) == $needdle;
} // end func str_ends_with

/**
 * String starts with something
 *
 * This function will return true only if input string starts with
 * niddle
 *
 * @param string $string Input string
 * @param string $niddle Needle string
 * @return boolean
 */
function str_starts_with($string, $niddle) {
    return substr($string, 0, strlen($niddle)) == $niddle;
} // end func str_starts with
//--------------------------------------------------------------------
/**
* Assumes mbstring internal encoding is set to UTF-8
* Wrapper around mb_substr
* Return part of a string given character offset (and optionally length)
* @param string
* @param integer number of UTF-8 characters offset (from left)
* @param integer (optional) length in UTF-8 characters from offset
* @return mixed string or FALSE if failure
* @package utf8
* @subpackage strings
*/
function utf8_substr($str, $offset, $length = FALSE){
    if ( $length === FALSE ) {
        return mb_substr($str, $offset);
    } else {
        return mb_substr($str, $offset, $length);
    }
}
//--------------------------------------------------------------------
/**
* Wrapper round mb_strlen
* Assumes you have mb_internal_encoding to UTF-8 already
* Note: this function does not count bad bytes in the string - these
* are simply ignored
* @param string UTF-8 string
* @return int number of UTF-8 characters in string
* @package utf8
* @subpackage strings
*/
function utf8_strlen($str){
    return mb_strlen($str);
}


function detect_encoding($string, $encoding_list = null, $strict = false) {
    if (function_exists('mb_detect_encoding')) {
        if ($encoding_list == null) $encoding_list = mb_detect_order();
        return mb_detect_encoding($string, $encoding_list, $strict);
    } else {
        return 'UTF-8';
    }
}

/**
 * Check if $object is valid $class instance
 *
 * @access public
 * @param mixed $object Variable that need to be checked agains classname
 * @param string $class Classname
 * @return null
 */
function instance_of($object, $class) {
    return $object instanceof $class;
} // instance_of



function utf8_safe($text) {
    $safe = html_entity_decode(htmlentities($text, ENT_COMPAT, "UTF-8"), ENT_COMPAT, "UTF-8");
    return preg_replace('/[\xF0-\xF4][\x80-\xBF][\x80-\xBF][\x80-\xBF]/', "", $safe);
}

/**
 * Converts HTML to plain text
 * @param $html
 * @return string
 */
function html_to_text($html) {
    include_once APP_PATH . "/Libs/classes/mail/class.html2text.inc";
    $h2t = new html2text($html);
    return $h2t->get_text(); 
}