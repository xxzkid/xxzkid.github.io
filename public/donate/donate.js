function init() {
  var img = document.createElement('img')
  img.src = "donate.png"
  img.alt = "支持"
  img.style.maxWidth = "98%"
  document.querySelector('#qrcode-donate').appendChild(img)

  fetch('http://127.0.0.1:5201/suid', {
    method: 'GET'
  }).then((response) => {
    if (response.ok) {
      return response.json()
    } else {
      return Promise.reject({
        status: response.status,
        statusText: response.statusText
      })
    }
  }).then((data) => {
    console.log(JSON.stringify(data), '-----')
  }).catch((error) => {
    console.error(error, '-----');
  })
}

document.addEventListener("DOMContentLoaded", (event) => {
  init()
})
