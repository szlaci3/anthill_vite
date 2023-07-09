import { Button, Select, Form, Input, message, Popover } from 'antd';
import { hasVal } from '@/utils/utils';
import { getSocialPolicyCity, getSocialPolicyData } from '@/services/globalServices';
import { useState, useEffect } from 'react';
import { useRequest } from 'umi';
import { QuestionCircleFilled } from '@ant-design/icons';

const { Option } = Select;
let timeoutID;

const adjustables = [
  {label: "企业养老基数", spType: "基本养老", payer: "qyjs", name: "qy_yljs"},
  {label: "个人养老基数", spType: "基本养老", payer: "grjs", name: "gr_yljs"},
  {label: "企业医疗基数", spType: "基本医疗", payer: "qyjs", name: "qy_yliaojs"},
  {label: "个人医疗基数", spType: "基本医疗", payer: "grjs", name: "gr_yliaojs"},
  {label: "企业失业基数", spType: "基本失业", payer: "qyjs", name: "qy_syejs"},
  {label: "个人失业基数", spType: "基本失业", payer: "grjs", name: "gr_syejs"},
  {label: "企业工伤基数", spType: "基本工伤", payer: "qyjs", name: "qy_gsjs"},
  {label: "企业生育基数", spType: "基本生育", payer: "qyjs", name: "qy_syujs"},
];
const adjustablesLast2 = [
  {label: "企业公积金基数", spType: "公积金", payer: "qyjs", name: "qy_gjjjs"},
  {label: "个人公积金基数", spType: "公积金", payer: "grjs", name: "gr_gjjjs"}
];


function Details3(props) {
  const {
    form,
    staffData,
    fetch,
    isEdit,
    isBound,
    id,
    sbxzFieldHead,
    salaryInfoFieldHead,

    save,
  } = props;

  const [cities, setCities] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [spData, setSpData] = useState([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [enableNumberFields, setEnableNumberFields] = useState(false);
  const [insBase, setInsBase] = useState(false);
  const [socialCss, setSocialCss] = useState({});

  const ratio = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const citiesRes = useRequest(() => getSocialPolicyCity(),
      {
          formatResult: res => res.data,
      }
  );

  useEffect(() => {
    if (staffData.socialPolicy && staffData.socialPolicy.ss_city) {
      getPolicies(staffData.socialPolicy.ss_city);
    }
  }, [staffData.socialPolicy && staffData.socialPolicy.ss_city]);

  useEffect(() => {
    if (staffData.socialPolicy && staffData.socialPolicy.ss_name) {
      setEnableNumberFields(true);
    }
  }, [staffData.socialPolicy && staffData.socialPolicy.ss_name]);

  useEffect(() => {
    if (!citiesRes.data) {
      return false;
    }

    let cityList = citiesRes.data.split("@").map((str, i) => {
      if (str !== "") {
        let city = str.split("|");
        return city[0];
      }
    }).filter(str => !!str);
    setCities(cityList);
  }, [citiesRes.data]);


  const month = (staffData.sbxz && staffData.sbxz.month) ? (staffData.sbxz.month.slice(0, 4) + "年" + staffData.sbxz.month.slice(5, 7) + "月") : "";

  const onCityChange = async city => {
    form.setFieldsValue({socialPolicy: {ss_name: null}});
    setEnableNumberFields(false);
    getPolicies(city);
  }

  const getPolicies = async (city, countAttempt = 0) => {
    if (city === "(无)") {
      setIsLoadingPolicies(false);
      setPolicies([]);
      setSpData([]);
    } else {
      setIsLoadingPolicies(true);//disable policies Select
      const response = await getSocialPolicyData({city});

      setIsLoadingPolicies(false);
      if ((!response.data || !response.data[0])) {
        if (countAttempt < 4) {// if empty response, call repeatedly
          getPolicies(city, countAttempt + 1);
        } else {
          message.error("社保政策读取失败");
        }
      } else {
        setPolicies(response.data.map(item => item.sp_name));
        setSpData(response.data);
      }
    }
  }

  const onPolicyChange = policy => {
    onAdjustAll();
    setEnableNumberFields(true);
  }

  const onSimpleInputChange = (keyEvent, name, adjustType) => {
    keyEvent.target.onkeydown = ev => {
      if (ev.key === "Enter") {
        handleSimpleInputChange({name, value: ev.target.value, adjustType});
      }
    };
    keyEvent.target.onblur = ev => {
      handleSimpleInputChange({name, value: ev.target.value, adjustType});
    };
  }

  const handleSimpleInputChange = ({name, value, adjustType}) => {
    let myValue = value.trim();
    myValue = myValue === "" ? null : Number(value);
    myValue = isNaN(myValue) ? null : myValue;
    if (adjustType === 2) {
      if (+form.getFieldValue("socialPolicy").qy_gjjjs !== myValue || +form.getFieldValue("socialPolicy").gr_gjjjs !== myValue) {
        addHighlight(name);
      } 
      adjustSingle({name: "qy_gjjjs", value: myValue, adjustType: 2, allowWarning: name === "qy_gjjjs"});
      adjustSingle({name: "gr_gjjjs", value: myValue, adjustType: 2, allowWarning: name === "gr_gjjjs"});
    } else {
      adjustSingle({name, value: myValue, adjustType, allowWarning: true});
    }
  }

  const adjustSingle = ({name, value, adjustType, allowWarning}) => {
    const arr = adjustType === 2 ? adjustablesLast2 : adjustables;
    let fieldObj;
    for (let i=0; i<arr.length; i++) {
      if (arr[i].name === name) {
        fieldObj = arr[i];
        break;
      }
    }
    const myValue = getAdjustedValue({...fieldObj, value, allowWarning});// Allow warning if single (but adjustType 2 has a special case)
    form.setFieldsValue({socialPolicy: {[name]: myValue}});
  }

  const onAdjust = () => {
    onAdjustArray(adjustables);
  }

  const onAdjustLast2 = () => {
    onAdjustArray(adjustablesLast2);
  }

  const onAdjustAll = () => {
    onAdjustArray(adjustables.concat(adjustablesLast2));
  }

  const onAdjustArray = (arr) => {
    let socialPolicy = {};
    let css = {};
    arr.map((fieldObj, i) => {
      const {name} = fieldObj;
      socialPolicy[name] = getAdjustedValue({...fieldObj, value: insBase || 1, allowWarning: false});
      if (+form.getFieldValue("socialPolicy")[name] !== +socialPolicy[name]) {
        css[name] = "has-changed";
      } 
    });

    form.setFieldsValue({socialPolicy});
    setSocialCss(css);
  }

  const getAdjustedValue = ({label, spType, payer, name, value, allowWarning}) => {
    const socialPolicyObj = getSpByType(spType);
    if (typeof socialPolicyObj !== "undefined") {
      if (value !== "") {
        value = Number(value);
      }
      const min = socialPolicyObj[payer + "_min"];
      const max = socialPolicyObj[payer + "_max"];
      if (value !== 0 && value < min) {
        if (allowWarning) {
          message.warning("“" + label + "”最小为" + min);//adjusted to min accepted 3575
        }
        addHighlight(name);
        return min;
      } else if (value > max) {
        if (allowWarning) {
          message.warning("“" + label + "”最大为" + max);//adjusted to max accepted 4000
        }
        addHighlight(name);
        return max;
      } else {
        window.clearTimeout(timeoutID);
        timeoutID = window.setTimeout(() => {setSocialCss({})}, 2000);
        return value;
      }
    }
  }

  const addHighlight = name => {
    setSocialCss({...socialCss, [name]: "has-changed"});
    window.clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => {setSocialCss({})}, 2000);
  }

  const getSpByType = (spType) => {// "基本养老"(Pension Base)
    let socialPolicyObj;
    spData.map(item => {
      if (item.sp_name === form.getFieldValue('socialPolicy').ss_name) { // from ref, because at first call state.ss_name is not defined
        item.sp_parameter.map(param => {
          if (param.socialpolicy_type === spType) {
            socialPolicyObj = param;
            return;
          }
        }); 
        return;
      }
    });
    return socialPolicyObj;
  }

  const renderExtraFields = (fields) => {
    let list = [];
    for (let item in fields) {
      let readOnly = item === "column_field_1" && fields[item] === "税前工资";

      list.push(
        <Form.Item name={["salaryInfo", item]} label={fields[item]} key={item}>
          <Input
            disabled={!isEdit}
            readOnly={readOnly}
          />
        </Form.Item>
      );
    }

    return list;
  }



  return (
    <Form form={form} {...ratio} onFinish={save} initialValues={staffData} colon={false} scrollToFirstError>
      <div className="ice">
        <div className="title">{month + "社保薪资"}</div>
        <div className="body grey-first repeat-3">
          <Form.Item name={["sbxz", "qy_total"]} label="企业社保">
            <Input disabled={!isEdit} readOnly/>
          </Form.Item>

          {hasVal(id) && <Form.Item name={["sbxz", "column_field_1"]} label={sbxzFieldHead ? sbxzFieldHead.column_field_1 : ""}>
            <Input disabled={!isEdit} readOnly/>
          </Form.Item>}

          <Form.Item name={["sbxz", "qy_gjjjs"]} label="企业公积金">
            <Input disabled={!isEdit} readOnly/>
          </Form.Item>

          <Form.Item name={["sbxz", "gr_total"]} label="个人社保">
            <Input disabled={!isEdit} readOnly/>
          </Form.Item>

          {hasVal(id) && <Form.Item name={["sbxz", "column_field_4"]} label={sbxzFieldHead ? sbxzFieldHead.column_field_4 : ""}>
            <Input disabled={!isEdit} readOnly/>
          </Form.Item>}

          <Form.Item name={["sbxz", "gr_gjjjs"]} label="个人公积金">
            <Input disabled={!isEdit} readOnly/>
          </Form.Item>

          <div purpose="grey-if-fourth"/>
        </div>
      </div>

      <div className="ice">
        <div className="title">社保信息</div>

        <div className="body grey-first repeat-4">
          <Form.Item name={["socialPolicy", "ss_city"]} label="社保城市">
            <Select
              disabled={!isEdit}
              showArrow={isEdit}
              virtual={false}
              dropdownClassName="grid-options"
              onChange={onCityChange}
            >
              {cities.map(item => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name={["socialPolicy", "ss_name"]} label="社保政策" className={isEdit ? "is-edit" : ""}>
            <Select
              disabled={!isEdit || isLoadingPolicies}
              showArrow={isEdit && !isLoadingPolicies}
              loading={isLoadingPolicies}
              virtual={false}
              dropdownClassName="grid-options repeat-2"
              onChange={onPolicyChange}
            >
              {policies.map(item => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          {isEdit ? [
            <Form.Item key="b1" label={
              <span>
                社保基数 <Popover content="可填写年度平均工资">
                  <QuestionCircleFilled className="blue-question"/>
                </Popover>
              </span>}>
              <Input type="number" min={0} onChange={ev => setInsBase(ev.target.value)}/>
            </Form.Item>,

            <div key="b2" className="adjust">
              <Button type="primary" htmlType="button" disabled={!enableNumberFields} onClick={onAdjust}>智能调整</Button>
              <Button type="primary" htmlType="button" disabled={!enableNumberFields} onClick={onAdjustLast2}>公积金调整</Button>       
            </div>
          ] : [
            <div purpose="grey-if-third" key="b1"/>,
            <div purpose="grey-if-fourth" key="b2"/>
          ]}

          <Form.Item name={["socialPolicy", "qy_yljs"]} label="企业养老基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "qy_yljs", 1)}} className={socialCss.qy_yljs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "qy_yliaojs"]} label="企业医疗基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "qy_yliaojs", 1)}} className={socialCss.qy_yliaojs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "qy_syejs"]} label="企业失业基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "qy_syejs", 1)}} className={socialCss.qy_syejs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "qy_gsjs"]} label="企业工伤基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "qy_gsjs", 1)}} className={socialCss.qy_gsjs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "qy_syujs"]} label="企业生育基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "qy_syujs", 1)}} className={socialCss.qy_syujs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "qy_gjjjs"]} label="企业公积金基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "qy_gjjjs", 2)}} className={socialCss.gr_gjjjs + " " + socialCss.qy_gjjjs/*this is trick*/}/>
          </Form.Item>

          <div purpose="grey-if-third"/>
          <div purpose="grey-if-fourth"/>


          <Form.Item name={["socialPolicy", "gr_yljs"]} label="个人养老基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "gr_yljs", 1)}} className={socialCss.gr_yljs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "gr_yliaojs"]} label="个人医疗基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "gr_yliaojs", 1)}} className={socialCss.gr_yliaojs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "gr_syejs"]} label="个人失业基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "gr_syejs", 1)}} className={socialCss.gr_syejs}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "gr_gjjjs"]} label="个人公积金基数">
            <Input disabled={!isEdit} readOnly={!enableNumberFields} onChange={ev => {onSimpleInputChange(ev, "gr_gjjjs", 2)}} className={socialCss.gr_gjjjs + " " + socialCss.qy_gjjjs}/>
          </Form.Item>


          <Form.Item name={["socialPolicy", "ss_start"]} label="社保起缴月">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "ss_end"]} label="社保止缴月">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "gjj_start"]} label="公积金起缴月">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "gjj_end"]} label="公积金止缴月">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "bcgjj_start"]} label="补充公积金起缴月">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>

          <Form.Item name={["socialPolicy", "bcgjj_end"]} label="补充公积金止缴月">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>

          <div purpose="grey-if-fourth"/>
        </div>
      </div>

      {salaryInfoFieldHead && JSON.stringify(salaryInfoFieldHead) !== '{}' && <div className="ice">
        <div className="title">薪资信息</div>

        <div className="body grey-first repeat-3">

          {renderExtraFields(salaryInfoFieldHead)}
          <div purpose="grey-if-second"/>
          <div purpose="grey-if-third"/>
        </div>
      </div>}
    </Form>
  )
}

export default Details3;