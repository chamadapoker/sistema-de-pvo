// import { supabase } from '../lib/supabase'; // REMOVED SUPABASE DEPENDENCY

export interface Country {
    id: string;
    name: string;
    code: string; // ISO 3
    code_2: string; // ISO 2
    region: string;
    capital: string;
    continent: string;
    latitude?: number;
    longitude?: number;
    population?: number;
    area_km2?: number;
    languages?: string[];
    currency_code?: string;
    currency_name?: string;
    military_budget_usd?: number;
    active_military?: number;
    reserve_military?: number;
    military_rank?: number;
    flag_url?: string;
    coat_of_arms_url?: string;
    description?: string;
    military_description?: string;
    created_at: string;
    updated_at: string;
}

export interface CountryEquipment {
    id: string;
    country_id: string;
    equipment_id: string;
    quantity?: number;
    status: string; // ACTIVE, RESERVE, RETIRED, ORDERED
    year_acquired?: number;
    variant?: string;
    notes?: string;
    created_at: string;
}

// MOCKED DATA
const MOCKED_COUNTRIES: Country[] = [
    {
        id: '1',
        name: 'Brasil',
        code: 'BRA',
        code_2: 'BR',
        region: 'South America',
        capital: 'Brasília',
        continent: 'South America',
        flag_url: 'https://flagcdn.com/w320/br.png',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Estados Unidos',
        code: 'USA',
        code_2: 'US',
        region: 'North America',
        capital: 'Washington, D.C.',
        continent: 'North America',
        flag_url: 'https://flagcdn.com/w320/us.png',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '3',
        name: 'China',
        code: 'CHN',
        code_2: 'CN',
        region: 'Asia',
        capital: 'Beijing',
        continent: 'Asia',
        flag_url: 'https://flagcdn.com/w320/cn.png',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const countryService = {
    async getAllCountries(): Promise<Country[]> {
        return MOCKED_COUNTRIES;
    },

    async getCountry(countryId: string): Promise<Country> {
        const country = MOCKED_COUNTRIES.find(c => c.id === countryId);
        if (!country) throw new Error('Country not found');
        return country;
    },

    async getCountriesByRegion(region: string): Promise<Country[]> {
        return MOCKED_COUNTRIES.filter(c => c.region === region);
    },

    async getCountriesByContinent(continent: string): Promise<Country[]> {
        return MOCKED_COUNTRIES.filter(c => c.continent === continent);
    },

    async getTopMilitaryCountries(limit: number = 30): Promise<any[]> {
        return MOCKED_COUNTRIES.slice(0, limit);
    },

    async getCountryEquipment(_countryId: string): Promise<any[]> {
        return [];
    },

    async getEquipmentOperators(_equipmentId: string): Promise<any[]> {
        return [];
    },

    async searchCountries(searchTerm: string): Promise<Country[]> {
        const term = searchTerm.toLowerCase();
        return MOCKED_COUNTRIES.filter(c => c.name.toLowerCase().includes(term));
    },

    async getCountryStats(_countryId: string): Promise<any> {
        return {
            total_equipment: 0,
            by_category: {}
        };
    },

    async addEquipmentToCountry(countryId: string, equipmentId: string, _quantity?: number, status?: string, _yearAcquired?: number, _variant?: string): Promise<CountryEquipment> {
        console.warn('addEquipmentToCountry not implemented (mocked)');
        return {
            id: 'mock-id',
            country_id: countryId,
            equipment_id: equipmentId,
            status: status || 'ACTIVE',
            created_at: new Date().toISOString()
        };
    },

    async removeEquipmentFromCountry(_countryId: string, _equipmentId: string): Promise<void> {
        console.warn('removeEquipmentFromCountry not implemented (mocked)');
    }
};
