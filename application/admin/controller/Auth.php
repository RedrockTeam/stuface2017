<?php
/**
 * Created by PhpStorm.
 * User: jx
 * Date: 2017/8/6
 * Time: 21:30
 */

namespace app\admin\controller;


use think\Config;
use think\Controller;
use think\Request;
use think\Session;

class Auth extends Controller
{
    public function __construct(Request $request = null)
    {
        parent::__construct($request);
        if (!Session::has("admin")) {
            if ($request->isGet()) {
                $context = Config::get('context.path');
                $url = $context.'/admin/login';
                return $this->redirect($url);
            } else {
                return jsonReturn(400, '请先登录');
            }
        }
    }
}