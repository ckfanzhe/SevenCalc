//获取元素
var output1 = document.getElementById("txt1");
var output2 = document.getElementById("txt2");
var oList = document.getElementsByClassName("list")[0];

//使用对象来保存 所需内容
var obj = {};
// 设置变量用于保存上一次计算的结果
obj.pre = "";

//用于标注是否是继续运算状态
obj.contin = false;  

//计算用表达式
obj.expression = ""; 

//点输入锁
obj.dot = true;
  
// 函数执行
calculator();

//曾 实现翻页功能
$(function () {
	$('#btn1').click(function () {
		var dis=$('#div1').css('display')
		if (dis=='none') {
			$('#h1').html('科学计算机')
			$('#div2').toggle(50,'linear')
			$('#div1').toggle(50,'linear')
		}else{
			$('#h1').html('普通计算机')
			$('#div2').toggle(50,'linear')
			$('#div1').toggle(50,'linear')
		}
	})
})


//计算逻辑
function calculator(){
	oList.addEventListener("click", function (e) {
	//事件源对象，获取每次点击的内容
	var even = e || event;
	var target = e.target || e.srcElement;
	//保存每次点击的内容
	var data = target.innerHTML;
	
	//获取声音按钮
	var isActive = document.getElementById("switch").classList.contains("mui-active");
	console.log(isActive);
	
	//播放音乐
	play(isActive);
	
	//清空操作
	if (obj.cls) 
	{
		output1.value = "";
		output2.value = "";
		obj.cls = false;
		obj.dot = true;
		backfontsize();  //恢复字体
	}
	
	//清零
	if (data == "c") 
	{
		output1.value = "";
		output2.value = "0";
		backfontsize();
		obj = {};
		obj.dot = true;
		return;
	}
	
	//输入小数情况，其他字符情况
	if (output2.value == "0" && data != ".") 
	{
		output2.value = "";
	}
	
	if(data == "del"){
		obj.contin = false;
		output2.value = output2.value.replace("del","");
		console.log("output2 length:"+output2.value.length);
		console.log("output2 value:"+ output2.value);
		//如果最后删除的内容为点，那么就设置点解锁为true
		if(output2.value.substring(output2.value.length-1, output2.value.length)=="."){
			obj.dot = true;
		}
		if(output2.value.length>1){
			output2.value = output2.value.substring(0, output2.value.length-1) ;
			return;
		}else{
			output2.value = "0";
			return;
		}
	}
	
	//如果长度太长，则缩放字体 14 17   20 24
	if(output2.value.length>=20){
		if(output2.value.length>=27&&data!="="){  //超过17限定输入
			mui.toast('超过限定字符啦',{ duration:'long', type:'div' }) 
			return;
		}
		smallfontsize();
	}
	
	if(data == "+" ||data=="-" || data == "*" || data == "/"){ //防止重复输入运算符
		var bottomstr = output2.value.substring(output2.value.length-1,output2.value.length);
		if(bottomstr=="+" ||bottomstr=="-"||bottomstr=="*"||bottomstr=="/"){
			return;
		}
	}

	//如果数字后面直接跟括号，自动补* 防止计算错误
	if(data=="("){  
		obj.dot = true; //如果输入了这类符号，则判定可以输入点
		console.log("sub is:"+output2.value.substring(output2.value.length-1,output2.value.length));
		if(!isNaN(output2.value.substring(output2.value.length-1,output2.value.length))&&output2.value!=""){
			output2.value += "*";
		}
	}
	
	//后半边括号数字自动补齐 只能是数字才补齐
	if(!isNaN(data)){  
		if(output2.value.substring(output2.value.length-1,output2.value.length)==")"){
			output2.value += "*";
		}
	}
	
	//特殊符号 补齐 * 补头
	if(data=="e"||data=="π"){
		if(!isNaN(output2.value.substring(output2.value.length-1,output2.value.length))&&output2.value!=""){
			output2.value += "*";
		}
	}
	
	//特殊符号 补齐 * 补尾巴
	if(!isNaN(data)){  
		if(output2.value.substring(output2.value.length-1,output2.value.length)=="e"){
			output2.value += "*";
		}
		if(output2.value.substring(output2.value.length-1,output2.value.length)=="π"){
			output2.value += "*";
		}
	}
	
	//特殊符号输入逻辑
	if(data == "sin" || data == "cos" || data == "tan" || data == "√"||data=="ln"||data=="lg"){  
		obj.dot = true; //如果输入了这类符号，则判定可以输入点
		if(!isNaN(output2.value.substring(output2.value.length-1,output2.value.length))&&output2.value!=""){
			output2.value += "*";
		}
		output2.value += data + "(";
	}else{
		// 输入特殊符号 解锁点
		if(data == "." && obj.dot){  //判断点输入逻辑
			console.log("dot flag is :"+ obj.dot);
			obj.dot = false;
			output2.value += data;
		}else if(data!="."){
			output2.value += data;
		}
	}
	//开始执行运算逻辑
	calc(data);
	}, false)
}

function calc(data){
	console.log("getdata in :"+ data);
	// 普通运算
	if(data == "="){
		obj.dot = true; //如果输入了这类符号，则判定可以输入点
		var strtop = output2.value.substring(0,1);
		// if(isNaN(strtop)&&strtop!=""&&strtop!="("&&strtop!="-"&&strtop!="s"&&strtop!="t"&&strtop!="c"&&strtop!="l"){
		// 	output2.value = "0"+ output2.value;  //防止 零的初始化运算
		// }
		if(strtop=="+"||strtop=="*"||strtop=="/"){
			output2.value = "0"+ output2.value;  //防止 零的初始化运算
		}
		output1.value = output2.value;
		output2.value = output2.value.replace("=", "");
		if(output2.value==""){  //防止未初始化点击等于
			output1.value = "0="
			output2.value = "0";
			return;
		}
		try{
			obj.expression = output2.value;
			obj.expression = obj.expression.replace(/sin/g,"Math.sin");
			obj.expression = obj.expression.replace(/cos/g,"Math.cos");
			obj.expression = obj.expression.replace(/tan/g,"Math.tan");
			obj.expression = obj.expression.replace(/lg/g,"Math.log10");
			obj.expression = obj.expression.replace(/ln/g,"Math.log");
			obj.expression = obj.expression.replace(/√/g,"Math.sqrt");
			obj.expression = obj.expression.replace(/e/g,"Math.E");
			obj.expression = obj.expression.replace(/π/g,"Math.PI");
			console.log(obj.expression);
			output2.value = parseFloat(eval(obj.expression).toFixed(8));
			obj.pre = output2.value;
			if(output2.value.length>=16){
				mui.toast('运算溢出了哦，结果可能不对！',{ duration:'long', type:'div' }) 
			}
			console.log("pre is :" + obj.pre);
			obj.contin = true;
			obj.cls =true;
		}catch(exception){
			console.log(exception);
			output1.value = "syntax error!";
		}
	}
	//连续运算
	if(data == "+" || data == "-" || data == "*" || data == "/"){
		obj.dot = true;  //如果输入了这类符号，则判定可以输入点
		console.log(obj.pre + output2.value);
		var strtop1 = output2.value.substring(0,1);
		if(obj.contin&&isNaN(strtop1)&&strtop1!="e"&&strtop1!="π"&&strtop1!="√"&&strtop1!="t"&&strtop1!="c"&&strtop1!="s"&&strtop1!="l"&&strtop1!="."){
			output2.value = obj.pre + output2.value;
			obj.expression = obj.pre + obj.expression;  //加上表达式的值
			obj.contin = false;
		}
	}
	return;
	
}
// 超出字符字体变小
function smallfontsize(){
	output2.style.fontSize = "25px";
	output1.style.fontSize = "25px";
}
// 恢复字体
function backfontsize(){
	output2.style.fontSize = "35px";
	output1.style.fontSize = "35px";
}

function play(isActive){
	// alert("开始播放");
	if(isActive){
		var music = document.getElementById("music");
		music.play();  //播放音乐
	}


}
	