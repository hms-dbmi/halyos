import 'whatwg-fetch';
import { coordDistance } from '../../services/general_utils';

export const FETCH_POLLEN_REQUEST = "FETCH_POLLEN_REQUEST";
export const FETCH_POLLEN_SUCCESS = "FETCH_POLLEN_SUCCESS";
export const FETCH_POLLEN_FAILURE = "FETCH_POLLEN_FAILURE";


export const requestPollenLevels = (lat,long) => ({
  type: FETCH_POLLEN_REQUEST,
  lat:lat,
  long:long
});

export const receivePollenLevels = (lat,long, data) => ({
  type: FETCH_POLLEN_SUCCESS,
  lat: lat,
  long: long,
  pollenLevels: data,
  receivedAt: Date.now()
});

export function fetchPollenLevels(lat,long) {
  // Vimig's API Key: Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA
  // Samson's API Key: jfytctksruIxkfUdyQxo8JdG9QAB7jgi

  //this is extra messy since we pull the location key first with one fetch, and then pull the data with another.
  return (dispatch) => {
  dispatch(requestPollenLevels(lat,long));
  if(lat && long){
    fetch('https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=jfytctksruIxkfUdyQxo8JdG9QAB7jgi&q=' + lat + '%2C' + long)
      .then(
          response => response.json(),
          error => console.error('location not found', error)
      )
      .then(function(json) {
        if(!json){
          return Promise.resolve();
        }
        let locationKey = json.Key;
        return fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + locationKey + '?apikey=jfytctksruIxkfUdyQxo8JdG9QAB7jgi&details=true')
          .then(
            response => response.json(),
            error => console.error('Could not load pollen levels.', error)
          )
          .then(function(json) {
              if(json.DailyForecasts){
                dispatch(receivePollenLevels(lat,long, json.DailyForecasts[0].AirAndPollen));  
              }
              else {
                return Promise.resolve();
              }
              
            }
          );
      });
  } else {
    return Promise.resolve();
  }


  };
}

export const FETCH_FLU_REQUEST = "FETCH_FLU_REQUEST";
export const FETCH_FLU_SUCCESS = "FETCH_FLU_SUCCESS";

export const requestFluLevels = (lat,long) => ({
  type: FETCH_FLU_REQUEST,
  lat:lat,
  long:long
});

export const receiveFluLevels = (lat,long, markers) => ({
  type: FETCH_FLU_SUCCESS,
  lat:lat,
  long:long,
  fluMarkers: markers,
  receivedAt: Date.now()
});

export function fetchFluLevels(lat,long) {
  return (dispatch) => {
  dispatch(requestFluLevels(lat,long));

  return fetch('https://api.v2.flunearyou.org/map/markers')
    .then(
      response => response.json(),
      error => console.error('Could not load flu levels', error)
    )
    .then(function(json) {

      // we are not going to store all the flu markers in the data store because we don't need them. We will find the one we need and only store that here.
      var leastDistanceAway = Number.POSITIVE_INFINITY;
      var closestPoint;
      var dist;

      for (let destination of json){
        if (destination.latitude && destination.longitude){
           dist = coordDistance(parseInt(lat), parseInt(long), parseInt(destination.latitude), parseInt(destination.longitude));
        }
        else {
          continue;
        }

        //This corresponds to 5 miles (I'm pretty sure)
        if (leastDistanceAway < 0.07){
          break;
        }
        if (leastDistanceAway > dist){
          closestPoint = destination;
          leastDistanceAway = dist;
        }
      }
      dispatch(receiveFluLevels(lat,long, closestPoint));
    });
  };
}

export const FETCH_AIQ_REQUEST = "FETCH_AIQ_REQUEST";
export const FETCH_AIQ_SUCCESS = "FETCH_AIQ_SUCCESS";
export const FETCH_AIQ_FAILURE = "FETCH_AIQ_FAILURE";


export const requestAirQualityLevels = (lat, long) => ({
  type: FETCH_AIQ_REQUEST,
  lat: lat,
  long:long
});

export const receiveAirQualityLevels = (lat, long, json) => ({
  type: FETCH_AIQ_SUCCESS,
  lat: lat,
  long: long,
  aiqLevels: json,
  receivedAt: Date.now()
});

export const failureAirQualityLevels = () => ({
  type: FETCH_AIQ_FAILURE,
  receivedAt: Date.now()

});

export function fetchAirQualityLevels(lat,long) {
  return (dispatch) => {
  dispatch(requestAirQualityLevels(lat,long));

  return fetch('https://api.airvisual.com/v2/nearest_city?lat=' + lat +  '&lon=' + long +  '&key=RaaZECPFvpEBgetio')
    .then(
      response => {
        if(!response.ok){
          dispatch(failureAirQualityLevels());
          console.log('response is not okay!!!');
          return Promise.resolve();

        }
        return response.json();
      },
      error => {
        console.warn('Could not load air quality data.', error);

      }
    )
    .then(function(json) {
        dispatch(receiveAirQualityLevels(lat, long, json.data));
      }
    );
  };
}
