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
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("settings");
  const { resolvedTheme, setTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState("#2cc9b3");

  const [settings, setSettings] = useState({
    // Company Details
    company: "Softghor.Com",
    email: "info@softghor.com",
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

  const primaryStorageKey = "ui:primary-color";

  const applyPrimaryColor = (hex: string) => {
    const hsl = hexToHsl(hex);
    const root = document.documentElement;
    root.style.setProperty("--primary", hsl);
    root.style.setProperty("--ring", hsl);
    root.style.setProperty("--sidebar-primary", hsl);
    root.style.setProperty(
      "--primary-foreground",
      hslForeground(hex),
    );
    root.style.setProperty(
      "--sidebar-primary-foreground",
      hslForeground(hex),
    );
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(primaryStorageKey);
    if (stored && isHexColor(stored)) {
      setPrimaryColor(stored);
      applyPrimaryColor(stored);
      return;
    }
    if (stored) {
      window.localStorage.removeItem(primaryStorageKey);
    }
    applyPrimaryColor(primaryColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isHexColor(primaryColor)) {
      return;
    }
    window.localStorage.setItem(primaryStorageKey, primaryColor);
  }, [primaryColor]);

  const primaryPreview = useMemo(() => primaryColor, [primaryColor]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
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
              value="settings"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              SETTINGS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-0 space-y-6">
            {/* Company Details Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Company Details</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Logo Section */}
                <div className="flex items-center gap-6">
                  <div className="flex">
                    <div className="bg-[hsl(215,28%,17%)] text-white px-4 py-3 font-bold text-xl">
                      SOFT
                    </div>
                    <div className="bg-primary text-white px-4 py-3 font-bold text-xl">
                      GHOR
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-wider">
                    MORE THAN A SOFTWARE COMPANY
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
                      Primary Color
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={primaryPreview}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPrimaryColor(value);
                          applyPrimaryColor(value);
                        }}
                        className="h-10 w-14 p-1"
                      />
                      <Input
                        value={primaryPreview}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPrimaryColor(value);
                          if (isHexColor(value)) {
                            applyPrimaryColor(value);
                          }
                        }}
                        placeholder="#2cc9b3"
                      />
                    </div>
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
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">SOFTGHOR</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

const isHexColor = (value: string) =>
  /^#([0-9a-fA-F]{6})$/.test(value);

const hexToHsl = (hex: string) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  return `${hDeg} ${sPct}% ${lPct}%`;
};

const hslForeground = (hex: string) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.5 ? "222 47% 11%" : "0 0% 100%";
};
