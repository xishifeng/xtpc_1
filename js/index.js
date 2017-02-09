$(function () {
    // 初始化当前索引
    var key = 0;
    // var flag=1;
    // keys为总屏数
    var keys = $(".wrapBox .box");
    //漂浮header
    var fixedHeadBox = $('#fixedHeadBox');
    //滑轮滚动事件
    $(document).mousewheel(function (event, delta) {
        // 控制变量flag节流，无论怎么滚动，都是一屏屏的显示
        if (!$(".wrapBox").is(":animated")) {
            // 两个参数
            /*alert(delta);
             1.当鼠标向下滑动的时候，弹出-1；
             2.当鼠标向上滚动的时候，弹出1；
             3.只有两个值1和-1；			
             */

            key = key - delta;
            if (key < 0) {
                key = 0;
            } else if (key > 4) {
                key = 4;
            }

            if (key >= 1) {
                fixedHeadBox.stop(true).show();
            } else {
                fixedHeadBox.stop(true).hide();
            }
            $(".wrapBox").stop(true).animate({top: -key * 100 + "%"}, 500, function () {
                // flag = 1;
            });
            $('.siderNav li').eq(key).addClass('current').siblings().removeClass('current');
            // alert("delta");
        }
    });
    $(document).keydown(function (event) {
        // 控制变量flag节流，无论怎么滚动，都是一屏屏的显示
        if(event && event.keyCode==40){
            if (!$(".wrapBox").is(":animated")) {
                key ++;
                if (key < 0) {
                    key = 0;
                } else if (key > 5) {
                    key = 5;
                }

                if (key >= 1) {
                    fixedHeadBox.stop(true).show();
                } else {
                    fixedHeadBox.stop(true).hide();
                }
                $(".wrapBox").stop(true).animate({top: -key * 100 + "%"}, 500, function () {
                    flag = 1;
                });
            }
        }

        if(event && event.keyCode==38){
            if (!$(".wrapBox").is(":animated")) {
                key --;
                if (key < 0) {
                    key = 0;
                } else if (key > 5) {
                    key = 5;
                }

                if (key >= 1) {
                    fixedHeadBox.stop(true).show();
                } else {
                    fixedHeadBox.stop(true).hide();
                }
                $(".wrapBox").stop(true).animate({top: -key * 100 + "%"}, 500, function () {
                    flag = 1;
                });
            }
        }




           
    });
    
});

//二屏轮播
var KFlow = function () {
    var kf = this;
    kf.config = {
        sleep: 300,
        shade: '.kf_imgShade',
        desc: '.kf_desc',
        space: 5
    };
    kf.box = {
        self: null,
        width: 0,
        center: 0
    };
    kf.item = {
        all: null,
        count: 0,
        scale: 0.6,
        curr: {
            width: 300,
            height: 200,
            left: 0,
            right: 0,
            top: 0
        },
        other: {
            width: 0,
            height: 0,
            top: 0
        }
    };
    kf.index = {
        all: [],
        curr: 0
    };
    kf.init = function (data) {
        //盒子
        kf.box = data.box;
        kf.box.width = kf.box.width();
        kf.box.height = kf.box.height();
        kf.box.center = kf.box.width / 2;
        //中间元素        
//        kf.item.curr.width = kf.box.width / 3 ;
//        kf.item.curr.height = kf.item.curr.width * 0.618;
        kf.item.curr.height = kf.box.height - 50;
        kf.item.curr.width = kf.item.curr.height / 0.618;

        var halfWidth = kf.item.curr.width / 2;
        kf.item.curr.left = kf.box.center - halfWidth;
        kf.item.curr.right = kf.box.center + halfWidth;
        //非中间元素
//        kf.item.other.width = kf.item.curr.width * kf.item.scale;
        kf.item.other.height = kf.item.curr.height * kf.item.scale;
        kf.item.other.width = kf.item.other.height;
//        kf.item.other.height = kf.item.curr.height * kf.item.scale;
        kf.item.other.top = (kf.item.curr.height - kf.item.other.height) / 2;
        //元素
        kf.item.all = data.item;
        kf.item.count = kf.item.all.length;
        //所有数组
        for (var i = 0, max = kf.item.count; i < max; i++) {
            kf.index.all[i] = i;
        }
        //当前索引  取一半
        kf.index.curr = Math.floor(kf.item.count / 2);
        //随机第一个
        var kf_random = Math.floor(Math.floor(Math.random().toFixed(2) * 100) % kf.item.count);
        var over_count = Math.floor(Math.abs(kf_random - kf.index.curr));
        
        if(kf_random > kf.index.curr){
            for (var i = 0, max = over_count; i < max; i++) {
                var num = kf.index.all.shift();
                kf.index.all.push(num);
            }
        }        
        else if(kf_random < kf.index.curr){
            for (var i = 0, max = over_count; i < max; i++) {
                var num = kf.index.all.pop();
                kf.index.all.unshift(num);  
            }
        }else{
            
        }
        //初始化内容
        var _sleep = kf.config.sleep;
        kf.config.sleep = 0;
        kf.left();
        kf.config.sleep = _sleep;
        //初始化点击
        $('.kf_img').click(function () {
            var this_item = $(this);
            var this_parent = this_item.parent().parent();
            var index = this_parent.attr('data-index');
            console.log(index + ' ' + kf.index.curr)
            if (index == kf.index.curr) {
                if(!this_parent.is(":animated")){
                    //弹窗
                    var url = this_item.attr('href');
                    window.open(url);
                }
            } else {
                kf.reset(index);
            }
        });
    };
    kf.reset = function (index) {
        var offset = index - kf.index.curr;
        if (offset > 0) {
            kf.left();
        } else {
            kf.right();
        }

    }
    kf.left = function () {
        if (kf.item.all.is(":animated")) {
            console.log('动画中');
            return false;
        }
        var num = kf.index.all.shift();
        kf.index.all.push(num);
        kf.calculate('left');

    };
    kf.right = function () {
        if (kf.item.all.is(":animated")) {
            console.log('动画中');
            return false;
        }
        var num = kf.index.all.pop();
        kf.index.all.unshift(num);
        kf.calculate('right');
    };
    kf.calculate = function (toDo) {
        for (var i = 0, max = kf.item.count; i < max; i++) {
            var _sleep = kf.config.sleep;
            switch (toDo) {
                case 'left':
                    if (i == kf.item.count - 1) {
                        kf.config.sleep = 0;
                    }
                    kf.show(i);
                    kf.config.sleep = _sleep;
                    break;
                case 'right':
                    if (i == 0) {
                        kf.config.sleep = 0;
                    }
                    kf.show(i);
                    kf.config.sleep = _sleep;
                    break;
            }
        }
    };
    kf.show = function (index) {
        var this_item = kf.item.all.eq(kf.index.all[index]);
        this_item.attr('data-index', index);
        if (index == kf.index.curr) {
            //正常尺寸
            this_item.animate({
                width: kf.item.curr.width + 'px',
                height: kf.item.curr.height + 'px',
                top: kf.item.curr.top,
                left: kf.item.curr.left - kf.config.space
            }, kf.config.sleep, function () {
                //介绍
                this_item.find(kf.config.desc).animate({
                    opacity: '1'
                }, kf.config.sleep * 2);
            });
            //遮罩
            this_item.find('.kf_img').animate({
                opacity: '1'
            }, kf.config.sleep);

        } else {
            var _left = 0;
            if (index < kf.index.curr) {
                _left = kf.item.curr.left - kf.config.space - (kf.item.other.width + kf.config.space) * (kf.index.curr - index);
            } else {
                _left = kf.item.curr.right - (kf.item.other.width + kf.config.space) * (kf.index.curr - index + 1);
            }
            //缩放尺寸                        
            this_item.animate({
                width: kf.item.other.width + 'px',
                height: kf.item.other.height + 'px',
                top: kf.item.other.top,
                left: _left
            }, kf.config.sleep);
            //遮罩
            this_item.find('.kf_img').animate({
                opacity: '0.3'
            }, kf.config.sleep / 2);
            //介绍
            this_item.find(kf.config.desc).animate({
                opacity: '0'
            }, 0);
        }
    }
};
var kf = new KFlow();
$(document).ready(function () {
    kf.init({
        box: $('#zuopin_tj_ul'),
        item: $('.kf_imgItem')
    });
    $('#lbtn').click(function () {
        kf.left();
    });
    $('#rbtn').click(function () {
        kf.right();
    });
    
});


//var heights = $(".masthead_txt").height();
var heights = $(document).height();
var widths = $(".masthead_txt").width();
var halfHeight = heights/2;
var txtImgWidth = 0;

window.onresize = function () {
   kf.init({
        box: $('#zuopin_tj_ul'),
        item: $('.kf_imgItem')
    });
    $('#lbtn').click(function () {
        kf.left();
    });
    $('#rbtn').click(function () {
        kf.right();
    });
    //var heights = $(".masthead_txt").height();
    var heights = $(document).height();
    var widths = $(".masthead_txt").width();
    var halfHeight = heights/2;
    var txtImgWidth = 0;
    if(widths <= 1600){
        $(".masthead_txt").css("paddingTop",halfHeight);
        $(".containerg").css("width",widths*0.7);
        $(".containerg .banner_txt_07").css("width",widths*0.44);
        var bannerTxtWidth = $(".containerg .banner_txt_07").width();
        $(".containerg .banner_txt_07").css("height",bannerTxtWidth*0.14935);
    }else{
        $(".masthead_txt").css("paddingTop",halfHeight);
        $(".containerg").css("width",widths*0.64);
        $(".containerg .banner_txt_07").css("width",widths*0.4);
        var bannerTxtWidth = $(".containerg .banner_txt_07").width();
        $(".containerg .banner_txt_07").css("height",bannerTxtWidth*0.14935);
    }

}

