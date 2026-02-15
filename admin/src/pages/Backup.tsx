import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Download, 
  Upload, 
  Database, 
  Clock, 
  Shield, 
  RefreshCw, 
  Trash2, 
  FileDown,
  HardDrive,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupRecord {
  id: number;
  name: string;
  date: string;
  time: string;
  size: string;
  type: "manual" | "scheduled";
  status: "success" | "failed" | "pending";
}

const Backup = () => {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupTime, setBackupTime] = useState("02:00");
  const [retentionDays, setRetentionDays] = useState("30");

  const [backupHistory] = useState<BackupRecord[]>([
    { id: 1, name: "backup_2026_01_31_full.sql", date: "2026-01-31", time: "02:00 AM", size: "45.2 MB", type: "scheduled", status: "success" },
    { id: 2, name: "backup_2026_01_30_full.sql", date: "2026-01-30", time: "02:00 AM", size: "44.8 MB", type: "scheduled", status: "success" },
    { id: 3, name: "backup_2026_01_29_manual.sql", date: "2026-01-29", time: "03:45 PM", size: "44.5 MB", type: "manual", status: "success" },
    { id: 4, name: "backup_2026_01_28_full.sql", date: "2026-01-28", time: "02:00 AM", size: "44.1 MB", type: "scheduled", status: "failed" },
    { id: 5, name: "backup_2026_01_27_full.sql", date: "2026-01-27", time: "02:00 AM", size: "43.9 MB", type: "scheduled", status: "success" },
  ]);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast({
            title: "Backup Complete",
            description: "Your database has been backed up successfully.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleExportData = (format: string) => {
    // Simulate data export
    const data = {
      exportDate: new Date().toISOString(),
      format,
      tables: ["products", "customers", "orders", "inventory"],
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_${new Date().toISOString().split("T")[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Data exported as ${format.toUpperCase()} file.`,
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Import Started",
        description: `Importing ${file.name}...`,
      });
      
      // Simulate import process
      setTimeout(() => {
        toast({
          title: "Import Complete",
          description: "Data has been restored successfully.",
        });
      }, 2000);
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Backup settings have been updated successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "manual":
        return <Badge variant="outline" className="border-primary text-primary">Manual</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="border-secondary text-secondary-foreground">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Backup & Restore">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Backup & Restore</h1>
            <p className="text-muted-foreground">Manage your database backups and data recovery</p>
          </div>
        </div>

        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              BACKUP
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              RESTORE
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              EXPORT DATA
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              SCHEDULE SETTINGS
            </TabsTrigger>
          </TabsList>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <HardDrive className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Backups</p>
                      <p className="text-2xl font-bold">{backupHistory.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-600/10 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Successful</p>
                      <p className="text-2xl font-bold">{backupHistory.filter(b => b.status === "success").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-full">
                      <Calendar className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Backup</p>
                      <p className="text-2xl font-bold">{backupHistory[0]?.date || "Never"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Manual Backup
                </CardTitle>
                <CardDescription>Create an instant backup of your entire database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isBackingUp && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Backup in progress...</span>
                      <span>{backupProgress}%</span>
                    </div>
                    <Progress value={backupProgress} className="h-2" />
                  </div>
                )}
                <Button 
                  onClick={handleManualBackup} 
                  disabled={isBackingUp}
                  className="w-full md:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isBackingUp ? "Creating Backup..." : "Create Backup Now"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>View and manage your previous backups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SL</TableHead>
                        <TableHead>Backup Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupHistory.map((backup, index) => (
                        <TableRow key={backup.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{backup.name}</TableCell>
                          <TableCell>{backup.date}</TableCell>
                          <TableCell>{backup.time}</TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>{getTypeBadge(backup.type)}</TableCell>
                          <TableCell>{getStatusBadge(backup.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={backup.status !== "success"}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={backup.status !== "success"}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Backup</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this backup? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Restore Tab */}
          <TabsContent value="restore" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Restore from Backup
                </CardTitle>
                <CardDescription>Upload a backup file to restore your database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">
                    Warning: Restoring a backup will overwrite all current data. Make sure to create a backup of your current data before proceeding.
                  </p>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your backup file here</p>
                  <p className="text-sm text-muted-foreground mb-4">Supports .sql, .json, .csv files</p>
                  <Label htmlFor="restore-file" className="cursor-pointer">
                    <Input
                      id="restore-file"
                      type="file"
                      accept=".sql,.json,.csv"
                      className="hidden"
                      onChange={handleFileImport}
                    />
                    <Button variant="outline" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </Label>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Or restore from recent backup:</h4>
                  <div className="space-y-2">
                    {backupHistory.filter(b => b.status === "success").slice(0, 3).map((backup) => (
                      <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{backup.name}</p>
                            <p className="text-sm text-muted-foreground">{backup.date} at {backup.time} • {backup.size}</p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Restore
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Restore</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will restore your database to {backup.date} at {backup.time}. All current data will be replaced. Are you sure?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => {
                                toast({
                                  title: "Restore Started",
                                  description: "Your database is being restored...",
                                });
                              }}>
                                Restore
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>Export your data in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 hover:border-primary cursor-pointer transition-colors" onClick={() => handleExportData("json")}>
                    <CardContent className="pt-6 text-center">
                      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                        <FileDown className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">JSON Format</h3>
                      <p className="text-sm text-muted-foreground mb-4">Export all data as JSON file for easy import</p>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export JSON
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary cursor-pointer transition-colors" onClick={() => handleExportData("csv")}>
                    <CardContent className="pt-6 text-center">
                      <div className="p-4 bg-green-600/10 rounded-full w-fit mx-auto mb-4">
                        <FileDown className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">CSV Format</h3>
                      <p className="text-sm text-muted-foreground mb-4">Export data as CSV for spreadsheet applications</p>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary cursor-pointer transition-colors" onClick={() => handleExportData("sql")}>
                    <CardContent className="pt-6 text-center">
                      <div className="p-4 bg-accent rounded-full w-fit mx-auto mb-4">
                        <Database className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">SQL Format</h3>
                      <p className="text-sm text-muted-foreground mb-4">Export as SQL dump for database migration</p>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export SQL
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Tables to Export</CardTitle>
                <CardDescription>Choose which data tables to include in the export</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Products", "Customers", "Orders", "Inventory", "Suppliers", "Employees", "Expenses", "Payments"].map((table) => (
                    <div key={table} className="flex items-center space-x-2">
                      <Switch id={table.toLowerCase()} defaultChecked />
                      <Label htmlFor={table.toLowerCase()}>{table}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Automatic Backup Settings
                </CardTitle>
                <CardDescription>Configure scheduled backups for your database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup your database on a schedule
                    </p>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>

                {autoBackup && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Backup Frequency</Label>
                        <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Backup Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={backupTime}
                          onChange={(e) => setBackupTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retention">Retention Period (days)</Label>
                      <Select value={retentionDays} onValueChange={setRetentionDays}>
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Select retention" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Backups older than this will be automatically deleted
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>
                    <Shield className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Information</CardTitle>
                <CardDescription>Current backup storage usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Used: 222.5 MB</span>
                    <span>Available: 4.78 GB</span>
                  </div>
                  <Progress value={4.5} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You have used 4.5% of your 5 GB backup storage limit.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Backup;
