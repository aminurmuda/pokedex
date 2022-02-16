import React, { useState } from "react";

export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  function handleClick(tab) {
    setActiveTab(tab);
  }
  return (
    <>
      <div className="tabs is-centered">
        <ul>
          {tabs.map((tab) => {
            return (
              <li
                key={tab.name}
                className={activeTab.name === tab.name ? "is-active" : ""}
                onClick={() => {
                  setActiveTab(tab);
                }}
              >
                <a>
                  <p className="bold">{tab.name}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div class="pt-4 pb-4">{activeTab.content}</div>
    </>
  );
}
