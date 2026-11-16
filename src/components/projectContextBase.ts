import { createContext, useContext } from 'react'
import type { AvailabilityData, AvailabilityUpdate, ProjectData } from '../types'

export interface ProjectContextValue {
  project: ProjectData
  availability: AvailabilityData
  availabilityMap: Map<number, AvailabilityUpdate>
}

export const ProjectContext = createContext<ProjectContextValue | null>(null)

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within ProjectProvider')
  return ctx
}
