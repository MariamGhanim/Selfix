import {
  EnergyPanel,
  FocusPanel,
  FruitsPanel,
  OutingsPanel,
  RatingPanel,
  ReadingPanel,
  ShowerPanel,
  SleepPanel,
  StudyPanel,
  SweetsPanel,
  TasksPanel,
  TeethPanel,
  VitaminsPanel,
  WaterPanel,
  WorkoutPanel,
} from '../Trackers/panels'
import SalahPanel from '../Trackers/SalahPanel'
import {
  CustomChecklistPanel,
  CustomGridPanel,
  CustomNotesPanel,
} from '../Trackers/CustomPanels'

const PANELS = {
  rating: RatingPanel,
  energy: EnergyPanel,
  shower: ShowerPanel,
  fruits: FruitsPanel,
  sweets: SweetsPanel,
  water: WaterPanel,
  sleep: SleepPanel,
  salah: SalahPanel,
  focus: FocusPanel,
  vitamins: VitaminsPanel,
  study: StudyPanel,
  reading: ReadingPanel,
  teeth: TeethPanel,
  workout: WorkoutPanel,
  outings: OutingsPanel,
  todos: TasksPanel,
}

export default function RightPage({ tracker, selectedDay }) {
  const { month, day } = selectedDay

  let Panel = PANELS[tracker?.panel] || RatingPanel
  if (tracker?.custom) {
    if (tracker.panel === 'checklist') {
      return (
        <div
          data-right-page
          data-no-flip
          className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden p-1.5 sm:p-4"
        >
          <CustomChecklistPanel
            trackerId={tracker.id}
            month={month}
            day={day}
            title={tracker.title}
          />
        </div>
      )
    }
    if (tracker.panel === 'notes') {
      return (
        <div
          data-right-page
          data-no-flip
          className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden p-1.5 sm:p-4"
        >
          <CustomNotesPanel trackerId={tracker.id} month={month} day={day} title={tracker.title} />
        </div>
      )
    }
    return (
      <div
        data-right-page
        data-no-flip
        className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden p-1.5 sm:p-4"
      >
        <CustomGridPanel trackerId={tracker.id} month={month} day={day} title={tracker.title} />
      </div>
    )
  }

  return (
    <div
      data-right-page
      data-no-flip
      className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden p-1.5 sm:p-4"
    >
      <Panel month={month} day={day} />
    </div>
  )
}
