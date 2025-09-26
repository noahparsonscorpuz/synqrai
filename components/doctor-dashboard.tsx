"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Users, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react"

export function DoctorDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Good morning, Dr. Smith</h1>
          <p className="text-muted-foreground">Your clinical dashboard and AI insights</p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Brain className="h-4 w-4 mr-2" />
          AI Assistant Active
        </Badge>
      </div>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Diagnoses</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1 text-green-500" />
              94% accuracy rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              Avg. 2.3 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <Progress value={97} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Patient Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Clinical Insights</CardTitle>
            <CardDescription>Recent AI-powered diagnostic recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Complex Case Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Patient #1247: AI suggests rare autoimmune condition - 87% confidence
                </p>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Review Case →
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium">Drug Interaction Alert</p>
                <p className="text-sm text-muted-foreground">
                  Patient #0892: Potential interaction detected in new prescription
                </p>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Review Alert →
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Treatment Success</p>
                <p className="text-sm text-muted-foreground">
                  Patient #0445: 95% improvement in symptoms following AI-recommended therapy
                </p>
                <Button variant="link" className="p-0 h-auto text-xs">
                  View Progress →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Queue</CardTitle>
            <CardDescription>Today's appointments and priority cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Urgent - Chest pain symptoms</p>
                </div>
              </div>
              <Button size="sm">See Now</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Follow-up - Diabetes management</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="font-medium">Emma Davis</p>
                  <p className="text-sm text-muted-foreground">Routine - Annual checkup</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View All Patients
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Performance Analytics</CardTitle>
          <CardDescription>AI-powered insights into your practice efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Diagnostic Accuracy</span>
                <span className="text-sm text-muted-foreground">94.2%</span>
              </div>
              <Progress value={94} />
              <p className="text-xs text-muted-foreground">+2.1% vs last month</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Patient Satisfaction</span>
                <span className="text-sm text-muted-foreground">4.8/5.0</span>
              </div>
              <Progress value={96} />
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Collaboration</span>
                <span className="text-sm text-muted-foreground">87%</span>
              </div>
              <Progress value={87} />
              <p className="text-xs text-muted-foreground">Cases with AI assistance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
