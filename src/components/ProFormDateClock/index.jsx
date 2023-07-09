import React from 'react';
import {
  ProFormDatePicker,
} from '@ant-design/pro-form';
import clockIcon from '@/img/时间_time.svg';

        // <ProFormDateClock
        //   width={160}
        //   name="start_time"
        //   label="调整起始日期"
        //   fieldProps={{allowClear: false}}
        // />

class ProFormDateClock extends React.Component {
  render() {
    return <ProFormDatePicker
        {...this.props}
        fieldProps={{...this.props.fieldProps, className: "icon-is-clock " + (this.props.fieldProps && this.props.fieldProps.className || ""), suffixIcon: <img alt="" src={clockIcon} />}}
      />
  }
}

export default ProFormDateClock;
