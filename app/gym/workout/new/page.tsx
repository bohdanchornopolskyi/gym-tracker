"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Exercise, ExerciseCategory, SetInput } from "@/types";
import { useMutation, useQuery } from "convex/react";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categories: ExerciseCategory[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

type WorkoutExercise = {
  exercise: Exercise;
  sets: SetInput[];
};

export default function NewWorkoutPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    [],
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const exercises = useQuery(api.exercises.list, {});
  const createWorkout = useMutation(api.workouts.create);
  const createSet = useMutation(api.sets.create);

  const addExercise = (exercise: Exercise) => {
    if (workoutExercises.find((we) => we.exercise._id === exercise._id)) {
      return;
    }

    setWorkoutExercises([
      ...workoutExercises,
      {
        exercise,
        sets: [
          {
            exerciseId: exercise._id,
            setNumber: 1,
            reps: 10,
            weight: 0,
          },
        ],
      },
    ]);
    setDialogOpen(false);
  };

  const addSet = (exerciseId: Id<"exercises">) => {
    setWorkoutExercises(
      workoutExercises.map((we) => {
        if (we.exercise._id === exerciseId) {
          const lastSet = we.sets[we.sets.length - 1];
          return {
            ...we,
            sets: [
              ...we.sets,
              {
                exerciseId,
                setNumber: we.sets.length + 1,
                reps: lastSet?.reps || 10,
                weight: lastSet?.weight || 0,
              },
            ],
          };
        }
        return we;
      }),
    );
  };

  const removeSet = (exerciseId: Id<"exercises">, setIndex: number) => {
    setWorkoutExercises(
      workoutExercises.map((we) => {
        if (we.exercise._id === exerciseId) {
          const newSets = we.sets.filter((_, idx) => idx !== setIndex);
          return {
            ...we,
            sets: newSets.map((s, idx) => ({ ...s, setNumber: idx + 1 })),
          };
        }
        return we;
      }),
    );
  };

  const removeExercise = (exerciseId: Id<"exercises">) => {
    setWorkoutExercises(
      workoutExercises.filter((we) => we.exercise._id !== exerciseId),
    );
  };

  const updateSet = (
    exerciseId: Id<"exercises">,
    setIndex: number,
    field: "reps" | "weight" | "restTime",
    value: number,
  ) => {
    setWorkoutExercises(
      workoutExercises.map((we) => {
        if (we.exercise._id === exerciseId) {
          return {
            ...we,
            sets: we.sets.map((s, idx) =>
              idx === setIndex ? { ...s, [field]: value } : s,
            ),
          };
        }
        return we;
      }),
    );
  };

  const incrementValue = (
    exerciseId: Id<"exercises">,
    setIndex: number,
    field: "reps" | "weight",
    increment: number,
  ) => {
    setWorkoutExercises(
      workoutExercises.map((we) => {
        if (we.exercise._id === exerciseId) {
          return {
            ...we,
            sets: we.sets.map((s, idx) =>
              idx === setIndex
                ? { ...s, [field]: Math.max(0, s[field] + increment) }
                : s,
            ),
          };
        }
        return we;
      }),
    );
  };

  const saveWorkout = async () => {
    if (workoutExercises.length === 0) {
      return;
    }

    const workoutId = await createWorkout({
      date: new Date(date).getTime(),
      notes: notes || undefined,
    });

    for (const we of workoutExercises) {
      for (const set of we.sets) {
        await createSet({
          workoutId,
          ...set,
        });
      }
    }

    router.push("/gym/history");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">New Workout</h1>
            <p className="text-sm text-muted-foreground">
              Log your exercises and sets
            </p>
          </div>
          <Button
            onClick={saveWorkout}
            disabled={workoutExercises.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Workout
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="How did you feel today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Exercises</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Select Exercise</DialogTitle>
                </DialogHeader>
                <ExerciseSelector
                  exercises={exercises}
                  onSelect={addExercise}
                />
              </DialogContent>
            </Dialog>
          </div>

          {workoutExercises.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No exercises added. Click "Add Exercise" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {workoutExercises.map((we) => (
                <Card key={we.exercise._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{we.exercise.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="secondary" className="mt-1">
                            {we.exercise.category}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(we.exercise._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {we.sets.map((set, idx) => (
                        <div key={idx}>
                          <div className="flex items-center gap-2">
                            <span className="w-12 text-sm font-medium">
                              Set {idx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  incrementValue(
                                    we.exercise._id,
                                    idx,
                                    "reps",
                                    -1,
                                  )
                                }
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                className="h-8 w-16 text-center"
                                value={set.reps}
                                onChange={(e) =>
                                  updateSet(
                                    we.exercise._id,
                                    idx,
                                    "reps",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  incrementValue(
                                    we.exercise._id,
                                    idx,
                                    "reps",
                                    1,
                                  )
                                }
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <span className="text-sm">reps</span>
                            </div>
                            <span className="text-muted-foreground">×</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  incrementValue(
                                    we.exercise._id,
                                    idx,
                                    "weight",
                                    -2.5,
                                  )
                                }
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                step="0.5"
                                className="h-8 w-20 text-center"
                                value={set.weight}
                                onChange={(e) =>
                                  updateSet(
                                    we.exercise._id,
                                    idx,
                                    "weight",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  incrementValue(
                                    we.exercise._id,
                                    idx,
                                    "weight",
                                    2.5,
                                  )
                                }
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <span className="text-sm">kg</span>
                            </div>
                            {we.sets.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeSet(we.exercise._id, idx)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSet(we.exercise._id)}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Set
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseSelector({
  exercises,
  onSelect,
}: {
  exercises: Exercise[] | undefined;
  onSelect: (exercise: Exercise) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "All"
  >("All");

  const filteredExercises = exercises?.filter((ex) => {
    const matchesCategory =
      selectedCategory === "All" || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Tabs
        value={selectedCategory}
        onValueChange={(v) =>
          setSelectedCategory(v as ExerciseCategory | "All")
        }
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="All">All</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={selectedCategory}>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredExercises?.map((exercise) => (
                <Card
                  key={exercise._id}
                  className="cursor-pointer transition-colors hover:bg-accent"
                  onClick={() => onSelect(exercise)}
                >
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {exercise.name}
                      </CardTitle>
                      <Badge variant="secondary">{exercise.category}</Badge>
                    </div>
                    {exercise.muscleGroup && (
                      <CardDescription className="text-xs">
                        {exercise.muscleGroup}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
              {filteredExercises?.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  No exercises found
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
