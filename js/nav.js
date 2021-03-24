define(["jquery"],function($){
    function download(){
        $.ajax({
            type:"get",
            url:"../data/nav.json",
            success: function(result){
                var bannerArr = result.banner;
                for(var i = 0; i < bannerArr.length; i++){
                    $(`<a href="${bannerArr[i].url}">
                    <img class = "swiper-lazy swiper-lazy-loaded" src="../images/banner/${bannerArr[i].img}" alt=""/>
                </a>`).appendTo("#J_homeSwiper .swiper-slide");

                    var node = $(`<a href="#" class = 'swiper-pagination-bullet'></a>`);
                    if(i == 0){
                        node.addClass("swiper-pagination-bullet-active");
                    }
                node.appendTo("#J_homeSwiper .swiper-pagination");
                }
            },
            error:function(msg){
                console.log(msg);
            }
        }) 
        leftNavDownload();
        topNavDownload();
    }
     /* 实现轮播图效果 */
    function banner(){
        var iNow = 0;/* 当前轮播图的下标，默认为0 */
        var aImgs = null;/* 记录图片  */
        var aBtns = null;/* 记录小圆点  */

        var timer = setInterval(function(){
            iNow++;
            tab();
        },2500)

        function tab(){
            if(!aImgs){
                aImgs = $("#J_homeSwiper .swiper-slide").find("a");
            }
            if(!aBtns){
                aBtns = $("#J_homeSwiper .swiper-pagination").find("a");
            }
            if(iNow == 5){
                iNow = 0;
            }
            aImgs.hide().css("opacity",0.2).eq(iNow).show().animate({opacity:1},500);
            aBtns.removeClass("swiper-pagination-bullet-active").eq(iNow).addClass("swiper-pagination-bullet-active");
        }
        /* 添加鼠标移入移出 */
        $("#J_homeSwiper,.swiper-button-prev,.swiper-button-next").mouseenter(function(){
            clearInterval(timer);
        }).mouseleave(function(){
            timer = setInterval(function(){
                iNow++;
                tab();
            },2500)
        })

        /* 点击小圆点可以切换图片 */
        $("#J_homeSwiper .swiper-pagination").on("click","a",function(){
            iNow = $(this).index();
            tab();
            return false;/* 阻止a链接的默认行为 */
        })

        $(".swiper-button-prev,.swiper-button-next").click(function(){
            if(this.className == "swiper-button-prev"){
                iNow--;
                if(iNow == -1){
                    iNow = 4;
                }
            }else{
                iNow++;
            }
            tab()
        })   
    }
    /* 侧边导航栏数据的加载 */
    function leftNavDownload(){
        $.ajax({
            url:"../data/nav.json",
            success:function(result){
                var sideArr = result.sideNav;
                for(var i = 0; i < sideArr.length; i++){
                    var node = $(`<li class = 'category-item'>
                    <a href="/index.html" class = 'title'>
                        ${sideArr[i].title}
                        <em class = 'iconfont-arrow-right-big'></em>
                    </a>
                    <div class="children clearfix">
                        
                    </div>
                </li>`);
                node.appendTo("#J_categoryList");
                /* 取出子节点 */
                var childArr = sideArr[i].child;
                /* 判断多少列 */
                var col = Math.ceil(childArr.length / 6);
                node.find("div.children").addClass("children-col-" + col);
                for(var j = 0; j < childArr.length; j++){
                    if(j % 6 == 0){
                        var newUl = $(`<ul class="children-list children-list-col children-list-col-${parseInt(j % 6)}">
                    
                </ul>`);
                        newUl.appendTo(node.find("div.children"));
                    }
                    $(`<li>
                    <a href="http://www.mi.com/redminote8pro" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2" class="link clearfix" data-stat-id="d678e8386e9cb0fb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-d678e8386e9cb0fb', 'http://www.mi.com/redminote8pro', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2']);">
                        <img src=${childArr[j].img} width="40" height="40" alt="" class="thumb">
                        <span class="text">${childArr[j].title}</span>
                    </a>
                </li>`).appendTo(newUl);
                }
                }
            },
            error:function(msg){
                console.log(msg);
            }
        })
    }
    /* 给侧边栏添加移入移出的选项卡效果 */
    function leftNavTab(){
        $("#J_categoryList").on("mouseenter",".category-item",function(){
            $(this).addClass("category-item-active");
        })
        $("#J_categoryList").on("mouseleave",".category-item",function(){
            $(this).removeClass("category-item-active");
        })
    }
    /* 顶部导航数据加载 */
    function topNavDownload(){
        $.ajax({
            url:"../data/nav.json",
            success:function(result){
                var topArr = result.topNav;
                topArr.push({title:"服务"},{title:"社区"});
                for(var i = 0;i < topArr.length; i++){
                    $(`<li data-index="${i}" class="nav-item">
                    <a href="javascript:void(0);" class="link">
                        <span class="text">${topArr[i].title}</span>
                    </a>
                </li>`).appendTo(".site-header .header-nav .nav-list");

                    var node = $(`<ul class="children-list clearfix" style = "display: ${i == 0 ? "block" : "none"}"></ul>`);
                    node.appendTo("#J_navMenu .container");

                    if(topArr[i].childs){
                        var childArr = topArr[i].childs;
                        for(var j = 0; j < childArr.length; j++){
                            $(`<li>
                            <a href="#">
                                <div class="figure figure-thumb">
                                    <img src="${childArr[j].img}" alt="">
                                </div>
                                <div class="title">${childArr[j].a}</div>
                                <p class="price">${childArr[j].i}</p>
                            </a>
                        </li>`).appendTo(node);
                        }
                    }
                }
            },
            error:function(){
                console.log(msg);
            }

        })
    }
    /* 顶部导航添加选项卡效果 */
    function topNavTab(){
        $(".header-nav .nav-list").on('mouseenter','.nav-item',function(){
            $(this).addClass('nav-item-active');
            /* 需要找出当前移入a标签的下标  和ul的下标对应 */
            var index = $(this).index() - 1;
            if(index >= 0 && index <= 6){
                $('#J_navMenu').css({display:'block'}).removeClass('slide-up').addClass('slide-down');
                $('#J_navMenu .container').find('ul').eq(index).css('display','block').siblings('ul').css('display','none');
            }else{
                $('#J_navMenu').css({display:'none'}).removeClass('slide-down').addClass('slide-up');
            }
        })
        $(".header-nav .nav-list").on('mouseleave','.nav-item',function(){
            $(this).removeClass('nav-item-active');
        })
        $('.site-header').mouseleave(function(){
            $('#J_navMenu').css({display:'none'}).removeClass('slide-down').addClass('slide-up');
        })
    }
    /* 搜索框 */
    function searchTab(){
        $('#search').focus(function(){
            $('#J_keywordList').removeClass('hide').addClass('show');
        }).blur(function(){
            $('#J_keywordList').removeClass('show').addClass('hide');
        })
    }
    /* 给商品列表页的侧边导航添加移入移出 */
    function allGoodsTab(){
        $('.header-nav .nav-list').on('mouseenter','.nav-category',function(){
            $(this).addClass('nav-category-active');
            $(this).find('.site-category').css('display','block');
        })
        $('.header-nav .nav-list').on('mouseleave','.nav-category',function(){
            $(this).removeClass('nav-category-active');
            $(this).find('.site-category').css('display','none');
        })
    }
    return{
        download:download,
        banner:banner,
        leftNavTab:leftNavTab,
        topNavTab:topNavTab,
        searchTab:searchTab,
        leftNavDownload:leftNavDownload,
        topNavDownload:topNavDownload,
        allGoodsTab:allGoodsTab
    }
})