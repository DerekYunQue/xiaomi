define(['jquery','jquery-cookie'],function($){
    function download(){
        $.ajax({
            type:'get',
            url:'../data/goodsCarList.json',
            success:function(result){
                var arr = result.data;
                for(var i = 0; i < arr.length; i++){
                    $(`<li class="J_xm-recommend-list span4">    
                    <dl> 
                        <dt> 
                            <a href="#"> 
                                <img src="${arr[i].image}" srcset="//i1.mifile.cn/a1/pms_1551867177.2478190!280x280.jpg  2x" alt="${arr[i].name}"> 
                            </a> 
                        </dt> 
                        <dd class="xm-recommend-name"> 
                            <a href="#"> 
                            ${arr[i].name} 
                            </a> 
                        </dd> 
                        <dd class="xm-recommend-price">${arr[i].price}元</dd> 
                        <dd class="xm-recommend-tips">   ${arr[i].comments}人好评    
                            <a href="#" class = 'btn btn-small btn-line-primary J_xm-recommend-btn' style="display: none;" id = ${arr[i].goodsid}>加入购物车</a>  
                        </dd> 
                        <dd class="xm-recommend-notice">

                        </dd> 
                    </dl>  
                </li>`).appendTo('#J_miRecommendBox .row')
                }
            },
            error:function(msg){
                console.log(msg);
            }
        })
    }
    function loadCarData(){
        /* 数据源
        goodsCarList.json
        goodsList.json    new Promise处理两次按照顺序加载数据 */
        /* 清空 */
        $('#J_cartListBody .J_cartGoods').html("")


        new Promise(function(resolve,reject){
            $.ajax({
                type:'get',
                url:'../data/goodsCarList.json',
                success:function(result){
                    resolve(result.data);
                },
                error:function(msg){
                    reject(msg);
                }
            })
        }).then(function(arr1){
            return new Promise(function(resolve,reject){
                $.ajax({
                    type:'get',
                    url:'../data/goodsList2.json',
                    success:function(arr2){
                        var newArr = arr1.concat(arr2);
                        resolve(newArr);
                    },
                    error:function(msg){
                        reject(msg);
                    }
                })
            })
        }).then(function(arr){
            /* 将购物车中的所有数据拿到 */
            var cookieStr = $.cookie('goods');
            if(cookieStr){
                var cookieArr = JSON.parse(cookieStr);
                var newArr = [];

                for(var i = 0; i < cookieArr.length; i++){
                    for(var j = 0; j < arr.length; j++){
                        if(cookieArr[i].id == arr[j].product_id || cookieArr[i].id == arr[j].goodsid){
                            arr[j].num = cookieArr[i].num;
                            arr[j].id = arr[j].product_id ? arr[j].product_id : arr[j].goodsid;
                            newArr.push(arr[j]);
                        }
                    }
                }
                /* 将商品添加到页面上 */
                for(var i = 0; i < newArr.length; i++){
                    var node = $(`<div class="item-row clearfix" id = "${newArr[i].id}"> 
                    <div class="col col-check">  
                        <i class="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox" data-itemid="2192300031_0_buy" data-status="1">√</i>  
                    </div> 
                    <div class="col col-img">  
                        <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                            <img alt="" src="${newArr[i].image}" width="80" height="80"> 
                        </a>  
                    </div> 
                    <div class="col col-name">  
                        <div class="tags">   
                        </div>     
                        <div class="tags">  
                        </div>   
                        <h3 class="name">  
                            <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                ${newArr[i].name} 
                            </a>  
                        </h3>        
                    </div> 
                    <div class="col col-price"> 
                        ${newArr[i].price}元 
                        <p class="pre-info">  </p> 
                    </div> 
                    <div class="col col-num">  
                        <div class="change-goods-num clearfix J_changeGoodsNum"> 
                            <a href="javascript:void(0)" class="J_minus">
                                <i class="iconfont"></i>
                            </a> 
                            <input tyep="text" name="2192300031_0_buy" value="${newArr[i].num}" data-num="1" data-buylimit="20" autocomplete="off" class="goods-num J_goodsNum" "=""> 
                            <a href="javascript:void(0)" class="J_plus"><i class="iconfont"></i></a>   
                        </div>  
                    </div> 
                    <div class="col col-total"> 
                        ${(newArr[i].price * newArr[i].num).toFixed(1)}元 
                        <p class="pre-info">  </p> 
                    </div> 
                    <div class="col col-action"> 
                        <a id="2192300031_0_buy" data-msg="确定删除吗？" href="javascript:void(0);" title="删除" class="del J_delGoods"><i class="iconfont"></i></a> 
                    </div> 
                </div>`);
                    node.appendTo('#J_cartListBody .J_cartGoods');
                }
                isCheckAll();
            }
        })
    }
    /* 添加移入移出效果 */
    function cartHover(){
        $('#J_miRecommendBox .row').on('mouseenter','.J_xm-recommend-list',function(){
            $(this).find('.xm-recommend-tips a').css('display','block');
        })
        $('#J_miRecommendBox .row').on('mouseleave','.J_xm-recommend-list',function(){
            $(this).find('.xm-recommend-tips a').css('display','none');
        })
        /* 添加加入购物车操作 */
        $('#J_miRecommendBox .row').on('click','.xm-recommend-tips a',function(){
            var id = this.id;
            /* 判断是否是第一次添加 */
            var first = $.cookie('goods') == null ? true : false;
            /* 如果是第一次添加  直接创建cookie*/
            if(first){
                var cookieArr = [{id: id, num: 1}];
                $.cookie("goods",JSON.stringify(cookieArr),{
                    expires:7
                })
            }else{
                /* 判断之前是否添加过 */
                var same = false;/* 假设没添加过 */
                var cookieStr = $.cookie('goods');
                var cookieArr = JSON.parse(cookieStr);
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        cookieArr[i].num++;
                        same = true;
                        break;
                    }
                }
                if(!same){
                    var obj = {id: id, num: 1};
                    cookieArr.push(obj);
                }

                /* 最后都要存回cookie中 */
                $.cookie("goods",JSON.stringify(cookieArr),{
                    expires:7
                })
            }
            isCheckAll();
            loadCarData();
            return false;
        })
    }
    /* 给全选框和单选框添加点击事件 */
    function checkFunc(){
        /* 全选 */
        $('#J_cartBox .list-head .col-check').find('i').click(function(){
            var allChecks = $('#J_cartListBody').find('.item-row .col-check').find('i');
            if($(this).hasClass('icon-checkbox-selected')){
                $(this).add(allChecks).removeClass('icon-checkbox-selected');
            }else{
                $(this).add(allChecks).addClass('icon-checkbox-selected');
            }
            isCheckAll();
        })
        /* 单选 */
        $('#J_cartBox .J_cartGoods').on('click','.item-row .col-check i',function(){
            if($(this).hasClass('icon-checkbox-selected')){
                $(this).removeClass('icon-checkbox-selected');
            }else{
                $(this).addClass('icon-checkbox-selected');
            }
            isCheckAll();
        })
    }
    /* 判断有多少个被选中 */
    function isCheckAll(){
        var allChecks = $('#J_cartListBody').find('.item-row');
        var isAll = true;/* 假设是否都选中 */
        var total = 0;/* 计算总数 */
        var count = 0;/* 被选中数量 */
        var totalCount = 0;/* 记录总数 */

        allChecks.each(function(index,item){
            
            if(!$(item).find('.col-check i').hasClass('icon-checkbox-selected')){
                isAll = false;
            }else{
                total += parseFloat($(item).find('.col-price').html().trim()) * parseFloat($(item).find('.col-num input').val());
                count += parseInt($(item).find('.col-num input').val());
            }
            totalCount += parseInt($(item).find('.col-num input').val());
        })
        $('#J_selTotalNum').html(count);
        $('#J_cartTotalNum').html(totalCount);
        $('#J_cartTotalPrice').html(total);

        if(isAll){
            $('#J_cartBox .list-head .col-check').find('i').addClass('icon-checkbox-selected');
        }else{
            $('#J_cartBox .list-head .col-check').find('i').removeClass('icon-checkbox-selected');
        }
    }
    /* 给商品添加删除和数量增减 */
    function changeCars(){
        $('#J_cartListBody .J_cartGoods').on('click','.col-action .J_delGoods',function(){
            var id = $(this).closest('.item-row').remove().attr('id');

            var cookieStr = $.cookie('goods');
            var cookieArr = JSON.parse(cookieStr);
            for(var i = 0; i < cookieArr.length; i++){
                if(id == cookieArr[i].id){
                    cookieArr.splice(i,1);
                    break;
                }
            }
            cookieArr.length == 0 ? $.cookie("goods",null) : $.cookie("goods",JSON.stringify(cookieArr),{expires:7});
            isCheckAll();
            return false;
        })
        /* 添加加和减事件 */
        $('#J_cartListBody .J_cartGoods').on('click','.J_minus,.J_plus',function(){
            var id = $(this).closest('.item-row').attr('id');
            var cookieStr = $.cookie('goods');
            var cookieArr = JSON.parse(cookieStr);
            for(var i = 0; i < cookieArr.length; i++){
                if(cookieArr[i].id == id){
                    if(this.className == 'J_minus'){
                        cookieArr[i].num == 1 ? alert('数量已经为1，不能减少！') : cookieArr[i].num--;
                    }else{
                        cookieArr[i].num++;
                    }
                    break;
                }
            }
            $(this).siblings('input').val(cookieArr[i].num);
            /* 更新价格 */
            var price = parseFloat($(this).closest('.col-num').siblings('.col-price').html().trim());
            $(this).closest('.col-num').siblings('.col-total').html((price * cookieArr[i].num).toFixed(1) + '元');
            /* 更新cookie */
            $.cookie("goods",JSON.stringify(cookieArr),{expires:7});
            isCheckAll();
            return false;
        })
    }
    return {
        download:download,
        cartHover:cartHover,
        loadCarData:loadCarData,
        checkFunc:checkFunc,
        changeCars:changeCars
    }
})