import { useState, useEffect } from 'react';
import { showGuide } from './service';
import { history } from 'umi';
import { delay } from '@/utils/utils';
import { Button } from 'antd';
import { useEvent } from 'react-use';

const pathRecord = [
  {new: "/payable/insurance/calculation", old: "insurance-calculation"},
  {new: "/payable/insurance/settings", old: "insurance-settings"},
  {new: "/payable/salary/calculation", old: "salary-calculation"},
  {new: "/payable/salary/settings", old: "salary-settings"},
  {new: "/payable/salary/item-setup", old: "salary-item-setup"},
  {new: "/company-setup", old: "company-setup"},
  {new: "/index", old: "index"},
];

const guideList = {
  "1-01": [{ //index
    className: "guide1",
    arrowOrigin: "under-left",
    arrowType: "arr1b",
    line1: "“点击这里",
    line2: "可以进行账户设置哦~”"
    // hasNoButton: false //default
  }],
  "2-01": [{ //company-setup
    className: "guide2",
    arrowOrigin: "under-right",
    arrowType: "arr10f",
    line1: "正确填写信息",
    line2: "并点击“保存”"
  }],
  "5.1-01": [{ //insurance-calculation step1
    className: "guide51",
    arrowOrigin: "right-down",
    arrowType: "arr9b",
    line1: "您还未编辑员工社保信息哦~"
  }],
  "5.2-01": [{ //insurance-settings
    className: "guide52",
    arrowOrigin: "under-right",
    arrowType: "arr11f",
    table: "insurance-settings",
    line1: "“双击此处",
    line2: "可编辑员工社保信息设置”"
  }],
  "5.3-01": [{ //insurance-settings
    className: "guide53",
    arrowOrigin: "right-down",
    arrowType: "arr9b",
    line1: "完成后就可以进行员工社保计算啦！",
    line2: "快去使用吧~"
  }],
  "5.4-01": [{ //insurance-calculation step2
    className: "guide54",
    arrowOrigin: "under-right",
    arrowType: "arr11f",
    line1: "点击计算就出现员工社保信息啦~",
    line2: "轻松一键全搞定！"
  }],
  "5.6-01": [{ //insurance-calculation step3
    className: "guide56",
    arrowOrigin: "under-right",
    arrowType: "arr11f",
    line1: "输入员工姓名/手机/身份证，点击月份",
    line2: "一键“查询”全搞定~"
  }],
  "6.2-01": [{ //salary-item-setup
    className: "guide62",
    arrowOrigin: "right-down",
    arrowType: "arr9b",
    line1: "您还未设置计算公式哦~"
  }],
  "6.2-02": [{ //salary-calculation
    className: "guide622",
    arrowOrigin: "right-down",
    arrowType: "arr9b",
    line1: "您还未给员工编辑薪资信息哦~"
  }],
  "6.3-01": [{ //salary-item-setup
    className: "guide63",
    arrowOrigin: "under-right",
    arrowType: "arr11f",
    line1: "“点击此处",
    line2: "添加您想设置的项目名称，使用更方便哟~”"
  }],
  "6.4-01": [{ //salary-item-setup  // DOUBLE
    className: "guide64a",
    arrowOrigin: "above-right",
    arrowType: "arr7b",
    line1: "“点击此处",
    line2: "员工薪资想秀就秀~”",
    hasNoButton: true
  },{
    className: "guide64b",
    arrowOrigin: "under-left",
    arrowType: "arr1f",
    line1: "“点击此处",
    line2: "计算公式想关就关~”"
  }],
  "6.6-01": [{ //salary-settings
    className: "guide66",
    arrowOrigin: "under-right",
    arrowType: "arr11f",
    line1: "批量设置快速导入更方便！",
    line2: "快来试试吧~"
  }],
  "6.7-01": [{ //salary-settings
    className: "guide67",
    arrowOrigin: "under-right",
    arrowType: "arr11f",
    table: "salary-settings",
    line1: "“双击此处",
    line2: "可直接编辑薪资信息设置”"
  }],
  "6.8-01": [{ //salary-item-setup
    className: "guide68",
    arrowOrigin: "right-down",
    arrowType: "arr9b",
    line1: "设置完成后您就可以进行员工薪资计算啦~",
    line2: "快去试试吧！"
  }],
  "6.9-01": [{ //salary-calculation
    className: "guide69",
    arrowOrigin: "under-right",
    arrowType: "arr10f",
    line1: "“点击此处",
    line2: "员工薪资计算一键都搞定！”"
  }],
  "7.1": [{ //salary-calculation
    className: "guide7",
    arrowOrigin: "under-right",
    arrowType: "arr10f",
    line1: "一键发布",
    line2: "员工薪资一目了然！”"
  }]
};

function Guide(props) {
  // // currently we have no page having props.displayGuide=false.
  const [displayGuide, setDisplayGuide] = useState(forceShowGuide || (typeof props.displayGuide === "undefined" ? true : props.displayGuide));
  const [alphas, setAlphas] = useState();
  const [hiItems, setHiItems] = useState([]);
  const [guideBoxes, setGuideBoxes] = useState([]);
  const [step, setStep] = useState();
  const [jump, setJump] = useState();
  const [displayMask, setDisplayMask] = useState(false); // plays with opacity
  const [displayBox, setDisplayBox] = useState(false); // plays with opacity


  const getStyles = (hiItems) => {
    let edges = {};
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    hiItems.map((item, index, hiItems) => {
      if (!(item.top > edges.top)) { // if item.top is smaller or edges.top is undefined
        edges.top = item.top;
      }
      if (!(item.right < edges.right)) {
        edges.right = item.right;
      }
      if (!(item.bottom < edges.bottom)) {
        edges.bottom = item.bottom;
      }
      if (!(item.left > edges.left)) {
        edges.left = item.left;
      }
    });
    let margin = hiItems.length > 1 ? 8 : 5;
    return {
      top: {bottom: Math.max(0, windowHeight - edges.top + margin) + "px"},
      right: {left: edges.right + margin + "px"},
      bottom: {top: edges.bottom + margin + "px"},
      left: {right: Math.max(0, windowWidth - edges.left + margin) + "px"}
    };
  }

  const eachGuideBox = (box, i) => {
    let style = {};
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let alpha = alphas[box.className];
    if (!alpha) {
      return null;
    }
    switch (box.arrowOrigin) {
      case "under-left": {
        style.top = alpha.bottom;
        style.right = windowWidth - alpha.right; // "-" because alpha.right is calculated from left
        break;
      }
      case "under-right": {
        style.top = alpha.bottom;
        style.left = alpha.left;
        break;
      }
      case "right-down": {
        style.top = alpha.top;
        style.left = alpha.right;
        break;
      }
      case "right-up": {
        style.bottom = windowHeight - alpha.bottom;
        style.left = alpha.right;
        break;
      }
      case "overlap": {
        style.top = alpha.top;
        style.left = alpha.left;
        break;
      }
      case "above-right": {
        style.bottom = windowHeight - alpha.top;
        style.left = alpha.left;
        break;
      }
    }
    
    return <div key={i} className={`guide-content guide-transit-opacity ${box.className}-content ${displayBox ? "" : "opacity-0"}`} style={style}>
      <img src={require(`@/img/${box.arrowType}.png`)} alt=""/>
      <div>
        <div>{box.line1}<br />
        {box.line2 || ""}</div>
        {!box.hasNoButton && <Button type="primary" size="large" className="button-kiwi">知道啦!</Button>}
      </div>
    </div>
  }

  const close = () => {
    if (props.close) {
      props.close(); // For CompanySetup, ISettings, SSettings and Index page
    }

    // if (jump) { // jump functionality disabled 2022.aug
    //   history.push(oldToNew(jump));
    // } else {
    setDisplayMask(false);
    setDisplayBox(false);
    window.setTimeout(() => {
      setDisplayGuide(false);
      callShowGuide(); // next guide
    }, 500);
    // }
  }

  const newToOld = path => {
    let pathObj = pathRecord.find(item => item.new === path);
    return pathObj && pathObj.old;
  }

  const oldToNew = path => {
    let pathObj = pathRecord.find(item => item.old === path);
    return pathObj && pathObj.new;
  }

  useEvent("resize", () => {
    let hiAndAlpha = getHiItems(guideBoxes);
    setHiItems(hiAndAlpha.hiItems);
    setAlphas(hiAndAlpha.alphas);
  });

  useEffect(async () => {
    await delay(1000);
    callShowGuide();
  }, []);

  const callShowGuide = async () => {
    let path = history.location.pathname;
    if (path.slice(-1) === "/") {
      path = path.slice(0, -1);
    }
    
    let act = newToOld(path);
    if (!act) {
      return;
    }

    let res = await showGuide({act});

    if (res.status === "1") {
      let guideItem = guideList[res.data.step];
      if (!guideItem) {
        return;
      }
      setDisplayGuide(true);

      if (props.callback) {// For ISettings, SSettings and Index page.
        props.callback();
        if (res.data.step === "1-01") {
          await delay(200);// Index
        }
      }
      let hiAndAlpha = getHiItems(guideItem);
      setStep(res.data.step);
      setJump(res.data.jump);
      setGuideBoxes(guideItem);
      setHiItems(hiAndAlpha.hiItems);
      setAlphas(hiAndAlpha.alphas);
    } else {
      if (props.close) {
        props.close(); // Mostly For ISettings, SSettings. Calls for nothing in CompanySetup and Index page.
      }
    }
  }

  useEffect(() => {
    if (displayGuide) {
      window.setTimeout(() => {
        setDisplayMask(true);
      }, 1);
      window.setTimeout(() => {
        setDisplayBox(true);
      }, 250);
    }
  }, [displayGuide]);

  const getHiItems = (guideBoxes) => {
    let _hiItems = [];
    let _alphas = {};
    guideBoxes && guideBoxes.map((box, i) => {
      let {className, table} = box;
      if (table) {
        let rowAttributes = document.querySelector(`.${table} .ant-table-row`);
        if (!rowAttributes) {
          return;
        }
        rowAttributes = rowAttributes.getBoundingClientRect().toJSON();
        rowAttributes.right = window.innerWidth - 48;
        _hiItems.push(rowAttributes);
        _alphas[className] = rowAttributes;
      } else {
        let elements = document.getElementsByClassName(`${className}-hi`);
        for (let i=0; i < elements.length; i++) {
          _hiItems.push(elements[i].getBoundingClientRect());
          if (elements[i].className.indexOf(`${className}-alpha`) !== -1) {
            _alphas[className] = elements[i].getBoundingClientRect();
          }
        }
      }
    });
    return {hiItems: _hiItems, alphas: _alphas};
  }


  if (displayGuide && hiItems.length > 0 && alphas) {
    let styles = getStyles(hiItems);
    return <div onClick={close}>
      <div className={`guide-fixed guide-transit-opacity ${displayMask ? "" : "opacity-0"}`}>
        <div style={styles.right} className="grey-right">
        </div>
        <div style={styles.left} className="grey-left">
        </div>
        <div style={styles.bottom} className="grey-bottom">
        </div>
        <div style={styles.top} className="grey-top">
        </div>
      </div>
      {guideBoxes.map(eachGuideBox)}
    </div>
  } else {
    return <div/>
  }
}

export default Guide;