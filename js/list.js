console.log("加载成功");

require.config({
    paths:{
        "jquery":"jquery-1.11.3",
        "nav":"nav",
        "goodsList":"goodsList"
    },
})

require(['nav','goodsList'],function(nav,goodsList){
    nav.leftNavDownload();
    nav.topNavDownload();
    nav.leftNavTab();
    nav.topNavTab();
    nav.searchTab();
    nav.allGoodsTab();

    goodsList.download();
    goodsList.banner();
})