'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  RefreshCw,
  Crown,
  Globe,
  Mail,
  Shield,
  Database,
  Palette,
  Bell,
  Key,
  Server
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxBookingsPerUser: number;
  bookingCancellationHours: number;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Dahabiyat Nile Cruise',
    siteDescription: 'Luxury Nile River Cruises in Egypt',
    siteUrl: 'https://dahabiyat.com',
    adminEmail: 'admin@dahabiyat.com',
    supportEmail: 'support@dahabiyat.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    maxBookingsPerUser: 5,
    bookingCancellationHours: 24,
    defaultCurrency: 'USD',
    timezone: 'Africa/Cairo',
    dateFormat: 'MM/DD/YYYY',
    primaryColor: '#3B82F6',
    secondaryColor: '#F59E0B',
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico'
  });

  useEffect(() => {
    if (session?.user?.role && ['ADMIN'].includes(session.user.role)) {
      loadSettings();
    }
  }, [session]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Settings...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only administrators may access system settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-ocean-blue-600 via-navy-blue-600 to-deep-blue-700 rounded-lg shadow-lg">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <Settings className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">System Settings</h1>
              <p className="text-amber-200">Configure system-wide settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 bg-white/80 backdrop-blur-sm border-2 border-amber-200 p-2">
              <TabsTrigger value="general" className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">General</span>
                <span className="sm:hidden">Gen</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Email</span>
                <span className="sm:hidden">Mail</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Security</span>
                <span className="sm:hidden">Sec</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Booking</span>
                <span className="sm:hidden">Book</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Appearance</span>
                <span className="sm:hidden">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Notif</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-6 h-6" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="siteName" className="text-amber-800 font-semibold">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => updateSetting('siteName', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteUrl" className="text-amber-800 font-semibold">Site URL</Label>
                      <Input
                        id="siteUrl"
                        value={settings.siteUrl}
                        onChange={(e) => updateSetting('siteUrl', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="siteDescription" className="text-amber-800 font-semibold">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => updateSetting('siteDescription', e.target.value)}
                      className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="defaultCurrency" className="text-amber-800 font-semibold">Default Currency</Label>
                      <Input
                        id="defaultCurrency"
                        value={settings.defaultCurrency}
                        onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-amber-800 font-semibold">Timezone</Label>
                      <Input
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateFormat" className="text-amber-800 font-semibold">Date Format</Label>
                      <Input
                        id="dateFormat"
                        value={settings.dateFormat}
                        onChange={(e) => updateSetting('dateFormat', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                    />
                    <Label htmlFor="maintenanceMode" className="text-amber-800 font-semibold">
                      Maintenance Mode
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="w-6 h-6" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="adminEmail" className="text-amber-800 font-semibold">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => updateSetting('adminEmail', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supportEmail" className="text-amber-800 font-semibold">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => updateSetting('supportEmail', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                    <Label htmlFor="emailNotifications" className="text-amber-800 font-semibold">
                      Enable Email Notifications
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowRegistration"
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => updateSetting('allowRegistration', checked)}
                    />
                    <Label htmlFor="allowRegistration" className="text-amber-800 font-semibold">
                      Allow User Registration
                    </Label>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <Key className="w-5 h-5" />
                      <span className="font-semibold">Security Notice</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Additional security settings like two-factor authentication, password policies, and API keys should be configured through environment variables and server configuration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Booking Settings */}
            <TabsContent value="booking" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Database className="w-6 h-6" />
                    Booking Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="maxBookingsPerUser" className="text-amber-800 font-semibold">Max Bookings Per User</Label>
                      <Input
                        id="maxBookingsPerUser"
                        type="number"
                        value={settings.maxBookingsPerUser}
                        onChange={(e) => updateSetting('maxBookingsPerUser', parseInt(e.target.value))}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bookingCancellationHours" className="text-amber-800 font-semibold">Cancellation Hours</Label>
                      <Input
                        id="bookingCancellationHours"
                        type="number"
                        value={settings.bookingCancellationHours}
                        onChange={(e) => updateSetting('bookingCancellationHours', parseInt(e.target.value))}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Palette className="w-6 h-6" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="primaryColor" className="text-amber-800 font-semibold">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => updateSetting('primaryColor', e.target.value)}
                          className="w-16 h-10 border-2 border-amber-200"
                        />
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => updateSetting('primaryColor', e.target.value)}
                          className="flex-1 border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor" className="text-amber-800 font-semibold">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                          className="w-16 h-10 border-2 border-amber-200"
                        />
                        <Input
                          value={settings.secondaryColor}
                          onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                          className="flex-1 border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="logoUrl" className="text-amber-800 font-semibold">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={settings.logoUrl}
                        onChange={(e) => updateSetting('logoUrl', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faviconUrl" className="text-amber-800 font-semibold">Favicon URL</Label>
                      <Input
                        id="faviconUrl"
                        value={settings.faviconUrl}
                        onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Bell className="w-6 h-6" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                      />
                      <Label htmlFor="emailNotifications" className="text-amber-800 font-semibold">
                        Email Notifications
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="smsNotifications"
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                      />
                      <Label htmlFor="smsNotifications" className="text-amber-800 font-semibold">
                        SMS Notifications
                      </Label>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <Server className="w-5 h-5" />
                      <span className="font-semibold">Integration Notice</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      SMS notifications require additional setup with a service provider like Twilio. Email notifications use the configured SMTP settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 px-4">
            <Button
              onClick={loadSettings}
              variant="outline"
              disabled={saving}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}