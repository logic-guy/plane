import { FC } from "react";
import { observer } from "mobx-react-lite";
// components
import { InstanceAdminSidebarMenu, InstanceHelpSection, InstanceSidebarDropdown } from "components/instance";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";

export interface IInstanceAdminSidebar {}

export const InstanceAdminSidebar: FC<IInstanceAdminSidebar> = observer(() => {
  // store
  const { theme: themStore } = useMobxStore();

  return (
    <div
      className={`fixed inset-y-0 z-20 flex h-full flex-shrink-0 flex-grow-0 flex-col border-r border-custom-sidebar-border-200 bg-custom-sidebar-background-100 duration-300 md:relative ${
        themStore?.sidebarCollapsed ? "" : "md:w-[280px]"
      } ${themStore?.sidebarCollapsed ? "left-0" : "-left-full md:left-0"}`}
    >
      <div className="flex h-full w-full flex-1 flex-col">
        <InstanceSidebarDropdown />
        <InstanceAdminSidebarMenu />
        <InstanceHelpSection />
      </div>
    </div>
  );
});
