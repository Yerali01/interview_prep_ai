"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-context"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  // Only show the UI after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    if (!mounted || !buttonRef.current || !circleRef.current) return

    // Get button position
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const buttonCenterX = buttonRect.left + buttonRect.width / 2
    const buttonCenterY = buttonRect.top + buttonRect.height / 2

    // Calculate the maximum distance to any corner of the screen
    const distanceToTopLeft = Math.sqrt(Math.pow(buttonCenterX, 2) + Math.pow(buttonCenterY, 2))
    const distanceToTopRight = Math.sqrt(Math.pow(window.innerWidth - buttonCenterX, 2) + Math.pow(buttonCenterY, 2))
    const distanceToBottomLeft = Math.sqrt(Math.pow(buttonCenterX, 2) + Math.pow(window.innerHeight - buttonCenterY, 2))
    const distanceToBottomRight = Math.sqrt(
      Math.pow(window.innerWidth - buttonCenterX, 2) + Math.pow(window.innerHeight - buttonCenterY, 2),
    )

    // Use the maximum distance for the circle radius
    const maxRadius = Math.max(distanceToTopLeft, distanceToTopRight, distanceToBottomLeft, distanceToBottomRight)

    // Position the circle
    circleRef.current.style.left = `${buttonCenterX}px`
    circleRef.current.style.top = `${buttonCenterY}px`

    // Set the circle color based on the new theme
    if (newTheme === "dark") {
      circleRef.current.style.backgroundColor = "hsl(240 10% 3.9%)" // dark background color
    } else {
      circleRef.current.style.backgroundColor = "hsl(0 0% 100%)" // light background color
    }

    // Start animation
    circleRef.current.style.transform = `scale(${maxRadius / 5})`

    // Set theme immediately to ensure it changes
    setTheme(newTheme as "dark" | "light" | "system")

    // Reset animation after it completes
    setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.style.transform = "scale(0)"
      }
    }, 500) // Match this with the CSS transition duration
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button ref={buttonRef} variant="ghost" size="icon" className="h-8 w-8">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Animation circle */}
      <div
        ref={circleRef}
        className="fixed rounded-full pointer-events-none z-[9999] transition-transform duration-500 ease-in-out"
        style={{
          width: "10px",
          height: "10px",
          transform: "scale(0)",
          transformOrigin: "center",
        }}
      />
    </>
  )
}
