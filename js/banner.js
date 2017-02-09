var imageList = $('.imageList li');
var imageListCount = imageList.length;
var imageLastIndex = 0;
var imageCurrIndex = 0;
var imagePointer = 'right';
var auto_timer = 0;
var auto_timers = 0;
var indexLastAItem;
var imageTip = $("#imageTipList");

//初始化
imageList.css({opacity: 0});
var defualt = {
    timer: 10000,
    sleep: 1600
};
//banner显示
function bannerShow(sleep) {
    clearTimeout(auto_timer);
    clearTimeout(auto_timers);
    if (!sleep) {
        sleep = defualt.sleep;
    }
    //
    if(imagePointer == 'right'){
       imageCurrIndex = imageLastIndex +1;
    }else{
       imageCurrIndex = imageLastIndex -1;
    }
    
    //防止越界
    if(imageCurrIndex > imageListCount -1 ){
        if(imagePointer == 'right'){
            imageCurrIndex = 0; 
        }else{
            imageCurrIndex = imageListCount -1;
        }        
    }else if(imageCurrIndex < 0 ){
        if(imagePointer == 'right'){
            imageCurrIndex = 0; 
        }else{
            imageCurrIndex = imageListCount -1;
        } 
    }
    imageTip.find("li").removeClass("tips-active").eq(imageLastIndex).addClass("tips-active");
    //创建图片
    var imagea = imageList.eq(imageCurrIndex).find('a');
    var imgurl = imagea.attr('data-url');
    var imgObj = new Image();
    imgObj.src = imgurl;
    var jqObj = $(imgObj);
    //注册事件
    if (jqObj.complete == true) {
        doShow(imageCurrIndex, imageLastIndex, sleep);
    }else{
        jqObj.load(function () {
        doShow(imageCurrIndex, imageLastIndex, sleep);
        });
        jqObj.error(function () {
            //console.log('error');
            bannerShow(sleep);
        });
    }    
}
//显示



function doShow(index, lastIndex, sleep) {
    if (!imageList.is(":animated")){
        var indexItem = imageList.eq(index);     
        var indexAItem  = indexItem.find('a');
        var indexLastItem = imageList.eq(lastIndex);
        var indexLastAItem = indexLastItem.find('a');
        indexAItem.css('background-image','url(' + indexAItem.attr('data-url') + ')');         
        imageList.eq(lastIndex).stop(true).animate({opacity: '0'}, sleep);
        indexItem.stop(true).animate({opacity: '1'}, sleep,function(){
            auto_timer = setTimeout("bannerShow()", defualt.timer);
        });
        if(indexAItem.hasClass('Animationb')){
            indexAItem.removeClass('Animationb');
            indexAItem.addClass('Animationl');
        }else if(indexAItem.hasClass('Animationl')){
            indexAItem.removeClass('Animationl');
            indexAItem.addClass('Animationb');
        }else if(indexLastAItem.hasClass('Animationb')){
            indexAItem.removeClass("Animationl");
            indexAItem.removeClass("Animationb");
            indexAItem.addClass("Animationl");
        }else{
            indexAItem.removeClass("Animationl");
            indexAItem.removeClass("Animationb");
            indexAItem.addClass("Animationb");
        }
        
        imageLastIndex = index;        
    } else {
        console.log('loading...');
        //当新图片由无到有渐变出来的时候，如果点击tips，会出现loading，点击无效
    }

   // return indexLastAItem;

   
}
//随机获取图片索引
function getImageIndex() {
    var num = (Math.random().toFixed(1) * 10) % imageListCount;
    return num;
}

$(document).ready(function () {   
    //获取随机图片ID
    for(var i = 0;i<imageListCount;i++){
    	imageTip.append("<li></li>");
    }
    imageLastIndex = getImageIndex();
    imageTip.find("li").removeClass("tips-active").eq(imageLastIndex).addClass("tips-active");
    //初始化
    bannerShow(defualt.sleep);
    //首屏切换
    $('.indexPage_rightBtn').click(function () {
        imagePointer = 'right';
        bannerShow(defualt.sleep);
    });
    $('.indexPage_leftBtn').click(function () {
        imagePointer = 'left';
        bannerShow(defualt.sleep);
    });
    
    $(document).on("click","#imageTipList>li",function(){
    	imageLastIndex = $(this).index();
    	console.log(imageLastIndex);
    	bannerShow(defualt.sleep);
    });
    
    $('.masthead_txt,#top_bantouming').click(function(){
        console.log(imageLastIndex);
        var url = imageList.eq(imageLastIndex).find('a').attr('href');
        window.open(url);
    });
});

