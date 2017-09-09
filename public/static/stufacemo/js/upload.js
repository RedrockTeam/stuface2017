var now = Date.now();
var expireDate = new Date('2017-9-10 12:00:00').getTime(); // 截止日期

if (now >= expireDate) {
    location.href = 'http://localhost/redrock/stuface/index.php/weixin/index/stufacemo'
}
var add = $('.add'),
    p_form = $('.p_form'),
    button = $('.button'),
    test_last = /\.png$|jpeg$|jpg$/i,
    file = p_form.children[0],
    stuId = window.location.search.split('=')[1],
    icon = $('.icon'),
    //cover = $('.cover'),
    image,
    check_upload =  false;

// 本地
//var publicDir = '/redrock/stuface/public'
///var urlPrefix = `/redrock/stuface/index.php/index/index`
// 线上
var publicDir = '/stuface2017/public'
var urlPrefix = `/stuface2017/index.php/index/index`

function getQueryString(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    } 

    function chooseImg() {
        var value = file.value;
        if( test_last.test(value) ) {
            check_upload =  true;
            icon.style.display = 'none';
            add.style.backgroundImage = 'url('+ getFullSrc(file) +')';
            image = file.files[0];
            //console.log(1)
        } else {
            window.alert('只能上传png、jpeg、jpg格式');
            check_upload =  false;
        }
    }
   function getFullSrc (obj) {
    	return window.URL.createObjectURL(obj.files[0]);
    }
    function uploadImg() {
        if(!check_upload) return;
        var formData = new FormData();
        formData.append('stuId', stuId);
        formData.append('image',file.files[0]);
        console.log(file.files[0])
        //cover.style.display = 'block';
        ajax({
            method: 'post',
            url: urlPrefix + '/uploadImage',
            info: 'form',
            data: formData,
            success: function(res) {
                console.log(res)
                window.alert(res.info);
				window.history.back(-1);
            }
        })
    } 
add.addEventListener('touchend',function() {
    file.click();
    
})
file.addEventListener('change',function() {
    chooseImg();
    //console.log(file.files[0]);
})
button.addEventListener('touchend',function() {
    uploadImg();
})
