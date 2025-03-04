export interface ErrorWorkout {
  name?: string
  sets?: string
  reps?: string
}

export interface SelectedWorkoutPlannerItem {
  plannerWeeklyId: string
  workoutPlannerId: string
}

export interface WorkoutItem {
  id: string
  name: string
  sets: number
  reps: { weight: string; reps: string }[]
}

export interface WorkoutPlan {
  id: string
  name: string
  date: string
  workouts: WorkoutItem[]
}

export interface WeeklyPlan {
  id: string
  date: string
  workoutPlan: WorkoutPlan[]
}

export interface DailyWorkoutPlanProps {
  weeklyPlan: WeeklyPlan
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, dayId: string) => void
  onDragStart: (e: React.DragEvent, workout: WorkoutItem, dayId: string) => void
  handleAddWorkoutPlannerModal: (date: string) => void
  handleAddWorkoutPlannerItemModal: ({ plannerWeeklyId, workoutPlannerId }: SelectedWorkoutPlannerItem) => void
  handleReorder: (workoutId: string, workoutPlannerId: string) => void
  handleDragStartWorkoutPlanner: (e: React.DragEvent, planner: WorkoutPlan, fromWeeklyId: string) => void
  handleDropWorkoutPlanner: (e: React.DragEvent, dayId: string) => void
  handleDropWorkoutItem: (e: React.DragEvent, workoutPlannerId: string, dayId: string) => void
}

export interface WorkoutItemProps {
  workoutPlan: WorkoutPlan
  dayId: string
  onDragOver: (e: React.DragEvent, workoutId: string, dayId: string) => void
  onDragStart: (e: React.DragEvent, workout: WorkoutItem, workoutPlannerId: string) => void
  handleReorder: (workoutId: string, workoutPlannerId: string) => void
  handleDropWorkoutItem: (e: React.DragEvent, workoutPlannerId: string, dayId: string) => void
}
