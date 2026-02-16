import {
  DANGER_KEYWORDS,
  COGNITIVE_DISTORTION_KEYWORDS,
  INSOMNIA_KEYWORDS,
  RUMINATION_KEYWORDS,
} from '../data/mockData'

export function detectMarkers(text) {
  const lower = text.toLowerCase()

  for (const keyword of DANGER_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      return { type: 'danger', keyword }
    }
  }

  for (const keyword of COGNITIVE_DISTORTION_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      return { type: 'cognitive_distortion', keyword }
    }
  }

  for (const keyword of INSOMNIA_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      return { type: 'insomnia', keyword }
    }
  }

  for (const keyword of RUMINATION_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      return { type: 'rumination', keyword }
    }
  }

  return null
}
