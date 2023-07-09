import { Form } from 'antd';


function Details4(props) {
  const {
    deduction,
    isEdit,
  } = props;

  if (!deduction || !deduction.education_children) {
    return <div/>
  }

  const eachEducation = (education, i) => {
    return <div key={i} className="body grey-first repeat-3 sub-fragment">
      <div className="dedu-field">
        <label>子女姓名</label>
        <span>{education.f_name}</span>
      </div>
      <div className="dedu-field">
        <label>子女身份证件类型</label>
        <span>{education.f_card_type}</span>
      </div>
      <div className="dedu-field">
        <label>子女身份证件号码</label>
        <span>{education.f_card}</span>
      </div>
      <div className="dedu-field">
        <label>出生日期</label>
        <span>{education.f_birthday}</span>
      </div>
      <div className="dedu-field">
        <label>国籍（地区）</label>
        <span>{education.e_country}</span>
      </div>
      <div className="dedu-field">
        <label>当前受教育阶段</label>
        <span>{education.e_stage}</span>
      </div>
      <div className="dedu-field">
        <label>当前受教育阶段起始日期</label>
        <span>{education.e_begin}</span>
      </div>
      <div className="dedu-field">
        <label>预计当前受教育阶段结束日期</label>
        <span>{education.e_end}</span>
      </div>
      <div className="dedu-field">
        <label>教育终止日期</label>
        <span>{education.e_finish}</span>
      </div>
      <div className="dedu-field">
        <label>当前就读国家（地区）</label>
        <span>{education.e_country}</span>
      </div>
      <div className="dedu-field">
        <label>当前就读学校</label>
        <span>{education.e_school}</span>
      </div>
      <div className="dedu-field">
        <label>扣除比例</label>
        <span>{education.e_percentage}</span>
      </div>

      <div purpose="grey-if-fourth"/>
    </div>
  }

  const eachTraining = (training, i) => {
    if (training.e_type == 1) {
      return <div key={i} className="body grey-first repeat-3 sub-fragment">
        <div className="dedu-field">
          <label>当前继续教育起始日期</label>
          <span>{training.e_begin}</span>
        </div>
        <div className="dedu-field">
          <label>预计当前继续教育结束日期</label>
          <span>{training.e_end}</span>
        </div>
        <div className="dedu-field">
          <label>教育阶段</label>
          <span>{training.e_stage}</span>
        </div>
      </div>
    } else {
      return <div key={i} className="body grey-first repeat-3 sub-fragment">
        <div className="dedu-field">
          <label>继续教育类型</label>
          <span>{training.e_stage}</span>
        </div>
        <div className="dedu-field">
          <label>发证（批准）日期</label>
          <span>{training.e_finish}</span>
        </div>
        <div className="dedu-field">
          <label>证书名称</label>
          <span>{training.e_certificate_name}</span>
        </div>
        <div className="dedu-field">
          <label>证书编号</label>
          <span>{training.e_certificate_number}</span>
        </div>
        <div className="dedu-field">
          <label>发证机关</label>
          <span>{training.e_school}</span>
        </div>
      </div>
    }
  }

  const eachCareParent = (parent, i) => {
    return <div key={i} className="body grey-first repeat-3 sub-fragment">
      <div className="dedu-field">
        <label>被赡养姓名</label>
        <span>{parent.f_name}</span>
      </div>
      <div className="dedu-field">
        <label>被赡养人身份证件类型</label>
        <span>{parent.f_card_type}</span>
      </div>
      <div className="dedu-field">
        <label>被赡养人身份证件号码</label>
        <span>{parent.f_card}</span>
      </div>
      <div className="dedu-field">
        <label>被赡养人国籍（地区）</label>
        <span>{parent.f_nationality}</span>
      </div>
      <div className="dedu-field">
        <label>与被赡养人关系</label>
        <span>{parent.f_type}</span>
      </div>
      <div className="dedu-field">
        <label>被赡养人出生日期： </label>
        <span>{parent.f_birthday}</span>
      </div>
    </div>
  }

  const eachCareChild = (child, i) => {
    return <div key={i} className="body grey-first repeat-3 sub-fragment">
      <div className="dedu-field">
        <label>其他子女姓名</label>
        <span>{child.f_name}</span>
      </div>
      <div className="dedu-field">
        <label>其他子女身份证件类型</label>
        <span>{child.f_card_type}</span>
      </div>
      <div className="dedu-field">
        <label>其他子女身份证件号码</label>
        <span>{child.f_card}</span>
      </div>
      <div className="dedu-field">
        <label>其他子女国籍（地区）</label>
        <span>{child.f_nationality}</span>
      </div>
    </div>
  }


  return (
    <Form colon={false} className={"details-4" + (isEdit ? " is-edit" : "")} scrollToFirstError>
      <div className="ice">
        {/* EDUCATION */}
        <div className="title">子女教育</div>            

        {deduction.education_children.map(eachEducation)}
      </div>
      
      <div className="ice">
        {/* TRAINING */}
        <div className="title">继续教育-学历(学位)继续教育</div>

        {deduction.education_self.map(eachTraining)}
      </div>
      <div className="ice">
        {/* MEDICAL */}
        <div className="title">大病医疗</div>

        <div className="body grey-first repeat-3 sub-fragment">
          <div className="dedu-field">
            <label>目前总医疗金额</label>
            <span>￥<b>{deduction.ill}</b></span>
          </div>
          <div purpose="grey-if-second"/>
          <div purpose="grey-if-third"/>
        </div>
      </div>
      {deduction.house[0] && (
        <div className="ice">
          {/* HOUSING */}
          <div className="title">住房贷款利息</div>

          <div className="body grey-first repeat-3 sub-fragment">
            <div className="dedu-field">
              <label>房屋坐落地址</label>
              <span>{deduction.house[0].h_address}</span>
            </div>
            <div className="dedu-field">
              <label>具体地址</label>
              <span>{deduction.house[0].h_specific_address}</span>
            </div>
            <div className="dedu-field">
              <label>是否借款人</label>
              <span>{deduction.house[0].h_self}</span>
            </div>
            <div className="dedu-field">
              <label>房屋证书类型</label>
              <span>{deduction.house[0].h_certificate_type}</span>
            </div>
            <div className="dedu-field">
              <label>房屋证书号码</label>
              <span>{deduction.house[0].h_certificate}</span>
            </div>
            <div className="dedu-field">
              <label><span>是否婚前各自首套房贷款</span>且婚后分别扣除50%</label>
              <span>{deduction.house[0].h_half}</span>
            </div>
            <div className="dedu-field">
              <label>贷款合同编号</label>
              <span>{deduction.house[0].h_contract}</span>
            </div>
            <div className="dedu-field">
              <label>贷款银行</label>
              <span>{deduction.house[0].h_bank}</span>
            </div>
            <div className="dedu-field">
              <label>贷款期数（月数）</label>
              <span>{deduction.house[0].h_repayment_months}</span>
            </div>
            <div className="dedu-field">
              <label>首次还款日期</label>
              <span>{deduction.house[0].h_first_repayment_date}</span>
            </div>
          </div>
        </div>
      )}
      {deduction.renting[0] && (
        <div className="ice">
          {/* RENT */}
          <div className="title">住房租金</div>

          <div className="body grey-first repeat-3 sub-fragment">
            <div className="dedu-field">
              <label>主要工作省份</label>
              <span>{deduction.renting[0].renting_work_province}</span>
            </div>
            <div className="dedu-field">
              <label>主要工作城市</label>
              <span>{deduction.renting[0].renting_work_city}</span>
            </div>
            <div className="dedu-field">
              <label>出租类型</label>
              <span>{deduction.renting[0].renting_type}</span>
            </div>
            <div className="dedu-field">
              <label><span>出租方姓名</span>组织名称</label>
              <span>{deduction.renting[0].renting_name}</span>
            </div>
            <div className="dedu-field">
              <label>出租方证件类型</label>
              <span>{deduction.renting[0].renting_certificates_type}</span>
            </div>
            <div className="dedu-field">
              <label><span>身份证件号码</span>统一社会信用代码</label>
              <span>{deduction.renting[0].renting_card}</span>
            </div>
            <div className="dedu-field">
              <label>住房坐落地址</label>
              <span>{deduction.renting[0].renting_address}</span>
            </div>
            <div className="dedu-field">
              <label>具体地址</label>
              <span>{deduction.renting[0].renting_specific_address}</span>
            </div>
            <div className="dedu-field">
              <label>住房租赁合同编号</label>
              <span>{deduction.renting[0].renting_num}</span>
            </div>
            <div className="dedu-field">
              <label>租赁期起</label>
              <span>{deduction.renting[0].renting_begin}</span>
            </div>
            <div className="dedu-field">
              <label>租赁期止</label>
              <span>{deduction.renting[0].renting_end}</span>
            </div>
          </div>
        </div>
      )}
      {deduction.pension && <div className="ice">
        {/* ELDERLY */}
        <div className="title">赡养老人</div>

        <div className="body grey-first repeat-3 sub-fragment">
          <div className="dedu-field">
            <label>是否独生子女</label>
            <span>{deduction.pension.top && deduction.pension.top.f_is_only}</span>
          </div>
          <div className="dedu-field">
            <label>分摊方式</label>
            <span>{deduction.pension.top && deduction.pension.top.f_apportionment_type}</span>
          </div>
          <div className="dedu-field">
            <label>本年度月扣除金额</label>
            <span>￥<b>{deduction.pension.top && deduction.pension.top.f_cost}</b></span>
          </div>
        </div>
        {deduction.pension.parent && deduction.pension.parent.map(eachCareParent)}
        {deduction.pension.children && deduction.pension.children.map(eachCareChild)}
      </div>}
    </Form>
  )
}

export default Details4;