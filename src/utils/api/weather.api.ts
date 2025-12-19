import axios, { AxiosRequestConfig } from 'axios';
import { apiKey } from '../constant'; 

interface WeatherParams {
    cityName: string;
    days?: string;
}

const forecastEndpoint = (params: WeatherParams) => 
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days || '7'}&aqi=no&alerts=no`;

const locationsEndpoint = (params: WeatherParams) => 
    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint: string): Promise<any> => {
    const options: AxiosRequestConfig = {
        method: 'GET',
        url: endpoint
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log('Error fetching weather:', error);
        return null;
    }
}

export const fetchWeatherForecast = (params: WeatherParams) => {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocations = (params: WeatherParams) => {
    return apiCall(locationsEndpoint(params));
}