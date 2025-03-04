import { Suspense } from 'react'
import './App.css'
import Calendar from '@/pages/Calendar'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Calendar />
    </Suspense>
  )
}

export default App
