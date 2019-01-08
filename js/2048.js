var game = {  //Module:专门操作一类数据的方法和属性的集合
    data: null,//保存游戏的数据：二维数组
    RN: 4, CN: 4,//总行数和列数
    score: 0, //本次得分
    sts: 1,//游戏开始的标记
    RUNNING: 1,//运行中
    GAMEOVER: 0,//结束
    final: null,//历史最高分
    startX: null,//手机端位置记录--x
    startY: null,//手机端位置记录--y
    endX: null,//手机端位置记录--x
    endY: null,//手机端位置记录--y
    maxHeight: null,//屏幕高度
    itHeight: parseInt($('.game').css('height')),//元素高度
    start: function () {//启动游戏
        this.sizeChange();
        this.historyScore();
        this.sts = this.RUNNING;
        this.data = [];
        for (var x = 0; x < this.RN; x++)  //创建全为0的2维数组
        {
            this.data.push([]);
            for (var y = 0; y < this.CN; y++) {
                this.data[x][y] = 0;
            }
        }
        this.randomNum(); //随机生成1个数
        this.randomNum(); //随机生成1个数
        this.randomNum(); //随机生成1个数
        this.updateView(); //刷新页面
        //重新开始
        $('.end-pop a').on('click', function (event) {
            event.preventDefault();
            game.start();
            $('.end-pop').removeClass('show');
            $('.score').text(0);
        });
        if (this.sts === 1) {
            //网站中
            document.onkeydown = function (e) { //e=event
                //alert(e.keyCode);  //获取键盘操作的对应电位数字
                switch (e.keyCode) {
                    case 37://电脑端--向左
                        this.moveLeft();
                        break;
                    case 38://电脑端--向上
                        this.moveTop();
                        break;
                    case 39://电脑端--向右
                        this.moveRight();
                        break;
                    case 40://电脑端--向下
                        this.moveBottom();
                        break;
                }
            }.bind(this);
            //手机中
            $('body').on('touchstart', function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.startX = e.originalEvent.changedTouches[0].pageX;
                this.startY = e.originalEvent.changedTouches[0].pageY;
            }.bind(this));
            $('body').on('touchmove', function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.endX = e.originalEvent.changedTouches[0].pageX;
                this.endY = e.originalEvent.changedTouches[0].pageY;
            }.bind(this));
            $('body').on('touchend', function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.checkDirection();
            }.bind(this));
        }
    },
    sizeChange: function () {//调整屏幕尺寸
        if (window.innerHeight) {
            this.maxHeight = window.innerHeight;
        }
        else if ((document.body) && (document.body.clientHeight)) {
            this.maxHeight = document.body.clientHeight;
        }
        $('body').css('height', this.maxHeight);
        $('.game').css('top', this.maxHeight / 2 - this.itHeight / 2);
    },
    historyScore: function () {//历史最高分
        if (localStorage.getItem('my_2048_score')) {
            this.final = parseInt(localStorage.getItem('my_2048_score'));
        }
        else {
            this.final = 0;
        }
        $('.maxScore').text(this.final);
    },
    checkDirection: function () {//移动端判断移动方向

        // $('#lalala').html(this.startX + '----' + this.startY + '----' + this.endX + '----' + this.endY);
        var gapWidth = this.endX - this.startX,//x差值
            gapHeight = this.endY - this.startY,//y差值
            direction;//方向
        if (Math.abs(gapWidth) < 10 && Math.abs(gapHeight) < 10) {//移动小于10px忽略动作
            direction = 0;
        }
        else {
            if (gapWidth > 0) {//坐标轴右边
                if (gapHeight > 0) {//坐标轴右下
                    if (gapWidth > gapHeight) {
                        direction = 4;
                    }
                    else if (gapWidth < gapHeight) {
                        direction = 2;
                    }
                    else {
                        direction = Math.random() < 0.5 ? 4 : 2;
                    }
                }
                else {//坐标轴右上
                    gapHeight = Math.abs(gapHeight);
                    if (gapWidth > gapHeight) {
                        direction = 4;
                    }
                    else if (gapWidth < gapHeight) {
                        direction = 1;
                    }
                    else {
                        direction = Math.random() < 0.5 ? 4 : 1;
                    }
                }
            }
            else {//坐标轴左边
                gapWidth = Math.abs(gapWidth);
                if (gapHeight > 0) {//坐标轴左下
                    if (gapWidth > gapHeight) {
                        direction = 3;
                    }
                    else if (gapWidth < gapHeight) {
                        direction = 2;
                    }
                    else {
                        direction = Math.random() < 0.5 ? 3 : 2;
                    }
                }
                else {//坐标轴左上
                    gapHeight = Math.abs(gapHeight);
                    if (gapWidth > gapHeight) {
                        direction = 3;
                    }
                    else if (gapWidth < gapHeight) {
                        direction = 1;
                    }
                    else {
                        direction = Math.random() < 0.5 ? 3 : 1;
                    }
                }
            }
        }
        switch (direction) {
            case 0://移动还--不动
                break;
            case 1://移动端--向上
                this.moveTop();
                break;
            case 2://移动端--向下
                this.moveBottom();
                break;
            case 3://移动端--向左
                this.moveLeft();
                break;
            case 4://移动端--向右
                this.moveRight();
                break;
        }
    },
    randomNum: function () {//空位置随机生成1个--2或者4
        while (true) {
            var x = Math.floor(Math.random() * this.RN), y = Math.floor(Math.random() * this.CN);
            if (this.data[x][y] === 0) {
                this.data[x][y] = Math.random() < 0.3 ? 4 : 2;
                break;
            }
        }
    },
    updateView: function () {//刷新页面属性
        for (var x = 0; x < this.RN; x++) {
            for (var y = 0; y < this.CN; y++) {
                var div = document.getElementById('c' + x + y);  //获取id为'c'+x+y的对象
                if (this.data[x][y] !== 0) {  //判断二维数组中的值是否为0
                    div.innerHTML = this.data[x][y];  //修改其中的内容
                    div.className = "cell n" + this.data[x][y]; //修改class的内容
                }
                else {
                    div.innerHTML = "";
                    div.className = "cell";
                }
            }
        }
    },
    moveLeft: function () {//左移
        var before = String(this.data);//记录左移前的数组，并转化为字符串
        for (var x = 0; x < this.RN; x++) {
            this.moveLeftInRow(x);
        }
        var after = String(this.data);//记录左移后的数组，并转化为字符串
        if (before !== after) {//若产生移动 则进行下面操作
            this.randomNum();
            this.updateView();
            $('.score').text(this.score);
            if (this.score > this.final) {
                this.final = this.score;
                $('.maxScore').text(this.final);
            }
            var een = this.end();//判断游戏是否结束
            if (een === -1) {
                this.endTime();
            }
        }
    },
    moveLeftInRow: function (x) {//左移第x行
        for (var y = 0; y < (this.CN - 1); y++) {//遍历全部列 到倒数第二个位置
            var nextY = this.leftGetNext(x, y);//获取y列的第一个非0的位置
            if (nextY !== -1) {  //若有非0数字
                if (this.data[x][y] === this.data[x][nextY]) { //若两个数字相同，相加并且将原位置置为0
                    this.data[x][y] *= 2;
                    this.data[x][nextY] = 0;
                    this.score += this.data[x][y];
                }
                else {
                    if (this.data[x][y] !== 0) {
                        if ((y + 1) !== nextY) { //若该位置不为0且该位置后的1位与遍历来的next位置不是一个位置，将其后面的数字换位下一个数字，并将原位置置为0
                            this.data[x][y + 1] = this.data[x][nextY];
                            this.data[x][nextY] = 0;
                        }
                    }
                    else {
                        this.data[x][y] = this.data[x][nextY]; //若该位置是0 ，将后面非0数的挪到前边，并且从该位置出发再遍历一次
                        this.data[x][nextY] = 0;
                        y--;
                    }
                }
            }
            else {
                break;
            }
        }
    },
    leftGetNext: function (x, y) { //左移获取y列后的第一个非0的位置
        for (var nextY = (y + 1); nextY < this.CN; nextY++) {
            if (this.data[x][nextY] !== 0) {
                return nextY;
            }
        }
        return -1;
    },
    moveRight: function () {  //右移
        var before = String(this.data);  //记录右移前的数组，并转化为字符串
        for (var x = 0; x < this.RN; x++) {
            this.moveRightInRow(x);
        }
        var after = String(this.data);//记录右移后的数组，并转化为字符串
        if (before !== after) {//若产生移动 则进行下面操作
            this.randomNum();
            this.updateView();
            $('.score').text(this.score);
            if (this.score > this.final) {
                this.final = this.score;
                $('.maxScore').text(this.final);
            }
            var een = this.end();//判断游戏是否结束
            if (een === -1) {
                this.endTime();
            }
        }
    },
    moveRightInRow: function (x) {//右移第x行
        for (var y = (this.CN - 1); y > 0; y--) {  //遍历全部列 到正数第二个位置
            var nextY = this.rightGetNext(x, y);//获取y列前的第一个非0的位置
            if (nextY !== -1) {//若有非0数字
                if (this.data[x][y] === this.data[x][nextY]) { //若两个数字相同，相加并且将原位置置为0
                    this.data[x][y] *= 2;
                    this.data[x][nextY] = 0;
                    this.score += this.data[x][y];
                }
                else {
                    if (this.data[x][y] !== 0) {  //若该位置不为0
                        if ((y - 1) !== nextY) { //且该位置前的1位与遍历来的next位置不是一个位置，将其后面的数字换位下一个数字，并将原位置置为0
                            this.data[x][y - 1] = this.data[x][nextY];
                            this.data[x][nextY] = 0;
                        }
                    }
                    else {
                        this.data[x][y] = this.data[x][nextY]; //若该位置是0 ，将后面非0数的挪到前边，并且从该位置出发再遍历一次
                        this.data[x][nextY] = 0;
                        y++;
                    }
                }
            }
            else {
                break;
            }
        }
    },
    rightGetNext: function (x, y) { //右移获取y列前的第一个非0的位置
        for (var nextY = (y - 1); nextY >= 0; nextY--) {
            if (this.data[x][nextY] !== 0) {
                return nextY;
            }
        }
        return -1;
    },
    moveTop: function () {//上移
        var before = String(this.data);  //记录上移前的数组，并转化为字符串
        for (var y = 0; y < this.CN; y++) {
            this.moveTopInRow(y);
        }
        var after = String(this.data);   //记录上移后的数组，并转化为字符串
        if (before !== after) {   //若产生移动 则进行下面操作
            this.randomNum();
            this.updateView();
            $('.score').text(this.score);
            if (this.score > this.final) {
                this.final = this.score;
                $('.maxScore').text(this.final);
            }
            var een = this.end();//判断游戏是否结束
            if (een === -1) {
                this.endTime();
            }
        }
    },
    moveTopInRow: function (y) {//上移第y列
        for (var x = 0; x < (this.RN - 1); x++) {  //遍历全部行 到正数第二个位置
            var nextX = this.topGetNext(x, y);//获取x行前的第一个非0的位置
            if (nextX !== -1) {  //若有非0数字
                if (this.data[x][y] === this.data[nextX][y]) { //若两个数字相同，相加并且将原位置置为0
                    this.data[x][y] *= 2;
                    this.data[nextX][y] = 0;
                    this.score += this.data[x][y];
                }
                else {
                    if (this.data[x][y] !== 0) {  //若该位置不为0
                        if ((x + 1) !== nextX) { //且该位置前的1位与遍历来的next位置不是一个位置，将其后面的数字换位下一个数字，并将原位置置为0
                            this.data[x + 1][y] = this.data[nextX][y];
                            this.data[nextX][y] = 0;
                        }
                    }
                    else {
                        this.data[x][y] = this.data[nextX][y]; //若该位置是0 ，将后面非0数的挪到前边，并且从该位置出发再遍历一次
                        this.data[nextX][y] = 0;
                        x--;
                    }
                }
            }
            else {
                break;
            }
        }
    },
    topGetNext: function (x, y) { //上移获取x行前的第一个非0的位置
        for (var nextX = (x + 1); nextX < this.RN; nextX++) {
            if (this.data[nextX][y] !== 0) {
                return nextX;
            }
        }
        return -1;
    },
    moveBottom: function () {//下移
        var before = String(this.data);  //记录下移前的数组，并转化为字符串
        for (var y = 0; y < this.CN; y++) {
            this.moveBottomInRow(y);
        }
        var after = String(this.data);   //记录下移后的数组，并转化为字符串
        if (before !== after) { //若产生移动 则进行下面操作
            this.randomNum();
            this.updateView();
            $('.score').text(this.score);
            if (this.score > this.final) {
                this.final = this.score;
                $('.maxScore').text(this.final);
            }
            var een = this.end();//判断游戏是否结束
            if (een === -1) {
                this.endTime();
            }
        }
    },
    moveBottomInRow: function (y) {  //下移第y列
        for (var x = (this.RN - 1); x > 0; x--) {  //遍历全部行 到正数第二个位置
            var nextX = this.bottomGetNext(x, y);//获取x行前的第一个非0的位置
            if (nextX !== -1) {  //若有非0数字
                if (this.data[x][y] === this.data[nextX][y]) { //若两个数字相同，相加并且将原位置置为0
                    this.data[x][y] *= 2;
                    this.data[nextX][y] = 0;
                    this.score += this.data[x][y];
                }
                else {
                    if (this.data[x][y] !== 0) {  //若该位置不为0
                        if ((x - 1) !== nextX) { //且该位置前的1位与遍历来的next位置不是一个位置，将其后面的数字换位下一个数字，并将原位置置为0
                            this.data[x - 1][y] = this.data[nextX][y];
                            this.data[nextX][y] = 0;
                        }
                    }
                    else {
                        this.data[x][y] = this.data[nextX][y]; //若该位置是0 ，将后面非0数的挪到前边，并且从该位置出发再遍历一次
                        this.data[nextX][y] = 0;
                        x++;
                    }
                }
            }
            else {
                break;
            }
        }
    },
    bottomGetNext: function (x, y) { //下移获取x行前的第一个非0的位置
        for (var nextX = (x - 1); nextX >= 0; nextX--) {
            if (this.data[nextX][y] !== 0) {
                return nextX;
            }
        }
        return -1;
    },
    end: function () { //游戏结束验证  -1  表示结束
        for (var x = 0; x < this.RN; x++) {  //行
            for (var y = 0; y < this.CN; y++) {  //列
                if (this.data[x][y] !== 0) {    //不能有空位    下面比较时 可以排除右下角
                    if (x < 3 && y < 3) {    //1-3 行和 列 与右、下比
                        if (this.data[x][y] !== this.data[x + 1][y] && this.data[x][y] !== this.data[x][y + 1]) {
                            continue;
                        }
                        else {
                            return 0;
                        }
                    }
                    else if (x === 3 && y < 3) {   //第4行和右边比
                        if (this.data[x][y] !== this.data[x][y + 1]) {
                            continue;
                        }
                        else {
                            return 0;
                        }
                    }
                    else if (x < 3 && y === 3) {   //第4列和下边比
                        if (this.data[x][y] !== this.data[x + 1][y]) {
                            continue
                        }
                        else {
                            return 0;
                        }
                    }
                }
                else {
                    return 0;
                }
            }
        }
        return -1;
    },
    endTime: function () {
        $('.score-top').text(this.score);
        this.score = 0;
        this.sts = this.GAMEOVER;
        localStorage.setItem('my_2048_score', this.final);
        $('.end-pop').addClass('show');
    }
};
game.start(); //页面加载时启动游戏