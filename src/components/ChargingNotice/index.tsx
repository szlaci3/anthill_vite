import { useState } from 'react';
import { Modal, Checkbox } from 'antd';
import { useModel, Link } from 'umi';
import { readed } from './service';

function ChargingNotice(props) {
  const { initialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState;
  const { cid } = currentUser;

  const [visible, setVisible] = useState(true);
  const [iKnow, setIKnow] = useState(false);

  const onCancel = () => {
    props.isEmptyPage ? setVisible(false) : props.onCancel();
  }

  const onOk = () => {
    if (props.iKnow) {
      readed({
        a_id: 90,
        staff_id: cid,
      });
    }
    onCancel();
  }

  return <div></div>
}

export default ChargingNotice;