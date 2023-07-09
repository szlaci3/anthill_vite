import { useState, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { Input } from 'antd';
import { toArrayIfPossible } from '@/utils/utils';
import VirtualTable from '@/components/VirtualTable';
import searchIcon from '@/img/编组_magnifier.svg';

const { Search } = Input;

function UTable(props) {
  const {
    rowKey = "column_0",
    hiddenCols = ["员工编号"],
    sorterCols,
    searchCols,
    searchPlaceholder,
    actionCols,
    api,
    defaultParams = {},
    formatResult,
    headerTitle,
    rowClick = () => {},
    alterCols,
    className,
    specialCols,
    getSpecialCell,
    toolBarButtons = [],
    refreshCount,
  } = props;
  const actionRef = useRef();
  const [tableCols, setTableCols] = useState([]);
  const [totalWidth, setTotalWidth] = useState(0);
  let totalWidthTemp = 0;
  let myTableCols: ProColumns<API.RuleListItem>[] = [];
  let myTableRows = [{[rowKey]: 0}]; //表格内容
  const [tableRows, setTableRows] = useState(myTableRows);
  const [paramsStatus, setParamsStatus] = useState(defaultParams);
  let total = 0;

  const res = useRequest((params) => api({ ...params, ...paramsStatus }),
    {
      refreshDeps: [paramsStatus, refreshCount],
      formatResult: formatResult || (res => res.data),
    }
  );

  useEffect(() => {
    if (res.data) {
      myTableRows = toArrayIfPossible(res.data.data);
      setTableRows(myTableRows);
      if (!tableCols[0]) {
        let colKeys = Object.keys(res.data.cols);
        let cols = colKeys.map(item => ({
          Field: item,
          Comment: res.data.cols[item],
        }));

        if (alterCols) {
          cols = alterCols(cols);
        }

        cols.forEach((val, idx) => {
          if (!hiddenCols.includes(val.Comment)) {
            let sample = "";
            for (let i=0; i<myTableRows.length; i++) {
              sample = myTableRows[i][val.Field] || "";
              if (sample) {
                break;
              }
            }
            sample = String(sample);
            let w = Math.min(350, Math.max(73, val.Comment.length * 23 + 14, 8 + sample.length * (sample[0] > 0 || sample[0] <= 0 ? 9 : 16)));
            if (idx === 0 || idx === cols.length - 1) {
              w += 18;// last col reduced for scrollbar, counterbalance it.
            }
            let defaultSortOrder;
            if (defaultParams.sort_col === val.Field) {
              switch (defaultParams.sort_type) {
                case 'asc': defaultSortOrder = 'ascend'; break;
                case 'desc': defaultSortOrder = 'descend'; break;
              }
            }
            myTableCols.push({
              width: w,
              title: val.Comment,
              dataIndex: val.Field,
              key: val.Field,
              className: val.Field,
              ellipsis: true,
              sorter: !sorterCols || sorterCols.includes(val.Comment),
              // canSearch: searchCols && searchCols.includes(val.Comment),
              canSearch: true,
              hasColAction: !actionCols || actionCols.includes(val.Comment),
              defaultSortOrder,
            });
            totalWidthTemp = totalWidthTemp + w;
          }
        });

        setTotalWidth(totalWidthTemp);
        setTableCols(myTableCols);
      }
    }
  }, [res.data]);

  const onChange = ((
    pagination,
    filters,
    sorter,
    // extra,
  ) => {
    setParamsStatus({
      page: pagination.current,
      sort_col: sorter['field'] || defaultParams.sort_col,
      sort_type: sorter['order'] === 'ascend' ? 'asc' : sorter['order'] === 'descend' ? 'desc' : defaultParams.sort_type,
      search_keyword: paramsStatus.search_keyword,
    });
  })

  const onSearch = (searchVal) => {
    setParamsStatus({
      ...paramsStatus,
      page: 1,
      search_keyword: String(searchVal || "").trim() || undefined,
    });
  }

  if (!res.data && !res.loading || !tableCols[0]) {
    return <div/>;
  }


  return (
    <>
      <VirtualTable
        headerTitle={headerTitle}
        rowClick={rowClick}
        specialCols={specialCols}
        getSpecialCell={getSpecialCell}
        actionRef={actionRef}
        className={`look ${className || ''}`}
        scroll={{
          x: '100vw',
          y: window.innerHeight - 366,
        }}
        loading={res.loading}
        rowKey={rowKey}
        columns={tableCols}
        totalWidth={totalWidth}
        dataSource={tableRows}
        onChange={onChange}
        sortDirections={['ascend', 'descend', 'ascend']}
        options={false}
        search={false}
        search_keyword={paramsStatus.search_keyword}
        toolBarRender={() => toolBarButtons}
        pageMax={res.data && res.data.page.max}
        pagination={{
          current: paramsStatus.page,
          showSizeChanger: false,
          position: ['bottomRight'],
          showTotal: false,
        }}

      />
    </>
  );
}

export default UTable;