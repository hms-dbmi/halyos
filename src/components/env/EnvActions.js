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
  zipCode,
  pollenLevels: json,
  receivedAt: Date.now()
});

export const failPollenLevels = zipCode => ({
  type: FETCH_POLLEN_FAILURE,
  zipCode,
  error: 'oops'
});

export function fetchPollenLevels(zipCode) {

  return function (dispatch) {
    dispatch(requestPollenLevels(zipCode));
    // Vimig's API Key: Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA
    // Samson's API Key: jfytctksruIxkfUdyQxo8JdG9QAB7jgi

    return fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + zipCode + '?apikey=jfytctksruIxkfUdyQxo8JdG9QAB7jgi&details=true')
      .then(
        response => response.json(),
        error => console.error('An error occured.', error)
      )
      .then(json =>
        dispatch(receivePollenLevels(zipCode, json))
      );
  };
}
