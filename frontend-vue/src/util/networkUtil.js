import axios from 'axios';

export async function doGetRequest(url) {
  let reqData
  await axios.get(url)
  .then(response => {
    console.log('response.data:', response.data)
    reqData = response.data
  })
  .catch(error => {
    reqData = null
    console.error('There was an error!', error);
  });
  
  return reqData
}