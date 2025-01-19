import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { Homepage, Product, Pricing, AppLayout, PageNotFound, Login, ProtectedRoute } from './pages'
import { CityList, CountriesList, City, Form } from './components'
import { CitiesProvider } from './contexts/CitiesContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
    <CitiesProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/app" element={
          <ProtectedRoute> 
            <AppLayout />
            </ProtectedRoute>}>
          <Route index element={<Navigate replace to='cities' />}/>
          <Route path="cities" element={<CityList/>}/>
            <Route path="cities/:id" element={<City />} />
          <Route path="countries" element={<CountriesList/>}/>
          <Route path="form" element={<Form />}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
  )
}

export default App