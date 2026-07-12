import { useState } from 'react'
import BottomNav from './components/BottomNav'
import TriagePage from './pages/TriagePage'
import CommunityPage from './pages/CommunityPage'
import RankPage from './pages/RankPage'
import StorePage from './pages/StorePage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [tab, setTab] = useState('triage')

  return (
    <div className="mx-auto min-h-full w-full max-w-[480px] px-5 pb-24">
      {tab === 'triage' && <TriagePage />}
      {tab === 'community' && <CommunityPage />}
      {tab === 'rank' && <RankPage />}
      {tab === 'store' && <StorePage />}
      {tab === 'profile' && <ProfilePage onNavigate={setTab} />}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
