import { useState } from 'react';
/*
<STabs
	tabs=[{
		name: "Tab1",
		content: <div>You are viewing 1</div>
	}, {
		name: "Tab2",
		content: <div>Now You are viewing 2</div>
	}]/>*/

function STabs(props) {
  const {
    tabs,
    tabsWithError = [],
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeft, setLineLeft] = useState(0);
  const [isFirstState, setIsFirstState] = useState(true);

	
  const eachTab = (tab, i) => (
    <div key={i} data-index={i} className={(i == currentIndex ? "s-current" : "") + (tabsWithError[i] ? " tab-with-error" : "")} onClick={onTabChange}>
      <span>{tab.name}</span>
    </div>
  )

  const eachContent = (tab, i) => (
    <div key={i} className={i == currentIndex ? "" : "display-none"}>
      {tab.content}
    </div>
  )

  const setValues = target => {
    setCurrentIndex(target.dataset.index);
    setLineWidth(target.childNodes[0].offsetWidth);
    setLineLeft(target.childNodes[0].offsetLeft);
  }

  if (isFirstState) {
    window.setTimeout(() => {
      let currentTab = document.getElementsByClassName('s-current')[0];
      currentTab && setValues(currentTab);
    }, 80);
  }

  const onTabChange = ev => {
    props.discardTabError && props.discardTabError(currentIndex, ev.currentTarget.dataset.index);
    setIsFirstState(false);
    setValues(ev.currentTarget);
  }

  return (
    <>
      {tabs.map(eachContent)}
    </>
  );
  // return (
  //   <>
  //     <div className="s-tabs">
  //       {tabs.map(eachTab)}
  //     </div>
  //     <div className={"s-tabs-underline" + (tabsWithError[currentIndex] ? " with-error" : "")}><div style={{width: lineWidth, left: lineLeft, transition: isFirstState ? "none" : "all .3s"}}/></div>
  //     {tabs.map(eachContent)}
  //   </>
  // );
}

export default STabs;