export default class NetworkUTIL {

  async GET(URL, TOKEN) {
    let final_response = null

    await fetch(URL, {
      method: 'GET',// *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        "Accept": "application/json",
        "Authorization": TOKEN
      },
    })
    .then(res => res.json())
    .then(response => {
      final_response = response
    })
    .catch(e => {
      final_response = e
    });

    return final_response;
  }

  async POST(URL, BODY, TOKEN) {
    let final_response = null
    
    await fetch(URL, {
      method: 'POST',// *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization": TOKEN
      },
      body: JSON.stringify(BODY)
    })
    .then(res => res.json())
    .then(response => {
      final_response = response
    })
    .catch(e => {
      final_response = e
    });

    return final_response;
  }
}