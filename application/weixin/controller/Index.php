<?php
namespace app\weixin\controller;

use app\weixin\model\Student;
use think\Config;
use think\Controller;

class Index extends Controller
{
//    重邮小帮手
    private $appId = "wx81a4a4b77ec98ff4";
    private $appSecret = "872a908ec98bd92f8db811eba2a83236";

//    测试公众号
//    private $appId = "wxdab44034ceb528e8";
//    private $appSecret = "ef79ebb78a637b1c36c10cd06e811d2c";
    /**
     * 微信端入口,获取openid后查询学号，渲染模板
     * @return mixed|void
     */
    public function stufacemo()
    {
        $code = getParameter("code");
        if (!is_null($code)) {
            $url = "https://api.weixin.qq.com/sns/oauth2/access_token?" .
                "appid={$this->appId}" .
                "&secret={$this->appSecret}" .
                "&code={$code}" .
                "&grant_type=authorization_code";
            $json = getCurlContent($url);
            $data = json_decode($json, true);
            if(isset($data['openid'])) {
                $openId = $data['openid'];
                $array = array("openid" => $openId, "bind"=>1);
                $stu =  db('student')->where($array)->find();
                  if (empty($stu) || is_null($stu)) {
                      //请先绑定小帮手
                      return $this->redirect("http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Bind/Bind/bind/openid/{$openId}/token/gh_68f0a1ffc303");
                  }
                $this->assign("idnum", $stu['idcard']);
                $this->assign('student', $stu['stuId']); 
                $this->assign('openid', $openId);
                return $this->fetch();
           }
        } 
        $context = "http://hongyan.cqupt.edu.cn/stuface2017/index.php/weixin/index/stufacemo";
            $url = $context;
            $redirect = "https://open.weixin.qq.com/connect/oauth2/authorize?".
                        "appid={$this->appId}&".
                        "redirect_uri={$url}&".
                        "response_type=code&".
                        "scope=snsapi_userinfo&".
                        "state=fuckweixin#wechat_redirect";
            return $this->redirect($redirect);

        // $this->assign("idnum", '024914');
        // $this->assign('student', '2015211878'); 
        // return $this->fetch();
    }

    public function stufacemo_upload() {
        return $this->fetch();
    }
    /**
     * 通过学号获取个人信息接口
     * @return mixed|void
     */
    public function getStuInfo() {
        $stunum = getParameter("stunum");
        if (is_null($stunum)) {
            return jsonReturn(400, '学号不可为空');
        }
        $stu = Student::findByStunum($stunum); 
       return json_encode($stu);
    }

}
