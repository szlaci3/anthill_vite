import { AutoComplete, Form } from 'antd';
import { useState } from 'react';

  // <InfoField
  //   name
  //   label
  //   fetch
  //   disabled
  // />

function InfoField({name, label, fetch, disabled, className, onBlur, autoFocus}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Form.Item name={name} label={label} className={className}>
      <AutoComplete
        options={fetch[name] ? [{ value: fetch[name] }] : null}
        disabled={disabled}
        name={name}
        onFocus={() => {setIsVisible(true)}}
        onBlur={(ev) => {setIsVisible(false); onBlur && onBlur(ev)}}
        onSelect={() => {setIsVisible(false)}}
        open={isVisible}
        dropdownClassName="fetch-bg"
        autoFocus={autoFocus}
      />
    </Form.Item>
  )
}

export default InfoField;