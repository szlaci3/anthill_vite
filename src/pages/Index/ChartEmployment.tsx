import { Line } from '@ant-design/charts';
import { joinOutStaff } from './service';
import { useRequest } from 'umi';
import { Card } from 'antd';

function ChartEmployment(props) {
  const {month, monthday} = props;
  const joinCount = 'Entry';
  const outCount = 'Resignation';
  const tryCount = 'Probation';

  const res = useRequest(() => joinOutStaff(),
    {
      formatResult: res => res,
    }
  );
  const times = [
    null,
    month[monthday-5], // 1-based "array"
    month[monthday-4],
    month[monthday-3],
    month[monthday-2],
    month[monthday-1],
    month[monthday]
  ];

  let data = [];
  let max = 0;
  if (res.data) {
    for(let i in res.data.joinCount) {
      let join = +res.data.joinCount[i];
      let out = +res.data.outCount[i];
      let _try = +res.data.tryCount[i];
      // let join = Math.round(Math.random() * 2);
      // let out = Math.round(Math.random() * 2);
      // let _try = Math.round(Math.random() * 2);
      data.push({time: times[i], value: join, category: joinCount});
      data.push({time: times[i], value: out, category: outCount});
      data.push({time: times[i], value: _try, category: tryCount});
      max = Math.max(max, join, out, _try);
    }
  }

  const config = {
    data: data,
    height: (window.innerHeight - 380) / 2,
    xField: "time",
    yField: "value",
    seriesField: 'category',
    xAxis: {
      label: {
        style: {
          fill: '#97A3B0',
          fontSize: 10,
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
          }
        }
      },
      label: {
        style: {
          fill: '#97A3B0',
          fontSize: 10,
        },
      },
    },
    appendPadding: 3,
    meta: {
      time: {
        range: [0, 1],
      },
      value: {
        tickInterval: max < 4 ? 1 : null, // avoid fractions
        tickCount: 5,
      },
    },
    color: item => {
      switch (item.category) {
        case joinCount: return "#6A3D9A";
        case outCount: return "#FB9A99";
        case tryCount: return "#CAB2D6";
      }
    },
    point: {
      size: 4,
      style: {
        lineWidth: 0,
      },
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: datum.category, value: datum.value };
      },
    },
    animation: {
      appear: {
        duration: 2000,
      },
    },
    legend: {
      position: 'top-right',
      offsetX: -15,
    }
  };
  return <Card className="ice-card vemployment">
    <div className="chart-title">Trend of Employee Movement</div>
    <Line {...config} />
  </Card>
};

export default ChartEmployment;