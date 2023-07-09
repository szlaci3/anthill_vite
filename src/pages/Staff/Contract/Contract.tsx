import UTable from '@/components/UTable';
import { contractData } from './service';
import { Card, Button } from 'antd';
import classNames from 'classnames';
import { ImportOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ContractViewPopup from './ContractViewPopup';
import ContractUploadPopup from './ContractUploadPopup';
import ContractBulkUploadPopup from './ContractBulkUploadPopup';
import ChargingNotice from '@/components/ChargingNotice';
import { useModel } from 'umi';

let popupKey = 0;
interface Info {
  id: string
  employee: string
  isFromView?: boolean;
}

function Contract() {
  const { initialState = {} } = useModel('@@initialState');
  const { currentUser = {} } = initialState;
  const { vip } = currentUser;

  const [viewInfo, setViewInfo] = useState<Info | null>(null);
  const [uploadInfo, setUploadInfo] = useState<Info | null>(null);
  const [displayBulkUpload, setDisplayBulkUpload] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const rowKey = "column_0";

  if (vip != "1") {
    return <ChargingNotice
      isEmptyPage={true}
    />
  }

  const openUploadContract = (ev: React.MouseEvent & {
    currentTarget: HTMLDivElement
  }) => {
    popupKey++;
    setUploadInfo({
      id: ev.currentTarget.dataset.id,
      employee: ev.currentTarget.dataset.employee,
    });
  }

  const openViewContract = (ev: React.MouseEvent & {
    currentTarget: HTMLDivElement
  }) => {
    popupKey++;
    setViewInfo({
      id: ev.currentTarget.dataset.id,
      employee: ev.currentTarget.dataset.employee,
    });
  }

  const openBulkUpload = () => {
    popupKey++;
    setDisplayBulkUpload(true);
  }

  const closeUploadContract = () => {
    if (uploadInfo && uploadInfo.isFromView) {
      popupKey++;
      setViewInfo(uploadInfo);
    }
    setUploadInfo(null);
  }

  const alterCols = cols => {
    const contractNameColIdx = cols.findIndex(col => col.Comment === "Hon");
    const lastCol = cols.splice(contractNameColIdx, 1)[0];
    cols.push({
      ...lastCol,
      Comment: "Actions",
    })
    return cols;
  }

  const getEmployeeCol = cols => {
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].title === "Name") {
        return cols[i].dataIndex;
      }
    }
  }

  const getSpecialCell = ({ columnIndex, rowIndex, style, mergedColumns, rawData, search_keyword, rowHover, rowUnhover }) => {
    let text = rawData[rowIndex][mergedColumns[columnIndex].dataIndex];

    switch (mergedColumns[columnIndex].title) {
      case "Actions": {
        let hasContract = !!text;
        text = hasContract ? text.toString() : "";
        let employeeCol = getEmployeeCol(mergedColumns);

        return (<div
          className={classNames(`virtual-table-cell vrow-${rowIndex}`, {
            'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
            'virtual-table-cell-first': columnIndex === 0,
            'vtc-odd': rowIndex % 2 === 1,
            'pointer': true,
            'action-cell': true,
          })}
          style={style}
          data-row={rowIndex}
          data-id={rawData[rowIndex][rowKey]}
          data-employee={rawData[rowIndex][employeeCol]}
          onMouseOver={rowHover}
          onMouseOut={rowUnhover}
          // onClick={hasContract ? openViewContract : openUploadContract}
          key={rowIndex}
        >
          {hasContract ? text : "Upload Contract"}
        </div>)
      }
    }
  }

  return (
    <>
      <ContractViewPopup
        key={"v" + popupKey}
        viewInfo={viewInfo}
        onCancel={() => {
          setViewInfo(null);
        }}
        refreshTable={() => {
          setViewInfo(null);
          setRefreshCount(refreshCount + 1);
        }}
        switchToUpload={() => {
          popupKey++;
          setUploadInfo({...viewInfo, isFromView: true});
          setViewInfo(null);
        }}
      />

      <ContractUploadPopup
        key={"u" + popupKey}
        uploadInfo={uploadInfo}
        onCancel={closeUploadContract}
        refreshTable={() => {
          closeUploadContract();
          setRefreshCount(refreshCount + 1);
        }}
      />

      <ContractBulkUploadPopup
        key={"b" + popupKey}
        visible={displayBulkUpload}
        onCancel={() => {
          setDisplayBulkUpload(false);
        }}
        refreshTable={() => {
          setDisplayBulkUpload(false);
          setRefreshCount(refreshCount + 1);
        }}
      />

      <Card className="top-section">
        <div className="t1">Contract</div>
      </Card>
      <UTable
        pageSize={50}
        rowKey={rowKey}
        hiddenCols={["员工编号"]}
        sorterCols={[]}
        searchCols={[]}
        searchPlaceholder="姓名/手机/身份证"
        actionCols={ ["Actions"]}
        specialCols={["Actions"]}
        getSpecialCell={getSpecialCell}
        headerTitle={<div className="t2">Existing Contracts</div>}
        className="contract-table"
        api={contractData}
        alterCols={alterCols}
        // toolBarButtons={[
        //   <Button type="primary" size="large" className="common-bulk-upload tall" icon={<ImportOutlined />} onClick={openBulkUpload}>Import Spreadsheet</Button>
        // ]}
        refreshCount={refreshCount}
      />
    </>
  );
}

export default Contract;