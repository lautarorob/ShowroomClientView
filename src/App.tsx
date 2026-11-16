import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProjectProvider } from './components/ProjectProvider'
import { IntroPage } from './pages/IntroPage'
import { MasterplanPage } from './pages/MasterplanPage'
import { TopviewPage } from './pages/TopviewPage'
import { AvailabilityPage } from './pages/AvailabilityPage'
import { GalleryPage } from './pages/GalleryPage'
import { AmenitiesPage } from './pages/AmenitiesPage'
import { Tour360Page } from './pages/Tour360Page'
import { LocationPage } from './pages/LocationPage'
import { ContactPage } from './pages/ContactPage'
import { VideoPage } from './pages/VideoPage'
import { QuotePage } from './pages/QuotePage'

export default function App() {
  return (
    <ProjectProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/masterplan" element={<MasterplanPage />} />
          <Route path="/topview" element={<TopviewPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/tour360" element={<Tour360Page />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/quote/:unitId" element={<QuotePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ProjectProvider>
  )
}
