"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface DonationButtonProps {
  className?: string;
}

  export function DonationButton({ className }: DonationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Heart className="h-4 w-4 mr-1 text-red-500" />
          <span className="text-xs">Support</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Support the Creator</DialogTitle>
          <DialogDescription>
            Thank you for considering supporting this project! Your contribution helps keep this resource free and
            up-to-date.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>You can support this project in the following ways:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <a
                href="https://www.buymeacoffee.com/flutterprep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Buy me a coffee
              </a>
            </li>
            <li>
              <a
                href="https://github.com/sponsors/flutter-prep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub Sponsors
              </a>
            </li>
            <li>
              <a
                href="https://www.patreon.com/flutterprep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Patreon
              </a>
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
