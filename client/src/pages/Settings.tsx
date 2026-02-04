import { useState } from "react";
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
    darkMode: false,
    lowStockQuantity: "10",
    currency: "Tk",
  });

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
                      checked={settings.darkMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, darkMode: checked })
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
