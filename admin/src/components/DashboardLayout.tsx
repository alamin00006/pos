"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "@/lib/router";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { logout as logoutAction } from "@/redux/authSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermission } from "@/hooks/usePermission";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  LayoutDashboard,
  ShoppingBag,
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
  X,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { MenuItem, MenuSection, menuSections } from "@/helpers/utils/Menu";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

function SidebarLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  // Support "#" links if needed
  if (href === "#") {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { hasPermission } = usePermission();

  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useIsMobile();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const isChildActive = (item: MenuItem) =>
    item.children?.some((child) => location.pathname === child.path) ?? false;

  // ✅ AdminSidebar-style permission filter (parent + children)
  const filteredMenuSections = useMemo(() => {
    return menuSections
      .map((section) => {
        const items = section.items
          .map((item) => {
            const hasChildren = !!item.children?.length;

            // Single item
            if (!hasChildren) {
              return item.permissionKey
                ? hasPermission(item.permissionKey)
                  ? item
                  : null
                : item;
            }

            // Parent + children
            const children = (item.children || []).filter((c) =>
              c.permissionKey ? hasPermission(c.permissionKey) : true,
            );

            const parentOk = item.permissionKey
              ? hasPermission(item.permissionKey)
              : true;

            if (!parentOk && children.length === 0) return null;

            return { ...item, children };
          })
          .filter(Boolean) as MenuItem[];

        if (items.length === 0) return null;
        return { ...section, items };
      })
      .filter(Boolean) as MenuSection[];
  }, [hasPermission]);

  const SidebarContent = ({
    collapsed,
    onCloseMobile,
  }: {
    collapsed: boolean;
    onCloseMobile?: () => void;
  }) => {
    return (
      <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
        {/* Top / Brand (mobile close like AdminSidebar) */}
        {isMobile ? (
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                <span className="text-primary">Pos</span>soft
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              className="h-8 w-8 text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          !collapsed && (
            <div className="pt-3 pb-2 flex items-center justify-center gap-2">
              <span className="font-bold text-xl">
                <span className="text-primary">Pos</span>soft
              </span>
            </div>
          )
        )}

        {/* Search (only when not collapsed on desktop, always on mobile like AdminSidebar) */}
        {(!collapsed || isMobile) && (
          <div className={cn("px-3 pb-2", !isMobile && "p-3")}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <Input
                placeholder="Search Menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white text-black border-none placeholder:text-black h-9"
              />
            </div>
          </div>
        )}

        {/* Menu */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4 pb-4">
            {filteredMenuSections.map((section, idx) => (
              <div key={section.title ?? idx}>
                {(!collapsed || isMobile) && section.title && (
                  <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2 px-3">
                    {section.title}
                  </div>
                )}

                <div className="space-y-0.5">
                  {section.items
                    .filter((item) => {
                      // optional: search filter by label + child label
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      const selfMatch = item.label.toLowerCase().includes(q);
                      const childMatch =
                        item.children?.some((c) =>
                          c.label.toLowerCase().includes(q),
                        ) ?? false;
                      return selfMatch || childMatch;
                    })
                    .map((item) => {
                      const Icon = item.icon || ShoppingBag;
                      const hasChildren = !!item.children?.length;

                      const isActive = item.path
                        ? location.pathname === item.path
                        : isChildActive(item);

                      const isExpanded =
                        expandedItems.includes(item.label) ||
                        isChildActive(item);

                      return (
                        <div key={item.label}>
                          {hasChildren ? (
                            <Collapsible
                              open={isExpanded}
                              onOpenChange={() => toggleExpanded(item.label)}
                            >
                              <CollapsibleTrigger asChild>
                                <button
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                                    collapsed && !isMobile && "justify-center",
                                    isActive &&
                                      "bg-sidebar-accent text-sidebar-foreground",
                                  )}
                                  title={
                                    collapsed && !isMobile
                                      ? item.label
                                      : undefined
                                  }
                                >
                                  <Icon className="h-4 w-4 shrink-0" />
                                  {(!collapsed || isMobile) && (
                                    <>
                                      <span className="flex-1 text-left text-sm">
                                        {item.label}
                                      </span>
                                      <span className="text-sidebar-foreground/50">
                                        {isExpanded ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </span>
                                    </>
                                  )}
                                </button>
                              </CollapsibleTrigger>

                              {(!collapsed || isMobile) && (
                                <CollapsibleContent>
                                  <div className="ml-7 mt-1 space-y-0.5">
                                    {item.children?.map((child) => {
                                      const active =
                                        location.pathname === child.path;
                                      return (
                                        <SidebarLink
                                          key={child.path}
                                          href={child.path}
                                          className={cn(
                                            "block px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                                            active &&
                                              "bg-sidebar-accent text-sidebar-foreground",
                                          )}
                                        >
                                          {child.label}
                                        </SidebarLink>
                                      );
                                    })}
                                  </div>
                                </CollapsibleContent>
                              )}
                            </Collapsible>
                          ) : (
                            <SidebarLink
                              href={item.path ?? "#"}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                                collapsed && !isMobile && "justify-center",
                                item.path &&
                                  location.pathname === item.path &&
                                  "bg-sidebar-accent text-sidebar-foreground",
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              {(!collapsed || isMobile) && (
                                <span className="flex-1 text-left text-sm">
                                  {item.label}
                                </span>
                              )}
                            </SidebarLink>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom user + logout (AdminSidebar style) */}
        <div className="p-3 border-t border-sidebar-border">
          {!collapsed || isMobile ? (
            <>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-primary">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-sidebar-foreground">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.roles?.[0] || "Role"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/60 shrink-0" />
              </div>

              <Button
                variant="ghost"
                className="mt-2 w-full justify-start gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 border-0"
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
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col flex-shrink-0 shadow-xl transition-[width] duration-200",
          isSidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent collapsed={isSidebarCollapsed} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-header flex items-center justify-between px-4 lg:px-6 relative">
          <div className="flex items-center gap-4">
            {/* Desktop collapse btn */}
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

            {/* Mobile Menu (AdminSidebar overlay inside Sheet) */}
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
                <SidebarContent
                  collapsed={false}
                  onCloseMobile={() => {
                    // Sheet closes itself when user clicks outside / close button?
                    // If your Sheet needs manual close, handle it via controlled Sheet.
                  }}
                />
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
