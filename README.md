# orientboard-component-echarts
   Baidu echarts component for react-orientboard

## example
   ```json
   {
     title: { text: 'React Echarts' },
     //tooltip: { trigger: 'axis' },
     legend: { data: ['最高气温', '最低气温'],
     bottom: '2%' },
     toolbox: { show: true,
       feature : {
           dataView: {readOnly: false},
           magicType: {type: ['line', 'bar','stack','tiled']},
       }
     },
     xAxis: [{
       type: 'category', boundargGap: false,
       data: ['周一','周二','周三','周四','周五','周六','周日']
     }],
     yAxis: [{ type: 'value', axisLabel: { formatter: '{value} C' } }],
     series : [{
        name:'最高气温',
        type:'bar',
        data:[11, 11, 15, 13, 12, 13, 10],
//         markPoint : { data : [ {type : 'max', name: '最大值'}, {type : 'min', name: '最小值'} ] },
//         markLine : { data : [ {type : 'average', name: '平均值'} ] }
      },
      {
        name:'最低气温',
        type:'bar',
        data:[1, -2, 2, 5, 3, 2, 0],
      }]
   }
```
