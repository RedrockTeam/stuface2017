<?php
namespace app\index\controller;

use think\Controller;
use think\Request;
use app\index\model\Image;
use app\index\model\User;

class Index extends Controller
{
    public function index() {
        return $this->fetch();
    }
    public function stufacemo() {
        // 渲染学号
        $this->assign('student', 2015211878);

        return $this->fetch();
    }
    public function stufacemo_upload() {

        $this->assign('student', 2015211878);
        return $this->fetch();
    }

    public function getPageNumber($sex) {
        if (!$sex) {
            $request = Request::instance();
            $sex = $request->param()['sex'];
        }

        $type = [
            'm' => '男',
            'w' => '女',
            'a' => '*'
        ];
        if (!array_key_exists($sex, $type)) {
            return json_encode([
                'status' => 401,
                'data' => null,
                'info' => '参数错误, 必须为 m, w, a 中的一个'
            ]);
        }

        return json_encode([
            'status' => 200,
            'data' => Image::pages($type[$sex]),
            'info' => '获取页面数成功'
        ]);
    }

    public function getPic() {
        $request = Request::instance();
        $rank = $request->param()['rank'];
        $index = $request->param()['index'];
        $sex = $request->param()['sex'];

        $type = [
            'm' => '男',
            'w' => '女',
            'a' => '*'
        ];
        $ranks = [
            'new' => 'time desc',
            'hot' => 'vote desc',
            'comp' => null
        ];
        if (!array_key_exists($sex, $type)) {
            return json_encode([
                'status' => 401,
                'data' => null,
                'info' => 'sex 参数错误'
            ]);
        }
        if (!array_key_exists($rank, $ranks)) {
            return json_encode([
                'status' => 401,
                'data' => null,
                'info' => 'rank 参数错误,'
            ]);
        }

        if(!is_numeric($index)) {
            return json_encode([
                'status' => 401,
                'data' => null,
                'info' => 'index 参数错误'
            ]);
        }

        $index = intval($index);

        // 获取当前页面数
        $pages = json_decode($this->getPageNumber($sex));

        if ($index > 0 && $index <= $pages->data) {
            $imgs = Image::page($ranks[$rank], $index, $type[$sex]);
            return json_encode([
                'status' => 200,
                'data' => $imgs,
                'info' => '获取图片成功'
            ]);
        }
        return json_encode([
            'status' => 200  ,
            'data' => [],
            'info' => '暂无数据'
        ]);
    }

    // 登录
    public function login() {
        $request = Request::instance();

        $stuId = $request->param()['stuId'];

        $stuPassword = $request->param()['stuPassword'];
        // 如果该学生未在数据库中，则从API登录，并存数据库
        if (is_null(User::check($stuId))) {
            $stuInfo = getUserInfo($stuId);
            if ($stuInfo['status'] == '200') {
                $userInfo = $stuInfo['data'];

                // 获取密码验证
                if ($userInfo['idNum'] == $stuPassword) {

                    $name = $userInfo['name'];
                    $sex = $userInfo['gender'];
                    User::insert($stuId, $stuPassword, $name, $sex);
                }
            }
        }
        // 从数据库登录
        $stuData = User::doLogin($stuId, $stuPassword);
        if ($stuData) {
            return json_encode([
                'status' => 200,
                'data' => $stuData,
                'info' => '登录成功'
            ]);
        }
        return json_encode([
            'status' => 408,
            'data' => null,
            'info' => '学号或者密码错误'
        ]);
    }

    // 上传图片
    public function uploadImage() {
        $request = Request::instance();
        $stuId = $request->param()['stuId'];

        if (!preg_match('/2017/', $stuId)) {
            return json_encode([
                'status' => 400,
                'data' => null,
                'info' => '你不是新生哦'
            ]);
        }
        $now = time();
        $timeend = mktime(23, 59, 59, 9, 15, 2017);
        if ($now >= $timeend) {
            return json_encode([
                'status' => -400,
                'data' => null,
                'info' => '上传时间已过'
            ]);
        }

        if (!User::check($stuId)) {
            $user = getUserInfo($stuId)['data'];
            User::insert($stuId, $user['idNum'], $user['name'], $user['gender']);
        }

        if (Image::check($stuId)) {
            return json_encode([
                'status' => 402,
                'data' => null,
                'info' => '你已上传图片哦'
            ]);
        }

        $uploadRes = upload($stuId);
        if ($uploadRes['status'] != 200) {
            return json_encode([
                'status' => 401,
                'data' => null,
                'info' => '图片太大，限制5M'
            ]);
        }

        $uploadInfo['uid'] = $stuId;
        $uploadInfo['big_pic'] = $uploadRes['big_pic'];
        $uploadInfo['pic'] = $uploadRes['pic'];
        $uploadInfo['time'] = time();

        if (Image::insert($uploadInfo)) {
            return json_encode([
                'status' => 200,
                'data' => $uploadInfo,
                'info' => '上传成功'
            ]); 
        }
        return json_encode([
            'status' => 400,
            'data' => null,
            'info' => '你未登录过新生笑脸'
        ]);
    }

    // 投票，在common.php， 蒋天星那货当时叫我写在那里面
    public function vote() {
        return vote();
    }
    // 获取上传图片信息
    public function getStatus() {
        $request = Request::instance();
        $stuId = $request->param()['stuId'];

        if (is_null(User::check($stuId))) {
            return json_encode([
                'status' => 400,
                'data' => 0,
                'info' => '请先进行登录'
            ]);
        }

        $status = [
            0 => '你未上传图片',
            1 => '审核中',
            2 => '审核通过',
            3 => '审核失败'
        ];

        // return json_encode(Image::status($stuId));

        if (!Image::status($stuId)) {
            $statusKey = 0;
        } else {
            $statusKey = Image::status($stuId)[0]['is_pass'];
        }
        return json_encode([
            'status' => 200,
            'data' => $statusKey,
            'info' => $status[$statusKey]
        ]); 
    }
    public function getFaceById() {
        $request = Request::instance();
        $id = $request->param()['id'];

        $res = Image::getById($id);

        if ($res) {
            return json_encode([
                'status' => 200,
                'data' => $res,
                'info' => '获取信息成功'
            ]);
        } else {
            return json_encode([
                'status' => 400,
                'data' => null,
                'info' => '未找到该编号下的同学'
            ]);
        }
    }
}
