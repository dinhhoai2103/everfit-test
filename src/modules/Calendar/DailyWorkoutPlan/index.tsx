import React from 'react'
import { getCurrentDay, getDayText } from '@/utils/date'
import WorkoutItem from '../WorkoutItem'
import Icon from '@/components/Icon'
import { AddIcon } from '@/assets/icons'
import './styles.scss'
import { DailyWorkoutPlanProps } from '../declare'
import { ThreeDot } from '@/assets/icons/ThreeDot'

const DailyWorkoutPlan: React.FC<DailyWorkoutPlanProps> = ({
  weeklyPlan,
  onDragOver,
  handleAddWorkoutPlannerModal,
  handleAddWorkoutPlannerItemModal,
  onDragStart,
  handleReorder,
  handleDragStartWorkoutPlanner,
  handleDropWorkoutPlanner,
  handleDropWorkoutItem
}) => {
  return (
    <li
      key={weeklyPlan.id}
      className={`day ${weeklyPlan.date == getCurrentDay() ? 'current-day' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDropWorkoutPlanner(e, weeklyPlan.id)}
    >
      <div className='day-text'>{getDayText(weeklyPlan.date)}</div>
      <div className='workout-planner'>
        <div className='workout-planner-header'>
          <h2 className='workout-planner--day'>{weeklyPlan.date}</h2>
          <Icon icon={<AddIcon />} onClick={() => handleAddWorkoutPlannerModal(weeklyPlan.date)} />
        </div>

        {weeklyPlan.workoutPlan.length > 0 && (
          <div className='workout-planner-item-wrap'>
            {(weeklyPlan.workoutPlan || []).map((workoutPlanner) => (
              <div
                key={workoutPlanner.id}
                draggable
                onDragStart={(e) => {
                  handleDragStartWorkoutPlanner(e, workoutPlanner, weeklyPlan.id)
                }}
                onDragOver={onDragOver}
                onDrop={(e) => handleDropWorkoutPlanner(e, weeklyPlan.id)}
                className='workout-planner-item'
              >
                <div className='workout-name'>
                  <p className='title'>{workoutPlanner.name}</p>
                  <Icon icon={<ThreeDot />} />
                </div>
                <WorkoutItem
                  key={workoutPlanner.id}
                  workoutPlan={workoutPlanner}
                  dayId={workoutPlanner.id}
                  onDragOver={onDragOver}
                  handleReorder={handleReorder}
                  onDragStart={onDragStart}
                  handleDropWorkoutItem={handleDropWorkoutItem}
                />
                <div className='workout-planner-item-action'>
                  <Icon
                    icon={<AddIcon />}
                    onClick={() =>
                      handleAddWorkoutPlannerItemModal({
                        plannerWeeklyId: weeklyPlan.id,
                        workoutPlannerId: workoutPlanner.id
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

export default DailyWorkoutPlan
