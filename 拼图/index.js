window.onload = function() {
    var start = document.querySelector('.startGame')
    var img = document.querySelector('img')
    var game = document.querySelector('.game')
    start.addEventListener('click', function() {
        start.style.display = 'none';
        img.style.display = 'none';
        game.style.display = 'block'
        let p1 = new Ping();
        p1.init("ul", 3)
    })

}

function Ping() {
    //初始化变量
    this.oUl = null;
    this.allLi = null;
    this.length = 0;
    this.lastLi = null;
    this.num = 0;
    this.zIndex = 2;
    this.arr = [];
}


//通过Index找到Li
Ping.prototype.Li = function(index) {
    for (let i = 0; i < this.length; i++) {
        if (this.allLi[i].index == index) {
            return this.allLi[i];
        }
    }
}




Ping.prototype.init = function(id, num) {
    this.num = num;
    this.oUl = document.querySelector(id);
    this.oUl.innerHTML = this.sheng(num);
    //获取最后一个元素 添加类名
    this.allLi = document.querySelectorAll('li');
    this.length = this.allLi.length;
    this.lastLi = this.allLi[this.length - 1];
    this.lastLi.className = 'active';
    this.ding();
    this.click();
    this.jian();
}


//判断是否可以移动
Ping.prototype.pan = function(li) {
    let index = li.index;
    let num = this.lastLi.index;
    if (num % this.num == 0) { //左
        //上                                下                           右  
        if (index + this.num == num || index - this.num == num || index - 1 == num) {
            return true
        }
    } else if (num % this.num == this.num - 1) { //右
        //上                                 下                        左
        if (num - this.num == index || index - this.num == num || index + 1 == num) {
            return true
        }

    } else { //中
        if (num - this.num == index || index - this.num == num || index + 1 == num || index - 1 == num) {
            return true
        }
    }
    return false
}


//移动
Ping.prototype.move = function(li) {
    if (this.pan(li)) {
        li.style.left = this.arr[this.lastLi.index][0] + "px";
        li.style.top = this.arr[this.lastLi.index][1] + "px";
        this.lastLi.style.left = this.arr[li.index][0] + "px";
        this.lastLi.style.top = this.arr[li.index][1] + "px";
        // console.log(li.index);
        [this.lastLi.index, li.index] = [li.index, this.lastLi.index]
    }
    this.he()
}


//点击
Ping.prototype.click = function() {
    let This = this;
    this.allLi.forEach(function(value) {
        value.onclick = function() {

            this.style.zIndex = This.zIndex++;
            This.move(this)
        }
    })
}


//定位位移
Ping.prototype.ding = function() {
    let arr1 = [];
    let arrA = [];
    for (let i = 0; i < this.length; i++) {
        arr1.push([this.allLi[i].offsetLeft, this.allLi[i].offsetTop, i])
        arrA.push([this.allLi[i].offsetLeft, this.allLi[i].offsetTop, i])
    }
    this.arr = arrA

    //拼图随机生成
    let arr2 = [];
    for (let i = 0; i < this.length - 1; i++) {
        arr2.push(arr1[i])
    }

    arr2.sort(function(a, b) {
            return Math.random() - 0.5;
        }) //随机排序

    arr2.push(arr1[this.length - 1]);
    //逆序数 
    //在一个排列中，如果一对数的前后位置与大小顺序相反，即前面的数大于后面的数，
    // 那末它们就称为一个逆序。一个排列中逆序的总数就称为这个排列的逆序数。逆序数为偶数的排列称为偶排列；
    // 逆序数为奇数的排列称为奇排列。如2431中，21，43，41，31是逆序，逆序数是4，为偶排列。
    // 1-n的全排列中，逆序数最小为0（正序），最大为n*(n-1) / 2（倒序）

    let arr3 = [];
    let a = 0;
    for (let i = 0; i < this.length; i++) {
        arr3.push(arr2[i][2]);
        for (let i = 0; i < this.length; i++) {
            let b = arr3[i]
            for (let j = i; j < this.length; j++) {
                let c = arr3[j];
                if (b > c) {
                    a += 1
                }
            }
        }
    }
    console.log(a);
    // console.log(arr3, a);
    //判断拼图逆序数为奇数还是偶数，拼图只有在逆序数为偶数情况下才能拼完（未测试）
    if (a % 2 == 0) {
        console.log('加油');
    } else {
        console.log('你不会成功的');
        this.ding()
            // return false;
    }
    arr1 = arr2;

    //给li添加定位  定位偏移  索引 外边距  背景以及背景定位
    for (let i = 0; i < this.length; i++) {
        this.allLi[i].style.position = "absolute";
        this.allLi[i].style.left = arr1[i][0] + "px";
        this.allLi[i].style.top = arr1[i][1] + "px";
        this.allLi[i].index = arr1[i][2];
        this.allLi[i].style.margin = 0;
        this.allLi[i].style.backgroundSize = this.num * 100 + "px";
        //第一个px里面要加一个空格  计算不同拼图的背景定位
        this.allLi[i].style.backgroundPosition = (i % this.num) * -100 + "px " + ((i - (i % this.num)) / this.num) * -100 + "px"
    }

}


//判断合并
Ping.prototype.he = function() {
    var This = this;
    let arr1 = [];
    let arr2 = [];
    var n = 0;
    for (let i = 0; i < this.length; i++) {
        arr1.push(this.allLi[i].index);
        arr2.push(this.arr[i][2]);
    }
    for (var i = 0; i < this.length; i++) {
        if (arr1[i] == arr2[i]) {
            n += 1
        }
    }
    if (n == this.length) {
        alert('闯关成功')
        This.num++;
        This.init('ul', This.num)
    }
}



//生成li
Ping.prototype.sheng = function(num) {
    //动态添加ol的长宽
    this.oUl.style.width = 2 + num * 2 + num * 100 + 'px'
    this.oUl.style.height = num * 2 + num * 100 + 'px'
        //获取个数并且生成li
    let n = num * num;
    var str = "";
    for (let i = 0; i < n; i++) {
        str += "<li></li>"
    }
    return str
}


//键盘移动
Ping.prototype.jian = function() {
    let This = this;
    document.addEventListener('keyup', function(e) {
        // console.log(e.key);
        if (e.key == 'ArrowLeft') {
            //左
            if (This.lastLi.index + 1 > This.length - 1) {
                This.move(This.Li(This.lastLi.index));
            } else {
                This.move(This.Li(This.lastLi.index + 1));
            }

        } else if (e.key == 'ArrowRight') {
            //右
            if (This.lastLi.index - 1 < 0) {
                This.move(This.Li(This.lastLi.index));
            } else {
                This.move(This.Li(This.lastLi.index - 1));
            }

        } else if (e.key == 'ArrowUp') {
            //上
            if (This.lastLi.index + This.num > This.length - 1) {
                This.move(This.Li(This.lastLi.index));
            } else {
                This.move(This.Li(This.lastLi.index + This.num));
            }
        } else if (e.key == 'ArrowDown') {
            //下
            if (This.lastLi.index - This.num < 0) {
                This.move(This.Li(This.lastLi.index));
            } else {
                This.move(This.Li(This.lastLi.index - This.num));
            }

        }
    })
}