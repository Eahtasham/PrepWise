import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Lock, Mail, Shield, User } from "lucide-react"

interface SettingsContentProps {
  user: any
}

export function SettingsContent({ user }: SettingsContentProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="border-b border-gray-800">
          <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
            <div className="flex overflow-x-auto space-x-4 py-2">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-transparent data-[state=active]:text-teal-500 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-1 py-2"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-transparent data-[state=active]:text-teal-500 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-1 py-2"
              >
                <Mail className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-transparent data-[state=active]:text-teal-500 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-1 py-2"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-transparent data-[state=active]:text-teal-500 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 rounded-none px-1 py-2"
              >
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <TabsContent value="profile" className="mt-6">
          <Card className="dark-gradient border-teal-800">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription className="text-gray-400">Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.image || "/placeholder.svg"} alt="User" />
                    <AvatarFallback className="bg-teal-800 text-teal-100 text-xl">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Change Avatar
                  </Button>
                </div>
                <div className="grid gap-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        defaultValue={user?.name?.split(" ")[0] || ""}
                        className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        defaultValue={user?.name?.split(" ")[1] || ""}
                        className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-gray-300">
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      defaultValue="Software Developer"
                      className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-[100px] bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="dark-gradient border-teal-800">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription className="text-gray-400">Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "email-interviews",
                      label: "Interview Reminders",
                      description: "Get notified about upcoming interviews",
                    },
                    {
                      id: "email-feedback",
                      label: "Interview Feedback",
                      description: "Get notified when feedback is available",
                    },
                    {
                      id: "email-tips",
                      label: "Weekly Tips",
                      description: "Receive weekly interview tips and tricks",
                    },
                    {
                      id: "email-digest",
                      label: "Monthly Digest",
                      description: "Receive a monthly summary of your progress",
                    },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-gray-800">
                      <div>
                        <Label htmlFor={item.id} className="text-white font-medium">
                          {item.label}
                        </Label>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={true} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Push Notifications</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "push-interviews",
                      label: "Interview Alerts",
                      description: "Receive alerts for upcoming interviews",
                    },
                    {
                      id: "push-feedback",
                      label: "Feedback Available",
                      description: "Receive alerts when new feedback is available",
                    },
                    {
                      id: "push-tips",
                      label: "New Tips",
                      description: "Receive alerts for new interview tips",
                    },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-gray-800">
                      <div>
                        <Label htmlFor={item.id} className="text-white font-medium">
                          {item.label}
                        </Label>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={item.id !== "push-tips"} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="dark-gradient border-teal-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Password</CardTitle>
                <Shield className="h-5 w-5 text-teal-500" />
              </div>
              <CardDescription className="text-gray-400">Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-300">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card className="dark-gradient border-teal-800">
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription className="text-gray-400">Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Interview Preferences</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="defaultRole" className="text-gray-300">
                      Default Role
                    </Label>
                    <Select defaultValue="fullstack">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                        <SelectItem value="mobile">Mobile Developer</SelectItem>
                        <SelectItem value="devops">DevOps Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultType" className="text-gray-300">
                      Default Interview Type
                    </Label>
                    <Select defaultValue="mixed">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Account Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-gray-800">
                    <div>
                      <Label htmlFor="account-active" className="text-white font-medium">
                        Account Active
                      </Label>
                      <p className="text-sm text-gray-400">Your account is currently active</p>
                    </div>
                    <Switch id="account-active" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-gray-800">
                    <div>
                      <Label htmlFor="data-collection" className="text-white font-medium">
                        Data Collection
                      </Label>
                      <p className="text-sm text-gray-400">Allow us to collect usage data to improve your experience</p>
                    </div>
                    <Switch id="data-collection" defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-6">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
