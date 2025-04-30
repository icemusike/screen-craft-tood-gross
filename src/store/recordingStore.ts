import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Recording {
  id: string
  title: string
  date: string
  duration: number
  thumbnailUrl: string
  videoUrl: string
  processed: boolean
}

interface RecordingState {
  recordings: Recording[]
  currentRecording: Recording | null
  addRecording: (recording: Recording) => void
  updateRecording: (id: string, updates: Partial<Recording>) => void
  deleteRecording: (id: string) => void
  setCurrentRecording: (recording: Recording | null) => void
}

export const useRecordingStore = create<RecordingState>()(
  persist(
    (set) => ({
      recordings: [],
      currentRecording: null,
      addRecording: (recording) => 
        set((state) => ({ 
          recordings: [...state.recordings, recording] 
        })),
      updateRecording: (id, updates) => 
        set((state) => ({ 
          recordings: state.recordings.map((rec) => 
            rec.id === id ? { ...rec, ...updates } : rec
          ) 
        })),
      deleteRecording: (id) => 
        set((state) => ({ 
          recordings: state.recordings.filter((rec) => rec.id !== id) 
        })),
      setCurrentRecording: (recording) => 
        set({ currentRecording: recording }),
    }),
    {
      name: 'recordings-storage',
    }
  )
)
