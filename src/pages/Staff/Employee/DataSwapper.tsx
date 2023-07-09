import { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Radio, Select } from 'antd';
import InfoField from './InfoField';
import EmployeeDatePicker from '@/components/EmployeeDatePicker';
import EmployeeDropdown from '@/components/EmployeeDropdown';
import { eduOptions, hasVal } from '@/utils/utils';

const {useForm} = Form;

const nameFields = [
  {name: "r_race", label: "民族"},
  {name: "r_bank_name", label: "开户银行"},
  {name: "r_bank_account", label: "银行账号"},
  {name: "r_zipcode", label: "邮政编码"},
  {name: "r_guraduated_school", label: "毕业学校"},
  {name: "r_personal_page", label: "个人网页"},

  {name: "s_passport", label: "护照号码"},
  {name: "r_cpemail", label: "工作邮箱"},
  {name: "r_ext", label: "分机"},
  {name: "r_residence", label: "户籍所在地"},
  {name: "s_phone", label: "手机号码"},
  {name: "r_qq", label: "QQ号码"},
  {name: "r_language", label: "擅长语言"},
  {name: "r_skills", label: "专业技能"},
  {name: "r_sb_account", label: "社保账户"},
  {name: "r_gjj_account", label: "公积金账户"},
  {name: "age", label: "年龄"},
  {name: "r_contact_address", label: "联系地址"},

  {name: "s_birthday", label: "生日", type: "date"},
  {name: "r_edu", label: "学历", type: "dropdown"},

  {name: "s_sex", label: "性别", type: "twoOptions", options: ["男", "女"]},
  {name: "r_marry", label: "婚姻状况", type: "twoOptions", options: ["未婚", "已婚"]},
  {name: "r_residence_type", label: "户籍类型", type: "twoOptions", options: ["城镇", "农村"]},
];

function DataSwapper(props) {
  const {
    data,
    visible,
  } = props;
  const [form] = useForm();
  const [myFields, setMyFields] = useState();

  useEffect(() => {
    if (!data) {
      return false;
    }

    let arr = nameFields.filter(({name}) => data[name] !== props.fetch[name] && hasVal(props.fetch[name]) && props.fetch[name] !== "");
    setMyFields(arr);
  }, [data]);

  if (!myFields || !data) {
    return <div/>
  }

  const onSubmit = values => {
    props.saveSwapper(values);
    onClose();
  }

  const onClose = () => {
    props.onClosePopup();
    window.setTimeout(() => {
      form.resetFields();
    }, 350);
  }

  const renderPseudoField = ({name, label, type}, i) => (
    <Form.Item name={name} label={label} key={i} className={type === "twoOptions" || type === "date" ? "half-width" : ""}>
      <Input
        disabled
      />
    </Form.Item>
  )

  const ratio = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };


  return (
    <Modal
      maskClosable={false}
      title="一键应用"
      visible={visible}
      onCancel={onClose}
      onOk={form.submit}
      okText="保存"
      destroyOnClose={true}
      centered={true}
      closeIcon={<span className="close-x">&times;</span>}
      width={800}
      className="data-swapper-modal max-height-modal narrow-header-modal"
    >

      <div className="swapper-inner">
        <Form initialValues={data} className="ahalf" colon={false} {...ratio}>
          <h3>应用前</h3>
          {myFields.map((field, i) => {
            if (field.name === "r_edu") {
              return <Form.Item name="r_edu" label="学历" key={i} className="half-width">
                <Select
                  disabled
                />
              </Form.Item>
            }
            return renderPseudoField(field, i);
          })}
        </Form>

        <Form form={form} onFinish={onSubmit} initialValues={props.fetch} className="ahalf" colon={false} {...ratio}>
          <h3>应用后</h3>
          {myFields.map((field, i) => {
            if (field.name === "s_birthday") {
              return (
                <Form.Item name="s_birthday" label="生日" key={i} className="half-width">
                  <EmployeeDatePicker
                    name="s_birthday"
                    autoValue={data.s_birthday}
                    setObj={obj => {form.setFieldsValue(obj)}}
                    showToday={false}
                  />
                </Form.Item>
              )
            } else if (field.name === "r_edu") {
              return (
                <Form.Item name="r_edu" label="学历"
                  className="half-width" key={i}>
                  <EmployeeDropdown
                    options={eduOptions}
                    name="r_edu"
                    autoValue={data.r_edu}
                    setObj={obj => {form.setFieldsValue(obj)}}
                  />
                </Form.Item>
              )
            } else if (field.type === "twoOptions") {
              return (
                <Form.Item name={field.name} label={field.label} key={i}>
                  <Radio.Group
                    name={field.name}
                    className="rubber"
                    buttonStyle="solid"
                    options={field.options}
                    optionType="button"
                  />
                </Form.Item>
              )
            }
            /* Unlike in EmployeeData, here Fetch is the Value and data is the autoValue */
            return <InfoField
              name={field.name}
              label={field.label}
              fetch={data}
              key={i}
            />
          })}
        </Form>
      </div>
    </Modal>
  )
}

export default DataSwapper;