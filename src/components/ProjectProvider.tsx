import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { availabilityIndex, loadProjectData } from '../data'
import type { AvailabilityData, ProjectData } from '../types'
import { ProjectContext } from './projectContextBase'

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{
    project: ProjectData
    availability: AvailabilityData
  } | null>(null)

  useEffect(() => {
    let alive = true
    loadProjectData().then((d) => {
      if (alive) setData(d)
    })
    return () => {
      alive = false
    }
  }, [])

  if (!data) {
    return (
      <div className="loading-screen" role="status">
        <div className="loading-screen__spinner" />
        <span className="loading-screen__text">Cargando página</span>
      </div>
    )
  }

  const value = {
    project: data.project,
    availability: data.availability,
    availabilityMap: availabilityIndex(data.availability),
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
