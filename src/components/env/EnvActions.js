import 'whatwg-fetch'

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
  return (dispatch) => {
  dispatch(requestPollenLevels(lat,long));
  console.log("lat, long", lat);
  if(lat && long){
    fetch('https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=jfytctksruIxkfUdyQxo8JdG9QAB7jgi&q=' + lat + '%2C' + long)
      .then(
          response => response.json(),
          error => console.error('location not found', error)
      )
      .then(function(json) {
        // console.log("890location key data: ", json);
        let locationKey = json.Key;
        return fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + locationKey + '?apikey=jfytctksruIxkfUdyQxo8JdG9QAB7jgi&details=true')
          .then(
            response => response.json(),
            error => console.error('Could not load pollen levels.', error)
          )
          .then(function(json) {
            // console.log("890pollen data: ", json);
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

export const receiveFluLevels = (lat,long, json) => ({
  type: FETCH_FLU_SUCCESS,
  lat:lat,
  long:long,
  pollenLevels: json,
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
      console.log("flu data: ", json);
        dispatch(receiveFluLevels(lat,long, json));
      }
    );
  };
}

export const FETCH_AIQ_REQUEST = "FETCH_AIQ_REQUEST";
export const FETCH_AIQ_SUCCESS = "FETCH_AIQ_SUCCESS";


export const requestAirQualityLevels = (lat, long) => ({
  type: FETCH_AIQ_REQUEST,
  lat: lat,
  long:long
});

export const receiveAirQualityLevels = (lat, long, json) => ({
  type: FETCH_AIQ_SUCCESS,
  lat: lat,
  long: long,
  pollenLevels: json,
  receivedAt: Date.now()
});

export function fetchAirQualityLevels(lat,long) {
  return (dispatch) => {
  dispatch(requestAirQualityLevels(lat,long));

  return fetch('https://api.airvisual.com/v2/nearest_station?lat=' + lat +  '&lon=' + long +  '&key=RaaZECPFvpEBgetio')
    .then(
      response => response.json(),
      error => console.error('Could not load air quality data.', error)
    )
    .then(function(json) {
        console.log("aiq data", json);
        dispatch(receiveAirQualityLevels(lat, long, json));
      }
    );
  };
}
