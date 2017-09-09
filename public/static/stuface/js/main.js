
// sessionStorage.clear();
var rankToSort = 'comp',
    clickedSex = 'a',
    nowPage = 1;

// 本地 本地只需改这个参数
// var publicDir = '/redrock/stuface'
// var urlPrefix = `/redrock/stuface/index.php/index/index`
// 线上
var publicDir = '/stuface2017/public'
var urlPrefix = `/stuface2017/index.php/index/index`

var expireText = '本次活动已结束，获奖信息请查看右上角信息提示或关注重邮小帮手查看获奖推送！谢谢';
var awardText = function (name, rank) {
    return '<span class="hl">' + name + '</span> 您好：恭喜您在新生笑脸活动中排名第 <span class="hl">' + rank + '</span> 名，请于9月16日-9月20日在太极操场西六门三楼左侧红岩网校工作站领取奖品！';
}
var noAWardText = '很遗憾，您未获奖，但是不要灰心！在后面我们为鲜肉们准备了更多精彩的活动！敬请留意哦！';

function showAwardInfo(name, rank) {
    return rank===-1 ? noAWardText : awardText(name, rank);
}

function checkLogin() {
    if (sessionStorage.stuid) {
        $('.log-out').style.display = "block";
        return true;
    }
    $('.log-out').style.display = "none";
    return false
}
checkLogin();

function showModel(text) {
    $('.model-text').innerHTML = text;
    $('.model-view').style.display = 'block';
}

[$('.model-view'), $('.login-view'), $('.info-view'), $('.upload-view'), $('.big-pic-view')].forEach(ele => {
    ele.addEventListener('click', e => {
        if (e.target == e.currentTarget) {
            e.currentTarget.style.display = 'none';
        }
    });
});
$('.log-out').addEventListener('click', function() {
    sessionStorage.clear();
    location.reload();
})
//如果不是第一次登陆，
if (sessionStorage.stuid) {
    $('.title-last').classList.add('my-info-active');
    $('.title-last').classList.remove('login-in');
}
$('.search b').addEventListener('click', function() {
    var infoToSearch = parseInt($('.search input').value);
    Ajax({
        method: 'GET',
        url: `${urlPrefix}/getFaceById/id/${infoToSearch}`,
        success: function(res) {
            var status = parseInt(res.status);
            if (status === 200) {
                $('.show-details').innerHTML = allImgView([res.data]);
            } else if (status === 400) {
                showModel('未找到该编号下的同学');
            }
        }
    });
});

//有新消息
$('.title-last').addEventListener('click', function() {
    if ($('.title-last').classList.contains('my-info-active')) {
        var now = Date.now();
        var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

        if (now >= expireDate) {
            var data = JSON.parse(sessionStorage.userInfo);
            showModel(showAwardInfo(data.stu_name, data.rank));
        } else {
            Ajax({
                method: 'GET',
                url: `${urlPrefix}/getStatus/stuId/${sessionStorage.stuid}`,
                success: function(res) {
                    var status = parseInt(res.status);
                    $('.info-view').style.display = 'block';
                    $('.info-view').querySelector('.login-form').style.height = '216px';
                    if (status === 200) {
                        if (res.data == 2) {
                            $('.message').innerHTML = '您的照片已审核通过，可在首页查看哦';
                            $('.again-upload').style.display = 'none';
                        } else if (res.data == 0) {
                            $('.message').innerHTML = '您未上传照片哦';
                            $('.info-view').querySelector('.login-form').style.height = '300px';
                        } else if (res.data == 1) {
                            $('.message').innerHTML = '您上传的照片正在审核中哦，请耐心等待';
                            $('.again-upload').style.display = 'none';
                        } else {
                            $('.message').innerHTML = '您参与的新生笑脸——晒晒录取通知书活动由于 <span class="highlight">未审核或者审核未通过</span> ，所以不能将您的照片上传到首页进行展示哦。'
                            $('.info-view').querySelector('.login-form').style.height = '300px';
                        }
                    } else {
                        showModel(res.info);
                    }
                }
            });
        }
    }
});

//获取页面总数
function getPageNumber(sex = 'a') {
    Ajax({
        url: `${urlPrefix}/getPageNumber/sex/${sex}`,
        success: function(res) {
            var status = parseInt(res.status);
            if (status === 200) {
                var dataCount = res.data;
                clickedIndex = 0;
                sessionStorage.pageCount = dataCount;
                var pageView = '<li class="page-count page-selected" style="display:block">1</li>';
                for (var i = 2; i <= dataCount; i++) {
                    pageView += '<li class="page-count" style="display:block">'+i+'</li>'
                }
                $('.page-div').innerHTML = pageView;
            } else {
                showModel(res.info);
            }
        }
    })
}
// 获取全部
getPageNumber('a');

//获取第一页页面图片信息
Ajax({
    url: `${urlPrefix}/getPic/rank/comp/index/1/sex/a`,
    success: function(res) {
        var status = parseInt(res.status);
        if (status === 200) {
            $('.show-details').innerHTML = allImgView(res.data);
        } else {
            showModel(res.info);
        }
    }
})

//图片上传
var allBtnUpload = [].slice.call($('.btn-uplaod'));
allBtnUpload.forEach( function(element, index) {
    element.addEventListener('click', function() {
        var now = Date.now();
        var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

        if (now >= expireDate) {
            $('.model-view').querySelector('.model-text').classList.add('award-info');
            showModel(expireText);
            return;
        }

        $('.model-view').querySelector('.model-text').classList.remove('award-info');
        if (!sessionStorage.stuid) {
            return showModel('你还未登录哦');
        }
        if (!/^2017/.test(sessionStorage.stuid)) {
            return showModel('你不是新生哦');
        }
        
        Ajax({
            method: 'GET',
            url: `${urlPrefix}/getStatus/stuId/${sessionStorage.stuid}`,
            success: function(res) {
                var status = parseInt(res.status);
                if (status === 200) {
                    if (res.data == 2 || res.data == 1) {
                        showModel('你的照片' + res.info + ',无需再次上传');
                    } else {
                        if (element.classList.contains('again-upload')) {
                            $('.info-view').style.display = 'none';
                        }
                        $('.upload-view').style.display = 'block';
                    }
                } else {
                    showModel(res.info);
                }
            }
        });
    });
});

var file='';
[$('.upload-img-div input'), $('.rechoose-img')].forEach( function(ele, i) {
    ele.addEventListener('change', function () {
        file = ele.files[0];
        $('.info-view').style.display = 'none';
        if (file) {
            if(/image\/\w+/.test(file.type)){  
                $('.upload-view').style.display = 'block';
            } else {
                showModel("只能上传图片哦～");  
            }
        }
        var fr = new FileReader();
        fr.onloadend = function(e) {
          $('.upload-img-forsee').src = e.target.result;
        }
        fr.readAsDataURL(file);
    });
});
$('.upload-btn').addEventListener('click', function() {
    if (!file) {
        return showModel('请选择图片哦')
    }
    var type = file.type;
    if(!/png$|jpeg$|jpg$/i.test(type)) {
        return showModel('只能上传png、jpeg、jpg格式');
    }
    var form = new FormData();
    form.append("image", file)
    form.append("stuId", sessionStorage.stuid);
    Ajax({
        method: 'POST',
        url: `${urlPrefix}/uploadImage`,
        content: form,
        success: function(res) {
            var status = parseInt(res.status);
            if (status === 200) {
                showModel('上传成功');
                $('.info-view').style.display = 'none';
                $('.upload-view').style.display = 'none';
                $('.upload-img-forsee').src = ROOT + "/static/stuface/images/upload-camera.png";
                file = '';
            } else {
                showModel(res.info);
            }
        }
    });
}); 

//选中元素出现红边框
var imgParent = $('.show-details');

// 输入编号focus 
$('.input-num').addEventListener('click', function() {
    var allimgs = [].slice.call($('.show-img') || []);
    allimgs.forEach(function(element, index) {
        element.classList.remove('show-img-active');
    });
    [$('.sex span'), $('.show-style span')].forEach(function(element, index) {
        element.classList.remove('arrow-up');            
        element.classList.add('arrow-down');
        element.parentElement.parentElement.classList.remove('show-img-active', 'select-more');
    });
    $('.input-num').parentElement.classList.add('show-img-active');
});

//笑脸展示 下拉列表 部分
attachEvetn($('.comp'), $('.all-sex'));
attachEvetn($('.all-sex'), $('.comp'));
function attachEvetn(clicked, another) {
    clicked.addEventListener('click', function() {
        $('.input-num').parentElement.classList.remove('show-img-active');
        another.parentElement.classList.remove('show-img-active', 'select-more');
        another.querySelector('span').classList.remove('arrow-up');
        another.querySelector('span').classList.add('arrow-down');

        var target = clicked.querySelector('span');
        if (target.classList.contains('arrow-up')) {
            target.classList.remove('arrow-up');
            target.classList.add('arrow-down');
            target.parentElement.parentElement.classList.remove('show-img-active', 'select-more');
        } else {
            target.classList.remove('arrow-down');            
            target.classList.add('arrow-up');
            target.parentElement.parentElement.classList.add('show-img-active', 'select-more');
        }
    });
}
//取消登陆
var allcloses = [].slice.call($('.login-close'));
allcloses.forEach( function(ele, i) {
    ele.addEventListener('click', function() {
        ele.parentElement.parentElement.parentElement.style.display = "none";
        // $('.title-last').classList.add('my-info');
    });
});
//登录按钮
if ($('.login-in')) {
    $('.login-in').addEventListener('click', function() {
        if (!this.classList.contains('login-in')) return;
    $('.login-view').style.display = "block";
    });
}
//登录
$('.login-btn').addEventListener('click', function() {
    if (!checkLogin()) {
        var stuid = parseInt($('.stuid').value);
        var stupassword = $('.password').value;
        Ajax({
            method: "POST",
            url: `${urlPrefix}/login`,
            content: `stuId=${stuid}&stuPassword=${stupassword}`,
            success: function (res) {
                if (parseInt(res.status) === 200) {
                    var now = Date.now();
                    var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期
                    
                    // 显示获奖信息
                    if (now >= expireDate) {
                        var data = res.data[0];
                        var rank = data.rank;
                        $('.model-view').querySelector('.model-text').classList.add('award-info');
                        if (data.rank !== -1) {
                            showModel(showAwardInfo(data.stu_name, data.rank));
                        }
                    } else {
                        showModel('登录成功');
                    }
                    
                    $('.login-view').style.display = "none";
                    $('.log-out').style.display = "block";
                    sessionStorage.stuid = stuid;
                    if (res.data) {
                        sessionStorage.sex = res.data[0].sex;
                        sessionStorage.userInfo = JSON.stringify(res.data[0]);
                    }
                    $('.title-last').classList.remove('login-in');
                    $('.title-last').classList.add('my-info-active');
                } else {
                    showModel(res.info);
                }
            }
        });
    }
});

//分类展示笑脸
selectRank($('.hot'), 'hot')
selectRank($('.comp-order'), 'comp')
selectRank($('.new'), 'new')
selectSex($('.man'), 'm')
selectSex($('.woman'), 'w')
selectSex($('.a-order'), 'a')

var clickedIndex = 0;
var middleIndex = 2;
//page-change
var pageDiv = $('.page-div');
pageDiv.addEventListener('click', function(e) {
    var target = e.target;
    if(target && target.nodeName.toUpperCase() === "LI") {
        clickedIndex = parseInt(target.firstChild.nodeValue)-1;
        imagePaging(clickedIndex);
    }
});
function imagePaging(pageIndex) {
    var pageCount = sessionStorage.pageCount;
    pages = [].slice.call($('.page-count') || []);
    pages.forEach(function(element, index) {
        element.classList.remove('page-selected');
    });
    pages[pageIndex].classList.add('page-selected');

    if (pageIndex < pageCount-2 && pageIndex>=2) {
        $('.page-div').style.marginLeft = -40 * (pageIndex-2) + 'px'
    }

    Ajax({
        method: 'GET',
        url: `${urlPrefix}/getPic/rank/${rankToSort}/index/${pageIndex+1}/sex/${clickedSex}`,
        success: function(res) {
            var status = parseInt(res.status);
            if (status === 200) {
                var imgInfo = res.data;
                $('.show-details').innerHTML = allImgView(res.data);
            } else {
                showModel(res.info);
            }
        }
    });
}

$('.hand-right').addEventListener('click', function() {
    var pageCount = sessionStorage.pageCount;
    var singleWidth = 38;

    clickedIndex = clickedIndex+1;
    if (clickedIndex >= pageCount) {
        clickedIndex -= 1
        return;
    }
    imagePaging(clickedIndex);
});

$('.hand-left').addEventListener('click', function() {
    clickedIndex = clickedIndex-1;
    if (clickedIndex < 0) {
        clickedIndex += 1
        return;
    }
    imagePaging(clickedIndex);
});
//点开大图后投票
$('.big-pic-vote').addEventListener('click', function() {
    var now = Date.now();
    var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期
    if (now >= expireDate) {
        $('.model-view').querySelector('.model-text').classList.add('award-info');
        return showModel(expireText);
    }
    if (checkLogin()) {
        var clickedImgUid = parseInt($('.big-pic-vote').parentElement.parentElement.parentElement.firstElementChild.getAttribute('alt'));
        var stuid = sessionStorage.stuid;
        Ajax({
            method: 'GET',
            url: `${urlPrefix}/vote/stuId/${stuid}/voteId/${clickedImgUid}`,
            success: function(res) {
                var status = parseInt(res.status);
                if (status == 200) {
                    $('.big-pic-vote').nextElementSibling.innerText = parseInt($('.big-pic-vote').nextElementSibling.innerText)+1;
                    showModel('投票成功! 您还有 <span class="color-red">' + res.data + '</span> 次投票机会哟～');
                } else {
                    showModel(res.info);
                }
            }
        });   
    } else {
        showModel('请先登录')
    }
});
$('.show-details').addEventListener('click', function(e) {
    var ele = e.target;
    //投票
    if(ele.classList.contains('love') || ele.parentElement.classList.contains('love')) {
        var now = Date.now();
        var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

        if (now >= expireDate) {
            $('.model-view').querySelector('.model-text').classList.add('award-info');
            return showModel(expireText);
        }
        if (checkLogin()) {
            var clickedImgUid = parseInt(ele.parentElement.parentElement.parentElement.querySelector('.show-face').getAttribute('alt'));
            var stuid = sessionStorage.stuid;
            Ajax({
                method: 'GET',
                url: `${urlPrefix}/vote/stuId/${stuid}/voteId/${clickedImgUid}`,
                success: function(res) {
                    var status = parseInt(res.status);
                    $('.model-view').querySelector('.model-text').classList.remove('award-info');
                    if (status === 200) {
                        ele.nextElementSibling.innerText = parseInt(ele.nextElementSibling.innerText)+1;
                        showModel('投票成功! 您还有 <span class="color-red">' + res.data + '</span> 次投票机会哟～');
                    } else {
                        showModel(res.info);
                    }
                }
            });
        } else {
            showModel('请先登录')
        }
    }   
    //大图展示
    if (ele.classList.contains('more-detail') || ele.classList.contains('show-face')) {
        var parentVote = ele.parentElement.parentElement;
        var bigPicUrl = parentVote.querySelector('.show-face').getAttribute('data-bigPic');
        $('.big-pic-view').style.display = 'block';
        $('.big-pic-id').innerHTML = parentVote.querySelector('.show-face').getAttribute('id');
        $('.big-pic-count').innerHTML = parentVote.querySelector('.loved-count').innerText;
        $('.big-pic-img').setAttribute('src', ROOT + '/uploads/' + bigPicUrl);
        $('.big-pic-img').setAttribute('alt', parentVote.querySelector('.show-face').alt);
    }
});
//根据返回图数据 渲染 页面
function allImgView(data) {
    if (!data) 
        return '';
    var imgView = '';
    
    var requestImg = data || [],
        lineCounts = parseInt(requestImg.length/4)+1;
    requestImg.forEach( function(img, i) {
        if (i % 4 === 0) {
            imgView += `<ul class="show-details-ul">
                            <li class="face-line">
                                <ul>`;
        }  
        imgView += `<li class="show-img">
                        <div>
                            <img src=${publicDir}/uploads/${img.pic}
                                alt=${img.uid}
                                data-sex=${img.sex}
                                id=${img.id} 
                                data-bigPic=${img.big_pic} class="show-face" />
                        </div>
                        <div class="face-detail">
                            <div class="love">
                                <div class="heart-shape"></div>
                                <div class="loved-count">${img.vote}</div>
                            </div>
                            <div class="more-detail"></div>
                        </div>
                    </li>`
        if (((i+1) % 4 === 0) || (i>lineCounts*4)) {
            imgView += `</ul>
                    </li>
                </ul>`;
        } 
    });
    return imgView;
}
function selectRank(ele, value) {
    ele.addEventListener('click', function() {
        rankToSort = value;
        ele.parentElement.querySelector('em').innerText = ele.innerText;
        $('.show-style span').classList.remove('arrow-up');
        $('.show-style span').classList.add('arrow-down');
        ele.parentElement.classList.remove('show-img-active', 'select-more');
        Ajax({
            method: 'GET',
            url: `${urlPrefix}/getPic/rank/${rankToSort}/index/${nowPage}/sex/${clickedSex}`,
            success: function(res) {
                var status = parseInt(res.status);
                if (status === 200) {
                    if (res.data) {
                        $('.show-details').innerHTML = allImgView(res.data);
                    } else {
                        $('.show-details').innerHTML = '';
                    }
                } else {
                    showModel(res.info);
                }
            }
        });
    });
}
function selectSex(ele, value) {
    ele.addEventListener('click', function() {
        getPageNumber(value);
        clickedSex = value;
        $('.sex span').classList.remove('arrow-up');
        $('.sex span').classList.add('arrow-down');
        ele.parentElement.querySelector('em').innerText = ele.innerText;
        ele.parentElement.classList.remove('show-img-active', 'select-more');
        Ajax({
            method: 'GET',
            url: `${urlPrefix}/getPic/rank/${rankToSort}/index/${nowPage}/sex/${clickedSex}`,
            success: function(res) {
                var status = parseInt(res.status);
                if (status === 200) {
                    if (res.data) {
                        $('.show-details').innerHTML = allImgView(res.data);
                    } else {
                        $('.show-details').innerHTML = '';
                    }
                } else {
                    showModel(res.info);
                }
            }
        });
    });
}
function Ajax (obj) {
    var request = new XMLHttpRequest,
        defaults = {
            method: "GET",
            url: "",
            async: true,
            success: function () {},
            error: function () {
                console.log('internet error');
            },
            content: null
        };
    for (var key in obj) {
        defaults[key] = obj[key];
    }
    request.onreadystatechange = function () {
        if (request.readyState === 4){
            if (request.status === 200) {
                var responseText = JSON.parse(request.responseText);
                defaults.success.call(request, responseText);
            } else {
                defaults.error(request);
            }
        }
    };
    request.open(defaults.method, defaults.url, defaults.async);
    if (defaults.method === 'POST') {
        if (!~defaults.url.indexOf('uploadImage')) {
            request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        }
    }
    request.send(defaults.content);
}
function $(ele) {
    if (document.querySelectorAll(ele).length > 1) {
        return document.querySelectorAll(ele);
    } else {
        return document.querySelector(ele);
    }
}
