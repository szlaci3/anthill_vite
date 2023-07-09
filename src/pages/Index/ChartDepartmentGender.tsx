import { Pie, measureTextWidth, RadialBar } from '@ant-design/charts';
import { companyStaffInfo, mawStaff } from './service';
import { useRequest } from 'umi';
import { Card } from 'antd';
import { hasVal, to0_2Dec } from '@/utils/utils';

function ChartDepartmentGender(props) {
  const deptRes = useRequest(() => companyStaffInfo(),
    {
      formatResult: res => res.data,
    }
  );

  const mawRes = useRequest(() => mawStaff(),
    {
      formatResult: res => res,
    }
  );

  function renderStatistic(containerWidth, text, style) {
    var textWidth = (0, measureTextWidth)(text, style);
    var R = containerWidth * .9;
    var scale = .8;
    if (2 * R < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + 625)),
        ),
        .8,
      );
    }

    var textStyleStr = 'width:'.concat(R * 2, 'px;');
    return '<div style="'
      .concat(textStyleStr, ';font-size:')
      .concat(scale, 'em;line-height:')
      .concat(scale < 1 ? 1 : 'inherit', ';">')
      .concat(text, '</div>');
  }

  let { dept } = deptRes.data || {};
  let data = [];
  if (deptRes.data) {
    for(let i in dept) {
      data.push({name: i, value: Number(dept[i])});
    }
  }

  var deptConfig = {
    appendPadding: 10,
    data: data,
    height: (window.innerHeight - 480) / 2,
    angleField: 'value',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: function formatter(v) {
          return ''.concat(v, ' \xA5');
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -12,
        style: {color: '#74818D', fontWeight: 500},
        customHtml: function customHtml(container, view, datum) {
          var _container$getBoundin = container.getBoundingClientRect(),
            width = _container$getBoundin.width,
            height = _container$getBoundin.height;
          var d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          var text = datum ? datum.name : 'All';
          return renderStatistic(d, text, { fontSize: 28 });
        },
      },
      content: {
        offsetY: 12,
        style: { fontSize: '12px' },
        customHtml: function customHtml(container, view, datum, data) {
          return datum
            ? '<div><span style="color: #FB9A99">' + datum.value + '</span><span style="font-weight: normal; color: #9DAAB6"></span></div>'
            : '<div><span style="color: #FB9A99">' + data.reduce(function (r, d) {return r + d.value;}, 0) + '</span><span style="font-weight: normal; color: #9DAAB6"></span></div>';
        },
      },
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      {
        type: 'pie-statistic-active',
        cfg: {
          start: [
            { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
            { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
            { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
            { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' }
          ]
        }
      }
    ],
    animation: {
      appear: {
        duration: 2000,
      },
    },
    color: ['#6FFBFF','#FFC45F','#D27BFE','#FF66AE','#5b8ff9','#5ad8a6','#5d7092','#7666f9','#f6c022','#fcecbd','#74cbed','#9967bd','#ff9d4e','#299999','#d69eff','#9efff7','#ffcb9e','#ff9ec6','#d5eff9','#e0d1eb'],
    legend: {
      pageNavigator: {
        marker: {
          style: {
            opacity: .3,
            inactiveOpacity: .1,
          }
        }
      }
    },
    state: {
      active: {
        style: {
          shadowColor: 'rgba(0,0,0,.2)',
          shadowBlur: 6,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          stroke: 'transparent',
        },
      },
    },
  };

  let men = [];
  let women = [];
  let menRatio = 1;
  let womenRatio = 1;
  let _man;
  let _woman;

  if(mawRes.data) {
    _man = +(mawRes.data || {}).man;
    _woman = +(mawRes.data || {}).women;// "e"
    men = [{name: "M", value: _man}];
    women = [{name: "F", value: _woman}];
    // _man = 0;
    // _woman = 0;
    menRatio = _man / (_man + _woman) || 0;
    womenRatio = _woman / (_woman + _man) || 0;
  }

  let diagramHeight = window.innerHeight / 7 - 40;

  var menConfig = { 
    data : menRatio ? men : [],
    yField : 'value',
    maxAngle : 340 * menRatio,
    startAngle: -Math.PI * .45,
    endAngle: Math.PI * 1.55,
    radius: 1,
    innerRadius: .7,
    height: diagramHeight,
    tooltip : false,
    color : () => '#D289FF',
    barBackground : { style: {fill: '#b7b7b7'} },
    interactions: [{ type: 'element-active' }],
    state: {
      active: {
        style: {
          fill: 'hsla(277, 100%, 62%, 1)',
          stroke: 'hsla(277, 100%, 82%, 1)',
          lineWidth: 3,
        },
      },
    },
    barStyle : { lineCap : 'round' },
    appendPadding: 10,
    annotations: [
      {
        type: 'text',
        position: ['50%', '50%'],
        content: to0_2Dec(menRatio * 100) + " %",
        style: {
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 'bold',
          fill: '#0D253E',
        },
      },
    ],
  };

  var womenConfig = { 
    data : womenRatio ? women : [],
    yField : 'value',
    startAngle: -Math.PI * .45 + Math.PI * 2 * menRatio,
    endAngle: Math.PI * 1.54 + Math.PI * 2 * menRatio,
    maxAngle : 340 * womenRatio,
    radius: 1,
    innerRadius: .7,
    height: diagramHeight,
    tooltip : false,
    color : () => '#FF65AA',
    barBackground : { style: {fill: '#b7b7b7'} },
    barStyle : { lineCap : 'round' },
    appendPadding: 10,
    state: {
      active: {
        style: {
          fill: 'hsla(333, 99%, 61%, 1)',
          stroke: 'hsla(333, 99%, 81%, 1)',
          lineWidth: 3,
        },
      },
    },
    annotations: [
      {
        type: 'text',
        position: ['50%', '50%'],
        content: to0_2Dec(womenRatio * 100) + " %",
        style: {
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 'bold',
          fill: '#0D253E',
        },
      },
    ],
  };


  return <>
    <Card className="ice-card vdepartment">
      <div className="chart-title">By Department</div>
      <Pie {...deptConfig} />
    </Card>

    <Card className="ice-card vgender">
      <div className="chart-title">By Gender</div>
      <div className="gender-diagram">
        <span> {_man} <b>Men</b></span>
        <RadialBar {...menConfig} />
      </div>
      <div className="gender-diagram">
        <span> {_woman} <b>Women</b></span>
        <RadialBar {...womenConfig} />
      </div>
    </Card>
  </>
};

export default ChartDepartmentGender;