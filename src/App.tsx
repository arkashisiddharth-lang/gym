import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { TrainingProvider } from './components/training'
import { About, Contact, Gallery, Home, Membership, Programs, Trainers } from './pages/pages'
export default function App() {
  return (
    <BrowserRouter><TrainingProvider><Routes><Route element={<Layout />}>
      <Route index element={<Home />} /><Route path="programs" element={<Programs />} /><Route path="trainers" element={<Trainers />} />
      <Route path="membership" element={<Membership />} /><Route path="about" element={<About />} /><Route path="gallery" element={<Gallery />} /><Route path="contact" element={<Contact />} />
      <Route path="*" element={<Home />} />
    </Route></Routes></TrainingProvider></BrowserRouter>
  )
}
