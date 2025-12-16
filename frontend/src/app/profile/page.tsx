"use client"

import { AlertCircle, CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { PageContainer, PageHeader } from "@/components/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const notificationPreferences = [
  {
    title: "Project updates",
    description: "Daily summaries for active projects and assigned tasks",
    defaultChecked: true,
  },
  {
    title: "Team messages",
    description: "Mentions, direct replies, and channel activity",
    defaultChecked: true,
  },
  {
    title: "Approvals",
    description: "Submittals, change orders, and invoice approvals",
    defaultChecked: true,
  },
  {
    title: "Weekly digest",
    description: "High-level portfolio health and blockers",
    defaultChecked: false,
  },
]

const communicationPreferences = [
  {
    title: "Email",
    description: "Send detailed summaries and approvals to jordan@alleato.build",
    defaultChecked: true,
  },
  {
    title: "Mobile push",
    description: "Time-sensitive alerts while you're on site",
    defaultChecked: true,
  },
  {
    title: "SMS",
    description: "Critical escalations when away from the app",
    defaultChecked: false,
  },
]

const securityItems = [
  {
    title: "Two-factor authentication",
    status: "Enabled",
    statusColor: "text-emerald-600",
    description: "Authenticator app configured on primary device",
    icon: ShieldCheck,
  },
  {
    title: "Last login",
    status: "Today, 8:42 AM",
    statusColor: "text-slate-600",
    description: "San Francisco, CA · Chrome on macOS",
    icon: Clock,
  },
  {
    title: "Active sessions",
    status: "2 devices",
    statusColor: "text-slate-600",
    description: "MacBook Pro · iPhone 15",
    icon: CheckCircle2,
  },
]

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal details, notification preferences, and security settings."
        breadcrumbs={[
          { label: "Account", href: "/settings" },
          { label: "Profile" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Edit profile
            </Button>
            <Button size="sm">
              Save changes
            </Button>
          </div>
        }
      />

      <PageContainer className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatars/avatar-01.png" alt="Jordan Steele" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Jordan Steele</CardTitle>
                    <Badge variant="secondary">Project Admin</Badge>
                  </div>
                  <CardDescription>Senior Project Manager · Alleato Construction</CardDescription>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>License: CA B-1059920</span>
                    <span className="text-gray-300">•</span>
                    <span>Timezone: PST (UTC-8)</span>
                    <span className="text-gray-300">•</span>
                    <span>Primary region: West Coast</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update photo
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>jordan@alleato.build</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>(415) 555-0142</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile completeness</span>
                    <span className="font-semibold text-foreground">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">Emergency contacts pending</Badge>
                    <Badge variant="outline">Safety certifications updated</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <Badge variant="outline">Concrete</Badge>
              <Badge variant="outline">Healthcare</Badge>
              <Badge variant="outline">Data centers</Badge>
              <Badge variant="outline">Tenant improvement</Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work preferences</CardTitle>
              <CardDescription>Set your availability and the information your team sees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between rounded-lg border bg-white p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Default role</p>
                  <p className="text-sm text-muted-foreground">Project Manager · Structural focus</p>
                </div>
                <Badge>Primary</Badge>
              </div>
              <div className="flex items-start justify-between rounded-lg border bg-white p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Work hours</p>
                  <p className="text-sm text-muted-foreground">6:30 AM - 4:00 PM · Monday - Friday</p>
                </div>
                <Badge variant="secondary">Field first</Badge>
              </div>
              <div className="flex items-start justify-between rounded-lg border bg-white p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Preferred communication</p>
                  <p className="text-sm text-muted-foreground">Push first, email summaries daily</p>
                </div>
                <Badge variant="secondary">Updated</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose when and how you are notified about project activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationPreferences.map((preference) => (
                <div key={preference.title} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{preference.title}</p>
                    <p className="text-sm text-muted-foreground">{preference.description}</p>
                  </div>
                  <Switch defaultChecked={preference.defaultChecked} aria-label={preference.title} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication channels</CardTitle>
              <CardDescription>Control which channels are used for different notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {communicationPreferences.map((preference) => (
                <div key={preference.title} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{preference.title}</p>
                    <p className="text-sm text-muted-foreground">{preference.description}</p>
                  </div>
                  <Switch defaultChecked={preference.defaultChecked} aria-label={preference.title} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Security & access</CardTitle>
              <CardDescription>Keep your account protected across every project workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityItems.map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-xl border bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <item.icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <span className={`text-xs font-semibold ${item.statusColor}`}>{item.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <CardTitle>Account health</CardTitle>
              </div>
              <CardDescription>Review outstanding items to keep your profile current.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-medium">Verify company safety training</p>
                <p className="text-amber-800">Upload the latest OSHA 30 certificate to stay compliant.</p>
              </div>
              <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
                <p className="font-medium">Add emergency contacts</p>
                <p className="text-muted-foreground">Share at least two contacts for site escalations.</p>
              </div>
              <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
                <p className="font-medium">Review permissions</p>
                <p className="text-muted-foreground">Confirm access for current projects and archived work.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
