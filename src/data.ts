import svgMap from './svgMap.json'
import type {
  AvailabilityData,
  AvailabilityUpdate,
  Level,
  ProjectData,
  Tower,
  UnitContext,
} from './types'

export const REMOTE_BASE = 'https://www.phbalcony.com'

const svgLookup = svgMap as Record<string, string>

/** Resolve a project asset path: local for SVGs, remote CDN for images. */
export function asset(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const local = svgLookup[path]
  if (local) return local
  return REMOTE_BASE + path
}

/** Raw SVG source URL (always local copy when available). */
export function svgAsset(path?: string): string {
  if (!path) return ''
  return svgLookup[path] ?? asset(path)
}

export async function fetchSvgSource(path?: string): Promise<string> {
  if (!path) return ''
  const url = svgAsset(path)
  const res = await fetch(url)
  return res.text()
}

let cached: { project: ProjectData; availability: AvailabilityData } | null = null

export async function loadProjectData(): Promise<{
  project: ProjectData
  availability: AvailabilityData
}> {
  if (cached) return cached
  const [projectRes, availabilityRes] = await Promise.all([
    fetch('/data/project.json'),
    fetch('/data/availability.json'),
  ])
  const project = (await projectRes.json()) as ProjectData
  const availability = (await availabilityRes.json()) as AvailabilityData
  cached = { project, availability }
  return cached
}

export function availabilityIndex(data: AvailabilityData): Map<number, AvailabilityUpdate> {
  return new Map(data.unitUpdates.map((u) => [u.unitId, u]))
}

export function allLevels(towers: Tower[]): Level[] {
  return towers.flatMap((t) => t.cluster?.levels ?? [])
}

export function allUnitContexts(
  towers: Tower[],
  availability: AvailabilityData,
): UnitContext[] {
  const av = availabilityIndex(availability)
  return towers.flatMap((tower) =>
    (tower.cluster?.levels ?? []).flatMap((level) =>
      (level.cluster?.units ?? []).map((unit) => ({
        unit,
        level,
        tower,
        availability: av.get(unit.unitId),
      })),
    ),
  )
}

export function findUnitContext(
  towers: Tower[],
  availability: AvailabilityData,
  unitId: number,
): UnitContext | undefined {
  return allUnitContexts(towers, availability).find((c) => c.unit.unitId === unitId)
}

export function statusLabel(status?: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'Disponible'
    case 'RESERVED':
      return 'Reservado'
    case 'SOLD':
      return 'Vendido'
    default:
      return 'No disponible'
  }
}

export function statusColor(status?: string, fallback = '#98A2B3'): string {
  switch (status) {
    case 'AVAILABLE':
      return '#1ac366'
    case 'RESERVED':
      return '#deca6e'
    case 'SOLD':
      return '#de7777'
    default:
      return fallback
  }
}

export function formatPrice(amount: number, currencyCode = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function unitSpecs(ctx: UnitContext): { label: string; value: string }[] {
  const level = ctx.unit.unitLevels?.[0]
  if (!level?.unitDetail) return []
  return [...level.unitDetail]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((d) => ({
      label: d.id,
      value:
        d.valueType === 'Boolean' ? (d.value ? 'Sí' : 'No') : String(d.value),
    }))
}

export function parseLatLng(latLng: string): [number, number] {
  const [lat, lng] = latLng.split(',').map((s) => Number(s.trim()))
  return [lat, lng]
}
