'use client'

import { monitors } from '@/data/monitors'
import { Monitor } from './Monitor'

export function MonitorField() {
  return (
    <group name="monitorField">
      {monitors.map((monitor) => (
        <Monitor key={monitor.id} data={monitor} />
      ))}
    </group>
  )
}
