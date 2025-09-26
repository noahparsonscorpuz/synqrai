"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  TrendingUp,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle,
  Building,
  GraduationCap,
  Coffee,
  Play,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center">
                <Calendar className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="text-7xl font-bold text-foreground mb-6 text-balance">
            The complete platform to <span className="gradient-text">automate scheduling</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-pretty max-w-4xl mx-auto leading-relaxed">
            Your team's toolkit to stop coordinating and start connecting. AI-powered scheduling that goes from
            availability collection to confirmed events automatically.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap">
            <Button size="lg" className="px-8 py-3 text-lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-8">Trusted by scheduling teams at</p>
          <div className="flex items-center justify-center gap-12 mb-16 flex-wrap opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">Stanford</div>
            <div className="text-2xl font-bold text-muted-foreground">Microsoft</div>
            <div className="text-2xl font-bold text-muted-foreground">Stripe</div>
            <div className="text-2xl font-bold text-muted-foreground">Notion</div>
            <div className="text-2xl font-bold text-muted-foreground">Airbnb</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="text-center border-border/50 hover-lift">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-foreground mb-2">95%</div>
              <div className="text-sm text-muted-foreground">time saved</div>
              <div className="text-sm text-muted-foreground">on coordination.</div>
              <div className="text-xs text-muted-foreground/60 mt-2">Stanford CS Department</div>
            </CardContent>
          </Card>
          <Card className="text-center border-border/50 hover-lift">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-foreground mb-2">3x</div>
              <div className="text-sm text-muted-foreground">faster</div>
              <div className="text-sm text-muted-foreground">event scheduling.</div>
              <div className="text-xs text-muted-foreground/60 mt-2">Microsoft Teams</div>
            </CardContent>
          </Card>
          <Card className="text-center border-border/50 hover-lift">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-foreground mb-2">100%</div>
              <div className="text-sm text-muted-foreground">automated</div>
              <div className="text-sm text-muted-foreground">calendar invites.</div>
              <div className="text-xs text-muted-foreground/60 mt-2">Stripe Engineering</div>
            </CardContent>
          </Card>
          <Card className="text-center border-border/50 hover-lift">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-foreground mb-2">0</div>
              <div className="text-sm text-muted-foreground">manual</div>
              <div className="text-sm text-muted-foreground">decision making.</div>
              <div className="text-xs text-muted-foreground/60 mt-2">Notion Product</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-12 max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">See synqr in action</h2>
            <p className="text-muted-foreground">
              Watch how AI transforms availability collection into confirmed calendar events
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-blue">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Collect Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Team members input their availability using familiar heatmap interface, just like When2Meet but with
                    calendar sync and constraint setting.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-purple">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI engine processes constraints, priorities, and preferences to find the optimal schedule that
                    maximizes attendance and minimizes conflicts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-green">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Automatic Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Calendar invites are sent instantly to all participants. No manual decision-making, no
                    back-and-forth coordination required.
                  </p>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Watch 2-Minute Demo
              </Button>
            </div>

            <div className="relative">
              <div className="bg-background border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Team Standup Scheduling</h4>
                  <Badge variant="secondary" className="text-xs">
                    Live Demo
                  </Badge>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs">
                  <div className="text-center text-muted-foreground p-2">Mon</div>
                  <div className="text-center text-muted-foreground p-2">Tue</div>
                  <div className="text-center text-muted-foreground p-2">Wed</div>
                  <div className="text-center text-muted-foreground p-2">Thu</div>
                  <div className="text-center text-muted-foreground p-2">Fri</div>
                  <div className="text-center text-muted-foreground p-2">Sat</div>
                  <div className="text-center text-muted-foreground p-2">Sun</div>

                  {/* Heatmap visualization */}
                  <div className="h-6 bg-accent-green/20 rounded"></div>
                  <div className="h-6 bg-accent-green/40 rounded"></div>
                  <div className="h-6 bg-accent-green/60 rounded"></div>
                  <div className="h-6 bg-accent-green/80 rounded"></div>
                  <div className="h-6 bg-accent-green rounded"></div>
                  <div className="h-6 bg-accent-green/20 rounded"></div>
                  <div className="h-6 bg-muted rounded"></div>

                  <div className="h-6 bg-accent-blue/30 rounded"></div>
                  <div className="h-6 bg-accent-blue/50 rounded"></div>
                  <div className="h-6 bg-accent-blue/70 rounded"></div>
                  <div className="h-6 bg-accent-blue rounded"></div>
                  <div className="h-6 bg-accent-blue/80 rounded"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">5 team members • 12 constraints</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">AI optimizing...</span>
                  </div>
                </div>

                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-accent-green" />
                    <span className="text-sm font-medium text-foreground">Optimal time found!</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Wednesday 2:00 PM - 3:00 PM</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    100% attendance • 0 conflicts • Calendar invites sent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Make scheduling seamless.</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            AI-powered optimization with rule-based constraints for teams, clubs, and organizations to coordinate time
            as easily as sending a message.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="group hover-lift border-border/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-accent rounded-2xl w-fit">
                <Zap className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Smart Collection</CardTitle>
              <CardDescription className="text-base">
                Familiar heatmap interface with calendar sync and constraint setting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-green" />
                Heatmap availability input
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-green" />
                Google & Outlook sync
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-green" />
                Custom constraints & rules
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift border-border/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-accent rounded-2xl w-fit">
                <Brain className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">AI Optimization</CardTitle>
              <CardDescription className="text-base">
                Intelligent matching with priority balancing and gap minimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-blue" />
                1:1 and group matching
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-blue" />
                Priority-based scheduling
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-blue" />
                Fairness balancing
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift border-border/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-accent rounded-2xl w-fit">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Full Automation</CardTitle>
              <CardDescription className="text-base">
                From availability to calendar invites with zero manual intervention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-purple" />
                Auto-schedule selection
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-purple" />
                Instant calendar invites
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent-purple" />
                Recurring event support
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Built for every team.</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From startups to universities, synqr adapts to your scheduling needs with intelligent automation and
            seamless integration.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
          <Card className="group hover-lift border-border/50 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-accent rounded-xl w-fit">
                <Building className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Workplaces</CardTitle>
              <CardDescription className="text-sm">Team standups, 1:1s, project syncs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">• Automated 1:1 matching</div>
              <div className="text-xs text-muted-foreground">• Recurring team meetings</div>
              <div className="text-xs text-muted-foreground">• Cross-team coordination</div>
            </CardContent>
          </Card>

          <Card className="group hover-lift border-border/50 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-accent rounded-xl w-fit">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Universities</CardTitle>
              <CardDescription className="text-sm">Study groups, office hours, events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">• Student-professor matching</div>
              <div className="text-xs text-muted-foreground">• Group study coordination</div>
              <div className="text-xs text-muted-foreground">• Campus event planning</div>
            </CardContent>
          </Card>

          <Card className="group hover-lift border-border/50 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-accent rounded-xl w-fit">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Communities</CardTitle>
              <CardDescription className="text-sm">Club meetings, social events, meetups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">• Member availability sync</div>
              <div className="text-xs text-muted-foreground">• Event optimization</div>
              <div className="text-xs text-muted-foreground">• Recurring gatherings</div>
            </CardContent>
          </Card>

          <Card className="group hover-lift border-border/50 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-accent rounded-xl w-fit">
                <Coffee className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Networking</CardTitle>
              <CardDescription className="text-sm">Conference 1:1s, coffee chats, mentorship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">• Smart attendee matching</div>
              <div className="text-xs text-muted-foreground">• Gap minimization</div>
              <div className="text-xs text-muted-foreground">• Interest-based pairing</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-12 max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why synqr is different</h2>
            <p className="text-muted-foreground">
              The first platform that unifies availability collection with AI-powered automation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Traditional Tools</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">When2Meet / CrabFit</div>
                    <div className="text-sm text-muted-foreground">Show overlaps, but you still decide manually</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Doodle</div>
                    <div className="text-sm text-muted-foreground">Polls + suggestions, no deep optimization</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Reclaim.ai</div>
                    <div className="text-sm text-muted-foreground">Personal calendar only, no group scheduling</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">synqr</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Heatmap familiarity + AI engine</div>
                    <div className="text-sm text-muted-foreground">
                      Familiar interface with intelligent optimization
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Full automation pipeline</div>
                    <div className="text-sm text-muted-foreground">
                      From availability to calendar invite, zero manual steps
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Rule-based constraints</div>
                    <div className="text-sm text-muted-foreground">Hard and soft rules with priority balancing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-12">Loved by teams worldwide</h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-border/50 hover-lift">
              <CardContent className="pt-8">
                <div className="text-sm text-muted-foreground mb-4">
                  "synqr eliminated the back-and-forth emails for our weekly team syncs. What used to take 30 minutes of
                  coordination now happens automatically."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-medium text-accent-foreground">SM</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Sarah Martinez</div>
                    <div className="text-xs text-muted-foreground">Engineering Manager, Stripe</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover-lift">
              <CardContent className="pt-8">
                <div className="text-sm text-muted-foreground mb-4">
                  "Our CS department went from chaos to seamless office hours scheduling. Students and professors love
                  how effortless it is now."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-medium text-accent-foreground">DL</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Dr. Lisa Chen</div>
                    <div className="text-xs text-muted-foreground">Professor, Stanford CS</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover-lift">
              <CardContent className="pt-8">
                <div className="text-sm text-muted-foreground mb-4">
                  "The AI optimization is incredible. It finds meeting times I never would have considered, and
                  everyone's actually happy with the schedule."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-medium text-accent-foreground">MJ</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Marcus Johnson</div>
                    <div className="text-xs text-muted-foreground">Product Lead, Notion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to automate your scheduling?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams who've eliminated scheduling coordination forever.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" className="px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
              Schedule Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
