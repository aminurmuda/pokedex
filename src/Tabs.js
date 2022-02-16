/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";

export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
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
      <div className="pt-4 pb-4 has-background-white">{activeTab.content}</div>
    </>
  );
}
