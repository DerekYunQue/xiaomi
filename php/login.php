<?php
    header('content-type:text/html;charset="utf-8"');

    /* var_dump($_POST); */
    /* 定义一个统一的返回格式 */
    $responseData = array("code" => 0, "message" => "");
    $username = $_POST['username'];
    $password = $_POST['password'];

    /* 对后台接收的数据进行简单的判断 */
    if(!$username){
        $responseData["code"] = 1;
        $responseData["message"] = "用户名不能为空";
        /* 将字符按照统一的返回格式返回 */
        echo json_encode($responseData);
        exit;
    }
    if(!$password){
        $responseData["code"] = 2;
        $responseData["message"] = "密码不能为空";
        /* 将字符按照统一的返回格式返回 */
        echo json_encode($responseData);
        exit;
    }

    /* 链接数据库，判断之前是否注册过 */
    $link = mysql_connect("localhost", "root", "123456");
    /* 判断数据库是否连接成功 */
    if(!$link){
		$responseData["code"] = 3;
		$responseData["message"] = "数据库链接失败";
		echo json_encode($responseData);
		exit; //终止后续所有的代码
	}
    /* 设置字符集 */
    mysql_set_charset("utf8");
    /* 选择数据库 */
    mysql_select_db("xiaomi");

    /* md5加密 */
    $str = md5(md5(md5($password)."xxx")."yyy");

    $sql1 = "SELECT * FROM users WHERE username='{$username}' AND password='{$str}'";
    /* 发送sql语句 */
    $res = mysql_query($sql1);
    /* 取出一行数据 */
    $row = mysql_fetch_assoc($res);
	if(!$row){
		//用户名重名
		$responseData["code"] = 4;
		$responseData["message"] = "用户名或密码错误！";
		echo json_encode($responseData);
		exit;
	}else{
        $responseData["message"] = "登录成功";
		echo json_encode($responseData);
    }
    
    /* 关闭数据库 */
    mysql_close($link);

?>