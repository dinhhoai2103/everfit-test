import { useEffect, useState } from 'react'
import { getCurrentWeekDays, getMondayOfCurrentWeek, getMonthDays } from '@/utils/date'
import { WeeklyPlan, WorkoutItem, WorkoutPlan, SelectedWorkoutPlannerItem } from '../declare'
import { generateId } from '@/utils/helper'

export const useLogic = () => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentWeekStart = getMondayOfCurrentWeek(today)
  const daysOfMonth = getMonthDays(currentYear, currentMonth)
  const currentWeekDays = getCurrentWeekDays(daysOfMonth, currentWeekStart)

  const [draggingWorkout, setDraggingWorkout] = useState<{
    workout: WorkoutItem
    fromPlannerId: string
  } | null>(null)

  const [, setDraggingWorkoutPlanner] = useState<{
    plan: WorkoutPlan
    fromWeeklyId: string
  } | null>(null)

  const [plannerWeeklies, setPlannerWeeklies] = useState<WeeklyPlan[]>([])

  const handleDragStartWorkoutPlanner = (e: React.DragEvent, plan: WorkoutPlan, fromWeeklyId: string) => {
    e.dataTransfer.setData('workoutPlannerId', plan.id)
    e.dataTransfer.setData('fromWeeklyId', fromWeeklyId)
    setDraggingWorkoutPlanner({ plan, fromWeeklyId })
  }

  const handleAddWorkoutPlanner = (workoutPlan: WorkoutPlan) => {
    setPlannerWeeklies(
      plannerWeeklies.map((p) => {
        if (p.date === workoutPlan.date) {
          return {
            ...p,
            workoutPlan: [...p.workoutPlan, workoutPlan]
          }
        }
        return p
      })
    )
  }

  const handleAddWorkoutItem = (workoutPlannerItemSelected: SelectedWorkoutPlannerItem, workoutItem: WorkoutItem) => {
    setPlannerWeeklies((prevPlanners) =>
      prevPlanners.map((planner) =>
        planner.id === workoutPlannerItemSelected.plannerWeeklyId
          ? {
              ...planner,
              workoutPlan: planner.workoutPlan.map((workoutPlan) => {
                if (workoutPlan.id === workoutPlannerItemSelected.workoutPlannerId) {
                  return {
                    ...workoutPlan,
                    workouts: [...workoutPlan.workouts, workoutItem]
                  }
                }
                return workoutPlan
              })
            }
          : planner
      )
    )
  }

  const handleDragStart = (e: React.DragEvent, workout: WorkoutItem, fromPlannerId: string) => {
    e.dataTransfer.setData('workoutId', workout.id)
    e.dataTransfer.setData('fromPlannerId', fromPlannerId)
    setDraggingWorkout({ workout, fromPlannerId })
  }

  const handleDrop = (e: React.DragEvent, targetPlannerId: string) => {
    e.preventDefault()

    const workoutId = e.dataTransfer.getData('workoutId')
    const fromPlannerId = e.dataTransfer.getData('fromPlannerId')

    if (fromPlannerId === targetPlannerId) return

    const newPlannerWeeklies = plannerWeeklies.map((weekly) => {
      return {
        ...weekly,
        workoutPlan: weekly.workoutPlan.map((planner) => {
          if (planner.id === fromPlannerId) {
            return {
              ...planner,
              workouts: planner.workouts.filter((w) => w.id !== workoutId)
            }
          }
          if (planner.id === targetPlannerId) {
            const movedWorkout = plannerWeeklies
              .flatMap((w) => w.workoutPlan)
              .find((p) => p.id === fromPlannerId)
              ?.workouts.find((w) => w.id === workoutId)
            const newWorkout = [...planner.workouts]
            if (movedWorkout) {
              newWorkout.push(movedWorkout)
            }
            return {
              ...planner,
              workouts: newWorkout
            }
          }
          return planner
        })
      }
    })

    setPlannerWeeklies(newPlannerWeeklies)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleReorder = (targetWorkoutId: string, targetPlannerId: string) => {
    if (!draggingWorkout || draggingWorkout.fromPlannerId !== targetPlannerId) return

    setPlannerWeeklies((prevWeeklies) =>
      prevWeeklies.map((weekly) => {
        return {
          ...weekly,
          workoutPlan: weekly.workoutPlan.map((planner) => {
            if (planner.id !== targetPlannerId) return planner

            const updatedWorkouts = [...planner.workouts]
            const draggedIndex = updatedWorkouts.findIndex((w) => w.id === draggingWorkout.workout.id)
            const targetIndex = updatedWorkouts.findIndex((w) => w.id === targetWorkoutId)

            if (draggedIndex !== -1 && targetIndex !== -1) {
              const [removed] = updatedWorkouts.splice(draggedIndex, 1)
              updatedWorkouts.splice(targetIndex, 0, removed)
            }

            return { ...planner, workouts: updatedWorkouts }
          })
        }
      })
    )
  }

  const handleDropWorkoutPlanner = (e: React.DragEvent, targetWeeklyId: string) => {
    e.preventDefault()

    const workoutPlannerId = e.dataTransfer.getData('workoutPlannerId')
    const fromWeeklyId = e.dataTransfer.getData('fromWeeklyId')

    if (fromWeeklyId === targetWeeklyId) return

    setPlannerWeeklies((prevWeeklies) =>
      prevWeeklies.map((weekly) => {
        if (weekly.id === fromWeeklyId) {
          return {
            ...weekly,
            workoutPlan: weekly.workoutPlan.filter((planner) => planner.id !== workoutPlannerId)
          }
        }
        if (weekly.id === targetWeeklyId) {
          const movedPlanner = prevWeeklies.flatMap((w) => w.workoutPlan).find((p) => p.id === workoutPlannerId)

          // Check if the planner already exists in the target weekly plan
          const plannerExists = weekly.workoutPlan.some((planner) => planner.id === workoutPlannerId)

          return {
            ...weekly,
            workoutPlan: movedPlanner && !plannerExists ? [...weekly.workoutPlan, movedPlanner] : weekly.workoutPlan
          }
        }
        return weekly
      })
    )
  }

  const handleDropWorkoutItem = (e: React.DragEvent, toPlannerId: string, toDayId: string) => {
    e.preventDefault()

    const workoutItemId = e.dataTransfer.getData('workoutItemId')
    const fromPlannerId = e.dataTransfer.getData('fromPlannerId')
    const fromDayId = e.dataTransfer.getData('fromDayId')

    if (fromPlannerId === toPlannerId && fromDayId === toDayId) return

    setPlannerWeeklies((prevWeeklies) => {
      return prevWeeklies.map((day) => {
        return {
          ...day,
          workoutPlanners: day.workoutPlan
            .map((planner) => {
              if (planner.id === fromPlannerId && day.id === fromDayId) {
                return {
                  ...planner,
                  workoutItems: planner.workouts.filter((item) => item.id !== workoutItemId)
                }
              }

              if (planner.id === toPlannerId && day.id === toDayId) {
                if (planner.workouts.some((item) => item.id === workoutItemId)) {
                  return planner
                }
                return {
                  ...planner,
                  workoutItems: [...planner.workouts, { id: workoutItemId, name: `Workout ${workoutItemId}` }]
                }
              }

              return planner
            })
            .filter((planner) => planner.workouts.length > 0)
        }
      })
    })
  }

  useEffect(() => {
    if (currentWeekDays.length > 0) {
      setPlannerWeeklies((prevPlannerWeekly: WeeklyPlan[]) => {
        return currentWeekDays.map((day) => {
          const existingPlanner = prevPlannerWeekly.find((p) => new Date(p.date).toDateString() === day.toDateString())

          return (
            existingPlanner || {
              id: generateId(),
              date: day.getDate().toString(),
              workoutPlan: []
            }
          )
        })
      })
    }
  }, [currentWeekDays?.length])

  return {
    currentYear,
    currentMonth,
    currentWeekDays,
    plannerWeeklies,
    handleAddWorkoutPlanner,
    handleDrop,
    handleReorder,
    handleDragOver,
    handleDragStart,
    handleAddWorkoutItem,
    handleDropWorkoutPlanner,
    handleDragStartWorkoutPlanner,
    handleDropWorkoutItem
  }
}
