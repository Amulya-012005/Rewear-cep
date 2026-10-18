export interface StateLocation {
  name: string;
  type: 'state' | 'ut';
  capital: string;
  majorCities: string[];
}

export interface StateCapital {
  no: number;
  state: string;
  capital: string;
}

export const INDIAN_STATE_CAPITALS: StateCapital[] = [
  { no: 1, state: 'Andhra Pradesh', capital: 'Amaravati' },
  { no: 2, state: 'Arunachal Pradesh', capital: 'Itanagar' },
  { no: 3, state: 'Assam', capital: 'Dispur' },
  { no: 4, state: 'Bihar', capital: 'Patna' },
  { no: 5, state: 'Chhattisgarh', capital: 'Raipur' },
  { no: 6, state: 'Goa', capital: 'Panaji' },
  { no: 7, state: 'Gujarat', capital: 'Gandhinagar' },
  { no: 8, state: 'Haryana', capital: 'Chandigarh' },
  { no: 9, state: 'Himachal Pradesh', capital: 'Shimla' },
  { no: 10, state: 'Jharkhand', capital: 'Ranchi' },
  { no: 11, state: 'Karnataka', capital: 'Bengaluru' },
  { no: 12, state: 'Kerala', capital: 'Thiruvananthapuram' },
  { no: 13, state: 'Madhya Pradesh', capital: 'Bhopal' },
  { no: 14, state: 'Maharashtra', capital: 'Mumbai' },
  { no: 15, state: 'Manipur', capital: 'Imphal' },
  { no: 16, state: 'Meghalaya', capital: 'Shillong' },
  { no: 17, state: 'Mizoram', capital: 'Aizawl' },
  { no: 18, state: 'Nagaland', capital: 'Kohima' },
  { no: 19, state: 'Odisha', capital: 'Bhubaneswar' },
  { no: 20, state: 'Punjab', capital: 'Chandigarh' },
  { no: 21, state: 'Rajasthan', capital: 'Jaipur' },
  { no: 22, state: 'Sikkim', capital: 'Gangtok' },
  { no: 23, state: 'Tamil Nadu', capital: 'Chennai' },
  { no: 24, state: 'Telangana', capital: 'Hyderabad' },
  { no: 25, state: 'Tripura', capital: 'Agartala' },
  { no: 26, state: 'Uttar Pradesh', capital: 'Lucknow' },
  { no: 27, state: 'Uttarakhand', capital: 'Dehradun' },
  { no: 28, state: 'West Bengal', capital: 'Kolkata' },
];

export const ALL_28_CAPITAL_CITIES = Array.from(
  new Set(INDIAN_STATE_CAPITALS.map((item) => item.capital))
).sort();

export const INDIA_LOCATIONS: StateLocation[] = [
  // 28 States
  { name: 'Andhra Pradesh', type: 'state', capital: 'Amaravati', majorCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'] },
  { name: 'Arunachal Pradesh', type: 'state', capital: 'Itanagar', majorCities: ['Itanagar', 'Naharlagun', 'Pasighat'] },
  { name: 'Assam', type: 'state', capital: 'Dispur', majorCities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'] },
  { name: 'Bihar', type: 'state', capital: 'Patna', majorCities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'] },
  { name: 'Chhattisgarh', type: 'state', capital: 'Raipur', majorCities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'] },
  { name: 'Goa', type: 'state', capital: 'Panaji', majorCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'] },
  { name: 'Gujarat', type: 'state', capital: 'Gandhinagar', majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
  { name: 'Haryana', type: 'state', capital: 'Chandigarh', majorCities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'] },
  { name: 'Himachal Pradesh', type: 'state', capital: 'Shimla', majorCities: ['Shimla', 'Dharamshala', 'Manali', 'Solan'] },
  { name: 'Jharkhand', type: 'state', capital: 'Ranchi', majorCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'] },
  { name: 'Karnataka', type: 'state', capital: 'Bengaluru', majorCities: ['Bengaluru', 'Hubballi', 'Mysuru', 'Mangaluru', 'Belagavi'] },
  { name: 'Kerala', type: 'state', capital: 'Thiruvananthapuram', majorCities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'] },
  { name: 'Madhya Pradesh', type: 'state', capital: 'Bhopal', majorCities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'] },
  { name: 'Maharashtra', type: 'state', capital: 'Mumbai', majorCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'] },
  { name: 'Manipur', type: 'state', capital: 'Imphal', majorCities: ['Imphal', 'Churachandpur', 'Thoubal'] },
  { name: 'Meghalaya', type: 'state', capital: 'Shillong', majorCities: ['Shillong', 'Tura', 'Jowai'] },
  { name: 'Mizoram', type: 'state', capital: 'Aizawl', majorCities: ['Aizawl', 'Lunglei', 'Champhai'] },
  { name: 'Nagaland', type: 'state', capital: 'Kohima', majorCities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { name: 'Odisha', type: 'state', capital: 'Bhubaneswar', majorCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'] },
  { name: 'Punjab', type: 'state', capital: 'Chandigarh', majorCities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'] },
  { name: 'Rajasthan', type: 'state', capital: 'Jaipur', majorCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
  { name: 'Sikkim', type: 'state', capital: 'Gangtok', majorCities: ['Gangtok', 'Namchi', 'Geyzing'] },
  { name: 'Tamil Nadu', type: 'state', capital: 'Chennai', majorCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'] },
  { name: 'Telangana', type: 'state', capital: 'Hyderabad', majorCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
  { name: 'Tripura', type: 'state', capital: 'Agartala', majorCities: ['Agartala', 'Udaipur', 'Dharmanagar'] },
  { name: 'Uttar Pradesh', type: 'state', capital: 'Lucknow', majorCities: ['Lucknow', 'Noida', 'Kanpur', 'Varanasi', 'Agra'] },
  { name: 'Uttarakhand', type: 'state', capital: 'Dehradun', majorCities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani'] },
  { name: 'West Bengal', type: 'state', capital: 'Kolkata', majorCities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'] },

  // 8 Union Territories
  { name: 'Andaman and Nicobar Islands', type: 'ut', capital: 'Port Blair', majorCities: ['Port Blair', 'Garacharma'] },
  { name: 'Chandigarh', type: 'ut', capital: 'Chandigarh', majorCities: ['Chandigarh'] },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'ut', capital: 'Daman', majorCities: ['Daman', 'Silvassa', 'Diu'] },
  { name: 'Delhi', type: 'ut', capital: 'New Delhi', majorCities: ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi'] },
  { name: 'Jammu and Kashmir', type: 'ut', capital: 'Srinagar', majorCities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'] },
  { name: 'Ladakh', type: 'ut', capital: 'Leh', majorCities: ['Leh', 'Kargil'] },
  { name: 'Lakshadweep', type: 'ut', capital: 'Kavaratti', majorCities: ['Kavaratti', 'Agatti', 'Andrott'] },
  { name: 'Puducherry', type: 'ut', capital: 'Puducherry', majorCities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] }
];

export const ALL_INDIAN_STATES = INDIA_LOCATIONS.map((l) => l.name);

export const ALL_INDIAN_CITIES = Array.from(
  new Set([
    ...ALL_28_CAPITAL_CITIES,
    ...INDIA_LOCATIONS.flatMap((l) => [l.capital, ...l.majorCities])
  ])
).sort();
