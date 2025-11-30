'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Bell, Mail, Save, Plus, Trash2, RefreshCw } from 'lucide-react';

interface NotificationChannel {
  type: 'email' | 'sms' | 'push';
  enabled: boolean;
  settings: Record<string, any>;
}

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  channels: string[];
  conditions: Record<string, any>;
  isActive: boolean;
}

export default function NotificationSettings() {
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notification settings
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API call
      const mockChannels: NotificationChannel[] = [
        {
          type: 'email',
          enabled: true,
          settings: {
            fromEmail: 'noreply@altavidatours.com',
            fromName: 'Altavida Tours.com',
            replyTo: 'info@altavidatours.com',
          },
        },
        {
          type: 'sms',
          enabled: true,
          settings: {
            provider: 'twilio',
            fromNumber: '+1234567890',
          },
        },
        {
          type: 'push',
          enabled: true,
          settings: {
            enabledForMobile: true,
            enabledForWeb: true,
          },
        },
      ];

      const mockTemplates: NotificationTemplate[] = [
        {
          id: 'booking-confirmation',
          name: 'Booking Confirmation',
          description: 'Sent when a new booking is confirmed',
          channels: ['email', 'sms'],
          conditions: { event: 'booking_confirmed' },
          isActive: true,
        },
        {
          id: 'payment-reminder',
          name: 'Payment Reminder',
          description: 'Sent before payment due date',
          channels: ['email'],
          conditions: { event: 'payment_due', daysBefore: 3 },
          isActive: true,
        },
        {
          id: 'tour-reminder',
          name: 'Tour Reminder',
          description: 'Sent before tour start date',
          channels: ['email', 'sms', 'push'],
          conditions: { event: 'tour_reminder', daysBefore: 1 },
          isActive: true,
        },
      ];

      setChannels(mockChannels);
      setTemplates(mockTemplates);
      if (mockTemplates.length > 0) {
        setSelectedTemplate(mockTemplates[0]);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send the updated settings to your API
      // await fetch('/api/notification-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ channels, templates }),
      // });
      
      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle channel status
  const toggleChannel = (type: 'email' | 'sms' | 'push', enabled: boolean) => {
    setChannels(
      channels.map((channel) =>
        channel.type === type ? { ...channel, enabled } : channel
      )
    );
  };

  // Update channel settings
  const updateChannelSettings = (type: 'email' | 'sms' | 'push', key: string, value: any) => {
    setChannels(
      channels.map((channel) =>
        channel.type === type
          ? {
              ...channel,
              settings: { ...channel.settings, [key]: value },
            }
          : channel
      )
    );
  };

  // Toggle template status
  const toggleTemplateStatus = (templateId: string, isActive: boolean) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateId ? { ...template, isActive } : template
      )
    );
  };

  // Update template channels
  const updateTemplateChannels = (templateId: string, channel: string, enabled: boolean) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              channels: enabled
                ? [...template.channels, channel]
                : template.channels.filter((c) => c !== channel),
            }
          : template
      )
    );
  };

  // Initialize component
  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchSettings} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Channels */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <p className="text-sm text-gray-500">
                Configure how notifications are delivered
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {channels.map((channel) => (
                <div key={channel.type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium capitalize">{channel.type}</h3>
                      <p className="text-sm text-gray-500">
                        {channel.type === 'email' && 'Email notifications'}
                        {channel.type === 'sms' && 'SMS notifications'}
                        {channel.type === 'push' && 'Push notifications'}
                      </p>
                    </div>
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={(checked) =>
                        toggleChannel(channel.type, checked)
                      }
                    />
                  </div>

                  {channel.enabled && (
                    <div className="pl-2 space-y-3 border-l-2 border-gray-100">
                      {channel.type === 'email' && (
                        <>
                          <div>
                            <Label>From Email</Label>
                            <Input
                              value={channel.settings.fromEmail}
                              onChange={(e) =>
                                updateChannelSettings(
                                  'email',
                                  'fromEmail',
                                  e.target.value
                                )
                              }
                              placeholder="noreply@example.com"
                            />
                          </div>
                          <div>
                            <Label>From Name</Label>
                            <Input
                              value={channel.settings.fromName}
                              onChange={(e) =>
                                updateChannelSettings(
                                  'email',
                                  'fromName',
                                  e.target.value
                                )
                              }
                              placeholder="Your Company Name"
                            />
                          </div>
                          <div>
                            <Label>Reply-To Email</Label>
                            <Input
                              value={channel.settings.replyTo}
                              onChange={(e) =>
                                updateChannelSettings(
                                  'email',
                                  'replyTo',
                                  e.target.value
                                )
                              }
                              placeholder="support@example.com"
                            />
                          </div>
                        </>
                      )}

                      {channel.type === 'sms' && (
                        <>
                          <div>
                            <Label>Provider</Label>
                            <Select
                              value={channel.settings.provider}
                              onValueChange={(value) =>
                                updateChannelSettings('sms', 'provider', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                                <SelectItem value="plivo">Plivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>From Number</Label>
                            <Input
                              value={channel.settings.fromNumber}
                              onChange={(e) =>
                                updateChannelSettings(
                                  'sms',
                                  'fromNumber',
                                  e.target.value
                                )
                              }
                              placeholder="+1234567890"
                            />
                          </div>
                        </>
                      )}

                      {channel.type === 'push' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="mobile-push"
                              checked={channel.settings.enabledForMobile}
                              onCheckedChange={(checked) =>
                                updateChannelSettings(
                                  'push',
                                  'enabledForMobile',
                                  checked
                                )
                              }
                            />
                            <Label htmlFor="mobile-push">Enable for Mobile</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="web-push"
                              checked={channel.settings.enabledForWeb}
                              onCheckedChange={(checked) =>
                                updateChannelSettings(
                                  'push',
                                  'enabledForWeb',
                                  checked
                                )
                              }
                            />
                            <Label htmlFor="web-push">Enable for Web</Label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notification Templates */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <p className="text-sm text-gray-500">
                Manage notification templates for different events
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select
                    value={selectedTemplate?.id || ''}
                    onValueChange={(value) => {
                      const template = templates.find((t) => t.id === value);
                      if (template) setSelectedTemplate(template);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{selectedTemplate.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedTemplate.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={selectedTemplate.isActive}
                          onCheckedChange={(checked) =>
                            toggleTemplateStatus(selectedTemplate.id, checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Delivery Channels</h4>
                      <div className="space-y-2">
                        {channels.map((channel) => (
                          <div
                            key={channel.type}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <Label className="capitalize">{channel.type}</Label>
                              <p className="text-xs text-gray-500">
                                {channel.type === 'email' && 'Send as email'}
                                {channel.type === 'sms' && 'Send as SMS'}
                                {channel.type === 'push' && 'Send as push notification'}
                              </p>
                            </div>
                            <Switch
                              checked={selectedTemplate.channels.includes(channel.type)}
                              onCheckedChange={(checked) =>
                                updateTemplateChannels(
                                  selectedTemplate.id,
                                  channel.type,
                                  checked
                                )
                              }
                              disabled={!channel.enabled}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Conditions</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(selectedTemplate.conditions).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Edit Email Template
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Notifications</CardTitle>
              <p className="text-sm text-gray-500">
                Send test notifications to verify your settings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Test Email</Label>
                <div className="flex space-x-2 mt-1">
                  <Input placeholder="test@example.com" className="flex-1" />
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </div>
              <div>
                <Label>Test SMS</Label>
                <div className="flex space-x-2 mt-1">
                  <Input placeholder="+1234567890" className="flex-1" />
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
