var dom = document.getElementById("container");
dom.style.width = "100%";
dom.style.height = "800px";
var myChart = echarts.init(dom);
var app = {};
option = null;

var startDate = new Date(),
    // endDate = new Date(startDate),
    oneDay = 24 * 60 * 60 * 1000,
    yData = [0],                //折线图节点
    yAll = [0],                 //折线图节点和
    yDataSort = [],             //折线图节点和集
    xCoord = [],                //横坐标
    yCoord;                     //纵坐标

// endDate.setFullYear(startDate.getFullYear() + 1);
// endDate.setDate(startDate.getDate() - 1);
//
// var xEnd = [endDate.getFullYear(), endDate.getMonth(), endDate.getDate()].join('-'),
//     xStart = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()].join('-');


// 横坐标日期集合
for (var i = 0; i < 5; i++) {
    var now = new Date(+startDate + oneDay * i * 2);                                        //开始日期加i天
    var xItem = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');               //取日期节点坐横坐标
    xCoord.push(xItem);
}

//折线图节点集合
for (var i = 0; i < 4; i++) {
    var now = new Date(+startDate + oneDay * i * 2);
    var yItem = Math.random() * 1000;
    yData.push(yItem);
}

//折线图节点数字求和
yAll = yData.reduce(function (sum, value) {
    return sum + value;
})

//折线图节点数字求和 数组
yDataSort = yData.reduce(function (sum, value) {
    var all = sum.length === 0 ? 0 : sum[sum.length - 1];
    sum.push(all + value);
    return sum;
}, [])

//纵坐标重点max值
yCoord = Math.ceil(yAll * 1.15);
console.log(yAll * 1.15)
console.log(yCoord)


option = {
    title: {
        text: '对数轴示例',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
    },
    legend: {
        left: 'right',
        data: [{
            name: '总金额'
        }]
    },
    xAxis: {
        type: 'category',
        name: '时间',
        boundaryGap: false,
        splitLine: {show: false},
        data: xCoord
    },
    yAxis: {
        type: 'value',
        name: '总金额',
        min: 0,
        max: yCoord,
        splitLine: {show: false},
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    series: [
        {
            name: '总金额',
            type: 'line',
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'red' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#FFAF00' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            },
            markLine: {
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: 'rgb(110, 241, 223)'
                    }
                },
                data: [
                    [{coord: [4, 0], symbol: 'none'}, {coord: [4, yDataSort[4]], symbol: 'none'}],
                    [{coord: [0, yDataSort[4]], symbol: 'none'}, {coord: [4, yDataSort[4]], symbol: 'none'}],
                ]
            },
            markPoint: {
                symbol: 'diamond',
                symbolSize: 30,
                itemStyle: {
                    normal: {
                        type: 'solid',
                        color: 'rgb(110, 241, 223)'
                    }
                },
                data: [{
                    coord: [4, yDataSort[4]]
                }]
            },
            data: yDataSort
        },
        // {
        //     name: '1/2的指数',
        //     type: 'bar',
        //     itemStyle: {
        //         normal: {
        //             color:'green'
        //         }
        //     },
        //     data: [yData[1],yData[2],yData[3],yData[4],yData[5]]
        // }
    ]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}