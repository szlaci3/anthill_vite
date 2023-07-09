import { DatePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import clockIcon from '@/img/时间_time.svg';

function EmployeeDatePicker(props) {
  const [auto, setAuto] = useState();
  const {showToday = true} = props;

  const handleChange = (val) => {
    auto && hideAuto();
    props.setObj({[props.name]: val ? val.format('YYYY-MM-DD') : ""});
  }

  const toggleAuto = (visible) => {
    if (props.autoValue) {
      if (visible) {
        setAuto(true);
      } else {
        hideAuto();
      }
    }
  }

  const hideAuto = () => {
    window.setTimeout(() => {
      setAuto(false);
    }, 150);
  }

  return <div className={"dropdown-field" + (auto ? " auto" : "")}>
    <DatePicker placeholder={props.disabled ? "" : "Pick date"} value={props.value ? dayjs(props.value) : ""} disabled={props.disabled} onChange={handleChange} onOpenChange={toggleAuto} suffixIcon={props.disabled ? null : <img alt="" src={clockIcon} />} showToday={showToday} className="icon-is-clock">
    </DatePicker>
    {auto && (
      <div className="fetch-holder">
        <div className="ant-select-dropdown ant-select-dropdown-placement-right">
          <div className="ant-select-item ant-select-item-option" onClick={props.setObj.bind(null, {[props.name]: props.autoValue})}>
            {props.autoValue}
          </div>
        </div>
      </div>
    )}
  </div>
}

export default EmployeeDatePicker;