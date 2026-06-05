"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, RefreshCw, Shield, Building2, Layers } from "lucide-react";
import { Bar, BarChart } from "recharts";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { useAuth } from "@/hooks/use-auth";

export const PageClient = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-muted/50 text-foreground flex flex-col">
      {/* NAVIGATION */}
      <nav className="w-full bg-card max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="MLS Logo" width={32} height={32} className="rounded-sm" />
          <span className="font-bold text-xl tracking-tight text-foreground">MLS</span>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/login"
            className="hidden sm:block text-foreground border border-border px-5 py-2.5 rounded-full hover:bg-accent transition-colors"
          >
            Login
          </Link>
          <Link href="/register">
            <Button className="rounded-full px-5 py-2.5">Sign Up</Button>
          </Link>
          <ModeToggle />
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-28 pb-20 flex flex-col items-center text-center">
        <div className="max-w-3xl flex flex-col items-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
            Past-exam explainer videos, organized and searchable.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
            Search by school, year, semester, exam type, and problem number. Watch 600+ explainer
            videos approved by your teachers.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="rounded-full px-8 py-4 text-base font-medium">
                Get Started Now
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-4 text-base font-medium"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* FLOATING WHITE CONTAINER: FEATURES */}
      <section className="max-w-[1400px] w-[calc(100%-2rem)] mx-auto mt-8 mb-24 bg-card rounded-[2.5rem] p-10 lg:p-16 shadow-sm border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
          <div className="lg:col-span-7">
            <Badge
              variant="secondary"
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
            >
              Core Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              Everything you need to master past exams.
            </h2>
          </div>
          <div className="lg:col-span-5 text-muted-foreground leading-relaxed text-sm max-w-sm">
            Search, watch, and learn from 600+ past-exam explainer videos organized by school, year,
            semester, and problem number.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {/* Feature 1 */}
          <div>
            <div className="inline-flex size-12 rounded-xl items-center justify-center border border-border mb-6 bg-muted">
              <RefreshCw className="size-5 text-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Smart search</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
              Filter by school name, year, semester, exam type, grade, subject, and problem number
              to find exactly what you need.
            </p>
          </div>
          {/* Feature 2 */}
          <div>
            <div className="inline-flex size-12 rounded-xl items-center justify-center border border-border mb-6 bg-muted">
              <Building2 className="size-5 text-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Approval-based access</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
              Teachers approve student accounts to ensure secure, authorized access to all video
              content.
            </p>
          </div>
          {/* Feature 3 */}
          <div>
            <div className="inline-flex size-12 rounded-xl items-center justify-center border border-border mb-6 bg-muted">
              <Shield className="size-5 text-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Mobile-first playback</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
              Watch explainer videos on any device—tablet, mobile, or desktop. Optimized for touch
              and portrait viewing.
            </p>
          </div>
        </div>
      </section>

      {/* BENTO BOX SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
          >
            Platform Stats
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Built for students and teachers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(280px,auto)]">
          {/* Box 1 (Top Left) */}
          <Card className="bg-muted rounded-[2.5rem] p-10 flex flex-col justify-center border-0">
            <CardContent className="p-0">
              <h3 className="text-[5rem] lg:text-[7rem] font-bold text-primary leading-none mb-4 tracking-tighter">
                600+
              </h3>
              <p className="text-xl text-foreground max-w-[240px] font-medium leading-snug">
                Past-exam explainer videos available
              </p>
            </CardContent>
          </Card>

          {/* Box 2 (Top Right) */}
          <Card className="bg-muted rounded-[2.5rem] p-10 flex flex-col justify-between group border-0">
            <CardContent className="p-0 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl text-foreground font-medium mb-3">
                  Track exam set completion.
                </h3>
                <p className="text-muted-foreground text-sm max-w-[240px]">
                  Monitor which exam sets are fully registered, partially complete, or pending
                  upload.
                </p>
              </div>

              <Card className="bg-card p-5 rounded-3xl shadow-sm border border-border flex items-center justify-between gap-4 mt-8 h-32">
                <CardContent className="p-0 flex items-center gap-4 w-full">
                  <div className="relative size-20 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="size-full transform -rotate-90">
                      <path
                        className="text-muted"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-primary drop-shadow-sm"
                        strokeDasharray="85, 100"
                        strokeWidth="4"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-foreground leading-none mb-0.5">
                        85%
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                        <span>Complete</span> <span className="text-foreground">45 sets</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-foreground rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                        <span>In Progress</span> <span className="text-primary">8 sets</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="w-[15%] h-full bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Box 3 (Bottom Left) */}
          <Card className="bg-muted rounded-[2.5rem] p-10 flex flex-col justify-center border-0">
            <CardContent className="p-0">
              <h3 className="text-3xl text-foreground font-bold mb-4 tracking-tight">
                Organized by School
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-[250px] text-sm md:text-base">
                Videos are structured by school name, year, semester, exam type, and problem number
                for easy lookup.
              </p>
            </CardContent>
          </Card>

          {/* Box 4 (Bottom Right - Progress Visual) */}
          <Card className="bg-muted rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group border-0">
            <CardContent className="p-0 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-widest">
                    Schools Covered
                  </div>
                  <div className="text-4xl font-bold text-foreground">
                    25<span className="text-xl text-muted-foreground font-medium ml-1">+</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs font-bold">
                  <ArrowUpRight className="size-3.5 mr-1.5" strokeWidth={3} />
                  Growing
                </Badge>
              </div>

              <ChartContainer
                config={{
                  schools: {
                    label: "Schools",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[40%] w-full"
              >
                <BarChart
                  data={[12, 18, 15, 25].map((value, index) => ({
                    month: index + 1,
                    schools: value,
                  }))}
                >
                  <Bar
                    dataKey="schools"
                    fill="var(--color-schools)"
                    radius={[4, 4, 0, 0]}
                    barSize={50}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* DARK STEPS SECTION */}
      <section className="bg-card text-card-foreground py-28 mt-12 w-full px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-full bg-muted/80 blur-[150px] rounded-full translate-x-1/2 opacity-50 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <Badge
            variant="secondary"
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Get Started
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-20 max-w-xl leading-[1.1] tracking-tight">
            Start watching explainer videos in three simple steps.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Sign up for access",
                desc: "Create your account with your name, branch, school, and grade. Your teacher will review and approve your request.",
              },
              {
                num: "2",
                title: "Search for videos",
                desc: "Filter by school name, year, semester, exam type, and problem number to find the exact explainer you need.",
              },
              {
                num: "3",
                title: "Watch and learn",
                desc: "Play videos instantly in your browser on any device. Ask your teacher follow-up questions if needed.",
              },
            ].map((step, i) => (
              <Card
                key={i}
                className="bg-muted/50 rounded-3xl p-10 relative overflow-hidden group border-0"
              >
                <CardContent className="p-0 relative pt-24">
                  <div className="absolute -top-5 -left-4 text-8xl font-bold text-foreground/5 leading-none select-none">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STATS / MISSION SECTION */}
      <section className="bg-background py-24 mb-12 px-6 text-center w-full shadow-sm border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <Badge
            variant="secondary"
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Our Mission
          </Badge>
          <h2 className="text-4xl text-foreground font-bold mx-auto max-w-xl leading-[1.1] tracking-tight mb-4">
            Replace manual video delivery with smart search
          </h2>
          <p className="text-muted-foreground mb-20">
            Teachers no longer send videos via KakaoTalk. Students find and watch explainer videos
            on their own.
            <br />
            Organized, searchable, and secure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-[3.5rem] md:text-[4rem] font-bold text-foreground mb-2 tracking-tighter">
                600+
              </h3>
              <p className="text-muted-foreground font-medium text-sm">Explainer videos</p>
            </div>
            <div>
              <h3 className="text-[3.5rem] md:text-[4rem] font-bold text-foreground mb-2 tracking-tighter">
                25+
              </h3>
              <p className="text-muted-foreground font-medium text-sm">Schools covered</p>
            </div>
            <div>
              <h3 className="text-[3.5rem] md:text-[4rem] font-bold text-foreground mb-2 tracking-tighter">
                100%
              </h3>
              <p className="text-muted-foreground font-medium text-sm">Approval-based access</p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR MODULES */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24 w-full">
        <div className="text-center mb-12 text-foreground text-[10px] font-bold uppercase tracking-widest">
          Featured Schools:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mx-auto">
          {/* Card 1 */}
          <Card className="bg-muted rounded-[2rem] p-10 group cursor-pointer border border-transparent hover:border-primary/20 transition-all">
            <CardContent className="p-0">
              <div className="size-12 bg-card rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Layers className="size-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Mangpo High School</h3>
              <p className="text-muted-foreground text-sm mb-8">
                2025 1st & 2nd semester midterm and final exam explainers.
              </p>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-primary">120 videos</span>
                <ArrowUpRight className="size-5 text-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </CardContent>
          </Card>
          {/* Card 2 */}
          <Card className="bg-muted rounded-[2rem] p-10 group cursor-pointer border border-transparent hover:border-primary/20 transition-all">
            <CardContent className="p-0">
              <div className="size-12 bg-card rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Building2 className="size-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Suwon High School</h3>
              <p className="text-muted-foreground text-sm mb-8">
                Complete coverage of 2024-2025 past exams with detailed solutions.
              </p>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-primary">95 videos</span>
                <ArrowUpRight className="size-5 text-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </CardContent>
          </Card>
          {/* Card 3 */}
          <Card className="bg-primary rounded-[2rem] p-10 group cursor-pointer border border-transparent hover:border-primary/80 transition-all relative overflow-hidden shadow-lg shadow-primary/20">
            <CardContent className="p-0 relative z-10">
              <div className="size-12 bg-primary-foreground/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Shield className="size-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">All Schools</h3>
              <p className="text-primary-foreground/80 text-sm mb-8">
                Browse explainer videos from 25+ schools across all regions.
              </p>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-primary-foreground">600+ videos</span>
                <ArrowUpRight className="size-5 text-primary-foreground opacity-90 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-[1400px] w-[calc(100%-3rem)] mx-auto mb-20 bg-card rounded-[2.5rem] p-12 md:p-20 text-card-foreground flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[40%] h-full bg-muted/80 rounded-[100%] blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-md relative z-10">
          <Badge
            variant="secondary"
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Get Started
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6 text-card-foreground">
            Ready to access past-exam explainers?
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-0">
            Sign up, get approved by your teacher, and start watching explainer videos organized by
            school, year, and problem number.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
          <Link href={user ? "/dashboard" : "/register"}>
            <Button
              size="lg"
              className="rounded-full px-6 flex-1 md:flex-auto py-3.5 text-sm font-medium whitespace-nowrap"
            >
              Get Started Now
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Learn More <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-background pt-16 pb-8 border-t border-border">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="flex items-start gap-2 mb-8">
            <Image src="/logo.png" alt="MLS Logo" width={24} height={24} className="rounded-sm" />
            <span className="font-bold text-lg tracking-tight text-foreground leading-[1]">
              MLS
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground mb-12">
            <Link href="#" className="hover:text-primary transition-colors">
              Modules
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="text-center text-[11px] text-muted-foreground w-full pt-4 border-t border-border">
            ©MLS 2024. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
