import { Form, Input, Radio } from 'antd';
import EmployeeDropdown from '@/components/EmployeeDropdown';
import EmployeeDatePicker from '@/components/EmployeeDatePicker';
import { hasVal, eduOptions, phoneValidator } from '@/utils/utils';
import InfoField from './InfoField';
import { parseIdentity } from '@/services/globalServices';
import { useState, useEffect } from 'react';

function Details1(props) {
  const {
    form,
    staffData,
    fetch,
    isEdit,
    extendFields,
    isBound,

    save,
    setCanSubmit,
  } = props;

  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [identityResult, setIdentityResult] = useState({});

  useEffect(() => {
    if (!isEdit) {
      setIsPhoneValid(true);
    }
  }, [isEdit])

  const renderExtendFields = (fields) => {
    let list = [];
    for (let item in fields) {
      list.push(
        <Form.Item name={["extendValues", item]} label={fields[item]} key={item}>
          <Input
            disabled={isBound || !isEdit}
          />
        </Form.Item>
      );
    }

    return list;
  }

  const getAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return isNaN(age) ? (staffData.age || "") : age;
  }

  const loadIdentityInfo = async (ev) => {
    let identity = ev.target.value.replaceAll(" ", "");
    if (identity) {
      let res = await parseIdentity({identity});
      let returnVal = {};
      if (res.htmlRes == 1) {// in DEV
        setCanSubmit(false);
        returnVal = {valid: false, invalidMsg: "error"};
      } else if (res.status == 0) {
        setCanSubmit(false);
        returnVal = {valid: false, invalidMsg: res.info};
      } else {
        const birthDate = new Date(res.birth);
        let identityResults = {
          [ev.target.id]: identity, // apply replaceAll changes
          s_sex: res.sex,
        };
        if (!isNaN(birthDate.getFullYear())) {
          identityResults.s_birthday = birthDate;
          identityResults.age = getAge(birthDate);
        }
        form.setFieldsValue(identityResults);

        setCanSubmit(true);
        returnVal = {valid: true, invalidMsg: undefined};
      }
      setIdentityResult(returnVal);
      return returnVal;
    } else {
      return {};
    }
  }

  const validatePhone = (ev) => {
    let phone = ev.target.value.replaceAll(" ", "").replaceAll("-", "");
    if (!phone) {
      setCanSubmit(false);
      return false;
    }
    form.setFieldsValue({[ev.target.id]: phone}); // apply replacements
    let bool = /^1[3456789]\d{9}$/.test(phone);
    setIsPhoneValid(bool);
    setCanSubmit(bool);
    return bool;
  }

  const ratio = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };


  return (
    <Form form={form} {...ratio} onFinish={save} initialValues={staffData} colon={false} requiredMark={false} scrollToFirstError>
      <div className="ice ntf-spaced">
        <div className="body white-first repeat-2">
          <Form.Item
            name="s_identity"
            label="Identity number"
            rules={[
              {required: true, message: 'Identity is must'}
            ]}
            validateStatus={identityResult.invalidMsg ? "error" : undefined}
            help={identityResult.invalidMsg}
          >
            <Input
              disabled={isBound || !isEdit}
              onBlur={loadIdentityInfo}
              onPressEnter={loadIdentityInfo}
              onChange={() => {setIdentityResult({...identityResult, valid: undefined})}}
            />
          </Form.Item>

          <InfoField name="s_passport" label="Passport"
            fetch={fetch} disabled={!isEdit}/>

          <Form.Item name="s_sex" label="Gender">
            {isEdit ? (
              <Radio.Group
                name="s_sex"
                className="rubber"
                buttonStyle="solid"
                >
                <Radio.Button value="M">M</Radio.Button>
                <Radio.Button value="F">F</Radio.Button>
              </Radio.Group>
            ) : (
              <Input
                disabled
              />
            )}
          </Form.Item>

          <Form.Item name="age" label="Age">
            <Input
              readOnly
              disabled={!isEdit}
            />
          </Form.Item>

          <InfoField name="r_race" label="Race"
            fetch={fetch} disabled={!isEdit}/>

          <Form.Item name="s_birthday" label="Date of birth" className="half-width">
            <EmployeeDatePicker
              disabled={!isEdit}
              name="s_birthday"
              autoValue={fetch.s_birthday}
              setObj={obj => {form.setFieldsValue(obj)}}
              showToday={false}
            />
          </Form.Item>

          <Form.Item name="r_marry" label="Marital status">
            {isEdit ? (
              <Radio.Group
                name="r_marry"
                className="rubber"
                buttonStyle="solid"
                >
                <Radio.Button value="Single">Single</Radio.Button>
                <Radio.Button value="Married">Married</Radio.Button>
              </Radio.Group>
            ) : (
              <Input
                disabled
              />
            )}
          </Form.Item>

          <Form.Item
            name="s_phone"
            label="Phone number"
            rules={[
              {required: true, message: 'Phone is must'},
            ]}
            validateStatus={isPhoneValid ? undefined : "error"}
            help={isPhoneValid ? undefined : "Phone must be of format '155' + 8 digits"}
          >
            <Input
              disabled={!isEdit}
              onBlur={validatePhone}
              onPressEnter={validatePhone}
            />
          </Form.Item>

          <InfoField name="r_contact_address" label="Contact address"
            fetch={fetch} disabled={!isEdit}/>

          <Form.Item name="r_residence_type" label="Residence type">
            {isEdit ? (
              <Radio.Group
                name="r_residence_type"
                className="rubber"
                buttonStyle="solid"
                >
                <Radio.Button value="Urban">Urban</Radio.Button>
                <Radio.Button value="Rural">Rural</Radio.Button>
              </Radio.Group>
            ) : (
              <Input
                disabled
              />
            )}
          </Form.Item>

          <InfoField name="r_residence" label="Residence"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_cpemail" label="Email"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_ext" label="Extension"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_bank_name" label="Bank name"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_bank_account" label="Bank account"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_zipcode" label="Zip code"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_sb_account" label="Insurance No."
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_gjj_account" label="CPF account"
            fetch={fetch} disabled={!isEdit}/>

          <Form.Item name="r_edu" label="Education"
            className="half-width">
            <EmployeeDropdown
              disabled={!isEdit}
              options={eduOptions}
              name="r_edu"
              autoValue={fetch.r_edu}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          <InfoField name="r_guraduated_school" label="School"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_qq" label="Social network"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_personal_page" label="Website"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_language" label="Language"
            className="max-width-unset"
            fetch={fetch} disabled={!isEdit}/>

          <InfoField name="r_skills" label="Skills"
            className="max-width-unset"
            fetch={fetch} disabled={!isEdit}/>

          <div purpose="grey-if-fourth"/>
        </div>
      </div>

      <div className="ice">
        <div className="body white-first repeat-2">
          {extendFields && renderExtendFields(extendFields)}
          <div purpose="grey-if-fourth"/>
        </div>
      </div>
    </Form>
  )
}

export default Details1;