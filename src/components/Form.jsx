import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useURLPosition } from "../hooks";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = useURLPosition();
  const { createCity, isLoading } = useCities();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [ geocodingError, setGeocodingError] = useState('');
  const navigate = useNavigate();

  const URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  const[emoji, setEmoji] = useState('');

useEffect(function(){
  if (!lat && !lng) return <Message message="Please click on the map to select a city" />;
  async function getCityData(){
    try {
      setIsLoadingGeocoding(true);
      setGeocodingError('');
      const res = await fetch(`${URL}?latitude=${lat}&longitude=${lng}`);
      const data = await res.json();
      
      if (!data.countryCode) throw new Error('That does not seem to be a city. Please click somewhere else 🙂');

      setCityName(data.city || data.locality || '');
      setCountry(data.countryName || '');
      setEmoji(convertToEmoji(data.countryCode));
    } catch(err) {
      setGeocodingError(err.message);
    } finally {
      setIsLoadingGeocoding(false)
}}
getCityData()}, [lat, lng])

async function handleSubmit(e) {
  e.preventDefault();
  if (!cityName && !date) return;

  const newCity = {cityName, country, date, emoji, notes, position: {lat, lng}};
  await createCity(newCity);
  navigate('/app/cities');
}

if (isLoadingGeocoding) return <Spinner />
if (geocodingError) return <Message message={geocodingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span> 
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker onChange={date => setDate(date)} selected={date} dateFormat='MM/dd/yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
