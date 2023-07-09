import { Line } from '@ant-design/charts';
import { sbxzCostChange } from './service';
import { useRequest } from 'umi';
import { Card } from 'antd';

function ChartInsuranceSalary(props) {
  const {month, monthday} = props;

  const res = useRequest(() => sbxzCostChange(),
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

  let insurance = [];
  let salary = [];
  if (res.data) {
    for(let i in res.data.sb) {
      insurance.push({time: times[i], value: Number(res.data.sb[i])});
      salary.push({time: times[i], value: Number(res.data.xz[i])});
    }
  }

  const insuranceConfig = {
    data: insurance,
    height: (window.innerHeight - 420) / 2,
    xField: "time",
    yField: "value",
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
    },
    smooth: true,
    color: '#FB9A99',
    point: {
      size: 4,
      style: {
        lineWidth: 0,
      },
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: 'Insurance ', value: `$${datum.value}` };
      },
    },
    animation: {
      appear: {
        duration: 2000,
      },
    }
  };
  const salaryConfig = {
    data: salary,
    height: (window.innerHeight - 420) / 2,
    xField: "time",
    yField: "value",
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
    },
    color: '#6A3D9A',
    point: {
      size: 4,
      style: {
        lineWidth: 0,
      },
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: 'Salary ', value: `$${datum.value}` };
      },
    },
    animation: {
      appear: {
        duration: 2000,
      },
    }
  };
  return <>
    <Card className="ice-card vinsurance">
      <div className="chart-title">Insurance</div>
      <Line {...insuranceConfig} />
    </Card>
    <Card className="ice-card vsalary">
      <div className="chart-title">Salary</div>
      <Line {...salaryConfig} />
    </Card>
  </>
};

export default ChartInsuranceSalary;