var dom = document.getElementById("container");
dom.style.width = "100%";
dom.style.height = "800px";
var myChart = echarts.init(dom);
var app = {};
option = null;
window.addEventListener("resize",function(){
    myChart.resize();
});

$(hsz).each(function (index) {
    var arr = $(this);
    var begin = arr[0].StartDate;
    var beginDate = mini.decode(mini.encode(begin));

    var btn = document.getElementById('btn'),
        oneDay = 24 * 60 * 60 * 1000,
        startDate = new Date(+beginDate - oneDay * 30),                     //开始日期是所给日期的前一个月，x轴原点为前一个月
        // endDate = new Date(startDate),
        a = 0,
        timer = null,
        yData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],                //提前定义折线图节点数组
        yAll = [0],                 //折线图节点和
        yDataSort = [],             //折线图节点和集
        xCoord = [],                //横坐标
        yCoord;                     //纵坐标

// endDate.setFullYear(startDate.getFullYear() + 1);
// endDate.setDate(startDate.getDate() - 1);
// var xEnd = [endDate.getFullYear(), endDate.getMonth(), endDate.getDate()].join('-'),
//     xStart = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()].join('-');

// 横坐标日期集合
    for (var i = 0; i < 31; i++) {
        var now = new Date(+startDate + oneDay * i);                                            //开始日期加i天
        var xItem = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');                 //取日期节点坐横坐标
        xCoord.push(xItem);
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

    option = {
        title: {
            text: '黑沙洲水道航道整治二期工程',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        legend: {
            left: '2%',
            top: '1%',
            data: [{
                name: '总金额'
            }]
        },
        xAxis: {
            type: 'category',
            name: '时间',
            boundaryGap: false,
            splitLine: {show: false},
            data: xCoord,
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
                            },
                        }
                    },
                    data: [
                        [{coord: [30, 0], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                        [{coord: [0, yAll], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                    ]
                },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 9,
                    label: {
                        normal: {
                            offset: [-15, -15],
                            textStyle: {
                                color: '#000'
                            },
                        },
                    },
                    itemStyle: {
                        normal: {
                            type: 'solid',
                            borderColor: {
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
                            },
                            borderWidth: 1,
                            color: '#fff'
                        }
                    },
                    data: [{
                        coord: [30, yAll]
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

    btn.onclick = function () {
        clearInterval(timer);
        timer = setInterval(function () {

            a = a + 1;
            var more = Math.ceil((Math.random() * 1000) * 21 - 10);                            //生成一个新折线图数据节点
            var moreSort = yDataSort[yDataSort.length - 1] + more;      //继续求和
            var newDay = new Date(+startDate + oneDay * (60 + a));       //生成一个月后新的一天
            var moreDay = [newDay.getFullYear(), newDay.getMonth() + 1, newDay.getDate()].join('-');

            yData.shift();                                              //去掉折线图节点数字数组的第一个点
            yData.push(more);                                           //把新的折线图数据节点加到折线图节点数字数组里去
            yDataSort.shift();                                          //去掉折线图节点数字和数组的第一个点
            yDataSort.push(moreSort);                                   //把新的和加到数组里去
            xCoord.shift();                                             //去掉日期数组的第一个值
            xCoord.push(moreDay);                                       //把新的日期加到数组里去

            yAll = yDataSort[yDataSort.length - 1];                     //重新赋值和数组的最大值
            yCoord = Math.ceil(yAll * 1.15);                            //重新赋值纵坐标最大值

            option = {
                title: {
                    text: '黑沙洲水道航道整治二期工程',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}'
                },
                legend: {
                    left: '2%',
                    top: '1%',
                    data: [{
                        name: '总金额'
                    }]
                },
                xAxis: {
                    type: 'category',
                    name: '时间',
                    boundaryGap: false,
                    splitLine: {show: false},
                    data: xCoord,
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
                                    type: 'dashed',
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
                                    },
                                }
                            },
                            data: [
                                [{coord: [30, 0], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                                [{coord: [0, yAll], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                            ]
                        },
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 8,
                            label: {
                                normal: {
                                    offset: [-15, -15],
                                    textStyle: {
                                        color: '#000'
                                    },
                                },
                            },
                            itemStyle: {
                                normal: {
                                    type: 'solid',
                                    show: true,
                                    borderColor: {
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
                                    },
                                    color: '#fff'
                                }
                            },
                            data: [{
                                coord: [30, yAll]
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
        }, 1000)
    }
})