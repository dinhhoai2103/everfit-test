import React, { useState } from 'react'
import './styles.scss'
import { useLogic } from './useLogic'
import { Modal, ModalBody, ModalContainer, ModalContent, ModalFooter, ModalHeader } from '@/components/Modal'
import { useModalStatus } from '@/hooks/useModalStatus'
import Input from '@/components/Input'
import DailyWorkoutPlan from '../DailyWorkoutPlan'
import { ErrorWorkout, SelectedWorkoutPlannerItem } from '../declare'
import { generateId } from '@/utils/helper'
import Button from '@/components/Button'

const initialWorkoutDetails = {
  sets: 0,
  reps: [{ weight: '', reps: '' }],
  name: ''
}
const WeeklyCalendar: React.FC = () => {
  const {
    handleAddWorkoutPlanner,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleReorder,
    plannerWeeklies,
    handleAddWorkoutItem,
    handleDropWorkoutPlanner,
    handleDragStartWorkoutPlanner,
    handleDropWorkoutItem
  } = useLogic()
  const { isOpen: isOpenWorkoutModal, open: openWorkoutModal, close: closeWorkoutModal } = useModalStatus()
  const { isOpen: isOpenWorkoutPlanModal, open: openWorkoutPlanModal, close: closeWorkoutPlanModal } = useModalStatus()

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedWorkoutPlannerItem, setSelectedWorkoutPlannerItem] = useState<SelectedWorkoutPlannerItem>({
    plannerWeeklyId: '',
    workoutPlannerId: ''
  })

  const [workoutDetails, setWorkoutDetails] = useState({
    sets: 0,
    reps: [{ weight: '', reps: '' }],
    name: ''
  })

  const addRepsEntry = () => {
    setWorkoutDetails({
      ...workoutDetails,
      reps: [...workoutDetails.reps, { weight: '', reps: '' }]
    })
  }

  const updateRepsEntry = (index: number, field: 'weight' | 'reps', value: number) => {
    const updatedReps = workoutDetails.reps.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    setWorkoutDetails({ ...workoutDetails, reps: updatedReps })
  }

  const removeRepsEntry = (index: number) => {
    setWorkoutDetails({
      ...workoutDetails,
      reps: workoutDetails.reps.filter((_, i) => i !== index)
    })
  }

  const [titleWorkoutPlanner, setTitleWorkoutPlanner] = useState<string>('')

  const [errorTitleWorkoutPlanner, setErrorTitleWorkoutPlanner] = useState<string>('')

  const [errorWorkout, setErrorWorkout] = useState<ErrorWorkout>({
    name: '',
    sets: '',
    reps: ''
  })

  const handleAddWorkoutPlannerModal = (date: string) => {
    openWorkoutPlanModal()
    setSelectedDate(date)
  }

  const handleAddWorkoutPlannerItemModal = ({ plannerWeeklyId, workoutPlannerId }: SelectedWorkoutPlannerItem) => {
    setSelectedWorkoutPlannerItem({ plannerWeeklyId, workoutPlannerId })
    openWorkoutModal()
  }

  const handleCloseWorkoutPlanModal = () => {
    setTitleWorkoutPlanner('')
    setErrorTitleWorkoutPlanner('')
    closeWorkoutPlanModal()
  }

  const handleCloseWorkoutModal = () => {
    setErrorWorkout({ name: '', sets: '', reps: '' })
    setWorkoutDetails(initialWorkoutDetails)
    closeWorkoutModal()
  }

  const onSubmitAddWorkoutPlan = () => {
    if (!titleWorkoutPlanner) {
      setErrorTitleWorkoutPlanner('Title workout planner is required')
      return
    }
    setErrorTitleWorkoutPlanner('')
    handleAddWorkoutPlanner({
      id: generateId(),
      name: titleWorkoutPlanner,
      date: selectedDate,
      workouts: []
    })
    handleCloseWorkoutPlanModal()
  }

  const onSubmitAddWorkoutItem = () => {
    const isValidWorkoutReps = workoutDetails.reps.every((entry) => Number(entry.weight) > 0 && Number(entry.reps) > 0)
    if (!workoutDetails.name || workoutDetails.sets == 0 || !isValidWorkoutReps) {
      const setsErrStr = workoutDetails.sets == 0 ? 'Sets workout is required' : ''
      const repsErrStr = !isValidWorkoutReps ? 'All reps entries must be filled and value must be greater than 0' : ''
      const nameErrStr = !workoutDetails.name ? 'Name workout is required' : ''
      setErrorWorkout({ ...errorWorkout, sets: setsErrStr, name: nameErrStr, reps: repsErrStr })
      return
    }
    setErrorWorkout({ name: '', sets: '', reps: '' })

    handleAddWorkoutItem(selectedWorkoutPlannerItem, {
      id: generateId(),
      name: workoutDetails.name,
      sets: workoutDetails.sets,
      reps: workoutDetails.reps
    })
    handleCloseWorkoutModal()
  }

  return (
    <>
      <div className='weekly-calendar'>
        <div className='days'>
          {plannerWeeklies.map((weeklyPlan) => (
            <DailyWorkoutPlan
              key={weeklyPlan.id}
              weeklyPlan={weeklyPlan}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              handleReorder={handleReorder}
              handleAddWorkoutPlannerModal={handleAddWorkoutPlannerModal}
              handleAddWorkoutPlannerItemModal={handleAddWorkoutPlannerItemModal}
              onDragStart={handleDragStart}
              handleDragStartWorkoutPlanner={handleDragStartWorkoutPlanner}
              handleDropWorkoutPlanner={handleDropWorkoutPlanner}
              handleDropWorkoutItem={handleDropWorkoutItem}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={isOpenWorkoutPlanModal} onClose={handleCloseWorkoutPlanModal}>
        <ModalContent>
          <ModalContainer>
            <ModalHeader title='Add workout plan' hasIcon onClose={handleCloseWorkoutPlanModal} />
            <ModalBody>
              <Input
                error={errorTitleWorkoutPlanner}
                label='Name'
                placeholder='Please enter workout plan'
                onChange={(e) => setTitleWorkoutPlanner(e.target.value)}
              />
            </ModalBody>
            <ModalFooter onClickOk={onSubmitAddWorkoutPlan} />
          </ModalContainer>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenWorkoutModal} onClose={handleCloseWorkoutModal}>
        <ModalContent>
          <ModalContainer>
            <ModalHeader title='Add workout' hasIcon onClose={handleCloseWorkoutModal} />
            <ModalBody>
              <Input
                placeholder='Please enter name'
                label='Name'
                error={errorWorkout.name}
                onChange={(e) => setWorkoutDetails({ ...workoutDetails, name: e.target.value })}
              />
              <Input
                type='number'
                placeholder='Please enter sets'
                min={1}
                error={errorWorkout.sets}
                label='Sets'
                onChange={(e) => setWorkoutDetails({ ...workoutDetails, sets: +e.target.value })}
              />
              <label className='input__label'>Reps</label>
              {workoutDetails.reps.map((entry, index) => {
                return (
                  <div key={index} className='reps-entry'>
                    <Input
                      type='number'
                      placeholder='Weight (e.g., 50 lb)'
                      min={1}
                      value={entry.weight}
                      onChange={(e) => updateRepsEntry(index, 'weight', +e.target.value)}
                    />
                    <Input
                      type='number'
                      placeholder='Reps'
                      min={1}
                      value={entry.reps}
                      onChange={(e) => updateRepsEntry(index, 'reps', +e.target.value)}
                    />
                    <Button className='btn-remove' variant='danger' size='small' onClick={() => removeRepsEntry(index)}>
                      Remove
                    </Button>
                  </div>
                )
              })}
              {errorWorkout.reps && <p className='input__error'>{errorWorkout.reps}</p>}
              <Button className='btn-add' variant='primary' size='small' onClick={addRepsEntry}>
                Add Reps Entry
              </Button>
            </ModalBody>
            <ModalFooter onClickOk={onSubmitAddWorkoutItem} />
          </ModalContainer>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WeeklyCalendar
