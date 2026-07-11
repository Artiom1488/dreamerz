import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

const UserSideBar = () => {
  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="offcanvas"
      className="z-50 p-0 [&>[data-sidebar=sidebar]]:rounded-none [&>[data-sidebar=sidebar]]:shadow-none [&>[data-sidebar=sidebar]]:ring-0 [&>[data-sidebar=sidebar]]:border-l [&>[data-sidebar=sidebar]]:border-sidebar-border"
    >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default UserSideBar;