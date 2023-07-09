import { message, Modal, Upload } from 'antd';
import { addExcel } from './service';
import { useState } from 'react';

const uploadStatus = {
  empty: <div>请将xls或csv文件拖至此框内<div className="linkish">选择文件</div></div>,
  progress: "上传中",
  full: "上传完成"
};

const ContractBulkUploadPopup = (props) => {
  const {visible} = props;
  const [isSaveLoading, setIsSaveLoading] = useState();
  const [uploadPercent, setUploadPercent] = useState();
  const [file, setFile] = useState('');
  const [bar, setBar] = useState('empty');

  const beforeUpload = (file) => {
    const extension = file.name.split(".").reverse()[0];
    const isRightType = extension === "xls" || extension === "xlsx" || extension === "csv";

    if (!isRightType) {
      message.error('仅支持上传XLS或CSV文件');
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
      // Get this url from response in real world.
      setFile(info.file.response.data);
      setUploadPercent(100);
      setBar('full');
    }
  };

  return (
    <Modal
      maskClosable={false}
      width={690}
      title="上传文件"
      visible={visible}
      destroyOnClose={true}
      okText="确 认"
      okButtonProps={{size: 'large'}}
      confirmLoading={isSaveLoading}
      cancelButtonProps={{size: 'large'}}
      onCancel={props.onCancel}
      centered={true}
      closeIcon={<span className="close-x">&times;</span>}
      onOk={async () => {
        if (bar !== "full") {
          return false;
        }
        setIsSaveLoading(true);
        let saveRes = await addExcel({file_path: file});
        setIsSaveLoading(false);
        if (saveRes.code == 0) {
          return false;
        }
        message.success(saveRes.msg);
        props.refreshTable();
        return true;
      }}
    >
      <Upload
        name="file"
        listType="picture-card"
        className="common-uploader"
        showUploadList={false}
        action={extendUrl + "/index/Staff_Info/upload"}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <img src={require("@/img/xls.png")} alt="PDF" className={bar}/>
        <div className="upload-status">
          {uploadStatus[bar]}
        </div>
        <div className={"progress-bar" + (!uploadPercent ? " visibility-hidden" : "")} ><div style={{width: `${uploadPercent}%`}}></div></div>
      </Upload>

      <div className="free-line">
        <span>请使用默认表格导入员工信息，</span>
        <a className="linkish" href={extendUrl + "/index/Contract/exportModel"} >点击下载</a>
      </div>
      
    </Modal>

  )
}

export default ContractBulkUploadPopup;