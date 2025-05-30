"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { firebaseGetQuizzes, type Quiz } from "@/lib/firebase-service-fixed"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        console.log("🔥 Fetching quizzes from Firebase...")

        const quizzesData = await firebaseGetQuizzes()
        console.log("🔥 Firebase quizzes received:", quizzesData?.length || 0)

        setQuizzes(quizzesData || [])
      } catch (err) {
        setError("Failed to load quizzes from Firebase")
        console.error("❌ Error fetching quizzes from Firebase:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quizzes</h1>
      </div>
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p>Something went wrong. Please refresh the page or try again later.</p>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your quizzes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && quizzes.length > 0
              ? quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.description}</TableCell>
                    <TableCell>{quiz.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : !loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No quizzes found.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {}
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}
interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => {
  return (
    <div className="w-full overflow-auto">
      <table ref={ref} className="w-full table-auto border-collapse text-sm [&[dir=rtl]]:rotate-180" {...props} />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableElement, TableHeaderProps>(({ className, ...props }, ref) => {
  return <thead ref={ref} className="[&[dir=rtl]]:rotate-180" {...props} />
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableElement, TableBodyProps>(({ className, ...props }, ref) => {
  return <tbody ref={ref} className="[&[dir=rtl]]:rotate-180" {...props} />
})
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => {
  return <tr ref={ref} className="m-0 border-b last:border-0 [&:has([data-state=checked])]:bg-muted/50" {...props} />
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[data-state=selected]]:bg-muted"
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className="p-4 align-middle [&:has([role=checkbox])]:pl-0 [&>[data-state=selected]]:bg-muted"
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className, ...props }, ref) => {
  return <caption ref={ref} className="mt-4 text-sm text-muted-foreground" {...props} />
})
TableCaption.displayName = "TableCaption"
