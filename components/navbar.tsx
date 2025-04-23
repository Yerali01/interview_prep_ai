"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Brain,
  Menu,
  X,
  ExternalLink,
  FileQuestion,
  Map,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Bot,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DonationButton } from "@/components/donation-button"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  // Update the mainNavItems array to remove Home
  // Main navigation items
  const mainNavItems = [
    // Home tab removed
    {
      href: "/topics",
      label: "Topics",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      active: pathname === "/topics" || pathname.startsWith("/topics/"),
    },
    {
      href: "/quiz",
      label: "Quizzes",
      icon: <Brain className="h-4 w-4 mr-2" />,
      active: pathname === "/quiz" || pathname.startsWith("/quiz/"),
    },
    {
      href: "/interview",
      label: "AI Interview",
      icon: <Bot className="h-4 w-4 mr-2" />,
      active: pathname === "/interview",
      highlight: true,
    },
    {
      href: "/interview-prep",
      label: "Interview Prep",
      icon: <FileQuestion className="h-4 w-4 mr-2" />,
      active: pathname === "/interview-prep",
    },
  ]

  // Remove Interview Prep from practiceItems
  // Items for the "Practice" dropdown
  const practiceItems = [
    // Interview Prep has been moved to mainNavItems
  ]

  // Items for the "Resources" dropdown
  const resourceItems = [
    {
      href: "/roadmap",
      label: "Roadmap",
      icon: <Map className="h-4 w-4 mr-2" />,
      active: pathname === "/roadmap",
    },
    {
      href: "/resources",
      label: "External Resources",
      icon: <ExternalLink className="h-4 w-4 mr-2" />,
      active: pathname === "/resources",
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const getUserInitials = () => {
    if (!user || !user.email) return "U"
    return user.email.substring(0, 1).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            FlutterPrep
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Main nav items */}
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors flex items-center",
                item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                item.highlight && "relative",
              )}
            >
              {item.icon}
              {item.label}
              {item.highlight && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </Link>
          ))}

          {/* Resources dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  resourceItems.some((item) => item.active)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {resourceItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center">
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User account */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link href="/auth/sign-in">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile menu button and user account */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {/* Remove the sign-in button from the mobile topbar */}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-border/40">
          <nav className="container py-6 flex flex-col gap-4">
            {/* Main nav items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center p-3 rounded-md",
                  item.active
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  item.highlight && "relative",
                )}
              >
                {item.icon}
                {item.label}
                {item.highlight && (
                  <span className="absolute top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </Link>
            ))}

            {/* Resources section */}
            <div className="px-2 pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</p>
            </div>
            {resourceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center p-3 rounded-md",
                  item.active
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Account section - Add sign in button to mobile menu */}
            <div className="px-2 pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
            </div>

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center p-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center p-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center p-3 rounded-md text-sm font-medium text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            )}

            {/* Donation button in mobile menu */}
            <div className="mt-4 px-3">
              <DonationButton className="w-full justify-center py-3" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
