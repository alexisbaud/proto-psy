import { create } from 'zustand'
import { JOURNAL_ENTRIES, SESSIONS } from '../data/mockData'

const useStore = create((set) => ({
  // ─── App state ──────────────────────────────────────────────
  hasCompletedQuestionnaire: false,
  hasDoneMoodCheckIn: false,
  currentMood: null,
  currentMoodColor: null,

  setQuestionnaireCompleted: () =>
    set({ hasCompletedQuestionnaire: true }),

  setCurrentMood: (mood, color) =>
    set({
      currentMood: mood,
      currentMoodColor: color,
      hasDoneMoodCheckIn: true,
    }),

  resetMoodCheckIn: () =>
    set({
      hasDoneMoodCheckIn: false,
      currentMood: null,
      currentMoodColor: null,
    }),

  // ─── Journal state ──────────────────────────────────────────
  journalEntries: JOURNAL_ENTRIES,
  currentEntryId: null,

  addJournalEntry: (entry) =>
    set((state) => ({
      journalEntries: [entry, ...state.journalEntries],
    })),

  updateJournalEntry: (id, updates) =>
    set((state) => ({
      journalEntries: state.journalEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    })),

  setCurrentEntryId: (id) =>
    set({ currentEntryId: id }),

  // ─── Sessions state ─────────────────────────────────────────
  sessions: SESSIONS,

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),

  markSessionDebriefed: (id) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, debriefCompleted: true } : session
      ),
    })),

  // ─── Exercise state ──────────────────────────────────────────
  completedExercises: [],
  currentExercise: null,

  addCompletedExercise: (exercise) =>
    set((state) => ({
      completedExercises: [...state.completedExercises, exercise],
    })),

  setCurrentExercise: (exercise) =>
    set({ currentExercise: exercise }),

  // ─── Debrief state ──────────────────────────────────────────
  debriefMessages: [],

  addDebriefMessage: (message) =>
    set((state) => ({
      debriefMessages: [...state.debriefMessages, message],
    })),

  resetDebrief: () =>
    set({ debriefMessages: [] }),

  // ─── Questionnaire state ────────────────────────────────────
  questionnaireAnswers: {},

  setQuestionnaireAnswer: (questionId, answer) =>
    set((state) => ({
      questionnaireAnswers: {
        ...state.questionnaireAnswers,
        [questionId]: answer,
      },
    })),
}))

export default useStore
