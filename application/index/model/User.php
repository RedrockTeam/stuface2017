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
        $images = db('image')
            ->field('*, min(id)')
            ->where('is_pass', 2)
            ->group('uid')
            ->order('vote desc')
            ->select();

        $rank = -1;
        foreach ($images as $index => $userImage) {
            if ($stuId == $userImage['uid']) {
                $rank = $index >= 50 ? -1 : $index+1;
                break;
            }
        }
        $user[0]['rank'] = $rank;
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