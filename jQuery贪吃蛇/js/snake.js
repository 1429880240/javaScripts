var rowNum = 15; //小方块的行
var colNum = 15; //小方块的列
var rowArr = []; //行数组
var eggRow, eggCol; //蛋的位置
var timer; //定义蛇移动计时器
var timer2; //定义时间计时器
var snakeArr = [];
var sRow = 0, //蛇头的位置
	sCol = 2;
var fen = 0; //分数
var miao = 0; //时间
var speed = 230; //速度
var direction = 'right'; //方向
var change = 0; //键盘的延时,防止频繁超速按键盘
var max; //最高分

$('#btn1').click(function() {
	//鼠标*****开始游戏******
	if($('#btn1').attr('src') == 'img/start.png') {
		start();
		$('#btn1').attr('src', 'img/pause.png');
		return;
	}
	//鼠标*****结束游戏*****
	else {
		clearInterval(timer);
		clearInterval(timer2);
		$('#btn1').attr('src', 'img/start.png');
	}
});

//重新开始游戏
$('#over').click(function() {
	$('#over').css('display', 'none');
	//开关图片切换
	$('#btn1').attr('src', 'img/start.png');
	//创建蛇
	createSnake(3);
	snakeArr[snakeArr.length - 1].attr('class', 'col snake1');
	//创建蛋
	createEgg();
	sRow = 0, //蛇头的位置
		sCol = 2;
	//方向初始化
	direction = 'right';
	//分数初始化
	fen = 0;
	//时间初始化
	miao = 0;
	//速度初始化
	speed = 230;
	change = 0;
	$('#shijian').html('<div class="glyphicon glyphicon-time"></div>0s');
	$('#score').text('得分:0分');

});

//创建地图行和列................
setMap(rowNum, colNum);

function setMap(rowNum, colNum) {
	//wrap宽度
	$('#wrap').css({
			'width': colNum * 35 + 2 + 286 + 'px',
		})
		//score,shijina宽度
	$('#score,#shijian').css({
		'width': (colNum * 35 + 2) / 2 + 'px',
	})

	// 设置map大小
	$('#map').css({
			'width': colNum * 35 + 2 + 'px',
			'height': rowNum * 35 + 2 + 66 + 'px',
		})
		//最佳分数
	max = localStorage.maxScore;
	if(max == undefined) {
		$('#btn2').text('最佳分数:0分');
	} else {
		$('#btn2').text('最佳分数:' + max + '分');
	}
	//地图的行
	for(var i = 0; i < rowNum; i++) {
		var newRow = $('<div></div>').attr('class', 'row'); //创建行div
		$('#map').append(newRow); //把行盒子放入地图中
		//地图的列
		var colArr = []; //列数组
		for(var j = 0; j < colNum; j++) {
			var newDiv = $('<div></div>').attr('class', 'col'); //创建列div
			newRow.append(newDiv); //把列盒子放入行盒子中
			colArr.push(newDiv); //把列盒子放入列数组中
		}
		rowArr.push(colArr);
	}
}
console.log(rowArr);
//创建蛇.................
function createSnake(length) {
	for(var i = 0; i < length; i++) {
		rowArr[0][i].attr('class', 'col snake');
		snakeArr.push(rowArr[0][i]);
	}
}
createSnake(3);
//蛇头样式
snakeArr[snakeArr.length - 1].attr('class', 'col snake1');

//创建蛋................
function createEgg() {
	eggRow = randomNum(0, rowNum - 1);
	eggCol = randomNum(0, colNum - 1);
	//如果蛋背景色变成蛇,重新生成蛋
	if(rowArr[eggRow][eggCol].attr('class') == 'col snake' || rowArr[eggRow][eggCol].attr('class') == 'col snake1' || rowArr[eggRow][eggCol].attr('class') == 'col snake2' || rowArr[eggRow][eggCol].attr('class') == 'col snake3' || rowArr[eggRow][eggCol].attr('class') == 'col snake4') {
		// 重新随机生成蛋
		createEgg();
	} else {
		rowArr[eggRow][eggCol].attr('class', 'col egg');
	}
}
createEgg();
// 随机数...............
function randomNum(x, y) {
	return Math.round(Math.random() * (y - x) + x);
}
//开始游戏*******************************************

document.onkeydown = function() {
	var e = window.event || event;
	//开关
	if(e.keyCode == 32) {
		change = 1;
	}
	if(change == 0) {
		return;
	}
	if(direction == 'right' && e.keyCode == 37) {
		return;
	}
	if(direction == 'left' && e.keyCode == 39) {
		return;
	}
	if(direction == 'up' && e.keyCode == 40) {
		return;
	}
	if(direction == 'down' && e.keyCode == 38) {
		return;
	}
	change = 0; //防止点击间隙时间小于计时器时间
	// 设定蛇的下一个移动方向
	switch(e.keyCode) {
		case 37:
			direction = 'left';
			break;
		case 38:
			direction = 'up';
			break;
		case 39:
			direction = 'right';
			break;
		case 40:
			direction = 'down';
			break;
		case 32:
			//键盘*****开始游戏******
			if($('#btn1').attr('src') == 'img/start.png') {
				start();
				$('#btn1').attr('src', 'img/pause.png');
				change = 1;
			}
			//键盘*****结束游戏*****
			else {
				clearInterval(timer);
				clearInterval(timer2);
				$('#btn1').attr('src', 'img/start.png');
				change = 0;
			}
			break;
		default:
	}
}

function start() {
	//计时器让蛇尾部消失,把尾部加到移动的头部
	timer = setInterval(function() {
		change = 1;
		switch(direction) {
			case 'left':
				sCol--;
				break;
			case 'right':
				sCol++;
				break;
			case 'up':
				sRow--;
				break;
			case 'down':
				sRow++;
				break;
			default:
		}
		//碰撞
		if(sRow < 0 || sCol < 0 || sRow >= rowNum || sCol >= colNum || rowArr[sRow][sCol].attr('class') == 'col snake') {
			$('#over').css('display', 'block');
			$('#over').html('<img src="img/over.png" style="width:300px" />游戏结束<br>得分:' + fen + '分<br>用时' + miao + 's<br><mark>重新开始游戏</mark>');
			clearInterval(timer);
			clearInterval(timer2);
			//清除蛇
			for(var i = 0; i < snakeArr.length; i++) {
				snakeArr[i].attr('class', 'col');
			}
			snakeArr = [];
			//清除蛋
			rowArr[eggRow][eggCol].attr('class', 'col');
			return;
		}
		//蛇移动
		if(eggRow == sRow && eggCol == sCol) {
			//遍历蛇数组为蛇的样式
			for(var i = 0; i < snakeArr.length; i++) {
				snakeArr[i].attr('class', 'col snake');
			}
			//蛇头为蛇头的样式🐍
			switch(direction) {
				case 'left':
					rowArr[sRow][sCol].attr('class', 'col snake3');
					break;
				case 'right':
					rowArr[sRow][sCol].attr('class', 'col snake1');
					break;
				case 'up':
					rowArr[sRow][sCol].attr('class', 'col snake4');
					break;
				case 'down':
					rowArr[sRow][sCol].attr('class', 'col snake2');
					break;
				default:
			}
			snakeArr.push(rowArr[sRow][sCol]);
			//重新生成蛋
			createEgg();

			fen++; //计分
			$('#score').text('得分:' + fen + '分');
			//最佳分数
			max = localStorage.maxScore;
			max = max > fen ? max : fen;
			localStorage.maxScore = max;
			$('#btn2').text('最佳分数:' + max + '分');
			//加速
			if(fen >= 6) {
				speed = 150;
				console.log(speed);
				clearInterval(timer);
				clearInterval(timer2);
				start();
			}
			if(fen >= 17) {
				speed = 100;
				console.log(speed);
				clearInterval(timer);
				clearInterval(timer2);
				start();
			}
			//生成新的egg
		} else {
			//删除蛇尾巴
			snakeArr[0].attr('class', 'col');
			snakeArr.shift();
			//遍历蛇数组为蛇的样式🐍
			for(var i = 0; i < snakeArr.length; i++) {
				snakeArr[i].attr('class', 'col snake');
			}
			//蛇头为蛇头的样式
			switch(direction) {
				case 'left':
					rowArr[sRow][sCol].attr('class', 'col snake3');
					break;
				case 'right':
					rowArr[sRow][sCol].attr('class', 'col snake1');
					break;
				case 'up':
					rowArr[sRow][sCol].attr('class', 'col snake4');
					break;
				case 'down':
					rowArr[sRow][sCol].attr('class', 'col snake2');
					break;
				default:
			}
			snakeArr.push(rowArr[sRow][sCol]);
		}

	}, speed);
	//时间计时器
	timer2 = setInterval(function() {
		miao++;
		$('#shijian').html('<div class="glyphicon glyphicon-time"></div>' + miao + 's');
	}, 1000);
}