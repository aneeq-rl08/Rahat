import { useState, useEffect } from 'react';
import CitySelectorModal from './CitySelectorModal';
import LucideIcon from '../LucideIcon';

const cities = [
  { name: 'Mecca, Saudi Arabia', value: 'Makkah,SA' },
  { name: 'Medina, Saudi Arabia', value: 'Madinah,SA' },
  { name: 'Riyadh, Saudi Arabia', value: 'Riyadh,SA' },
  { name: 'Dubai, UAE', value: 'Dubai,AE' },
  { name: 'Abu Dhabi, UAE', value: 'Abu Dhabi,AE' },
  { name: 'Sharjah, UAE', value: 'Sharjah,AE' },
  { name: 'Kuwait City, Kuwait', value: 'Kuwait,KW' },
  { name: 'Manama, Bahrain', value: 'Manama,BH' },
  { name: 'Doha, Qatar', value: 'Doha,QA' },
  { name: 'Muscat, Oman', value: 'Muscat,OM' },
  { name: 'Cairo, Egypt', value: 'Cairo,EG' },
  { name: 'Alexandria, Egypt', value: 'Alexandria,EG' },
  { name: 'Istanbul, Turkey', value: 'Istanbul,TR' },
  { name: 'Ankara, Turkey', value: 'Ankara,TR' },
  { name: 'Jakarta, Indonesia', value: 'Jakarta,ID' },
  { name: 'Kuala Lumpur, Malaysia', value: 'Kuala Lumpur,MY' },
  { name: 'Singapore', value: 'Singapore,SG' },
  { name: 'Karachi, Pakistan', value: 'Karachi,PK' },
  { name: 'Lahore, Pakistan', value: 'Lahore,PK' },
  { name: 'Islamabad, Pakistan', value: 'Islamabad,PK' },
  { name: 'Dhaka, Bangladesh', value: 'Dhaka,BD' },
  { name: 'Tehran, Iran', value: 'Tehran,IR' },
  { name: 'Baghdad, Iraq', value: 'Baghdad,IQ' },
  { name: 'Amman, Jordan', value: 'Amman,JO' },
  { name: 'Beirut, Lebanon', value: 'Beirut,LB' },
  { name: 'Damascus, Syria', value: 'Damascus,SY' },
  { name: 'Rabat, Morocco', value: 'Rabat,MA' },
  { name: 'Casablanca, Morocco', value: 'Casablanca,MA' },
  { name: 'Algiers, Algeria', value: 'Algiers,DZ' },
  { name: 'Tunis, Tunisia', value: 'Tunis,TN' },
  { name: 'Tripoli, Libya', value: 'Tripoli,LY' },
  { name: 'Khartoum, Sudan', value: 'Khartoum,SD' },
  { name: 'London, UK', value: 'London,GB' },
  { name: 'Manchester, UK', value: 'Manchester,GB' },
  { name: 'Birmingham, UK', value: 'Birmingham,GB' },
  { name: 'Paris, France', value: 'Paris,FR' },
  { name: 'Marseille, France', value: 'Marseille,FR' },
  { name: 'Berlin, Germany', value: 'Berlin,DE' },
  { name: 'Frankfurt, Germany', value: 'Frankfurt,DE' },
  { name: 'Madrid, Spain', value: 'Madrid,ES' },
  { name: 'Barcelona, Spain', value: 'Barcelona,ES' },
  { name: 'Rome, Italy', value: 'Rome,IT' },
  { name: 'Milan, Italy', value: 'Milan,IT' },
  { name: 'Turin, Italy', value: 'Turin,IT' },
  { name: 'Naples, Italy', value: 'Naples,IT' },
  { name: 'Palermo, Italy', value: 'Palermo,IT' },
  { name: 'Genoa, Italy', value: 'Genoa,IT' },
  { name: 'Bologna, Italy', value: 'Bologna,IT' },
  { name: 'Florence, Italy', value: 'Florence,IT' },
  { name: 'Venice, Italy', value: 'Venice,IT' },
  { name: 'Verona, Italy', value: 'Verona,IT' },
  { name: 'Lombardy, Italy', value: 'Milan,IT' },
  { name: 'Lomagna, Italy', value: 'Lomagna,IT' },
  { name: 'New York, USA', value: 'New York,US' },
  { name: 'Washington DC, USA', value: 'Washington DC,US' },
  { name: 'Los Angeles, USA', value: 'Los Angeles,US' },
  { name: 'Chicago, USA', value: 'Chicago,US' },
  { name: 'Houston, USA', value: 'Houston,US' },
  { name: 'Toronto, Canada', value: 'Toronto,CA' },
  { name: 'Montreal, Canada', value: 'Montreal,CA' },
  { name: 'Vancouver, Canada', value: 'Vancouver,CA' },
  { name: 'Sydney, Australia', value: 'Sydney,AU' },
  { name: 'Melbourne, Australia', value: 'Melbourne,AU' },
  { name: 'Perth, Australia', value: 'Perth,AU' }
];

export default function CitySelector({ selectedCity, onCitySelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      onCitySelect(savedCity);
    }
  }, [onCitySelect]);

  const handleCitySelect = (cityValue) => {
    onCitySelect(cityValue);
    localStorage.setItem('selectedCity', cityValue);
  };

  const getCityDisplayName = (cityValue) => {
    const city = cities.find(c => c.value === cityValue);
    return city ? city.name : cityValue || 'Select City';
  };

  return (
    <>
      <div style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        border: `1px solid #A3C9A8`,
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <h4 style={{ 
            margin: 0, 
            color: '#2F5D62', 
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Location
          </h4>
        </div>
        
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `2px solid #2F5D62`,
            borderRadius: '6px',
            background: 'white',
            color: '#2F5D62',
            fontSize: '0.85rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#f0f8f0';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'white';
          }}
        >
          <span>{getCityDisplayName(selectedCity)}</span>
          <LucideIcon name="Target" size={18} />
        </button>
        
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '0.75rem', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Click to select your city for accurate prayer times
        </p>
      </div>

      <CitySelectorModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
      />
    </>
  );
}
