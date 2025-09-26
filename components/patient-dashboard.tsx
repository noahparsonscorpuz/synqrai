"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Activity, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

export function PatientDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Jordan</h1>
          <p className="text-muted-foreground">Here's your health overview for today</p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Activity className="h-4 w-4 mr-2" />
          All Systems Normal
        </Badge>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72 BPM</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120/80</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1 text-green-500" />
              Normal range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2h</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Excellent quality
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94/100</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Health Insights</CardTitle>
            <CardDescription>AI-powered analysis of your health data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Excellent Sleep Pattern</p>
                <p className="text-sm text-muted-foreground">Your sleep consistency has improved by 15% this month</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium">Hydration Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Consider increasing water intake - target 8 glasses daily
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Activity Goal Progress</p>
                <p className="text-sm text-muted-foreground">You're 85% towards your weekly exercise goal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled healthcare visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Dr. Smith - Cardiology</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Annual Physical</p>
                  <p className="text-sm text-muted-foreground">Next Friday, 10:00 AM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Health Goals Progress</CardTitle>
          <CardDescription>Track your wellness journey with AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Steps</span>
                <span className="text-sm text-muted-foreground">8,432 / 10,000</span>
              </div>
              <Progress value={84} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Water Intake</span>
                <span className="text-sm text-muted-foreground">6 / 8 glasses</span>
              </div>
              <Progress value={75} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Meditation</span>
                <span className="text-sm text-muted-foreground">15 / 20 minutes</span>
              </div>
              <Progress value={75} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
