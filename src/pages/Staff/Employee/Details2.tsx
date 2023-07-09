import { Form, Input } from 'antd';
import EmployeeDropdown from '@/components/EmployeeDropdown';
import EmployeeDatePicker from '@/components/EmployeeDatePicker';
import { hasVal, contractTypeOptions } from '@/utils/utils';

function Details2(props) {
  const {
    form,
    staffData,
    fetch,
    isEdit,
    isBound,
    id,

    save,
  } = props;

  const ratio = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <Form form={form} {...ratio} onFinish={save} initialValues={staffData} colon={false} scrollToFirstError>
      <div className="ice">
        <div className="body white-first repeat-2">

          <Form.Item name="s_induction_date" label="入职时间" className="half-width">
            <EmployeeDatePicker
              name="s_induction_date"
              disabled={!isEdit}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          <Form.Item name="r_formal_date" label="入职时间" className="half-width">
            <EmployeeDatePicker
              name="r_formal_date"
              disabled={!isEdit}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          {hasVal(id) && <Form.Item name="serve_year" label="服务年限">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>}

          <Form.Item name="r_work_age" label="工龄">
            <Input disabled={!isEdit}/>
          </Form.Item>

          <Form.Item name="s_contract_name" label="合同名称">
            <Input disabled={!isEdit}/>
          </Form.Item>

          <Form.Item name="s_contract_type" label="合同类型"
            className="half-width">
            <EmployeeDropdown
              disabled={!isEdit}
              options={contractTypeOptions}
              name="s_contract_type"
              autoValue={fetch.s_contract_type}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          <Form.Item name="s_contract_start" label="合同起始日" className="half-width">
            <EmployeeDatePicker
              name="s_contract_start"
              disabled={!isEdit}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          <Form.Item name="s_contract_end" label="合同到期日" className="half-width">
            <EmployeeDatePicker
              name="s_contract_end"
              disabled={!isEdit}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          {hasVal(id) && <Form.Item name="r_contract_num" label="合同次数">
            <Input disabled={!isEdit} readOnly={true}/>
          </Form.Item>}

          <Form.Item name="s_contract_try_end" label="试用结束日期" className="half-width">
            <EmployeeDatePicker
              name="s_contract_try_end"
              disabled={!isEdit}
              setObj={obj => {form.setFieldsValue(obj)}}
            />
          </Form.Item>

          <Form.Item name="r_holiday_year" label="年休假">
            <Input disabled={!isEdit}/>
          </Form.Item>

          {hasVal(id) && [
            <Form.Item name="r_insurance_name" label="保险类型" key="l1">
              <Input disabled={!isEdit} readOnly={true}/>
            </Form.Item>,

            <Form.Item name="r_examination_time" label="体检时间" key="l2" className="half-width">
              <EmployeeDatePicker
                name="r_examination_time"
                disabled={!isEdit}
                setObj={obj => {form.setFieldsValue(obj)}}
              />
            </Form.Item>,

            <Form.Item name="r_insurance_date_isbool" label="预约体检" key="l3">
              <Input disabled={!isEdit} readOnly={true}/>
            </Form.Item>,

            <Form.Item name="leave" label="请假" key="l4">
              <Input disabled={!isEdit} readOnly={true}/>
            </Form.Item>,

            <Form.Item name="absence" label="缺勤" key="l5">
              <Input disabled={!isEdit} readOnly={true}/>
            </Form.Item>
          ]}
          
          <Form.Item name="r_foul_num" label="违纪次数">
            <Input disabled={!isEdit}/>
          </Form.Item>

          <Form.Item name="r_award_num" label="奖励次数">
            <Input disabled={!isEdit}/>
          </Form.Item>

          <div purpose="grey-if-fourth"/>
        </div>
      </div>
    </Form>
  )
}

export default Details2;