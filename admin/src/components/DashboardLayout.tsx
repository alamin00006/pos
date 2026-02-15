"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "@/lib/router";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { logout as logoutAction } from "@/redux/authSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/hooks/usePermission";

import {
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MenuItem, MenuSection, menuSections } from "@/helpers/utils/Menu";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { hasPermission } = usePermission();

  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "New sale completed",
      message: "Invoice #INV-2045 processed successfully.",
      time: "2 min ago",
    },
    {
      id: "n2",
      title: "Low stock alert",
      message: "Product “Premium Oil 5L” is below threshold.",
      time: "18 min ago",
    },
    {
      id: "n3",
      title: "Payment received",
      message: "Customer payment of Tk 18,500 received.",
      time: "1 hr ago",
    },
  ];

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label],
    );
  };

  const isChildActive = (item: MenuItem) =>
    item.children?.some((child) => location.pathname === child.path) ?? false;

  // Permissions from user (permissions: string[])
  const filteredMenuSections = useMemo(() => {
    return menuSections
      .map((section) => {
        const items = section.items
          .map((item) => {
            const hasChildren = !!item.children?.length;

            // Single
            if (!hasChildren) {
              return hasPermission(item.permissionKey) ? item : null;
            }

            // Parent + children
            const children = (item.children || []).filter((c) =>
              hasPermission(c.permissionKey),
            );

            const parentOk = hasPermission(item.permissionKey);

            if (!parentOk && children.length === 0) return null;

            return { ...item, children };
          })
          .filter(Boolean) as MenuItem[];

        if (items.length === 0) return null;
        return { ...section, items };
      })
      .filter(Boolean) as MenuSection[];
  }, [hasPermission]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link
          className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}
          href="/dashboard"
        >
          <div className="w-10 h-10 rounded-lg bg-sidebar-accent/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-sidebar-foreground font-bold text-lg">S</span>
          </div>
          {!isSidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
                SoftGhor
              </h1>
              <p className="text-xs text-sidebar-foreground/70">POS System</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {filteredMenuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {section.title && !isSidebarCollapsed && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-4 mb-2">
                {section.title}
              </p>
            )}

            <ul className="space-y-1">
              {section.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isActive = item.path
                  ? location.pathname === item.path
                  : isChildActive(item);
                const isOpen =
                  openMenus.includes(item.label) || isChildActive(item);

                if (hasChildren) {
                  return (
                    <li key={item.label}>
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => toggleMenu(item.label)}
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            className={`group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-foreground shadow-md"
                                : "text-sidebar-foreground/90 hover:bg-sidebar-accent/10"
                            } ${isSidebarCollapsed ? "justify-center" : ""}`}
                            title={isSidebarCollapsed ? item.label : undefined}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                className={`w-5 h-5 transition-colors ${
                                  isActive
                                    ? "text-sidebar-primary"
                                    : "text-sidebar-foreground/80 group-hover:text-sidebar-foreground"
                                }`}
                              />
                              {!isSidebarCollapsed && (
                                <span className="font-medium">
                                  {item.label}
                                </span>
                              )}
                            </div>

                            {!isSidebarCollapsed &&
                              (isOpen ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              ))}
                          </button>
                        </CollapsibleTrigger>

                        {!isSidebarCollapsed && (
                          <CollapsibleContent>
                            <ul className="mt-1 ml-4 space-y-1">
                              {item.children?.map((child) => {
                                const isChildItemActive =
                                  location.pathname === child.path;
                                return (
                                  <li key={child.path}>
                                    <a
                                      href={child.path}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                        isChildItemActive
                                          ? "bg-sidebar-accent/20 text-sidebar-foreground"
                                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                                      }`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                      {child.label}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <a
                      href={item.path!}
                      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-foreground shadow-md"
                          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/10"
                      } ${isSidebarCollapsed ? "justify-center" : ""}`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/80 group-hover:text-sidebar-foreground"
                        }`}
                      />
                      {!isSidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar">
        {!isSidebarCollapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent/30 flex items-center justify-center">
                <span className="text-sidebar-foreground font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.roles?.[0] || "Role"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 border-0"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 border-0"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 shadow-xl transition-[width] duration-200 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-header flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex text-header-foreground hover:bg-header-foreground/10"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"
              }
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-header-foreground hover:bg-header-foreground/10"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div>
              <h2 className="text-lg font-bold text-header-foreground">
                SOFTGHOR Digital POS Software
              </h2>
              <p className="text-xs text-primary">
                To Order: 01958-104255, 01958-104250
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-header-foreground/50" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-header-foreground/10 border-0 text-header-foreground placeholder:text-header-foreground/50"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-header-foreground hover:bg-header-foreground/10"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-header-foreground hover:bg-header-foreground/10"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>

            {isNotificationsOpen && (
              <div className="absolute right-4 top-16 z-50 w-80 rounded-lg border border-border bg-card shadow-lg">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Notifications
                  </p>
                  <button
                    className="text-xs text-primary hover:text-primary/90"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {notifications.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {item.time}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 text-center">
                  <button className="text-xs text-primary hover:text-primary/90">
                    View all
                  </button>
                </div>
              </div>
            )}

            <div className="relative hidden sm:flex items-center gap-2 pl-4 border-l border-header-foreground/20">
              <button
                className="flex items-center gap-2 text-header-foreground hover:text-header-foreground/90"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-header-foreground/20 flex items-center justify-center">
                  <span className="text-header-foreground text-sm font-semibold">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-header-foreground/70" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-border bg-card shadow-lg">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.name || "Account"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.roles?.[0] || "User"}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted/50"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/settings");
                      }}
                    >
                      Settings
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted/50"
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
