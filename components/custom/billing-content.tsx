"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Star, Crown, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BillingContentProps {
  user: {
    credits: number
    isPro: boolean
    name: string
    email: string
  }
}

export function BillingContent({ user }: BillingContentProps) {
  const handleBuyCredits = () => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const subject = "Credit Purchase Request"
    const body = `Hi there,

I would like to purchase additional credits for my account.

Account Details:
- Name: ${user.name}
- Email: ${user.email}
- Current Credits: ${user.credits}
- Account Type: ${user.isPro ? 'Pro' : 'Free'}

Please let me know the available credit packages and payment options.

Thank you!

Best regards,
${user.name}`

    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Credits</h1>
          <p className="text-gray-400 mt-1">Manage your account and purchase credits</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Status Card */}
        <Card className={`dark-gradient ${user.isPro ? 'border-yellow-500/50' : 'border-teal-800'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {user.isPro ? (
                <>
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Pro Account
                </>
              ) : (
                <>
                  <Star className="h-5 w-5 text-teal-500" />
                  Free Account
                </>
              )}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {user.isPro ? 'Premium features unlocked' : 'Basic features available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${user.isPro ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-gray-800'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {user.isPro ? 'Pro Plan' : 'Free Plan'}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {user.isPro ? 'All features unlocked' : 'Limited features'}
                  </p>
                </div>
                <Badge className={user.isPro ? 'bg-yellow-900 text-yellow-400' : 'bg-teal-900 text-teal-400'}>
                  {user.isPro ? 'Pro' : 'Free'}
                </Badge>
              </div>
            </div>

            {user.isPro && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-900/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm font-medium">Pro Benefits Active</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>• 15 Interview Credits</li>
                  <li>• Unlimited interview attempts</li>
                  <li>• Advanced feedback analysis</li>
                  <li>• Custom interview scenarios</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card className="dark-gradient border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-500" />
              Credits Balance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Credits are used for interviews and feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-white mb-2">
                {user.credits}
              </div>
              <p className="text-gray-400">Available Credits</p>
              
              {user.credits <= 5 && (
                <div className="mt-4 p-3 rounded-lg bg-orange-900/20 border border-orange-500/30">
                  <p className="text-orange-400 text-sm font-medium">
                    ⚠️ Low credit balance
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Consider purchasing more credits to continue using the service
                  </p>
                </div>
              )}
            </div>

            <Button 
              onClick={handleBuyCredits}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Buy More Credits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Information Card */}
      <Card className="dark-gradient border-teal-800">
        <CardHeader>
          <CardTitle>How to Purchase Credits</CardTitle>
          <CardDescription className="text-gray-400">
            Simple and secure credit purchasing process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-teal-900 text-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="text-white font-medium">Click "Buy More Credits"</h4>
                <p className="text-sm text-gray-400">
                  This will open your email client with a pre-written message
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-teal-900 text-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="text-white font-medium">Send the Email</h4>
                <p className="text-sm text-gray-400">
                  Your account details will be included automatically
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-teal-900 text-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="text-white font-medium">Receive Payment Options</h4>
                <p className="text-sm text-gray-400">
                  We'll respond with available packages and payment methods
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-teal-900 text-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="text-white font-medium">Credits Added Instantly</h4>
                <p className="text-sm text-gray-400">
                  Once payment is confirmed, credits are added to your account
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-800 border border-teal-500/30">
            <div className="flex items-center gap-2 text-teal-400 mb-2">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Need Help?</span>
            </div>
            <p className="text-sm text-gray-400">
              If you have any questions about credits or billing, feel free to reach out to us directly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}