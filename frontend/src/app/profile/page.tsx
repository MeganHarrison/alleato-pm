"use client"

import { AlertCircle, CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { useMemo } from "react"

import { PageContainer, PageHeader } from "@/components/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile"
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { getBestAvatarUrl } from "@/lib/gravatar"

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
  const { profile } = useCurrentUserProfile()

  const initials = useMemo(() => {
    const name = profile?.fullName || ""
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }, [profile?.fullName])

  const contactDetails = [
    {
      icon: Mail,
      value: profile?.email ?? "Add an email address",
    },
    {
      icon: Phone,
      value: profile?.phone ?? "Add a phone number",
    },
    {
      icon: MapPin,
      value: profile?.location ?? "Share your location",
    },
  ]

  const specialties = profile?.specialties && profile.specialties.length > 0
    ? profile.specialties
    : ["General contracting", "Field operations"]

  const profileCompleteness = profile?.profileCompleteness ?? 65

  return (
    <>
      <PageHeader
        title={profile?.fullName || "Profile"}
        description="Manage your personal details, notification preferences, and security settings."
        breadcrumbs={[
          { label: "Account", href: "/settings" },
          { label: profile?.fullName ? "Profile" : "Profile setup" },
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
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <Avatar className="h-16 w-16 shrink-0">
                  {profile?.avatarUrl ? (
                    <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                  ) : profile?.email ? (
                    <AvatarImage src={getBestAvatarUrl(undefined, profile.email)} alt={profile.fullName} />
                  ) : null}
                  <AvatarFallback>{initials || "?"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl break-words">{profile?.fullName || "Your profile"}</CardTitle>
                    <Badge variant="secondary">{profile?.role || "Team member"}</Badge>
                  </div>
                  <CardDescription className="break-words">
                    {[profile?.title, profile?.company].filter(Boolean).join(" · ") ||
                      "Share your title and company"}
                  </CardDescription>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span className="break-words">License: {profile?.licenseNumber || "Add license"}</span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="break-words">Timezone: {profile?.timezone || "Set your timezone"}</span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="break-words">Primary region: {profile?.region || "Not specified"}</span>
                  </div>
                </div>
              </div>
              <ProfileImageUpload
                currentImage={profile?.avatarUrl}
                userEmail={profile?.email || ''}
                userName={profile?.fullName || 'User'}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
                  {contactDetails.map((detail, index) => (
                    <div key={`${detail.value}-${index}`} className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground min-w-0">
                        <detail.icon className="h-4 w-4 shrink-0" />
                        <span className="break-words min-w-0">{detail.value}</span>
                      </div>
                      {index < contactDetails.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile completeness</span>
                    <span className="font-semibold text-foreground">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{profile?.workHours || "Set availability"}</Badge>
                    <Badge variant="outline">
                      {profile?.communicationPreference || "Choose communication preference"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="outline">
                  {specialty}
                </Badge>
              ))}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work preferences</CardTitle>
              <CardDescription>Set your availability and the information your team sees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-3 rounded-lg border bg-white p-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium break-words">Default role</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {profile?.role || "Share your primary role"}
                  </p>
                </div>
                <Badge className="shrink-0">{profile?.role ? "Primary" : "Pending"}</Badge>
              </div>
              <div className="flex items-start justify-between gap-3 rounded-lg border bg-white p-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium break-words">Work hours</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {profile?.workHours || "Add your working hours"}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">Updated</Badge>
              </div>
              <div className="flex items-start justify-between gap-3 rounded-lg border bg-white p-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium break-words">Preferred communication</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {profile?.communicationPreference || "Select how we should reach you"}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">Synced</Badge>
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
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground break-words">{preference.title}</p>
                    <p className="text-sm text-muted-foreground break-words">{preference.description}</p>
                  </div>
                  <Switch defaultChecked={preference.defaultChecked} aria-label={preference.title} className="shrink-0" />
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
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground break-words">{preference.title}</p>
                    <p className="text-sm text-muted-foreground break-words">
                      {preference.title === "Email"
                        ? `Send detailed summaries and approvals to ${profile?.email || "your email"}`
                        : preference.description}
                    </p>
                  </div>
                  <Switch defaultChecked={preference.defaultChecked} aria-label={preference.title} className="shrink-0" />
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
                    <item.icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground break-words">{item.title}</p>
                      <span className={`text-xs font-semibold ${item.statusColor} whitespace-nowrap`}>{item.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">{item.description}</p>
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
                <p className="font-medium break-words">Verify company safety training</p>
                <p className="text-amber-800 break-words">Upload the latest OSHA 30 certificate to stay compliant.</p>
              </div>
              <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
                <p className="font-medium break-words">Add emergency contacts</p>
                <p className="text-muted-foreground break-words">Share at least two contacts for site escalations.</p>
              </div>
              <div className="rounded-lg border bg-white p-4 text-sm text-slate-700">
                <p className="font-medium break-words">Review permissions</p>
                <p className="text-muted-foreground break-words">Confirm access for current projects and archived work.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
