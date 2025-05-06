import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, FileText, Receipt, CheckCircle, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface BillingContentProps {
  user: any
}

export function BillingContent({ user }: BillingContentProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-gray-400 mt-1">Manage your subscription and billing information</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <Download className="mr-2 h-4 w-4" /> Download Invoices
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="dark-gradient border-teal-800 md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription className="text-gray-400">Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-4 rounded-lg bg-gray-800">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-white">Free Plan</h3>
                  <Badge className="ml-2 bg-teal-900 text-teal-400 hover:bg-teal-900">Active</Badge>
                </div>
                <p className="text-gray-400 mt-1">Basic interview practice</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-2xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Interviews Used</span>
                  <span className="text-sm font-medium text-gray-300">5 / 10</span>
                </div>
                <Progress value={50} className="h-2 bg-gray-700"/>
                <p className="text-xs text-gray-400 mt-2">50% of your monthly interview quota used</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Feedback Reports</span>
                  <span className="text-sm font-medium text-gray-300">3 / 5</span>
                </div>
                <Progress value={60} className="h-2 bg-gray-700" />
                <p className="text-xs text-gray-400 mt-2">60% of your feedback report quota used</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-800 border border-teal-500/30">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-teal-500 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium">Upgrade to Pro</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Get unlimited interviews, detailed feedback, and priority support.
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Unlimited interview practice
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Advanced feedback analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Custom interview scenarios
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-800 pt-6">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto">Upgrade to Pro</Button>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 w-full sm:w-auto"
            >
              View Plan Details
            </Button>
          </CardFooter>
        </Card>

        <Card className="dark-gradient border-teal-800">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription className="text-gray-400">Manage your payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-gray-800 flex items-start gap-3">
              <div className="bg-teal-900 text-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">No payment method</p>
                <p className="text-sm text-gray-400 mt-1">Add a payment method to upgrade your plan</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-gray-800 pt-6">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 w-full"
            >
              Add Payment Method
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="dark-gradient border-teal-800">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription className="text-gray-400">View your billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList className="bg-gray-800 text-gray-400">
              <TabsTrigger
                value="invoices"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500"
              >
                Invoices
              </TabsTrigger>
              <TabsTrigger
                value="receipts"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500"
              >
                Receipts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="invoices" className="mt-4">
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white">No invoices yet</h3>
                  <p className="text-gray-400 mt-1">
                    Your invoice history will appear here once you upgrade to a paid plan.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="receipts" className="mt-4">
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Receipt className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white">No receipts yet</h3>
                  <p className="text-gray-400 mt-1">Your receipt history will appear here once you make a payment.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
