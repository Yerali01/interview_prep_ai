import Link from "next/link"
import { DonationButton } from "@/components/donation-button"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FlutterPrep</h3>
            <p className="text-muted-foreground">Your comprehensive resource for Flutter interview preparation</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/topics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-foreground transition-colors">
                  Quizzes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://flutter.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Flutter Official Docs
                </a>
              </li>
              <li>
                <a
                  href="https://dart.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dart Official Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <p className="text-muted-foreground mb-3">Help keep this resource free and up-to-date</p>
            <div className="flex flex-col items-center gap-4">
              <DonationButton />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} FlutterPrep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
