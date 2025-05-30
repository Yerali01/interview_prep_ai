"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  createQuiz as createQuizAction,
  deleteQuiz as deleteQuizAction,
  updateQuiz as updateQuizAction,
} from "@/lib/actions"
import { useTransition } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { firebaseGetQuizzes, type Quiz } from "@/lib/firebase-service-fixed"

interface QuizRowProps {
  quiz: Quiz
  refreshQuizzes: () => void
}

function QuizRow({ quiz, refreshQuizzes }: QuizRowProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(quiz.title)
  const [description, setDescription] = useState(quiz.description)
  const [isPending, startTransition] = useTransition()

  const updateQuiz = async () => {
    startTransition(async () => {
      const result = await updateQuizAction({
        id: quiz.id,
        title,
        description,
      })

      if (result?.error) {
        toast({
          title: "Error updating quiz",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Quiz updated",
          description: "Quiz updated successfully",
        })
        setOpen(false)
        refreshQuizzes()
      }
    })
  }

  const deleteQuiz = async () => {
    startTransition(async () => {
      const result = await deleteQuizAction(quiz.id)

      if (result?.error) {
        toast({
          title: "Error deleting quiz",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Quiz deleted",
          description: "Quiz deleted successfully",
        })
        refreshQuizzes()
      }
    })
  }

  return (
    <TableRow key={quiz.id}>
      <TableCell className="font-medium">{quiz.title}</TableCell>
      <TableCell>{quiz.description}</TableCell>
      <TableCell>{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}</TableCell>
      <TableCell className="flex items-center space-x-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit quiz</DialogTitle>
              <DialogDescription>Make changes to your quiz here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  defaultValue={quiz.title}
                  className="col-span-3"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  defaultValue={quiz.description}
                  className="col-span-3"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={updateQuiz} disabled={isPending}>
              Save changes
            </Button>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" size="sm" onClick={deleteQuiz} disabled={isPending}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
}

function CreateQuizDialog({ refreshQuizzes }: { refreshQuizzes: () => void }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPending, startTransition] = useTransition()

  const createQuiz = async () => {
    startTransition(async () => {
      const result = await createQuizAction({ title, description })

      if (result?.error) {
        toast({
          title: "Error creating quiz",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Quiz created",
          description: "Quiz created successfully",
        })
        setOpen(false)
        setTitle("")
        setDescription("")
        refreshQuizzes()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Quiz</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create quiz</DialogTitle>
          <DialogDescription>Create a new quiz here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} className="col-span-3" onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={createQuiz} disabled={isPending}>
          Create
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const refreshQuizzes = async () => {
    setLoading(true)
    try {
      const data = await firebaseGetQuizzes()
      setQuizzes(data)
      setError(null)
      setLastFetched(new Date())
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshQuizzes()
  }, [])

  return { quizzes, loading, error, refreshQuizzes, lastFetched }
}

export default function QuizzesPage() {
  const { quizzes, loading, error, refreshQuizzes, lastFetched } = useQuizzes()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <CreateQuizDialog refreshQuizzes={refreshQuizzes} />
      </div>
      {lastFetched && (
        <p className="text-sm text-muted-foreground">
          Last updated {formatDistanceToNow(lastFetched, { addSuffix: true })}
        </p>
      )}
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
            {!loading && quizzes.map((quiz) => <QuizRow key={quiz.id} quiz={quiz} refreshQuizzes={refreshQuizzes} />)}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
