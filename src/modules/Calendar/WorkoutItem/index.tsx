import { WorkoutItemProps } from '../declare'
import './styles.scss'

const WorkoutItem = ({ workoutPlan, onDragStart, handleReorder, handleDropWorkoutItem, dayId }: WorkoutItemProps) => {
  return (
    <ul
      key={workoutPlan.id}
      onDrop={(e) => handleDropWorkoutItem(e, workoutPlan.id, dayId)}
      onDragOver={(e) => e.preventDefault()}
      className='workout-item'
    >
      {workoutPlan.workouts.length > 0 &&
        workoutPlan.workouts.map((workout) => (
          <li
            className='workout-planner-content'
            key={workout.id}
            draggable
            onDragStart={(e) => onDragStart(e, workout, workoutPlan.id)}
            onDragOver={(e) => {
              e.preventDefault()
              handleReorder(workout.id, workoutPlan.id)
            }}
          >
            <div className='workout-item-name'>
              <span>{workout.name}</span>
            </div>
            <div className='workout-item-details'>
              <div className='workout-item-sets'>{workout.sets}x</div>
              {workout.reps && workout.reps.length > 0 && (
                <div className='workout-item-reps'>
                  {workout.reps.map((rep, index) => (
                    <span key={index}>
                      {rep.weight} lb x {rep.reps}
                      {index < workout.reps.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
    </ul>
  )
}

export default WorkoutItem
