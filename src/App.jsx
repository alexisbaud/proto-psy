import { Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore'
import MobileLayout from './components/layout/MobileLayout'
import TabLayout from './components/layout/TabLayout'
import Questionnaire from './features/questionnaire/Questionnaire'
import MoodSelector from './features/mood/MoodSelector'
import Journal from './features/journal/Journal'
import ExercisesList from './features/exercises/ExercisesList'
import CirclesExercise from './features/exercises/CirclesExercise'
import Sessions from './features/sessions/Sessions'
import Debrief from './features/debrief/Debrief'
import Progression from './features/progression/Progression'
import Profile from './features/profile/Profile'
import EmergencyScreen from './components/markers/EmergencyScreen'

function App() {
  const hasCompletedQuestionnaire = useStore(s => s.hasCompletedQuestionnaire)
  const hasDoneMoodCheckIn = useStore(s => s.hasDoneMoodCheckIn)

  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={
          !hasCompletedQuestionnaire
            ? <Navigate to="/questionnaire" replace />
            : !hasDoneMoodCheckIn
            ? <Navigate to="/mood" replace />
            : <Navigate to="/app/journal" replace />
        } />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/mood" element={<MoodSelector />} />
        <Route path="/emergency" element={<EmergencyScreen />} />
        <Route path="/exercise/circles" element={<CirclesExercise />} />
        <Route path="/debrief" element={<Debrief />} />
        <Route path="/debrief/:sessionId" element={<Debrief />} />
        <Route path="/app" element={<TabLayout />}>
          <Route path="journal" element={<Journal />} />
          <Route path="exercises" element={<ExercisesList />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="progression" element={<Progression />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileLayout>
  )
}

export default App
