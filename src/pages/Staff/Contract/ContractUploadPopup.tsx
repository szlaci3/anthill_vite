import { message, Form, Spin, Row, Col, Upload } from 'antd';
import { hasVal } from '@/utils/utils';
import { addRow, sendContract } from './service';
import { useState } from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';
import ProFormDateClock from '@/components/ProFormDateClock';

const {useForm} = Form;
const chineseNumbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const uploadStatus = {
  empty: <div>请将PDF文件拖至此框内<div className="linkish">选择文件</div></div>,
  progress: "上传中",
  full: "上传完成"
};

const ContractUploadPopup = (props) => {
  const [form] = useForm();
  const [loading, setLoading] = useState();
  const [uploadPercent, setUploadPercent] = useState();
  const [file, setFile] = useState('');
  const [displayFileRequired, setDisplayFileRequired] = useState(false);
  const [bar, setBar] = useState('empty');
  const {uploadInfo = {}} = props;

  const parseResponse = ({data}) => {
    let contractList = [];
    let department;
    let position;
    if (data && data.staff) {
      contractList = data.contract_list;
      department = data.staff.table_field_1;
      position = data.staff.table_field_2;
    }

    const toDigits = (name) => {
      if (hasVal(name) && name.slice(0, 2) === "合同") {
        return chineseNumbers.indexOf(name.slice(2));
      }
      return 0;
    }

    let contractTitle;
    for (var i = 0; i < contractList.length; i++) {
      if (contractTitle) {
        if (contractList[i].name === contractTitle) {
          // second step: check that default name is not used yet
          contractTitle = "";
          break;
        }
      } else if (toDigits(contractList[i].name)) {
        // first step: we create new default name
        let num = toDigits(contractList[i].name)
        contractTitle = "合同" + (chineseNumbers[num + 1] || num + 1);
      }
    }
    contractTitle = typeof contractTitle === "undefined" ? "合同一" : contractTitle;
    form.setFieldsValue({
      contractTitle,
      department,
      position,
      contract_type: "劳动合同",
    });
  }

  const beforeUpload = (file) => {
    const isRightType = file.type === 'application/pdf';
    if (!isRightType) {
      message.error('You can only upload PDF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('很抱歉，文件大小不能超过2MB哦');
    }
    return isRightType && isLt2M;
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setUploadPercent(info.file.percent);
      setBar('progress');
      return;
    }
    if (info.file.status === 'done') {
      setDisplayFileRequired(false);
      setFile(`${info.file.response.file}${info.file.response.imgname}`);
      setUploadPercent(100);
      setBar('full');
    }
  };

  return (
    <ModalForm
      form={form}
      layout="horizontal"
      labelCol={{span: 9}}
      labelAlign="left"
      width={920}
      colon={false}
      requiredMark={false}
      title={`Upload Contract`}
      visible={props.uploadInfo}
      className="contract-upload-modal max-height-modal errors-absolute-modal"
      modalProps={{
        okText: "确 认",
        okButtonProps: {size: 'large'},
        cancelButtonProps: {size: 'large'},
        onCancel: props.onCancel,
        maskClosable: false,
        centered: true,
        destroyOnClose: true,
        closeIcon: <span className="close-x">&times;</span>,
      }}
      onVisibleChange={async (becomeVisible) => {
        if (becomeVisible) {
          setLoading(true);
          const itemRes = await addRow({staffid: uploadInfo.id});
          setLoading(false);
          if (itemRes.code != 0) {
            parseResponse(itemRes);
          }
        } else {
          props.onCancel();
        }
      }}
      onFinish={async (values) => {
        if (!file) {
          setDisplayFileRequired(true);
        } else if (!loading) {
          let saveRes = await sendContract({
            staffid: uploadInfo.id,
            name: values.contractTitle,
            type: values.contract_type,
            template: file,
            start: values.induction_date,
            try_end: values.probation_end,
            end: values.expiry_date,
          });

          if (saveRes.code == 0) {
            return false;
          }
          message.success(saveRes.msg);
          props.refreshTable();
          return true;
        }
        return false;
      }}
    >
      <Spin spinning={loading}>

        <Row>
          <Col span={8}>
            <ProFormText
              width={170}
              name="contractTitle"
              label="合同名称"
              rules={[{required: true}]}
            />
          </Col>

          <Col span={8}>
            <ProFormSelect
              width={170}
              name="contract_type"
              label="合同类型"
              allowClear={false}
              valueEnum={['劳动合同','实习协议','劳务协议','聘用协议','兼职合同']}
              rules={[{required: true}]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <ProFormDateClock
              width={160}
              name="induction_date"
              label="合同起始日期"
              rules={[{required: true}]}
            />
          </Col>

          <Col span={8}>
            <ProFormDateClock
              width={160}
              name="probation_end"
              label="试用期到期日期"
            />
          </Col>

          <Col span={8}>
            <ProFormDateClock
              width={160}
              name="expiry_date"
              label="合同终止日期"
              rules={[{required: true}]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <ProFormText width={170} name="location" label="工作地点" />
          </Col>

          <Col span={8}>
            <ProFormText width={170} name="department" label="职级" />
          </Col>

          <Col span={8}>
            <ProFormText width={170} name="position" label="职位" />
          </Col>
        </Row>

        <div className="free-line">选择劳动合同文件上传（注：支持PDF）</div>
        
        <Upload
          name="file"
          listType="picture-card"
          className={"common-uploader" + (displayFileRequired ? " file-required" : "")}
          showUploadList={false}
          action={rootUrl + "/Customer/Staffcontract/uploadContract"}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          <img src={require("@/img/pdf.png")} alt="PDF" className={bar}/>
          <div className="upload-status">
            {uploadStatus[bar]}
          </div>
          <div className={"progress-bar" + (!uploadPercent ? " visibility-hidden" : "")} ><div style={{width: `${uploadPercent}%`}}></div></div>
        </Upload>

      </Spin>
    </ModalForm>

  )
}

export default ContractUploadPopup;