
addEventListener('fetch', event => {
  event.respondWith(handle(event))
})

function cors(req, res) {
  res.headers.set("Access-Control-Allow-Origin", req.headers.get('origin') || '*');
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Max-Age", "86400");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, HEAD, GET, POST, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Access-Control-Allow-Headers, Authorization, Accept, X-Requested-With");
}

function buf2hex(buf) {
  let hashArray = Array.from(new Uint8Array(buf));
  let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function handle(event) {
  let req = event.request;
  let req_url = new URL(req.url);
  if (req_url.pathname == '/x') {
    if (req.method === 'OPTIONS') {
      let res = Response.json({})
      cors(req, res);
      return res;
    } else if (req.method !== 'POST') {
      let res = Response.json({status: 200})
      cors(req, res);
      return res;
    }
  
    let body = await req.json();
    
    let method = body["method"] || "GET";
    let url = body["url"];
    let headers = body["headers"] || {};
    let params = body["params"] || {};
    let data = body["data"];
    let b = headers["b"] || "";
  
    let fetchResponse = await fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + new URLSearchParams(params), {
      method: method,
      headers: headers,
      body: data
    });
    let fetchResponseStatus = fetchResponse.status;
    let fetchResponseHeaders = Object.fromEntries(fetchResponse.headers);
  
    let fetchData;
    if (b === "1") {
      fetchData = buf2hex(await fetchResponse.arrayBuffer());
    } else {
      fetchData = await fetchResponse.text();
    }
    let res = Response.json({
      status: fetchResponseStatus, 
      headers: fetchResponseHeaders,
      data: fetchData
    });
    cors(req, res);
    return res;
  } else if (req_url.pathname == '/s') {
    let req_params = new URLSearchParams(req_url.search.slice(1));
    let durl = req_params.get('durl');
    return fetch(durl);
  }
  return Response.json({status: 400});
}
