<?php
namespace app\admin\controller;

use app\admin\model\Image;
use think\Config;
use think\Controller;
use think\Exception;


/**
 * Created by PhpStorm.
 * User: jx
 * Date: 2017/8/6
 * Time: 21:28
 */
class Index extends Controller
//class Index extends Auth
{
    /**
     * 照片审核页面
     * @return false|\PDOStatement|string|\think\Collection
     */
    public function index() {
        return Image::show();
    }

    /**
     * 审核通过
     */
    public function pass() {
        $stunum = getParameters('stunum');
        if ($stunum) {
            return jsonReturn(400, '缺少stunum参数');
        }
        Image::ifPass($stunum, true);
    }

    /**
     * 审核未通过
     */
    public function notPass() {
        $stunum = getParameters('stunum');
        if ($stunum) {
            return jsonReturn(400, '缺少stunum参数');
        }
        Image::ifPass($stunum, false);
    }

    /**
     * 图片上传页面
     */
    public function upload() {
        $this->display();
    }

    /**
     * 投票管理页面
     */
    public function vote() {
        $this->display();
    }

    /**
     * 后台投票
     */
    public function doVote() {
        try {
            $paramsName = array('stunum', 'count');
            $params = getParameters($paramsName);
            if (Image::doVote($params['stunum'], $params['count'])) {
                return jsonReturn(200, '投票成功', array(
                    'url' => Config::get('context.path').'admin/index/vote'
                ));
            } else {
                return jsonReturn(400, '投票失败');
            }
        } catch (Exception $e) {
            return jsonReturn(400, '投票失败,缺少必要参数');
        }
    }

    /**
     *投票排名详情页面
     */
    public function show() {
        $sql = "select stu_name, tbl_image.uid, tbl_user.sex, vote, time from tbl_image, tbl_user where is_pass = 2 AND tbl_image.uid = tbl_user.uid ORDER BY vote DESC";
        $data = db('image')->query($sql);
        for ($i = 0; $i < sizeof($data); $i++) {
            $data[$i]['rank'] = $i + 1;
        }
        $this->assign('data', $data);
        $this->display();
    }
}