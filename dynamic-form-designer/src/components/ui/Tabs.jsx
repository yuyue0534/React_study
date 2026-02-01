/**
 * Tabs 标签页组件
 * 用于切换不同内容区域
 */

import React, { useState } from 'react';
import clsx from 'clsx';

const Tabs = ({ tabs, defaultActiveKey, onChange, className }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.key);
  
  const handleTabClick = (key) => {
    setActiveKey(key);
    onChange?.(key);
  };
  
  const activeTab = tabs.find((tab) => tab.key === activeKey);
  
  return (
    <div className={clsx('flex flex-col h-full', className)}>
      {/* 标签头 */}
      <div className="flex border-b border-dark-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={clsx(
              'tab-item',
              activeKey === tab.key && 'active'
            )}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 标签内容 */}
      <div className="flex-1 overflow-auto">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
