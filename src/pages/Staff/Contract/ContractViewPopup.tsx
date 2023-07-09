import { message, Spin, Modal, Button, Popconfirm } from 'antd';
import { useRequest } from 'umi';
import { toArrayIfPossible } from '@/utils/utils';
import { addRow, delRow } from './service';
import ProTable from '@ant-design/pro-table';
import { ReactComponent as Delete1 } from '@/img/删除_delete-one.svg';
import { ReactComponent as Download3 }  from '@/img/下载3_download-three.svg';
import { ReactComponent as Folder }  from '@/img/文件夹-开_folder-open.svg';
import { useState } from 'react';

let clickIsShort: boolean = false;

interface Props {
  viewInfo?: any
  refreshTable: Function
  onCancel: Function
  switchToUpload: Function
} 

const ContractViewPopup = (props: Props) => {
  const {viewInfo = {}} = props;
  const [contractIdToDelete, setContractIdToDelete] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [deletedCounter, setDeletedCounter] = useState<number>(0);

  const columns = [
    {
      title: '合同名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '合同起始日期',
      dataIndex: 'start',
      key: 'start',
      ellipsis: true,
    },
    {
      title: '合同终止日期',
      dataIndex: 'end',
      key: 'end',
      ellipsis: true,
    },
    {
      title: '上传时间',
      dataIndex: 'addtime',
      key: 'addtime',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 260,
      render: (_text: string, record: {id: number, template: any}) => (
        <div>

          <Popconfirm
            title="劳动合同删除后将不可恢复，确定要删除吗？"
            visible={contractIdToDelete == record.id}
            okText="确 认"
            onConfirm={deleteContract}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={closeConfirmDelete}
          >
            <Button
              type="text"
              className="opera can-hover-icon"
              danger
              icon={<Delete1/>}
              onClick={openConfirmDelete}
              data-id={record.id}
              >
              删除
            </Button>
          </Popconfirm>

          <a href={rootUrl + record.template} download onClick={ev => ev.stopPropagation()}>
            <Button
              type="text"
              className="opera blue can-hover-icon"
              icon={<Download3/>}
              >
              下载
            </Button>
          </a>

          <Button
            type="text"
            className="opera blue can-hover-icon"
            icon={<Folder/>}
            >
            开
          </Button>
        </div>
      )
    },
  ];

  const openConfirmDelete = (ev) => {
    ev.stopPropagation()
    setContractIdToDelete(+ev.currentTarget.dataset.id);
  }

  const closeConfirmDelete = (ev) => {
    ev.stopPropagation()
    setContractIdToDelete(null);
  }

  const deleteContract = async (ev) => {
    ev.stopPropagation()
    setConfirmLoading(true);
    let res = await delRow({id: contractIdToDelete, staffid: viewInfo.id});

    setConfirmLoading(false);
    if (res.code == 0) {
      return;
    }
    message.success(res.msg);
    setContractIdToDelete(null);
    setDeletedCounter(deletedCounter + 1); // reload table
  }

  const openContract = (path: string) => {
    if (path) {
      window.open(rootUrl + path, "_blank");
    } else {
      message.error("未上传附件");
    }
  }

  const loadRes = useRequest(() => props.viewInfo ? addRow({staffid: viewInfo.id}) : (() => new Promise(() => {}))(),
    {
      refreshDeps: [props.viewInfo, deletedCounter],
      formatResult: res => res.data,
    }
  );

  let dataSource = toArrayIfPossible(loadRes.data ? loadRes.data.contract_list : []);

  const onClosePopup = () => {
    if (deletedCounter > 0 || viewInfo.isFromView) {
      props.refreshTable();
    } else {
      props.onCancel();
    }
  }

  const handleMouseDown = () => {
    clickIsShort = true;
    setTimeout(() => {
      clickIsShort = false;
    }, 500);
  }

  const handleClick = (path: string) => {
    if (clickIsShort) {
      openContract(path);
    }
  }

  return (
    <Modal
      maskClosable={false}
      width={860}
      title={`Contract List`}
      visible={props.viewInfo}
      className="max-height-modal"
      destroyOnClose={true}
      footer={null}
      onCancel={onClosePopup}
      centered={true}
      closeIcon={<span className="close-x">&times;</span>}
    >
      <Spin spinning={loadRes.loading}>
        <div onClick={closeConfirmDelete}>
          <div className="free-line">
            备注：历史记录只显示在本公司任职时，您所上传的劳动合同
            <a className="linkish float-right" onClick={() => props.switchToUpload()}>添加劳动合同</a>
          </div>

          <ProTable
            rowKey="id"
            className="contract-view-table tiny-table"
            size="small"
            onRow={(record) => ({
              onMouseDown: handleMouseDown,
              onClick: handleClick.bind(null, record.template),
            })}
            scroll={{
              x: '100%',
              y: window.innerHeight - 390,
            }}
            options={false}
            search={false}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </div>
      </Spin>
    </Modal>

  )
}

export default ContractViewPopup;