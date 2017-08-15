<?php
namespace app\index\model;

use think\Model;
use think\Db;

class Vote extends Model
{
    public static function check($stuId) {
        return db('image')->where([
            'uid' => $stuId,
            'is_pass' => 2
        ])->find();
    }
    public static function gets($stuId) {
        $todayTime = getTodayTime();
        $start =  $todayTime['start'];
        $end =  $todayTime['end'];

        return db('vote')
            ->where('uid', $stuId)
            ->where('vote_day', '<', $end)
            ->where('vote_day', '>', $start) ->select();
    }
    public static function insert($stuId, $voteId) {
        $todayTime = getTodayTime();
        $start =  $todayTime['start'];
        $end =  $todayTime['end'];

        return db('vote')->insert([
            'uid' => $stuId,
            'vote_uid' => $voteId,
            'vote_day' => time()
        ]);
    }
    public static function add($voteId) {
        return db('image')->where([
            'uid' => $voteId,
            'is_pass' => 2
        ])->inc('vote', 1)
          ->update();
    }
}