var choose = $('.choose');
var page = $('.page');
var list = $('.list');
var choose_two = $('.choose_two');
var zan = $('.zan');
var more = $('.more');
var stuId = localStorage.stuId;
var data_arr = [];
var pageLate = 1;
var type = 'comp';
var message = $('.message');
var cover = $('.cover');
var second = $('.second');
var award = $('.award');
var success = $('.success');
var choose_info = false,
    stuPassword = localStorage.stuPassword,
    choose_before = '';

// 本地
// var publicDir = '/redrock/stuface/public'
// var urlPrefix = `/redrock/stuface/index.php/index/index`
// 线上
var publicDir = '/stuface2017/public'
var urlPrefix = `/stuface2017/index.php/index/index`

var expireText = '本次活动已结束，获奖信息请查看右上角信息提示或关注重邮小帮手查看获奖推送！谢谢';
var awardText = function (name, rank) {
    return '<span class="hl">' + name + '</span> 您好：恭喜您在新生笑脸活动中排名第 <span class="hl">' + rank + '</span> 名，请于9月16日-9月20日在太极操场西六门三楼左侧红岩网校工作站领取奖品！';
}
var noAWardText = '很遗憾，您未获奖，但是不要灰心！在后面我们为鲜肉们准备了更多精彩的活动！敬请留意哦！';

function showExpireText() {
    award.style.display = 'block';
    document.querySelector('.award-msg').innerHTML = expireText
}

function showAwardInfo(name, rank) {
    award.style.display = 'block';
    document.querySelector('.award-msg').innerHTML = rank===-1 ? noAWardText : awardText(name, rank);
}

award.addEventListener('click', function(e) {
    if (e.target == e.currentTarget) {
        e.currentTarget.style.display = 'none';
    }
})
$('.award .close').addEventListener('click', function(e) {
    award.style.display = 'none';
})
//自动登录
ajax({
    method: 'post',
    url :urlPrefix+ '/login',
    data: {
        stuId: stuId,
        stuPassword: stuPassword
    },
    success: function(res){
        console.log(res)
        sessionStorage.userInfo = JSON.stringify(res.data[0]);
    }
})
//消息显示
message.addEventListener('click',function() {
    var now = Date.now();
    var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

    if (now >= expireDate) {
        var data = JSON.parse(sessionStorage.userInfo);
        return showAwardInfo(data.stu_name, data.rank);
    }

    if (!/^2017/.test(stuId)) {
        cover.style.display = 'block';
        success.style.display = 'block';
        success.children[1].innerHTML = '你不是新生哦';
        return;
    }
    ajax({
        method: 'get',
        url:  urlPrefix + '/getStatus/stuId/'+stuId,
        success: function(res){
            cover.style.display = 'block';
            success.style.display = 'block';
            $('.absolute').style.display = 'block';
            if (res.data == 2) {
                success.children[1].innerHTML = '您的照片已'+res.info+'，可在首页查看哦';
            } else if (res.data == 1) {
                success.children[1].innerHTML = '您的照片正在'+res.info+'，请耐心等待';
            } else {
                success.children[1].innerHTML = res.info;
                second.style.display = 'block';
            }
        }
    })
})
//page显示
ajax({
    method: 'get',
    url:  urlPrefix + '/getPageNumber/sex/a',
    success: function(res) {
        for(var i = 1; i <= res.data; i++) {
            var li = document.createElement('li');
            li.innerHTML = i;
            page.appendChild(li);
        }
        if (page.length) {
            page.children[0].style.backgroundColor = '#f00078';
        }
    }
})
//首页显示
ajax({
    method: 'get',
    url:  urlPrefix + '/getPic/rank/comp/index/1/sex/a',
    success: function(res) {
        show_pic(res)
    }
})
$('.first').addEventListener('click',function(){
    if(choose_before != '') {
        choose_before.style.backgroundColor = '#ffffff';
    }
    if(!choose_info) {
        choose_two.style.display = 'block';
        $('.first').children[1].className = 'iconfont icon-xiala';
        $('.first').children[1].style.color = '#ffbc00';
        $('.first').children[0].style.color = '#ffbc00';
        choose_info = true;
    } else {
        choose_two.style.display = 'none';
        $('.first').children[1].className = 'iconfont icon-xiala1';
        $('.first').children[1].style.color = '';
        $('.first').children[0].style.color = '';
        choose_info = false;
    }
})

//排序类型
choose_two.addEventListener('click',function(e) {
        var target = e.target;
        while(target.tagName != 'LI'){
            target = target.parentNode;   
        }
        target.style.backgroundColor = '#bebebe';
        choose_before = target;
        $('.first').children[1].className = 'iconfont icon-xiala1';
        $('.first').children[1].style.color = '';
        $('.first').children[0].style.color = '';
        choose_info = false;
        $('.first').children[0].innerHTML = target.children[0].innerHTML;
        choose_two.style.display = 'none';
        ajax({
            method: 'get',
            url:  urlPrefix + '/getPic/rank/'+target.getAttribute('name')+'/index/1/sex/a',
            success: function(res) {
                show_pic(res)
            }
        })
})
//点击页码
page.addEventListener('click',function(e) {
    var target = e.target;
    if(target.tagName != 'LI') return;
    if(pageLate ==  target.innerHTML) return;
    page.children[pageLate-1].style.backgroundColor = '#f87691';
    target.style.backgroundColor = '#f00078';
    pageLate = parseInt(target.innerHTML);
   ajax({
        method: 'get',
        url:  urlPrefix + '/getPic/rank/'+ type +'/index/'+ target.innerHTML +'/sex/a',
        success: function(res) {
            show_pic(res)
        }
    })
})
//关闭
$('.cover').addEventListener('click', e => {
    if (e.target == e.currentTarget) {
        e.currentTarget.style.display = 'none';
    }
    if ($('.container').querySelector('.show_more')) {
        $('.container').removeChild($('.show_more'));
    }
});
$('.close')[1].addEventListener('click',function() {
    $('.cover').style.display = 'none';
    $('.success').style.display = 'none';
    $('.absolute').style.display = 'none';
    second.style.display = 'none';
})
$('.upload-btn').addEventListener('click', function(e) {
    e.preventDefault();
    var now = Date.now();
    var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

    if (now >= expireDate) {
        var data = JSON.parse(sessionStorage.userInfo);
        return showExpireText(data.stu_name, data.rank);
    }
    location.href = e.currentTarget.href;
})
//投票&&预览
list.addEventListener('click',function(e) {
    var target;
    if(e.target.className == 'zan') {
        var now = Date.now();
        var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

        if (now >= expireDate) {
            var data = JSON.parse(sessionStorage.userInfo);
            return showExpireText(data.stu_name, data.rank);
        }

        target = e.target;
        ajax({
            method: 'get',
            url:  urlPrefix + '/vote/stuId/'+ stuId +'/voteId/' +target.name,
            success: function(res) {
                cover.style.display = 'block';
                if(res.status === 200) {
                    var num = parseInt(target.nextSibling.innerHTML);
                    target.nextSibling.innerHTML = num + 1;
                    $('.success').style.display = 'block';
                    $('.success').children[1].innerHTML = '投票成功! 您还有 <span class="vote_num">'+ res.data +'</span> 次投票机会哟～';
                    //console.log(res)
                } else {
                    $('.success').style.display = 'block';
                    $('.success').children[1].innerHTML = res.info;
                }
            }
        }) 
    } else if(e.target.className == 'more' || e.target.className == 'person') {
        target = e.target;
        var img_data = target.parentNode.parentNode.querySelector('.person');
        console.log(img_data)
        cover.style.display = 'block';
        document.body.style.overflow = 'hidden';
        var yulan = '<img class="big_person" src=' + publicDir + '/uploads/' +img_data.getAttribute('big_pic')+' alt=""><p class="other"><span class="all">编号<span class="number">'+img_data.getAttribute('id')+'</span></span><span class="zan_num_big">'+img_data.alt+'</span><img class="zan_big" name="'+ img_data.getAttribute('uid') +'" src="' + publicDir + '/static/stufacemo/imgs/zan1.png" alt=""></p>';
        var div = document.createElement("div");
        div.className = 'show_more';
        div.innerHTML = yulan;
        $('.container').appendChild(div);
        //预览投票

        $('.zan_big').addEventListener('click',function() {
            var now = Date.now();
            var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

            if (now >= expireDate) {
                var data = JSON.parse(sessionStorage.userInfo);
                return showExpireText(data.stu_name, data.rank);
            }
            ajax({
                method: 'get',
                url:  urlPrefix + '/vote/stuId/'+ stuId +'/voteId/' +$('.zan_big').name,
                success: function(res) {
                    $('.container').removeChild($('.show_more'));
                    if(res.status === 200) {
                        $('.success').style.display = 'block';
                        // $('.vote_num').innerHTML = res.data;
                        $('.success').children[1].innerHTML = '投票成功! 您还有 <span class="vote_num">'+ res.data +'</span> 次投票机会哟～';
                        console.log(res)
                    } else {
                        $('.success').style.display = 'block';
                        $('.success').children[1].innerHTML = res.info;
                        
                    }
                }
            }) 
        })
        //预览关闭
        $('.big_person').addEventListener('click', function(){
            $('.cover').style.display = 'none';
            $('.container').removeChild($('.show_more'));
        })
    } else {
        return;
    }
})

$('.search_button').addEventListener('click',function() {
    var value = $('.input').value;
    ajax({
        method: 'get',
        url: urlPrefix + '/getFaceById/id/'+ value,
        success: function(res) {
            if(res.status == 200) {
                list.innerHTML = '';
                var liParent = document.createElement('li');
                liParent.className = 'show';
                var li = '<span class="rank">No'+ res.data.id +'</span><img class="person" src="'+ publicDir +'/uploads/' +res.data.pic+'" alt="'+ res.data.vote +'" big_pic=' + res.data.big_pic + ' id=' + res.data.id + ' uid=' + res.data.uid +'><p class="other"><img class="zan" name="'+ res.data.uid  +'" src="' + publicDir + '/static/stufacemo/imgs/zan1.png" alt=""><span class="zan-num">'+ res.data.vote +'</span><img class="more" src="' + publicDir + '/static/stufacemo/imgs/more.png" alt="0"></p>';
                liParent.innerHTML = li;
                list.appendChild(liParent);
                data_arr = new Array(res.data);
            } else {
                window.alert(res.info);
            }
        }
    })
})
function show_pic(res) {
    list.innerHTML = '';
    data_arr = res.data;
	console.log(data_arr)
    for(var i = 0; i < res.data.length; i++) {
        var liParent = document.createElement('li');
        liParent.className = 'show';
        var li = '<span class="rank">No'+ res.data[i].id +'</span><div><img class="person" src="'+ publicDir +'/uploads/' +res.data[i].pic+'" alt="'+ res.data[i].vote +'" big_pic=' + res.data[i].big_pic + ' id=' + res.data[i].id + ' uid=' + res.data[i].uid +'></div><p class="other"><img class="zan" name="'+ res.data[i].uid  +'" src="' + publicDir + '/static/stufacemo/imgs/zan1.png" alt=""><span class="zan-num">'+ res.data[i].vote +'</span><img class="more" src="' + publicDir + '/static/stufacemo/imgs/more.png" alt="'+ i +'"></p>';
        liParent.innerHTML = li;
        list.appendChild(liParent);
    }
}
