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

const PANELS = {
  rating: RatingPanel,
  energy: EnergyPanel,
  shower: ShowerPanel,
  fruits: FruitsPanel,
  sweets: SweetsPanel,
  water: WaterPanel,
  sleep: SleepPanel,
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
  const Panel = PANELS[tracker?.panel] || RatingPanel

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-4">
      <Panel month={month} day={day} />
    </div>
  )
}
