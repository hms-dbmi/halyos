import 'whatwg-fetch'

export const FETCH_POLLEN_REQUEST = "FETCH_POLLEN_REQUEST";
export const FETCH_POLLEN_SUCCESS = "FETCH_POLLEN_SUCCESS";
export const FETCH_POLLEN_FAILURE = "FETCH_POLLEN_FAILURE";


export const requestPollenLevels = zipCode => ({
  type: FETCH_POLLEN_REQUEST,
  zipCode
});

export const receivePollenLevels = (zipCode, json) => ({
  type: FETCH_POLLEN_SUCCESS,
  zipcode: zipCode,
  pollenLevels: json,
  receivedAt: Date.now()
});

export function fetchPollenLevels(zipCode) {
  // Vimig's API Key: Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA
  // Samson's API Key: jfytctksruIxkfUdyQxo8JdG9QAB7jgi
  return (dispatch) => {
  dispatch(requestPollenLevels(zipCode));

  return fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + zipCode + '?apikey=Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA&details=true')
    .then(
      response => response.json(),
      error => console.error('Could not load pollen levels.', error)
    )
    .then(function(json) {
        dispatch(receivePollenLevels(zipCode, json));
      }
    );
  };
}

export const FETCH_FLU_REQUEST = "FETCH_FLU_REQUEST";
export const FETCH_FLU_SUCCESS = "FETCH_FLU_SUCCESS";

export const requestFluLevels = zipCode => ({
  type: FETCH_FLU_REQUEST,
  zipCode
});

export const receiveFluLevels = (zipCode, json) => ({
  type: FETCH_FLU_SUCCESS,
  zipcode: zipCode,
  pollenLevels: json,
  receivedAt: Date.now()
});

export function fetchFluLevels(zipCode) {
  return (dispatch) => {
  dispatch(requestPollenLevels(zipCode));

  return fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + zipCode + '?apikey=Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA&details=true')
    .then(
      response => response.json(),
      error => console.error('Could not load pollen levels', error)
    )
    .then(function(json) {
        dispatch(receivePollenLevels(zipCode, json));
      }
    );
  };
}

export const FETCH_AIQ_REQUEST = "FETCH_AIQ_REQUEST";
export const FETCH_AIQ_SUCCESS = "FETCH_AIQ_SUCCESS";


export const requestAirQualityLevels = zipCode => ({
  type: FETCH_AIQ_REQUEST,
  zipCode
});

export const receiveAirQualityLevels = (zipCode, json) => ({
  type: FETCH_AIQ_SUCCESS,
  zipcode: zipCode,
  pollenLevels: json,
  receivedAt: Date.now()
});

export function fetchAirQualityLevels(zipCode) {
  // Vimig's API Key: Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA
  // Samson's API Key: jfytctksruIxkfUdyQxo8JdG9QAB7jgi
  return (dispatch) => {
  dispatch(requestAirQualityLevels(zipCode));

  return fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + zipCode + '?apikey=Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA&details=true')
    .then(
      response => response.json(),
      error => console.error('Could not load air qusality data.', error)
    )
    .then(function(json) {
        dispatch(receiveAirQualityLevels(zipCode, json));
      }
    );
  };
}
