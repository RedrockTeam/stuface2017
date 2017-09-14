<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Request;
use app\index\model\Image;
use app\index\model\User;
use app\index\model\Vote;
// 应用公共文件
    // 上传图片
    function upload($stuId) {
        // 获取表单上传文件
        $file = request()->file('image');
        
        // 移动到框架应用根目录/public/uploads/日期 目录下

        $ext = explode('.', $file->getInfo()['name'])[1];

        $dirname = ROOT_PATH . 'public/uploads/' . date('Ymd');
        $filename = $stuId . '_' . time() . '_big.' . $ext;
        $filepath = $dirname . '/' . $filename;

        // 保存大图，成功则压缩并保存
        $info = $file->validate([
            'size'=> 25 * 1024 * 1024,
            'ext'=>'jpg,png,gif,jpeg'
        ])->move($dirname, $filename);

        compressImg($filepath);
        // 成功上传
        thumbImg($filepath);
        return [
            'status' => 200,
            'big_pic' => date('Ymd') . '/' . $filename,
            'pic' => date('Ymd') . '/' . preg_replace('/_big/', '', $filename),
        ];
    }

    function  thumbImg($filepath) {
        $image = \think\Image::open($filepath);

        $compressFilePath = preg_replace('/_big/', '', $filepath);

        // 按照原图的比例生成一个最大为300 * 300的缩略图并保存
        $image->thumb(300, 300,\think\Image::THUMB_SCALING)->save($compressFilePath);
        return $compressFilePath;
    }

    function compressImg($filepath) {
        $image = \think\Image::open($filepath);

        $compressFilePath = preg_replace('/_big/', '', $filepath);

        // 按照原图的比例生成一个最大为300 * 300的缩略图并保存
        $image->thumb(1500, 1000,\think\Image::THUMB_SCALING)->save($filepath);
        return $compressFilePath;
    }

    // 从API登录
    function getUserInfo($stuId) {
        $url = "http://hongyan.cqupt.edu.cn/stuface2017/index.php/weixin/index/getStuInfo?stunum=" . $stuId;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($output, true);
        return $data;
    }

    function vote() {
        $voteTimes = 1;
        // 投票截止日期
        $timeend = mktime(23, 59, 59, 9, 15, 2017);
        
        if (time() > $timeend) {
            return json_encode([
                'status' => 400,
                'data' => 0,
                'info' => '投票时间已过'
            ]);
        }

        $request = Request::instance();
        $stuId = $request->param()['stuId'];
        $voteId = $request->param()['voteId'];
        if (is_null(User::check($stuId))) {
            return json_encode([
                'status' => 400,
                'data' => 0,
                'info' => '请先进行登录'
            ]);
        }

        $voteData = Vote::gets($stuId);
        $votedTimes = count($voteData);
        $remaingTime = $voteTimes - $votedTimes;

        if ($votedTimes >= $voteTimes) {
            return json_encode([
                'status' => 402,
                'data' => 0,
                'info' => '你今天已经投过票哦'
            ]);
        }

        if (is_null(User::check($voteId))) {
            return json_encode([
                'status' => 400,
                'data' => $remaingTime,
                'info' => '投票用户不存在'
            ]);
        }

        if (is_null(Vote::check($voteId))) {
            return json_encode([
                'status' => 401,
                'data' => $remaingTime,
                'info' => '该用户未上传图片或者未通过'
            ]);
        }

        // 没有数据, 直接插入
        if (!$voteData) {
            return voteSuccess($stuId, $voteId, $remaingTime);
        }
        foreach ($voteData as $key => $value) {
            if ($value['vote_uid'] == $voteId) {
                return json_encode([
                    'status' => 408,
                    'data' => $remaingTime,
                    'info' => '你今天已为该同学投过票了哦'
                ]);
            }
        }
        return voteSuccess($stuId, $voteId, $remaingTime);
    }

    function voteSuccess($stuId, $voteId, $remaingTime) {
        if (Vote::insert($stuId, $voteId)) {
            Vote::add($voteId);
        }

        return json_encode([
            'status' => 200,
            'data' => $remaingTime-1,
            'info' => '投票成功'
        ]);
    }

    function getTodayTime() {
        // 获取今天的时间范围
        $year = date('Y');
        $month = date('m');
        $day = date('d');

        return [
            'start' => mktime(0, 0, 0, $month, $day, $year),
            'end' => mktime(23, 59, 59, $month, $day, $year)
        ];
    }
    /**
     * 判断参数中是否含空参数
     * @return bool
     */
    function hasBlank() {
        $args = func_get_args();
        foreach ($args as $arg) {
            if (is_null($arg) || strlen($arg) == 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * curl爬去数据
     * @param $url
     * @return mixed
     */
    function getContent($url, $method = 'get', $params = array()) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if (strtolower($method) == 'post') {
            curl_setopt($ch, CURLOPT_POST, true);
            if (!empty($params)) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            }
        }
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $data = curl_exec($ch);
        curl_close($ch);
        return json_decode($data);
    }

    /**
     * json返回
     * @param $status
     * @param $info
     * @param $data
     */
    function jsonReturn($status, $info, $data = null) {
        exit(json_encode(
            array(
                'status' => $status,
                'info' => $info,
                'data' => $data
            )
        ));
    }

    /**
     * 获取参数
     * @param $name
     * @return null
     */
    function getParameter($name) {
        $request = \think\Request::instance();
        return isset($request->param()[$name]) ? $request->param()[$name] : null;
    }

    /**
     * 获取一系列参数
     * @return array
     * @throws \think\Exception
     */
    function getParameters() {
        $args = func_num_args();
        $request = \think\Request::instance();
        $result = array();
        foreach ($args as $arg) {
            if(isset($request->param()[$arg])) {
                $result[$arg] = $request->param()[$arg];
            } else{
                throw new \think\Exception("{$arg}参数不存在");
            }
        }
        return $result;
    }
