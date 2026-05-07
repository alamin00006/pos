import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  Copy,
  Palette,
  RotateCcw,
  Settings as SettingsIcon,
} from "lucide-react";

const DEFAULT_PRIMARY_COLOR = "#16a34a";
const primaryStorageKey = "ui:primary-color";

const primaryPresets = [
  "#f97316",
  "#2563eb",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#64748b",
  "#ec4899",
  "#06b6d4",
  "#000000",
  "#1f2937",
  "#16a34a",
];

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("others");
  const { resolvedTheme, setTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);

  const [settings, setSettings] = useState({
    // Company Details
    company: "POS Software",
    email: "info@possoftware.com",
    phone: "01779724380",
    address: "Holding: 53 (1st floor), Road: 04 Block: G,Banasree , Dhaka 1219.",

    // Invoice Settings
    invoiceLogoType: "logo",
    invoiceDesign: "a4",

    // Barcode Settings
    barcodeType: "single",

    // Other Settings
    lowStockQuantity: "10",
    currency: "Tk",
  });

  const applyPrimaryColor = (hex: string) => {
    if (!isHexColor(hex)) {
      return;
    }
    const normalized = hex.toLowerCase();
    const root = document.documentElement;
    const foreground = getReadableForeground(normalized);
    root.style.setProperty("--primary", normalized);
    root.style.setProperty("--ring", normalized);
    root.style.setProperty("--sidebar-primary", normalized);
    root.style.setProperty("--primary-foreground", foreground);
    root.style.setProperty(
      "--sidebar-primary-foreground",
      foreground,
    );
  };

  const updatePrimaryColor = (hex: string) => {
    const normalized = hex.toLowerCase();
    setPrimaryColor(normalized);
    if (!isHexColor(normalized)) {
      return;
    }
    applyPrimaryColor(normalized);
    window.localStorage.setItem(primaryStorageKey, normalized);
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(primaryStorageKey);
    if (stored && isHexColor(stored)) {
      const nextColor =
        stored.toLowerCase() === "#f66e2a" ? DEFAULT_PRIMARY_COLOR : stored;
      setPrimaryColor(nextColor);
      applyPrimaryColor(nextColor);
      window.localStorage.setItem(primaryStorageKey, nextColor);
      return;
    }
    if (stored) {
      window.localStorage.removeItem(primaryStorageKey);
    }
    applyPrimaryColor(DEFAULT_PRIMARY_COLOR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primaryPreview = useMemo(
    () => (isHexColor(primaryColor) ? primaryColor : DEFAULT_PRIMARY_COLOR),
    [primaryColor],
  );

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleCopyPrimary = async () => {
    if (!isHexColor(primaryPreview)) {
      return;
    }
    await navigator.clipboard?.writeText(primaryPreview.toUpperCase());
    toast({
      title: "HEX copied",
      description: `${primaryPreview.toUpperCase()} copied to clipboard.`,
    });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary">Settings</h1>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="others"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              OTHERS
            </TabsTrigger>
            <TabsTrigger
              value="color"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Palette className="w-4 h-4" />
              COLOR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="others" className="mt-0 space-y-6">
            {/* Company Details Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Company Details</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Logo Section */}
                <div className="flex items-center gap-6">
                  <div className="rounded-md bg-primary px-4 py-3 text-xl font-bold text-primary-foreground">
                    POS Software
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-wider">
                    POINT OF SALE MANAGEMENT
                  </div>
                  <Button variant="outline" className="ml-auto">
                    CHANGE LOGO
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Input
                      value={settings.company}
                      onChange={(e) =>
                        setSettings({ ...settings, company: e.target.value })
                      }
                    />
                    <Label className="text-muted-foreground text-sm">
                      Company
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                    <Label className="text-muted-foreground text-sm">
                      Email Address
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={settings.phone}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                    />
                    <Label className="text-muted-foreground text-sm">Phone</Label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={settings.address}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                    />
                    <Label className="text-muted-foreground text-sm">
                      Address
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Settings Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Invoice Settings</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">
                      Invoice Logo Type
                    </Label>
                    <RadioGroup
                      value={settings.invoiceLogoType}
                      onValueChange={(value) =>
                        setSettings({ ...settings, invoiceLogoType: value })
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="logo" id="logo" />
                        <Label htmlFor="logo" className="cursor-pointer">
                          Logo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name" id="name" />
                        <Label htmlFor="name" className="cursor-pointer">
                          Name
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="cursor-pointer">
                          Both
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">
                      Invoice Design
                    </Label>
                    <Select
                      value={settings.invoiceDesign}
                      onValueChange={(value) =>
                        setSettings({ ...settings, invoiceDesign: value })
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="thermal">Thermal</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode Settings Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Barcode Settings</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Barcode Type
                  </Label>
                  <RadioGroup
                    value={settings.barcodeType}
                    onValueChange={(value) =>
                      setSettings({ ...settings, barcodeType: value })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single" className="cursor-pointer">
                        Single
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a4" id="barcode-a4" />
                      <Label htmlFor="barcode-a4" className="cursor-pointer">
                        A4
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Other Settings Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Other Settings</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={resolvedTheme === "dark"}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                    />
                    <Label>Dark Mode</Label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Low Stock Quantity
                    </Label>
                    <Input
                      type="number"
                      value={settings.lowStockQuantity}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          lowStockQuantity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Currency
                    </Label>
                    <Input
                      value={settings.currency}
                      onChange={(e) =>
                        setSettings({ ...settings, currency: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div>
              <Button onClick={handleSave} size="lg">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="color" className="mt-0">
            <div className="max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-foreground">
                  <Palette className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-foreground">
                    Theme Color
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Customize your primary brand color
                  </p>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  Current Color
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyPrimary}
                >
                  <Copy className="h-4 w-4" />
                  Copy HEX
                </Button>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-md border border-border shadow-md"
                  style={{ backgroundColor: primaryPreview }}
                />
                <div>
                  <p className="font-mono text-base font-semibold uppercase text-foreground">
                    {primaryPreview}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Primary brand color
                  </p>
                  <div className="mt-3 flex gap-2">
                    {[90, 70, 50, 32, 18].map((mix) => (
                      <span
                        key={mix}
                        className="h-3 w-8 rounded-full"
                        style={{
                          backgroundColor: `color-mix(in oklab, ${primaryPreview} ${mix}%, white)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Custom Color
                </p>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    value={primaryPreview}
                    onChange={(e) => updatePrimaryColor(e.target.value)}
                    className="h-11 w-14 shrink-0 p-1"
                    aria-label="Primary color picker"
                  />
                  <div className="min-w-0 flex-1">
                    <Input
                      value={primaryColor}
                      onChange={(e) => updatePrimaryColor(e.target.value)}
                      placeholder={DEFAULT_PRIMARY_COLOR}
                      className={
                        isHexColor(primaryColor)
                          ? "font-mono uppercase"
                          : "font-mono uppercase border-destructive focus-visible:ring-destructive"
                      }
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Enter a HEX color code or use the picker.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Preset Colors
                </p>
                <p className="text-xs text-muted-foreground">
                  {primaryPresets.length} options
                </p>
              </div>

              <div className="mb-5 grid grid-cols-6 gap-3">
                {primaryPresets.map((color) => {
                  const active =
                    primaryPreview.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      className="relative h-8 rounded-md border border-border shadow-sm transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      style={{ backgroundColor: color }}
                      onClick={() => updatePrimaryColor(color)}
                      aria-label={`Set primary color ${color}`}
                    >
                      {active && (
                        <span className="absolute inset-0 grid place-items-center text-white">
                          <Check className="h-4 w-4 drop-shadow" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Active
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updatePrimaryColor(DEFAULT_PRIMARY_COLOR)}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>

              {!isHexColor(primaryColor) && (
                <p className="mt-2 text-xs text-destructive">
                  Enter a valid 6 digit hex color like {DEFAULT_PRIMARY_COLOR}.
                </p>
              )}
            </div>
          </TabsContent>

        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">POS Software</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

const isHexColor = (value: string) =>
  /^#([0-9a-fA-F]{6})$/.test(value);

const getReadableForeground = (hex: string) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 150 ? "#101828" : "#ffffff";
};
