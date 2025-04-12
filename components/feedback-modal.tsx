"use client"

import type React from "react"

import { useState, useRef } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace these with your actual EmailJS service, template, and user IDs
      // You'll need to sign up at emailjs.com and create these
      const result = await emailjs.sendForm(
        "service_2ulr1ld", // Replace with your EmailJS service ID
        "template_o3y7cyh", // Replace with your EmailJS template ID
        formRef.current!,
        "_5Wo18VNJJ-8fy9IS", // Replace with your EmailJS public key
      )

      if (result.text === "OK") {
        toast({
          title: "Feedback sent!",
          description: "Thank you for your feedback.",
        })
        onOpenChange(false)
        formRef.current?.reset()
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
      toast({
        title: "Error sending feedback",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts, suggestions, or report issues with our Flutter Interview Prep website.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="to_email" value="eraliflash@gmail.com" />

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="from_name" placeholder="Your name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="reply_to" type="email" placeholder="Your email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              name="message"
              placeholder="Your feedback, suggestions, or issues..."
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
