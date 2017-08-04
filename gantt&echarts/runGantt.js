function runGantt() {
    var dom = document.getElementById("container");
    dom.style.width = "100%";
    dom.style.height = "400px";

    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    function randomData() {
        //  定义日期+1天
        now = new Date(+now + oneDay);
        //  增加随机性
        value = value + Math.random() * 21 - 10;
        //  返回name和value,name=>日期转成字符串,value=>锚点，日期转成"/"式:随机值
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                Math.round(value)
            ]
        }
        console.log(name)
    }

    var data = [];
    //  获取当前日期
    var now = new Date(2006, 11, 30);
    //  一天的毫秒数
    var oneDay = 24 * 3600 * 1000;
    //  取0-1000之间随机数
    var value = 0;
    //  把模拟数据添加进数组data
    for (var i = 0; i < 1000; i++) {
        data.push(randomData());
    }

    option = {
        title: {
            text: '动态数据 + 时间坐标轴'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'category',
            data: ['5', '6', '9', '13', '19', '33'],
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: true,
            data: data
        }]
    };

    var i = 0,
        timer = null,
        //  运动花费时间
        runTime = new Date(2006, 11, 31, 00, 00, 00),
        //  开始节点
        beginDate = new Date(2007, 0, 1, 00, 00, 00),
        endDate = new Date(2007, 9, 5, 00, 00, 00),
        moreDate = new Date(2007, 0, 15, 00, 00, 00),
        runName = "时间线",
        endName = "终点线",
        runPos = "bottom",
        endPos = "top",
        runColor = "red",
        endColor = "green",
        runW = 2,
        endW = 2,
        hourTime = 3600,
        dayTime = 86400,
        speed = dayTime,
        time = 1000;

    var start = document.getElementById("start");
    var reset = document.getElementById("reset");

//    设置时间线
    project.setTimeLines([
        {date: beginDate, text: runName, position: runPos, style: "width:" + runW + "px;background:" + runColor + ";"},
        {date: endDate, text: endName, position: endPos, style: "width:" + endW + "px;background:" + endColor + ";"}
    ]);

    start.onclick = function () {
        clearInterval(timer);
        timer = setInterval(function () {
            i = i + 1;
            //  开始运动
            var runDate = new Date((beginDate / 1000 + speed * i) * 1000);
            project.setTimeLines([
                {
                    date: endDate,
                    text: endName,
                    position: endPos,
                    style: "width:" + endW + "px;background:" + endColor + ";"
                },
                {
                    date: runDate,
                    text: runName,
                    position: runPos,
                    style: "width:" + runW + "px;background:" + runColor + ";"
                }
            ]);
            project.scrollToDate(runDate);

            start.onclick = function () {
                if (moreDate / 1000 <= endDate / 1000) {
                    clearInterval(timer);
                } else {
                    endDate = moreDate;
                }

            }

            if (runDate / 1000 === endDate / 1000) {
                clearInterval(timer);
            }

            for (var k = 0; k < 1; k++) {
                data[0].value = ["2016/12/31", 0];
                data.shift();
                data.push(randomData());
            }

            var mathDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
            // console.log(mathDate)
            myChart.setOption({
                series: [{
                    data: data,
                    markLine:{
                        lineStyle:{normal:{type:'solid'}},
                        data:[
                            [{coord:[0,800],symbol:'none'},{coord:[1, 800],symbol:'none'}],
                            [{coord:[1,0],symbol:'none'},{coord:[1, 932],symbol:'none'}],
                        ]
                    },
                    // markArea: {
                    //     silent: true,
                    //     itemStyle: {
                    //         normal: {
                    //             color: 'transparent',
                    //             borderColor: '#000',
                    //             borderWidth: 1,
                    //             borderType: 'solid'
                    //         }
                    //     },
                    //     data: [[{
                    //         name: '',
                    //         xAxis: 0,
                    //         yAxis: 0
                    //     }, {
                    //         xAxis: mathDate,
                    //         yAxis: '800'
                    //     }]]
                    // },
                    // markLine:{
                    //     data: [{
                    //         xAxis: mathDate
                    //     },{
                    //         yAxis:300
                    //     }]
                    // },
                    itemStyle: {normal: {label: {show: true}}},
                }]
            });
        }, time);

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }
}
