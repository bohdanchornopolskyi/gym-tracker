"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { ExerciseCategory } from "@/types";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";

const categories: ExerciseCategory[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | undefined
  >();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseCategory, setNewExerciseCategory] =
    useState<ExerciseCategory>("Chest");
  const [newExerciseMuscleGroup, setNewExerciseMuscleGroup] = useState("");

  const exercises = useQuery(api.exercises.list, {
    category: selectedCategory,
    search: searchTerm,
  });
  const createExercise = useMutation(api.exercises.create);

  const handleCreateExercise = async () => {
    if (!newExerciseName.trim()) return;

    await createExercise({
      name: newExerciseName,
      category: newExerciseCategory,
      muscleGroup: newExerciseMuscleGroup || undefined,
    });

    setNewExerciseName("");
    setNewExerciseMuscleGroup("");
    setDialogOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Exercise Library</h1>
            <p className="text-sm text-muted-foreground">
              Browse and manage your exercises
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Custom Exercise</DialogTitle>
                <DialogDescription>
                  Create a custom exercise for your workout library
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    placeholder="e.g., Cable Crossover"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise-category">Category</Label>
                  <Select
                    value={newExerciseCategory}
                    onValueChange={(value) =>
                      setNewExerciseCategory(value as ExerciseCategory)
                    }
                  >
                    <SelectTrigger id="exercise-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="muscle-group">Muscle Group (Optional)</Label>
                  <Input
                    id="muscle-group"
                    value={newExerciseMuscleGroup}
                    onChange={(e) => setNewExerciseMuscleGroup(e.target.value)}
                    placeholder="e.g., Pectorals"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateExercise}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <Tabs
          defaultValue="All"
          onValueChange={(value) =>
            setSelectedCategory(
              value === "All" ? undefined : (value as ExerciseCategory),
            )
          }
        >
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="md:hidden">
              <Select
                value={selectedCategory || "All"}
                onValueChange={(value) =>
                  setSelectedCategory(
                    value === "All" ? undefined : (value as ExerciseCategory),
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden md:inline-flex">
              <TabsTrigger value="All">All</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs"
            />
          </div>

          <TabsContent value="All" className="h-full">
            <ExerciseList exercises={exercises} />
          </TabsContent>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="h-full">
              <ExerciseList exercises={exercises} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function ExerciseList({
  exercises,
}: {
  exercises: ReturnType<typeof useQuery<typeof api.exercises.list>>;
}) {
  if (exercises === undefined) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No exercises found. Add a custom exercise to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <Card key={exercise._id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <Badge variant="secondary">{exercise.category}</Badge>
              </div>
            </CardHeader>
            {exercise.muscleGroup && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {exercise.muscleGroup}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
