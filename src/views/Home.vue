<template>
  <div class="home">
    <div class="title_box">
      <div class="title">智慧文旅驾驶舱</div>
      <dv-decoration-5 style="width:300px;height:40px;" />
    </div>
    <div class="content_box">
      <div class="count_box">
        <div class="count">
          <div class="count_label">2018实时游客数</div>
          <div class="count_value">{{countdata.a}}</div>
        </div>
        <div class="count">
          <div class="count_label">2018实时游客数</div>
          <div class="count_value">{{countdata.b}}</div>
        </div>
        <div class="count">
          <div class="count_label">2018实时游客数</div>
          <div class="count_value">{{countdata.c}}</div>
        </div>
        <div class="count">
          <div class="count_label">2018实时游客数</div>
          <div class="count_value">{{countdata.d}}</div>
        </div>
      </div>
      <div class="histogram">
        <ve-histogram :data="histogramData" :extend="histogram_extend"></ve-histogram>
      </div>
      <div class="pie1_box">
        <div class="liquid_title"></div>
        <!-- <ve-liquidfill :data="liquid_Data" :settings="liquid_settings"></ve-liquidfill> -->
        <ve-pie :data="pieData" :settings="pieSettings" :legend-visible="false"></ve-pie>
      </div>
      <div class="box3">
        <dv-capsule-chart :config="box3config" style="width:300px;height:200px" />
      </div>
      <div class="box4">
        <div class="box_title"></div>
        <div class="box_content">
          <dv-scroll-ranking-board :config="box4Data" style="width:500px;height:300px" />
        </div>
      </div>
      <div class="box5">
        <ve-radar :data="box6Data" :legend-visible="false"></ve-radar>
      </div>
      <div class="box6">
        <div class="box_title">上架销售排行</div>
        <dv-scroll-board :config="box5config" style="width:500px;height:300px" />
      </div>
      <div class="box7">
        <!-- <dv-flyline-chart :config="box7config" style="width:100%;height:100%;" /> -->
      </div>
      <div class="box8">
        <ve-histogram :data="box8Data" :extend="box8Settings" :colors="colors" :settings="box8se"></ve-histogram>
      </div>
      <div class="box9">
        <ve-map :data="box9Data" :settings="box9Settings" :extend="box9Extend" height="600px"></ve-map>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      histogram_extend: {
        yAxis: {
          name: "人数"
        },
        xAxis: {
          axisLabel: {
            rotate: "60"
          }
        },
        legend: {
          show: false
        },
        series: {
          type: "bar",
          label: { show: true, position: "top" }
        },
        textStyle: {
          color: "#fff"
        }
      },
      countdata: {
        a: "20123",
        b: "485231",
        c: "125893",
        d: "723341"
      },
      histogramData: {
        columns: ['场馆', '访问用户',],
        rows: [
          { '场馆': '蜡像馆', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '场馆': '图书馆', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '场馆': '文创馆', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '场馆': '咖啡厅', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '场馆': '艺术馆', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '场馆': '牡丹画廊', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      liquid_data: {
        columns: ['city', 'percent'],
        rows: [{
          city: '上海',
          percent: 0.6
        }]
      },
      liquid_settings: {
        seriesMap: {
          '上海': {
            shape: 'rect'
          }
        },
      },
      pieData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '1/1', '访问用户': 1393 },
          { '日期': '1/2', '访问用户': 3530 },
          { '日期': '1/3', '访问用户': 2923 },
          { '日期': '1/4', '访问用户': 1723 },
          { '日期': '1/5', '访问用户': 3792 },
          { '日期': '1/6', '访问用户': 4593 }
        ]
      },
      pieSettings: {
        radius: 60,
        offsetY: 120,
        level: [
          ['1/1', '1/2', '1/3'],
          ['1/4', '1/5']
        ],
        textStyle: {
          color: "#fff"
        }
      },
      box3config: {
        data: [
          {
            name: '南阳',
            value: 167
          },
          {
            name: '周口',
            value: 123
          },
          {
            name: '漯河',
            value: 98
          },
          {
            name: '郑州',
            value: 75
          },
          {
            name: '西峡',
            value: 66
          },
        ],
        colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
        unit: '单位'

      },
      box4Data: {
        data: [
          {
            name: '周口',
            value: 55
          },
          {
            name: '南阳',
            value: 120
          },
          {
            name: '西峡',
            value: 78
          },
          {
            name: '驻马店',
            value: 66
          },
          {
            name: '新乡',
            value: 80
          }
        ],
        unit: '万人次'

      },
      box5config: {
        header: ['列1', '列2', '列3'],
        data: [
          ['行1列1', '行1列2', '行1列3'],
          ['行2列1', '行2列2', '行2列3'],
          ['行3列1', '行3列2', '行3列3'],
          ['行4列1', '行4列2', '行4列3'],
          ['行5列1', '行5列2', '行5列3'],
          ['行6列1', '行6列2', '行6列3'],
          ['行7列1', '行7列2', '行7列3'],
          ['行8列1', '行8列2', '行8列3'],
          ['行9列1', '行9列2', '行9列3'],
          ['行10列1', '行10列2', '行10列3']
        ]

      },
      box6Data: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      box7config: {
        centerPoint: [0.48, 0.35],
        points: [
          {
            position: [0.52, 0.235],
            text: '新乡'
          },
          {
            position: [0.43, 0.29],
            text: '焦作'
          },
          {
            position: [0.59, 0.35],
            text: '开封'
          },
          {
            position: [0.53, 0.47],
            text: '许昌'
          },
          {
            position: [0.45, 0.54],
            text: '平顶山'
          },
          {
            position: [0.36, 0.38],
            text: '洛阳'
          },
          {
            position: [0.62, 0.55],
            text: '周口'
          },
          {
            position: [0.56, 0.56],
            text: '漯河'
          },
          {
            position: [0.37, 0.66],
            text: '南阳'
          },
          {
            position: [0.55, 0.81],
            text: '信阳'
          },
          {
            position: [0.55, 0.67],
            text: '驻马店'
          },
          {
            position: [0.37, 0.29],
            text: '济源'
          },
          {
            position: [0.20, 0.36],
            text: '三门峡'
          },
          {
            position: [0.76, 0.41],
            text: '商丘'
          },
          {
            position: [0.59, 0.18],
            text: '鹤壁'
          },
          {
            position: [0.68, 0.17],
            text: '濮阳'
          },
          {
            position: [0.59, 0.10],
            text: '安阳'
          }
        ],
        k: 0.5,
        bgImgUrl: '../assets/images/map.jpg',
      },
      box8Data: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      box8Settings: {
        legend: {
          show: false
        },
        textStyle: {
          color: "#fff"
        },
        series: {
          type: "bar",
          label: { show: true, position: "top" }
        },
      },
      box8se: {
        showLine: ['下单用户']
      },
      box9Settings: {
        position: 'china',
        // selectData: true,
        selectedMode: 'single'
      },
      cityName: '',
      box9Data: {
        columns: ['位置', 'GDP'],
        rows: [
          { '位置': '吉林', 'GDP': 123 },
          { '位置': '北京', 'GDP': 1223 },
          { '位置': '上海', 'GDP': 2123 },
          { '位置': '浙江', 'GDP': 4123 }
        ]
      },
      box9Extend: {
        series: {
          nameMap: {
            'Central and Western': '中西区',
            'Eastern': '东区',
            'Islands': '离岛',
            'Kowloon City': '九龙城',
            'Kwai Tsing': '葵青',
            'Kwun Tong': '观塘',
            'North': '北区',
            'Sai Kung': '西贡',
            'Sha Tin': '沙田',
            'Sham Shui Po': '深水埗',
            'Southern': '南区',
            'Tai Po': '大埔',
            'Tsuen Wan': '荃湾',
            'Tuen Mun': '屯门',
            'Wan Chai': '湾仔',
            'Wong Tai Sin': '黄大仙',
            'Yau Tsim Mong': '油尖旺',
            'Yuen Long': '元朗'
          }
        }
      },
      colors: ['#c23531', '#2f4554', '#61a0a8',
        '#d48265', '#91c7ae', '#749f83',
        '#ca8622', '#bda29a', '#6e7074',
        '#546570', '#c4ccd3']
    }
  },
}
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.home {
  overflow: hidden;
  width: 100vw;
  // height: 100vh;
  height: 1100px;
  box-sizing: border-box;
  background: url("../assets/images/bg.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
  .title_box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 36px;
      text-align: center;
      color: #fff;
    }
  }
  .content_box {
    margin-left: 100px;
    width: 100%;
    height: calc(100% - 80px);
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .count_box {
      display: flex;
      width: 600px;
      height: 200px;
      flex-wrap: wrap;
      .count {
        width: 300px;
        text-align: left;
        .count_label {
          font-size: 18px;
        }
        .count_value {
          font-size: 50px;
          color: rgba(2555, 255, 0, 1);
        }
      }
    }
    .histogram {
      width: 400px;
      height: 300px;
      position: absolute;
      left: 630px;
    }
    .pie1_box {
      width: 300px;
      height: 200px;
      position: absolute;
      left: 1350px;
      top: 30px;
    }
    .box3 {
      position: absolute;
      left: 1100px;
      top: 80px;
    }
    .box4 {
      position: absolute;
      top: 220px;
    }
    .box5 {
      position: absolute;
      top: 320px;
      left: 600px;
      width: 500px;
      height: 300px;
    }
    .box6 {
      position: absolute;
      top: 320px;
      left: 1200px;
      .box_title {
        text-align: left;
        line-height: 30px;
        font-size: 24px;
      }
    }
    .box7 {
      width: 600px;
      height: 500px;
      position: absolute;
      top: 550px;
      background-size: 100% 100%;
    }
    .box8 {
      width: 950px;
      position: absolute;
      top: 650px;
      left: 750px;
      height: 400px;
    }
    .box9 {
      width: 700px;
      position: absolute;
      left: 0;
      top: 400px;
    }
  }
}
</style>
