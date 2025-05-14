
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Dashboard tabs component that properly implements Radix UI Tab behavior
 * This component ensures tabs maintain their state correctly
 */
const DashboardTabs: React.FC<DashboardTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs 
      value={activeTab} 
      className="w-full" 
      onValueChange={onTabChange}
      defaultValue={activeTab}
    >
      {/* Hidden TabsList - critical for Radix UI's internal state management */}
      <TabsList className="hidden">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab content areas */}
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value} 
          className="m-0 focus:outline-none"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default React.memo(DashboardTabs);
