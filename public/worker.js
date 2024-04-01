
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

async function _handle(req, method, url, headers, params, data, remoteUrl) {
  if (req.method !== 'POST') {
    let res = Response.json({status: 405});
    cors(req, res);
    return res;
  }
  remoteUrl = remoteUrl || "";
  url = remoteUrl + url;

  let b = headers["b"] || "";

  if (headers['content-type'] != null && headers['content-type'] != '' 
    && headers['content-type'].indexOf('multipart/form-data') > -1) {
    var form_data = new FormData();
    for (var key in data) {
        form_data.append(key, data[key]);
    }
    data = form_data;
    delete headers['content-type'];
  }

  let fetchResponse = await fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + new URLSearchParams(params), {
    method: method,
    headers: headers,
    body: data
  });

  if (b === "1") {
    let res = new Response(fetchResponse.body, {
      status: fetchResponse.status, 
      headers: fetchResponse.headers,
    });
    cors(req, res);
    return res;
  }
  let res = Response.json({
    status: fetchResponse.status, 
    headers: fetchResponse.headers,
    data: await fetchResponse.text()
  });
  cors(req, res);
  return res;
}

const gh_token = "";
const gh_host = 'https://api.github.com';
const gh_download_host = 'https://raw.githubusercontent.com';
const gh_user = '';
const gh_repo = '';

async function gh_download(user, path, token) {
  let gh_new_path = user + '/' + path + "?token=" + token;
  let gh_download_url = gh_download_host + '/' + gh_user + '/' + gh_repo + '/main/' + gh_new_path;
  console.log('gh_download_url:', gh_download_url);
  let gh_resp = await fetch(gh_download_url, {
    method: 'GET',
    headers: {
      'user-agent': 'curl/8.1.2',
      'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': 'Bearer ' + gh_token,
    }
  });
  return gh_resp;
}

async function gh(method, user, path, raw) {
  if (method == null || method == '') {
    return Response.json({status: 400});
  }
  let gh_new_path = user + '/' + path;
  let gh_url = gh_host + '/repos/' + gh_user + '/' + gh_repo + '/contents/' + gh_new_path;
  console.log('gh_url:', gh_url);

  let gh_body = JSON.stringify({
    owner: gh_user,
    repo: gh_repo,
    path: gh_new_path,
    message: 'cf',
    content: raw == '' ? null : raw
  });
  let gh_resp = await fetch(gh_url, {
    method: method,
    headers: {
      'user-agent': 'curl/8.1.2',
      'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': 'Bearer ' + gh_token,
    },
    body: method == 'GET' ? null : gh_body
  });
  return gh_resp;
}

async function gh_response_handle(url, obj) {
  console.log('gh_response_handle:', url);
  if (url == '/list') {
    let new_obj = [];
    for (let idx in obj) {
      let item = obj[idx];
      new_obj.push({
        name: item['name'],
        path: item['path'],
        sha: item['sha'],
        token: new URLSearchParams(new URL(item['download_url']).search.substring(1)).get('token')
      })
    }
    return new_obj;
  } else if (url == '/sync') {
    let new_obj = {};
    new_obj['name'] = obj['content'] ? obj['content']['name'] : null;
    return new_obj;
  }
  return obj;
}

async function get_zlib_user(cookie) {
  if (cookie == null || cookie == '') {
    return null;
  }
  let zlib_resp = await fetch('https://zh.z-library.se', {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      cookie: cookie,
    }
  });
  let text = await zlib_resp.text();
  let exec_result = /new User\((.*)\)/.exec(text);
  if (exec_result == null) {
    return null;
  }
  let zlib_user = JSON.parse(exec_result[1]);
  let user = zlib_user['email'];
  if (user == null) {
    return null;
  }
  return zlib_user;
}

async function do_get(req) {
  let req_url = new URL(req.url);
  if (req_url.pathname == '/s') {
    let req_params = new URLSearchParams(req_url.search.substring(1));
    let durl = req_params.get('durl');
    let fetchResponse = await fetch(durl);
    let res = new Response(fetchResponse.body, {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
    });
    cors(req, res);
    return res;
  }
  let res = Response.json({status: 404});
  cors(req, res);
  return res;
}

async function do_post(req) {
  let req_url = new URL(req.url);

  let body = await req.json();
  let method = body["method"] || "GET";
  let url = body["url"];
  let headers = body["headers"] || {};
  let params = body["params"] || {};
  let data = body["data"];

  if (req_url.pathname == '/xbook') {
    return _handle(req, method, url, headers, params, data, 'https://zh.z-library.se');
  }  else if (req_url.pathname == '/xbookb') {
    let cookie = headers['cookie'] || headers['Cookie'] || "";
    let title = data['title'];
    let raw = data['raw'];
    let zlib_user = await get_zlib_user(cookie);
    
    let gh_method = '';
    let user = '';
    if (url == '/log') {
      if (zlib_user == null) {
        user = 'err';
      } else {
        user = zlib_user['email'];
      }
      gh_method = 'PUT';
    } else if (url == '/sync') {
      if (zlib_user == null) {
        let res = Response.json({status: 403});
        cors(req, res);
        return res;
      }
      user = zlib_user['email'];
      gh_method = 'PUT';
    } else if (url == '/list') {
      if (zlib_user == null) {
        let res = Response.json({status: 403});
        cors(req, res);
        return res;
      }
      user = zlib_user['email'];
      gh_method = 'GET';
    } else if (url == '/download') {
      if (zlib_user == null) {
        let res = Response.json({status: 403});
        cors(req, res);
        return res;
      }
      user = zlib_user['email'];
      let token = data['token'];
      let gh_resp = await gh_download(user, title, token);
      let res = new Response(gh_resp.body, {
        status: gh_resp.status,
        headers: gh_resp.headers
      });
      cors(req, res);
      return res;
    }
    else {
      let res = Response.json({status: 404});
      cors(req, res);
      return res;
    }
    let gh_resp = await gh(gh_method, user, title, raw);
    let res = null;
    if (gh_method == 'GET') {
      res = Response.json({
        status: gh_resp.status,
        headers: gh_resp.headers,
        data: await gh_response_handle(url, await gh_resp.json())
      });
    } else {
      res = Response.json({
        status: gh_resp.status,
        headers: gh_resp.headers,
        data: await gh_response_handle(url, await gh_resp.json())
      });
    }
    cors(req, res);
    return res;
  } else if (req_url.pathname == '/x') {
    return _handle(req, method, url, headers, params, data, "");
  }
  let res = Response.json({status: 404});
  cors(req, res);
  return res;
}

async function handle(event) {
  let req = event.request;

  if (req.method === 'OPTIONS') {
    let res = Response.json({})
    cors(req, res);
    return res;
  } else if (req.method === 'POST') {
    return do_post(req);
  } else if (req.method === 'GET') {
    return do_get(req);
  }
  let res = Response.json({status: 500});
  cors(req, res);
  return res;
}
