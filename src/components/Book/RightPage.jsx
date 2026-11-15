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
import { usePanelLayout } from '../Trackers/panelUi'

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

function PageFrame({ children }) {
  const { mode } = usePanelLayout()
  const isSheet = mode === 'sheet'

  return (
    <div
      data-right-page
      data-no-flip
      className={
        isSheet
          ? 'relative z-10 flex min-h-0 flex-col overflow-visible p-0'
          : 'relative z-10 flex h-full min-h-0 flex-col overflow-hidden p-1.5 sm:p-4'
      }
    >
      {children}
    </div>
  )
}

export default function RightPage({ tracker, selectedDay }) {
  const { month, day } = selectedDay

  let Panel = PANELS[tracker?.panel] || RatingPanel
  if (tracker?.custom) {
    if (tracker.panel === 'checklist') {
      return (
        <PageFrame>
          <CustomChecklistPanel
            trackerId={tracker.id}
            month={month}
            day={day}
            title={tracker.title}
          />
        </PageFrame>
      )
    }
    if (tracker.panel === 'notes') {
      return (
        <PageFrame>
          <CustomNotesPanel trackerId={tracker.id} month={month} day={day} title={tracker.title} />
        </PageFrame>
      )
    }
    return (
      <PageFrame>
        <CustomGridPanel trackerId={tracker.id} month={month} day={day} title={tracker.title} />
      </PageFrame>
    )
  }

  return (
    <PageFrame>
      <Panel month={month} day={day} />
    </PageFrame>
  )
}
