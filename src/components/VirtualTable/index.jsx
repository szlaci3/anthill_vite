import React, { useState, useEffect, useRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import ProTable from '@ant-design/pro-table';
import Highlighter from 'react-highlight-words';
import { hasVal } from '@/utils/utils';

let a = document.createElement('div');
a.style.overflow = "scroll";
document.body.appendChild(a);
let scrollbarWidth = a.offsetWidth - a.clientWidth;// scrollbarSize is 0, needs correction.
document.body.removeChild(a);

let clickIsShort;

function VirtualTable(props) {
  const pageSizeFake = 50; /* It divides and multiplies back, so it works with any number. */
  const { columns, search_keyword, scroll, rowKey, rowClick, specialCols, getSpecialCell, loading, totalWidth, pagination, pageMax } = props;
  const [tableWidth, setTableWidth] = useState(0);
  const layoutEl = document.getElementsByClassName("ant-layout-content")[0];
  const layoutWidth = layoutEl ? layoutEl.offsetWidth : 0;
  let tableSize = 3;
  if (totalWidth < layoutWidth * 4 / 5) {
    tableSize = 1;
  } else if (totalWidth < layoutWidth * 6 / 5) {
    tableSize = 2;
  }

  const mergedColumns = columns.map((column) => {
    let width;
    if (tableSize === 3 && column.width) {
      return column;
    } else if (tableSize === 2 && column.width) {
      width = column.width + Math.max(0, layoutWidth - totalWidth) / columns.length;
      return { ...column, width };
    } else {
      width = layoutWidth / columns.length;
      return { ...column, width };
    }
  });
  const gridRef = useRef();

  const resetVirtualGrid = () => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        shouldForceUpdate: true,
      });
    }
  };

  const rowHover = (ev) => {
    let rowIndex = ev.currentTarget.dataset.row
    let cellArr = document.getElementsByClassName(`vrow-${rowIndex}`);
    if (cellArr[0] && !cellArr[0].classList.contains('hover')) {
      cellArr.forEach(cell => {
        cell.classList.add('hover');
      })
    }
  }

  const rowUnhover = (ev) => {
    let rowIndex = ev.currentTarget.dataset.row
    let cellArr = document.getElementsByClassName(`vrow-${rowIndex}`);
    if (cellArr[0] && cellArr[0].classList.contains('hover')) {
      cellArr.forEach(cell => {
        cell.classList.remove('hover');
      })
    }
  }

  useEffect(() => {
    let el = document.getElementsByClassName("virtual-grid");
    if (el[0]) {
      el[0].scrollTop = 0;
    }
  }, [props.pagination.current, search_keyword, props.sort_col, props.sort_type]);

  useEffect(() => resetVirtualGrid, [tableWidth, columns, pagination]);
  
  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    const totalHeight = rawData.length * 54;
    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll.y && index === mergedColumns.length - 1
            ? width - scrollbarWidth - 1
            : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          if (specialCols && specialCols.includes(mergedColumns[columnIndex].comment || mergedColumns[columnIndex].title)) {
            return getSpecialCell({columnIndex, rowIndex, style, mergedColumns, rawData, search_keyword, rowHover, rowUnhover});
          }
          let text = rawData[rowIndex][mergedColumns[columnIndex].dataIndex];
          text = !hasVal(text) ? "" : text.toString();
          let {hasColAction, canSearch} = mergedColumns[columnIndex];

          const handleMouseDown = () => {
            clickIsShort = true;
            setTimeout(() => {
              clickIsShort = false;
            }, 500);
          }

          const handleMouseUp = (ev) => {
            if (clickIsShort && hasColAction && rowClick) {
              rowClick(ev, rawData[rowIndex]);
            }
          }

          return (<div
            className={classNames(`virtual-table-cell vrow-${rowIndex}`, {
              'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
              'virtual-table-cell-first': columnIndex === 0,
              'vtc-odd': rowIndex % 2 === 1,
              'pointer': hasColAction,
            })}
            style={style}
            data-row={rowIndex}
            data-id={rawData[rowIndex][rowKey]}
            onMouseOver={hasColAction ? rowHover : null}
            onMouseOut={hasColAction ? rowUnhover : null}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {canSearch ? <Highlighter
              highlightStyle={{ backgroundColor: '#3884FF', color: '#fff', padding: 0 }}
              searchWords={loading ? [] : [search_keyword]}
              autoEscape
              textToHighlight={text}
            />
            :
            <>
              {text}
            </>}
          </div>)
        }}
      </Grid>
    );
  };


  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <ProTable
        {...props}
        className={props.className}
        pagination={props.pagination && {
          ...props.pagination,
          total: pageMax * pageSizeFake,
          pageSize: pageSizeFake,
        }}
        columns={mergedColumns}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
} // Usage

export default VirtualTable;