import STabs from '@/components/STabs';
import { getStaffInfo, getTableField, getTabsInfo, getDeductionInfo, saveStaffInfo } from './service';
import { useRequest, history } from 'umi';
import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Radio, Checkbox, DatePicker, message, Modal, Select } from 'antd';
import { ReactComponent as BackArrow } from '@/img/左-小_left-small.svg';
import { ReactComponent as EditIcon } from '@/img/编辑_editor.svg';
import clockIcon from '@/img/时间_time.svg';
import { toArrayIfPossible, hasVal, eduOptions, contractTypeOptions } from '@/utils/utils';
import Details1 from './Details1';
import Details2 from './Details2';
import Details3 from './Details3';
import Details4 from './Details4';
import EmployeeDropdown from '@/components/EmployeeDropdown';
import InfoField from './InfoField';
import DataSwapper from './DataSwapper';

const {Option} = Select;

let a = document.createElement('div');
a.style.overflow = "scroll";
document.body.appendChild(a);
let scrollbarWidth = a.offsetWidth - a.clientWidth;// scrollbarSize is 0, needs correction.
document.body.removeChild(a);

const defaultData = {
  s_job_state: "Active",
  r_career_type: "Full-time",
  r_edu: "junior high school",
  r_marry: "Single",
  r_residence_type: "Urban",
}

function EmployeeDetails(props) {
  const [form] = Form.useForm();
  
  const {id} = props.match.params;
  const {isDismissed, isBound} = props.location.state || {};

  const [isEdit, setIsEdit] = useState(!hasVal(id));
  const [displayDepartment, setDisplayDepartment] = useState(false);
  const [displayUpdateFields, setDisplayUpdateFields] = useState(false);
  const [displaySalaryWish, setDisplaySalaryWish] = useState(false);
  const [displayDataSwapper, setDisplayDataSwapper] = useState();
  const [dataForSwapper, setDataForSwapper] = useState();
  const [hasValuesToSwap, setHasValuesToSwap] = useState(false);

  const [staffData, setStaffData] = useState(defaultData);
  const [fetch, setFetch] = useState({});
  const [picture, setPicture] = useState("trigger_error");
  const [sName, setSName] = useState();
  const [fidPid, setFidPid] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [isInfoLoaded, setIsInfoLoaded] = useState(!hasVal(id));
  const [originalExtendValues, setOriginalExtendValues] = useState({});
  const [extendFields, setExtendFields] = useState({});
  const [deduction, setDeduction] = useState({});
  
  const [adminText, setAdminText] = useState();
  const [isAdminToDismiss, setIsAdminToDismiss] = useState();

  const tableFieldRes = useRequest(() => getTableField(),
      {
          formatResult: res => res.data,
      }
  );
  let infoRes;
  let tabsRes;
  let deductionRes;
  let sbxzFieldHead = {};
  let salaryInfoFieldHead = {};

  const getDefaultPicture = sex => {
    return require("@/img/user-" + (sex === "女" ? "female" : "male") + ".jpg");      
  }

  if (hasVal(id)) {
    infoRes = useRequest(() => getStaffInfo({id}),
        {
            formatResult: res => res.data,
        }
    );

    tabsRes = useRequest(() => getTabsInfo({id}),
        {
            formatResult: res => res,
        }
    );

    deductionRes = useRequest(() => getDeductionInfo({sid: id}),
        {
            formatResult: res => res.data,
        }
    );

    const getAge = (birthDate) => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return isNaN(age) ? (staffData.age || "") : age;
    }

    useEffect(() => {
      if (!infoRes.data) {
        return false;
      }

      let otherInfo = JSON.parse(infoRes.data.staffData.s_other_info || "[]");
      let myStaffData = {...defaultData, ...otherInfo[0], ...otherInfo[1], ...infoRes.data.staffData};
      let myFetch = infoRes.data.memberData || {};
      myStaffData.extendValues = JSON.parse(myStaffData.s_info_info || "{}");
      myStaffData.socialPolicy = JSON.parse(myStaffData.s_social_info || "{}");
      myStaffData.age = getAge(new Date(myStaffData.s_birthday));
      myStaffData.r_career_type = myStaffData.r_career_type === "Part-time" ? "Part-time" : "Full-time";
      
      delete myStaffData.s_info_info;
      delete myStaffData.s_social_info;
      delete myFetch.r_standby_phone;//r_standby_phone never used and disturbs in disabling fetch button.


      setStaffData({...staffData, ...myStaffData});
      setOriginalExtendValues(myStaffData.extendValues);
      setFetch(myFetch);
      setSName(myStaffData.s_name);

      let photo = getDefaultPicture(myStaffData.s_sex);
      if (infoRes.data.headimg) {
        photo = infoRes.data.headimg;
        // photo = infoRes.data.headimg.slice(0, 4) === "http" ? infoRes.data.headimg.replace("http:", "https:") : (rootUrl + infoRes.data.file + "m_" + infoRes.data.headimg);
      }
      setPicture(photo);
      setFidPid({fid: myStaffData.fid, pid: myStaffData.pid});
      setCanSubmit(true);
      setIsInfoLoaded(true);
    }, [infoRes.data]);


    /* 1.
       Get values only once, when tabsRes.data is received. 
       Add the values to state.
       Let Form render only after and use initialValues.
    */
    useEffect(() => {
      if (!tabsRes.data) {
        return false;
      }

      setStaffData({
        ...staffData,
        sbxz: tabsRes.data.sbxz.data || {},
        salaryInfo: tabsRes.data.salaryinfo.data,
      });
    }, [tabsRes.data]);

    useEffect(() => {
      if (!deductionRes.data) {
        return false;
      }

      setDeduction(deductionRes.data);
    }, [deductionRes.data]);

    /* 2.
       Get fields: runs this code at each render.
       Simple variables (not state).
       Form renders without these fields, and updates when fields arrive.
    */
    if (tabsRes.data) {
      sbxzFieldHead = tabsRes.data.sbxz.fieldHead;
      salaryInfoFieldHead = tabsRes.data.salaryinfo.tablehead;
    }
  }

  useEffect(() => {
    if (tableFieldRes.data) {
      setExtendFields(tableFieldRes.data);
    }
  }, [tableFieldRes.data]);

  useEffect(() => {
    for (let name in fetch) {
      if (form.getFieldValue(name) !== fetch[name] && fetch[name] !== "") {
        setHasValuesToSwap(true);
        return;
      }
    }
    setHasValuesToSwap(false);
  }, [form.getFieldsValue(), fetch]);

  const save = (data) => {
    if (hasVal(id)) {
      update(data);
    } else {
      add(data);
    }
  }

  const add = async (data) => {
    let params = {
      ...data,
      s_sex: data.s_sex || "女",
      s_salary_info: JSON.stringify(data.salaryInfo),
      s_other_info: JSON.stringify([
        {table_field_1: data.table_field_1, table_field_2: data.table_field_2 || ""},
        {fid: fidPid.fid, pid: fidPid.pid}
      ]),
      s_social_info: JSON.stringify(data.socialPolicy),
      s_info_info: JSON.stringify(data.extendValues),
      s_job_state: "Active",
    };

    delete params.salaryInfo;
    delete params.extendValues;
    delete params.socialPolicy;
    delete params.sbxz;

    const saveRes = await saveStaffInfo(params);
    if (saveRes.code != 0) {
      message.success(saveRes.msg);
      setIsEdit(false);
      // history.push("/staff/employee/overview", {sort_type: "desc"});
    }
  };

  const update = async (data) => {
    let mainData = {};
    for (let i in data) {
      mainData[i] = data[i] === null ? "" : data[i];
    }
    let params = {
      ...mainData,
      s_id: staffData.s_id,
      s_sex: data.s_sex || "女",
      s_compamyid: staffData.s_compamyid,
      start_time: data.start_time && data.start_time.format("YYYY-MM-DD"),
      now_salary: hasVal(data.now_salary) ? data.now_salary : (hasVal(staffData.now_salary) ? staffData.now_salary : staffData.before_salary),
      type: 1,

      s_info_info: JSON.stringify(data.extendValues),
      s_other_info: JSON.stringify([
        {table_field_1: data.table_field_1, table_field_2: data.table_field_2 || ""},
        {fid: fidPid.fid, pid: fidPid.pid}
      ]),
      s_social_info: JSON.stringify(data.socialPolicy),
      s_salary_info: JSON.stringify({...data.salaryInfo}),
      // These were coming from editRow in the old website, so they were sent, but no need: First is instead s_salary_info above.
      // s_salary_info: JSON.stringify({...data.salaryInfo, staffname: data.salaryInfo.staffname}),
      // id: staffData.s_id,
      // s_add_time: staffData.s_add_time,
      // r_id: staffData.r_id,
      // r_staffid: staffData.r_staffid,
      // fid: fidPid.fid,
      // pid: fidPid.pid,
    };
    delete params.salaryInfo;
    delete params.extendValues;
    delete params.socialPolicy;
    delete params.sbxz;

    const saveRes = await saveStaffInfo(params);
    if (saveRes.code != 0) {
      setStaffData({...staffData, ...data});
      setOriginalExtendValues(data.extendValues);
      setIsEdit(false);
      setDisplayDepartment(false);
      message.success(saveRes.msg);
    }
  };

  const saveSwapper = async (values) => {
    let keptValues = {...staffData};
    let s_sex = values.s_sex || form.getFieldValue("s_sex") || "女";

    delete keptValues.s_dimission_date;

    let params = {
      ...keptValues,
      ...values,
      type: 1,
      s_sex,

      s_salary_info: JSON.stringify(staffData.salaryInfo),
      s_info_info: JSON.stringify(staffData.extendValues),
      s_other_info: JSON.stringify([
        {table_field_1: staffData.table_field_1, table_field_2: staffData.table_field_2 || ""},
        {fid: fidPid.fid, pid: fidPid.pid}
      ]),
      s_social_info: JSON.stringify(staffData.socialPolicy),
    };
    delete params.salaryInfo;
    delete params.extendValues;
    delete params.socialPolicy;
    delete params.sbxz;

    const saveRes = await saveStaffInfo(params);
    if (saveRes.code != 0) {
      setStaffData({...staffData, ...values, s_sex});
      message.success(saveRes.msg);
      form.setFieldsValue({...values, s_sex});
    }
  };

  const whetherAdmin = async () => {
  }

  const selectDepartment = (ev) => {
    let new_table_field_1 = ev.currentTarget.dataset.name;

    let table_field_1 = form.getFieldValue("table_field_1");
    form.setFieldsValue({
      "table_field_1": new_table_field_1,
    });
    setFidPid({
      fid: ev.currentTarget.dataset.fid,
      pid: ev.currentTarget.dataset.pid,
    });
    if (new_table_field_1 !== table_field_1 && hasVal(id)) {
      setDisplayUpdateFields(true);
    }
  }

  const cancelEdit = () => {
    let extendValues = {};
    for (let i in extendFields) {
      extendValues[i] = originalExtendValues[i];
    }

    setIsEdit(false);
    setDisplaySalaryWish(false);
    setDisplayUpdateFields(false);
    setFidPid({fid: staffData.fid, pid: staffData.pid});

    form.setFieldsValue({
      ...staffData,
      table_field_1: staffData.table_field_1,// must send undefined when missing
      table_field_2: staffData.table_field_2,
      extendValues,
      age: undefined,
      now_salary: undefined,
      start_time: undefined,
      reason: undefined,
    });
  }

  const toggleSalaryWish = ev => {
    if (!ev.target.checked) {
      form.setFieldsValue({now_salary: undefined});
      // make column_field_1 independent again:
      form.setFieldsValue({salaryInfo: {column_field_1: staffData.salaryInfo && staffData.salaryInfo.column_field_1}});
    }
    setDisplaySalaryWish(ev.target.checked);
  }

  const openDataSwapper = () => {
    const values = form.getFieldsValue();
    setDataForSwapper(values);
    setDisplayDataSwapper(true);
  }

  if (!isInfoLoaded || (hasVal(id) && !staffData.salaryInfo)) {
    return <div/>
  }

  const onJobStateChange = (ev) => {
    if (ev.target.value === "离职") {
      whetherAdmin();
    }
    form.setFieldsValue({s_job_state: "Active"});
    setStaffData({...staffData, s_job_state: "Active"});
  }


  return (
    <>
      <Card className="uppermost-section">
        <BackArrow className="back-arrow" onClick={history.goBack}/>
        <div className="t3">Add / Edit Employee Data</div>

        <div className="edit-btns">
          {isEdit ? (
            <Form form={form} onFinish={save} scrollToFirstError>
              <Button className="tall oper-1 btn-negative" onClick={hasVal(id) ? cancelEdit : history.goBack}>
                Cancel
              </Button>
              <Button type="primary" className="tall oper-1" htmlType="submit" disabled={!canSubmit}>
                Save
              </Button>
            </Form>
          ) : (
            <Button type="primary" className="tall oper-1" onClick={() => setIsEdit(true)} icon={<EditIcon/>}>
              Edit
            </Button>
          )}
        </div>
      </Card>
      
      <div className="employee tableless-page" style={{paddingRight: `${30 - scrollbarWidth}px`}}>
        <Card className="above-tabs ice-card">
          <div>
            <img className="employee-header-img" src={picture} onError={(ev) => {ev.target.src = getDefaultPicture(staffData.s_sex)}} alt="" />
 
            <Form form={form} onFinish={save} initialValues={staffData} colon={false} requiredMark={false} scrollToFirstError>
              <Form.Item name="s_name" className="s-name"
                rules={[
                  {required: true, message: 'Please provide First & Last Name'}
                ]}
              >
                <Input
                  disabled={!isEdit}
                  placeholder="Name"
                  onChange={ev => {setSName(ev.target.value)}}
                  style={{width: `${(sName || "").length + 3}em`}}
                />
              </Form.Item>

              <div>
                <Modal
                  maskClosable={false}
                  title={adminText || ""}
                  visible={adminText}
                  onCancel={() => {setAdminText()}}
                  onOk={() => {setAdminText();}}
                  okText="确认"
                  centered={true}
                  closeIcon={<span className="close-x">&times;</span>}
                  width={800}
                  className="narrow-header-modal"
                />

                <DataSwapper
                  visible={displayDataSwapper}
                  data={dataForSwapper}
                  fetch={fetch}
                  onClosePopup={() => {
                    setDisplayDataSwapper(false);
                    window.setTimeout(() => {
                      setDataForSwapper()
                    }, 350);
                  }}
                  saveSwapper={saveSwapper}
                />

                <Button type="text" className="blue btn-elephant align3" onClick={whetherAdmin} disabled={isEdit || staffData.s_job_state === "离职"}>
                  Dimission
                </Button>
                <Button type="text" className="blue btn-elephant" onClick={openDataSwapper} disabled={!hasValuesToSwap}>
                  Auto Fill
                </Button>
                <span className="swapper-instructions">(One-click application of previously filled in data)</span>
              </div>
              <div className="sep1"/>

              <Input.Group className="employee-line-3">
                <InfoField name="s_job_city" label="City"
                  fetch={fetch} disabled={!isEdit}/>

                <Form.Item name="r_career_type" label="Career type" className="rubber-wrapper">
                  {isEdit ? (
                    <Radio.Group
                      name="r_career_type"
                      className="rubber"
                      buttonStyle="solid"
                      >
                      <Radio.Button value="full">Full-time</Radio.Button>
                      <Radio.Button value="part">Part-time</Radio.Button>
                    </Radio.Group>
                  ) : (
                    <Input
                      disabled
                    />
                  )}
                </Form.Item>

                <Form.Item name="s_job_state" label="Job status" className="rubber-wrapper">
                  {!isEdit ? (
                    <Input
                      disabled
                    />
                  ) : (
                    <Radio.Group
                      name="s_job_state"
                      className="rubber"
                      buttonStyle="solid"
                      >
                      <Radio.Button value="Active">Active</Radio.Button>
                      <Radio.Button value="Dismissed">Dismissed</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>

                <Form.Item name="table_field_1" label="Department"
                  rules={[
                    {required: true, message: 'Department is must'}
                  ]}
                >
                  {isEdit ? (
                    <Select>
                      <Option value="HR"/>
                      <Option value="IT"/>
                      <Option value="Research"/>
                      <Option value="Marketing"/>
                    </Select>
                  ) : (
                    <Input
                      disabled
                    />
                  )}
                </Form.Item>
 
                <Form.Item name="table_field_2" label="Position">
                  <Input
                    disabled={!isEdit}
                  />
                </Form.Item>

                {isEdit && <div className="salary-wish-checkbox">
                  <Checkbox checked={displaySalaryWish} onChange={toggleSalaryWish}>Pay raise</Checkbox>
                </div>}

                {displaySalaryWish && <Form.Item name="before_salary" label="Current salary"
                    rules={[{
                      validator: ((_, value) => !isNaN(value) ? Promise.resolve() : Promise.reject(new Error('Must be number')))
                    }]}>
                  <Input
                    disabled={!isEdit}
                  />
                </Form.Item>}

                {displaySalaryWish && <Form.Item name="now_salary" label="New salary"
                    rules={[{
                      validator: ((_, value) => !isNaN(value) ? Promise.resolve() : Promise.reject(new Error('Must be number')))
                    }]}>
                  <Input
                    disabled={!isEdit}
                    onChange={ev => form.setFieldsValue({salaryInfo: {column_field_1: ev.target.value}})}
                  />
                </Form.Item>}

                {displayUpdateFields && <Form.Item name="start_time" label="Update starts">
                  <DatePicker
                    disabled={!isEdit}
                    suffixIcon={isEdit && <img alt="" src={clockIcon} />}
                    className="icon-is-clock"
                  />
                </Form.Item>}

                {displayUpdateFields && <Form.Item name="reason" label="Update reason">
                  <Input
                    disabled={!isEdit}
                  />
                </Form.Item>}
              </Input.Group>
            </Form>

          </div>
        </Card>

        <STabs
          tabs={[{
            name: "Basic Information",
            content: (
              <Details1
                form={form}
                staffData={staffData}
                fetch={fetch}
                isEdit={isEdit}
                extendFields={extendFields}
                isBound={isBound}

                save={save}
                setCanSubmit={setCanSubmit}
              />
            )
          }, {
            name: "Employee Records",
            content: (
              <Details2
                form={form}
                staffData={staffData}
                fetch={fetch}
                isEdit={isEdit}
                id={id}

                save={save}
              />
            )
          }, {
            name: "Social Security",
            content: (
              <Details3
                form={form}
                staffData={staffData}
                isEdit={isEdit}
                id={id}
                sbxzFieldHead={sbxzFieldHead}
                salaryInfoFieldHead={salaryInfoFieldHead}

                save={save}
              />
            )
          }, {
            name: "Deduction Information",
            content: (
              <Details4
                deduction={deduction}
                isEdit={isEdit}
              />
            )
          }]}/>
      </div>
    </>
  );
}

export default EmployeeDetails;