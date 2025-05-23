"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DefinitionTooltip } from "@/components/definition-tooltip"

export default function TooltipDemoPage() {
  // Sample definitions for demonstration
  const definitions = [
    {
      id: 1,
      term: "StatelessWidget",
      definition:
        "A widget that doesn't require mutable state. It describes part of the user interface which can depend only on the configuration information and the BuildContext.",
      category: "Flutter Widgets",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      term: "State",
      definition:
        "Information that can be read synchronously when the widget is built and might change during the lifetime of the widget. It's the dynamic part of a StatefulWidget.",
      category: "Flutter Concepts",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      term: "BuildContext",
      definition:
        "A handle to the location of a widget in the widget tree. It's used to interact with the widget tree, such as for finding ancestor widgets.",
      category: "Flutter Concepts",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tooltip Definition Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates how the tooltip definitions will appear when hovering over Flutter terms.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Flutter Widgets Overview</h2>

        <p className="mb-4">
          Flutter provides two types of widgets:{" "}
          <DefinitionTooltip term="StatelessWidget" definition={definitions[0]}>
            StatelessWidget
          </DefinitionTooltip>{" "}
          and StatefulWidget. A{" "}
          <DefinitionTooltip term="StatelessWidget" definition={definitions[0]}>
            StatelessWidget
          </DefinitionTooltip>{" "}
          is immutable, meaning that its properties can't change—all values are final.
        </p>

        <p className="mb-4">
          <DefinitionTooltip term="State" definition={definitions[1]}>
            State
          </DefinitionTooltip>{" "}
          in Flutter refers to data that can change during the lifetime of a widget. When the{" "}
          <DefinitionTooltip term="State" definition={definitions[1]}>
            state
          </DefinitionTooltip>{" "}
          of a widget changes, the widget rebuilds its UI.
        </p>

        <p className="mb-4">
          The{" "}
          <DefinitionTooltip term="BuildContext" definition={definitions[2]}>
            BuildContext
          </DefinitionTooltip>{" "}
          object is a reference to the location of a widget in the widget tree. It's passed to the build method of a
          widget and can be used to interact with other widgets in the tree.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-8 mb-8">
          <h3 className="text-lg font-semibold mb-2">How to Use This Feature</h3>
          <p className="text-sm">
            Hover over any highlighted term (like{" "}
            <DefinitionTooltip term="StatelessWidget" definition={definitions[0]}>
              StatelessWidget
            </DefinitionTooltip>
            ,{" "}
            <DefinitionTooltip term="State" definition={definitions[1]}>
              State
            </DefinitionTooltip>
            , or{" "}
            <DefinitionTooltip term="BuildContext" definition={definitions[2]}>
              BuildContext
            </DefinitionTooltip>
            ) to see its definition in a tooltip.
          </p>
        </div>
      </div>
    </div>
  )
}
