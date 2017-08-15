<?php
namespace app\index\model;

use think\Model;
use think\Db;

class User extends Model
{
    // 登录时检查是否已存在数据库
    public static function check($stuId) {
        return db('user')->where('uid', $stuId)->find();
    }
    public static function doLogin($stuId, $stuPassword) {
        $user = db('user')->where('uid', $stuId)->select();
        if ($user && $stuPassword == $user[0]['password']) {
            return $user;
        }
        return false;
    }
    public static function insert($stuId, $stuPassword, $name, $sex) {
        db('user')->insert([
            'uid' => $stuId,
            'password' => $stuPassword,
            'stu_name' => $name,
            'sex' => $sex
        ]);
    }
}