import { Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

function EmployeeDropdown(props) {
  const [auto, setAuto] = useState();

  const eachOption = (option, i) => {
    return <Option key={i} value={option}>{option}</Option>
  }

  const handleChange = (val) => {
    auto && hideAuto();
    props.setObj({[props.name]: val});
  }

  const toggleAuto = (visible) => {
    if (props.autoValue === 0 || props.autoValue) {// If it has a value (including 0)
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
    <Select placeholder="请选择" dropdownClassName="employee-options" value={props.value} disabled={props.disabled} showArrow={!props.disabled} onChange={handleChange} onDropdownVisibleChange={toggleAuto}>
      {props.options.map(eachOption)}
    </Select>
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

export default EmployeeDropdown;