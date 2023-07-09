import { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { message, Card } from 'antd';
import { Link, history, useRequest, useModel } from 'umi';
import icon15 from '@/img/人员调动_turn-around.svg';
import icon32 from '@/img/电子签_dianziqian.svg';
import icon37 from '@/img/到期文件_file-date.svg';
import icon39 from '@/img/加载_loading.svg';
import { customerIndex, getStatistics, mawStaff, joinOutStaff, sbxzCostChange, companyStaffInfo } from './service';
import { hasVal } from '@/utils/utils';
import ChartInsuranceSalary from './ChartInsuranceSalary';
import ChartEmployment from './ChartEmployment';
import ChartDepartmentGender from './ChartDepartmentGender';
import Guide from '@/components/Guide';

function Index(props) {
  const { initialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState;
  const { vip, cid } = currentUser;
  let index;

  const indexRes = useRequest(() => customerIndex(),
    {
      formatResult: res => res,
    }
  );

  const joinInvitations = useRequest(() => getStatistics());

  if (indexRes.data && indexRes.data.status !== 0) {
    index = indexRes.data;
  }

  let currentDate = new Date();
  let month = new Array(12)
  for (let i=-5;i<=11;i++) {
    if(i<=-1) {
      month[i]=13+i
    }else{
      month[i]=1+i
    }
    month[i]=month[i]+""
  }
  let monthday = currentDate.getMonth()

  return (
    <>
      <Guide/>

      <Card className="top-section hello">
        <div className="hello2">
          <div>
            <div className="i1">HELLO !</div>
            <div className="i2">{currentUser.name}<span className="i3">, welcome back...</span></div>
            <div/>
            {index && <div className="i4">You have <span className="number">{index.onjobCount}</span> employees</div>}
          </div>
        </div>
        
        <div className="shortcuts">
          {index && <div>
            <Link to="/contract" className="ant-btn-primary">
              <img alt="" src={icon39} />
              Joined
              <div className="number">{hasVal(joinInvitations.data) ? joinInvitations.data : "-"}</div>
            </Link>

            <Link to="/contract" className="ant-btn-primary">
              <img alt="" src={icon37} />
              Employees
              <div className="number">{hasVal(index.contract_to_expire) ? index.contract_to_expire : "-"}</div>
            </Link>

            <Link to="/contract" className="ant-btn-primary">
              <img alt="" src={icon32} />
              Pending
              <div className="number">{hasVal(index.unexecuted_contract) ? index.unexecuted_contract : "-"}</div>
            </Link>

            <Link to="/contract" className="ant-btn-primary">
              <img alt="" src={icon15} />
              Suspended
              <div className="number">{hasVal(index.contract_try_end) ? index.contract_try_end : "-"}</div>
            </Link>
          </div>}
        </div>
      </Card>

      <div className="charts">
        <ChartInsuranceSalary month={month} monthday={monthday}/>
        <ChartEmployment month={month} monthday={monthday}/>
        <ChartDepartmentGender/>
      </div>
    </>
  );
};

export default connect(state => {
  return {
  };
})(Index);