import axios from 'axios';

export async function doGetRequest(url) {
  let reqData
  await axios.get(url)
  .then(response => {
    reqData = response.data
  })
  .catch(error => {
    reqData = null
  });
  
  return reqData
}