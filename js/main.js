console.log("加载成功");

require.config({
    paths:{
        "jquery":"jquery-1.11.3",
        "jquery-cookie":"jquery.cookie",
        "nav":"nav",
        "slide":"slide",
        "data":"data"
    },
    shim:{
        "jquery-cookie":["jquery"]
    }
})

require(["nav","slide","data"],function(nav,slide,data){
    nav.download();
    nav.banner();
    nav.leftNavTab();
    nav.topNavTab();
    nav.searchTab();

    slide.download();
    slide.slideTab();

    data.download();
    data.tabMenu();
})
