import { createContext, useState, useEffect, useContext } from 'react';


const CitiesConext = createContext();

function CitiesProvider({children}) {
    const [cities, setCities] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentCity, setCurrentCity] = useState({})
    
      const BASE_URL = 'http://localhost:9000'
      useEffect(function () {
        async function fetchCities(){
         try { 
          setIsLoading(true)
          const res = await fetch(`${BASE_URL}/cities`)
          const data = await res.json()
          setCities(data)
        } catch {
          console.error('Failed to fetch data')
        } finally {
          setIsLoading(false)
        }
      }
      fetchCities()
    }, [])

    async function getCity(id){
            try { 
             setIsLoading(true)
             const res = await fetch(`${BASE_URL}/cities/${id}`)
             const data = await res.json()
             setCurrentCity(data)
           } catch {
             console.error('Failed to fetch data')
           } finally {
             setIsLoading(false)
           }
         }

    async function createCity(newCity){
      try { 
        setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities`, {
          method: 'POST',
          body: JSON.stringify(newCity),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await res.json()
        setCities(cities => [...cities, data])
      } catch {
        console.error('There was an error creating city...')
      } finally {
        setIsLoading(false)
      }
    } 
    
    async function deleteCity(id){
      try { 
        setIsLoading(true)
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: 'DELETE',
        })
        setCities(cities => cities.filter(city => city.id !== id))
      } catch {
        console.error('There was an error deleting city...')
      } finally {
        setIsLoading(false)
      }
    }      

    return (
        <CitiesConext.Provider value={{cities, isLoading, currentCity, getCity, createCity, deleteCity}}>
            {children}
        </CitiesConext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesConext)
    if (!context) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}

export {CitiesProvider, useCities}