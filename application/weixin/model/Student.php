<?php
/**
 * Created by PhpStorm.
 * User: jx
 * Date: 2017/8/6
 * Time: 18:10
 */

namespace app\weixin\model;


use think\Model;

class Student extends Model
{
    /**
     * 通过学号获取个人信息
     * @param $stu
     * @return mixed|void
     */
    public static function findByStunum($stu) {
        $data = db('new_student')->where(array('stuNum' => $stu))->find();
        if ($data['stuNum']) {
            $url = "http://202.202.43.125/api/verify";
            $result = getContent($url, 'POST', $data);
            return $result;
        }
        return jsonReturn(400, '失败');
    }
}