<?php
namespace app\admin\model;

use think\Model;

class Image extends Model
{
    /**
     * 首页数据展示
     * @return false|\PDOStatement|string|\think\Collection
     */
    public static function show() {
        $conditions = array(
            'is_pass' => 1
        );
        $fields = array(
            'pic',
            'big_pic',
            'uid',
            'time'
        );
        return db('image')->where($conditions)->field($fields)->select();
    }

    /**
     * 审核是否通过
     * @param $stunum
     * @param $ifPass
     * @return int|string
     */
    public static function ifPass($stunum, $ifPass) {
        $conditions = array('uid' => $stunum);
        $status = $ifPass ? 2 : 3;
        return db('image')->where($conditions)->update(array('status' => $status));
    }

    /**
     * 后台设置投票
     * @param $stunum
     * @param $count
     * @return int|string
     */
    public static function doVote($stunum, $count) {
        $conditions = array(
            'uid' => $stunum
        );
        $change = array(
            'vote' => $count,
            'is_pass' => 2
        );
        return db('image')->where($conditions)->update($change);
    }
}