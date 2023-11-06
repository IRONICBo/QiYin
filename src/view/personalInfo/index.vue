<template>
    <div class="con">
        <div>
            <div class='info'>
                <div>
                    <el-avatar :size="50" :src="circleUrl" />
                    <h1>昵称</h1>
                </div>
                <div class='fix_b'>
                    <el-button>修改信息</el-button>
                </div>
            </div>
           
            <el-divider />
            <h6>个性签名</h6>
            <el-divider />
            <div>
                <div>
                    <h6>标签选择</h6>
                    <div>
                        <el-button>开始选择</el-button>
                        <el-button @click='sendTag'>停止</el-button>
                    </div>
                </div>
                <div class='tag'>
                    <canvas id="myCanvas" width="1000" height="500"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
	import { reactive, toRefs, ref } from 'vue'
    import { onMounted} from 'vue'
    import StorageUtil from '../../utils/localStorage';


    const state = reactive({
        circleUrl:
            'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        squareUrl:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    })

    const dataList = [
        '热门','风景','宠物','体育', '美食', '娱乐', '时尚', '潮流', '明星', '电竞', '服装'
    ]

    let clickNum  = 0
    const dataLen = dataList.length
    console.log("data list",dataLen)
    const { circleUrl, squareUrl, sizeList } = toRefs(state)


    const circleInfo = () => {

        class Circle {

            constructor(x, y, r, color) {

                this.x = x;

                this.y = y;

                (this.r = r), (this.c = color ? color : this.getRandomColor());

            }
            getRandomColor() {

                let r = Math.floor(Math.random() * 100) + 155;

                let g = Math.floor(Math.random() * 100) + 155;

                let b = Math.floor(Math.random() * 100) + 155;

                return `rgb(${r},${g},${b})`;

            }

        }
        class RandomCircle {
            constructor(obj) {

                this.c = document.getElementById(obj.id);

                console.log(this.c)

                this.ctx = this.c.getContext("2d");

                this.dWidth = this.c.width;

                this.dHeight = this.c.height;



                this.fix = obj.fix || false;

                this.minMargin = obj.minMargin || 10;

                this.minRadius = obj.minRadius || 30;

                this.radiuArr = obj.radiuArr || [80,70,60,50,45,40,40,35,35,30,];

                this.total = obj.total || 10;

                this.circleArray = [];

                this.circleNumber = 1;

                this.c.addEventListener('click', function (e) {
                    clickNum ++
                })

            }

            drawOneCircle(c) {

                let ctx = this.ctx;

                ctx.beginPath();

                ctx.strokeStyle = c.c;

                ctx.fillStyle = c.c;

                ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);

                ctx.stroke();

                ctx.fill();



                ctx.fillStyle = "black";

                // ctx.fillText("No:" + this.circleNumber, c.x - 10, c.y - 5); //圆内文字

                // ctx.fillText("R:" + c.r, c.x - 10, c.y + 5);

                ctx.fillText(dataList[this.circleNumber], c.x - 10, c.y - 5)

                this.circleNumber++;

            }

            check(x, y, r) {

                return !(

                x + r > this.dWidth ||

                x - r < 0 ||

                y + r > this.dHeight ||

                y - r < 0

                );

            }

            // 获取一个新圆的半径，主要判断半径与最近的一个圆的距离
            getR(x, y) {

                if (this.circleArray.length === 0)

                return Math.floor(Math.random() * 20 + 80);

                let lenArr = this.circleArray.map((c) => {

                let xSpan = c.x - x;

                let ySpan = c.y - y;

                return (

                    Math.floor(Math.sqrt(Math.pow(xSpan, 2) + Math.pow(ySpan, 2))) -

                    c.r

                );

                });

                let minCircleLen = Math.min(...lenArr);

                let minC = this.circleArray[lenArr.indexOf(minCircleLen)];

                let tempR = this.fix

                ? this.radiuArr[this.circleArray.length]

                : minCircleLen - this.minMargin;

                let bool = this.fix

                ? tempR <= minCircleLen - minC.r

                : tempR >= this.minRadius;

                return bool ? tempR : false;

            }
            // 生成一个圆，随机生成圆心。
            // 如果连续生成200次半径都没有合适的话，终止进程
            createOneCircle() {

                let x, y, r;

                let createCircleTimes = 0;

                while (true) {

                createCircleTimes++;

                x = Math.floor(Math.random() * this.dWidth);

                y = Math.floor(Math.random() * this.dHeight);

                let TR = this.getR(x, y);

                if (!TR) {

                    continue;

                } else {

                    r = TR;

                }

                if (this.check(x, y, r) || createCircleTimes > 200) {

                    break;

                }

                }

                this.check(x, y, r) && this.circleArray.push(new Circle(x, y, r));

            }
            // 如果生成100次新圆都失败的话，终止方案。
            // 如果生成100种方案都没有合适可用的话，终止进程。
            init() {

                let n = 0;

                while (this.circleArray.length < this.total) {

                this.circleArray = [];

                let i = 0;

                while (this.circleArray.length < this.total) {

                    this.createOneCircle();

                    i++;

                    if (i >= 100) {

                    break;

                    }

                }

                n++;

                if (n > 100) {

                    break;

                }

                }

                // 根据半径从大到小画圆。

                this.circleArray

                .sort((a, b) => b.r - a.r)

                .forEach((c) => {

                    this.drawOneCircle(c);

                });

            }

        }
        const p = new RandomCircle({

            id: "myCanvas",

            total: 10, //配置数量

        });

        p.init();

        console.log(p);
        console.log(p.circleArray);

    }


    // created() {

    // this.$nextTick(()=>{

    //     this.circleInfo();//初始化

    // })

    // },

    const sendTag = () => {
        console.log(clickNum, dataList.length)
        let tagList = []
        if(clickNum < dataList.length) {
            tagList = dataList.slice(0, clickNum)
        } else{
            tagList = dataList
        }
        StorageUtil.set("tags", JSON.stringify(tagList));
        console.log(StorageUtil.get("tags"))
        return tagList
    }

    onMounted(()=>{
 		console.log('生命周期----onMounted')
        circleInfo();//初始化
 	})





</script>

<style scoped lang="less">
	
    .con {
		background-color: white;
		padding:5%;
	}

    .info {
        display: flex;
        flex-direction: row;
    }
    .fix_b {
        margin-left: 50%
    }
</style>