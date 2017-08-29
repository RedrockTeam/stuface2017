<?php
namespace app\index\model;

use think\Model;
use think\Db;
use app\index\model\User;

class Image extends Model
{
    public static function insert($uploadInfo) {
        $user = User::check($uploadInfo['uid']);
        if (!$user) {
            return false;
        }
        $uploadInfo['sex'] = $user['sex'];
        if (db('image')->insert($uploadInfo)) {
            return true;
        }
        return false;
    }
    public static function check($stuId) {
        return db('image')
            ->where('uid', $stuId)
            ->where('is_pass', 'NEQ', 3)
            ->find();
    }
    // 根据性别获取页面数
    public static function pages($sex = '*') {
        // 每页 12 张
        $number = 12;
        if ($sex == '*') {
            return intval(ceil(db('image')->where('is_pass', 2)->count() / $number));
        }
        return intval(ceil(db('image')->where([
            'is_pass' => 2,
            'sex' => $sex
        ])->count() / $number));
    }
    // 获取页面的照片
    public static function page($rank, $index, $sex) {
        $begin = ($index-1) * 12;
        if ($sex == '*') {
            return db('image')
                ->field('*, min(id)')
                ->where('is_pass', 2)
                ->group('uid')
                ->order($rank)
                ->limit($begin, 12)
                ->select();
        }
        return db('image')
            ->field('*, min(id)')
            ->where([
                'is_pass' => 2,
                'sex' => $sex
            ])
            ->group('uid')
            ->order($rank)
            ->limit($begin, 12)
            ->select();
    }
    public static function status($stuId) {
        return db('image')
            ->where('uid', $stuId)
            ->order('time desc')
            ->select();
    }
    public static function getById($id) {
        return db('image')->where([
            'id' => $id,
            'is_pass' => 2
        ])->find();
    }
}