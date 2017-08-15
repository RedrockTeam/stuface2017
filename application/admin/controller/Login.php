<?php
/**
 * Created by PhpStorm.
 * User: jx
 * Date: 2017/8/6
 * Time: 21:43
 */

namespace app\admin\controller;


use think\Config;
use think\Controller;
use think\Exception;
use think\Session;

class Login extends Controller
{
    public function index() {
        $this->display();
    }

    public function logout() {
        Session::destroy();
        $context = Config::get('context.path');
        $url = "{$context}admin/login";
        return jsonReturn(400, '退出成功', array('url' => $url));
    }

    public function doLogin() {
       try {
           $params = array(
               'username', 'password'
           );
           $fields = getParameters($params);
           $res = db('manager')->where($fields)->find();
           if (empty($res)) {
               return jsonReturn(400, '用户名或者密码错误');
           } else {
               $context = Config::get('context.path');
               $url = "{$context}admin/index";
               Session::set("admin", $fields);
               return jsonReturn(200, '登录成功', array(
                   'url' => $url
               ));
           }
       }catch (Exception $e) {
           return jsonReturn(400, '表单数据不完整');
       }
    }
}