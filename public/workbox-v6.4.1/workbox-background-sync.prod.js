this.workbox=this.workbox||{},this.workbox.backgroundSync=function(t,e,n,s){"use strict";function r(){return(r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t}).apply(this,arguments)}let a,i;const c=new WeakMap,o=new WeakMap,u=new WeakMap,h=new WeakMap,y=new WeakMap;let w={get(t,e,n){if(t instanceof IDBTransaction){if("done"===e)return o.get(t);if("objectStoreNames"===e)return t.objectStoreNames||u.get(t);if("store"===e)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return d(t[e])},set:(t,e,n)=>(t[e]=n,!0),has:(t,e)=>t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t};function f(t){return t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(m(this),e),d(c.get(this))}:function(...e){return d(t.apply(m(this),e))}:function(e,...n){const s=t.call(m(this),e,...n);return u.set(s,e.sort?e.sort():[e]),d(s)}}function l(t){return"function"==typeof t?f(t):(t instanceof IDBTransaction&&function(t){if(o.has(t))return;const e=new Promise(((e,n)=>{const s=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",a),t.removeEventListener("abort",a)},r=()=>{e(),s()},a=()=>{n(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",r),t.addEventListener("error",a),t.addEventListener("abort",a)}));o.set(t,e)}(t),e=t,(a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((t=>e instanceof t))?new Proxy(t,w):t);var e}function d(t){if(t instanceof IDBRequest)return function(t){const e=new Promise(((e,n)=>{const s=()=>{t.removeEventListener("success",r),t.removeEventListener("error",a)},r=()=>{e(d(t.result)),s()},a=()=>{n(t.error),s()};t.addEventListener("success",r),t.addEventListener("error",a)}));return e.then((e=>{e instanceof IDBCursor&&c.set(e,t)})).catch((()=>{})),y.set(e,t),e}(t);if(h.has(t))return h.get(t);const e=l(t);return e!==t&&(h.set(t,e),y.set(e,t)),e}const m=t=>y.get(t);const g=["get","getKey","getAll","getAllKeys","count"],p=["put","add","delete","clear"],D=new Map;function b(t,e){if(!(t instanceof IDBDatabase)||e in t||"string"!=typeof e)return;if(D.get(e))return D.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=p.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!r&&!g.includes(n))return;const a=async function(t,...e){const a=this.transaction(t,r?"readwrite":"readonly");let i=a.store;return s&&(i=i.index(e.shift())),(await Promise.all([i[n](...e),r&&a.done]))[0]};return D.set(e,a),a}w=(t=>r({},t,{get:(e,n,s)=>b(e,n)||t.get(e,n,s),has:(e,n)=>!!b(e,n)||t.has(e,n)}))(w);try{self["workbox:background-sync:6.4.0"]&&_()}catch(t){}const I="requests",B="queueName";class q{constructor(){this.t=null}async addEntry(t){const e=(await this.getDb()).transaction(I,"readwrite",{durability:"relaxed"});await e.store.add(t),await e.done}async getFirstEntryId(){const t=await this.getDb(),e=await t.transaction(I).store.openCursor();return null==e?void 0:e.value.id}async getAllEntriesByQueueName(t){const e=await this.getDb(),n=await e.getAllFromIndex(I,B,IDBKeyRange.only(t));return n||new Array}async getEntryCountByQueueName(t){return(await this.getDb()).countFromIndex(I,B,IDBKeyRange.only(t))}async deleteEntry(t){const e=await this.getDb();await e.delete(I,t)}async getFirstEntryByQueueName(t){return await this.getEndEntryFromIndex(IDBKeyRange.only(t),"next")}async getLastEntryByQueueName(t){return await this.getEndEntryFromIndex(IDBKeyRange.only(t),"prev")}async getEndEntryFromIndex(t,e){const n=await this.getDb(),s=await n.transaction(I).store.index(B).openCursor(t,e);return null==s?void 0:s.value}async getDb(){return this.t||(this.t=await function(t,e,{blocked:n,upgrade:s,blocking:r,terminated:a}={}){const i=indexedDB.open(t,e),c=d(i);return s&&i.addEventListener("upgradeneeded",(t=>{s(d(i.result),t.oldVersion,t.newVersion,d(i.transaction))})),n&&i.addEventListener("blocked",(()=>n())),c.then((t=>{a&&t.addEventListener("close",(()=>a())),r&&t.addEventListener("versionchange",(()=>r()))})).catch((()=>{})),c}("workbox-background-sync",3,{upgrade:this.i})),this.t}i(t,e){e>0&&e<3&&t.objectStoreNames.contains(I)&&t.deleteObjectStore(I);t.createObjectStore(I,{autoIncrement:!0,keyPath:"id"}).createIndex(B,B,{unique:!1})}}class E{constructor(t){this.o=t,this.u=new q}async pushEntry(t){delete t.id,t.queueName=this.o,await this.u.addEntry(t)}async unshiftEntry(t){const e=await this.u.getFirstEntryId();e?t.id=e-1:delete t.id,t.queueName=this.o,await this.u.addEntry(t)}async popEntry(){return this.h(await this.u.getLastEntryByQueueName(this.o))}async shiftEntry(){return this.h(await this.u.getFirstEntryByQueueName(this.o))}async getAll(){return await this.u.getAllEntriesByQueueName(this.o)}async size(){return await this.u.getEntryCountByQueueName(this.o)}async deleteEntry(t){await this.u.deleteEntry(t)}async h(t){return t&&await this.deleteEntry(t.id),t}}const k=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];class R{constructor(t){"navigate"===t.mode&&(t.mode="same-origin"),this.l=t}static async fromRequest(t){const e={url:t.url,headers:{}};"GET"!==t.method&&(e.body=await t.clone().arrayBuffer());for(const[n,s]of t.headers.entries())e.headers[n]=s;for(const n of k)void 0!==t[n]&&(e[n]=t[n]);return new R(e)}toObject(){const t=Object.assign({},this.l);return t.headers=Object.assign({},this.l.headers),t.body&&(t.body=t.body.slice(0)),t}toRequest(){return new Request(this.l.url,this.l)}clone(){return new R(this.toObject())}}const x="workbox-background-sync",v=new Set,j=t=>{const e={request:new R(t.requestData).toRequest(),timestamp:t.timestamp};return t.metadata&&(e.metadata=t.metadata),e};class A{constructor(t,{onSync:n,maxRetentionTime:s}={}){if(this.m=!1,this.g=!1,v.has(t))throw new e.WorkboxError("duplicate-queue-name",{name:t});v.add(t),this.p=t,this.D=n||this.replayRequests,this.I=s||10080,this.B=new E(this.p),this.q()}get name(){return this.p}async pushRequest(t){await this.k(t,"push")}async unshiftRequest(t){await this.k(t,"unshift")}async popRequest(){return this.R("pop")}async shiftRequest(){return this.R("shift")}async getAll(){const t=await this.B.getAll(),e=Date.now(),n=[];for(const s of t){const t=60*this.I*1e3;e-s.timestamp>t?await this.B.deleteEntry(s.id):n.push(j(s))}return n}async size(){return await this.B.size()}async k({request:t,metadata:e,timestamp:n=Date.now()},s){const r={requestData:(await R.fromRequest(t.clone())).toObject(),timestamp:n};e&&(r.metadata=e),await this.B[s+"Entry"](r),this.m?this.g=!0:await this.registerSync()}async R(t){const e=Date.now(),n=await this.B[t+"Entry"]();if(n){const s=60*this.I*1e3;return e-n.timestamp>s?this.R(t):j(n)}}async replayRequests(){let t;for(;t=await this.shiftRequest();)try{await fetch(t.request.clone())}catch(n){throw await this.unshiftRequest(t),new e.WorkboxError("queue-replay-failed",{name:this.p})}}async registerSync(){if("sync"in self.registration)try{await self.registration.sync.register(`${x}:${this.p}`)}catch(t){}}q(){"sync"in self.registration?self.addEventListener("sync",(t=>{if(t.tag===`${x}:${this.p}`){const e=async()=>{let e;this.m=!0;try{await this.D({queue:this})}catch(t){if(t instanceof Error)throw e=t,e}finally{!this.g||e&&!t.lastChance||await this.registerSync(),this.m=!1,this.g=!1}};t.waitUntil(e())}})):this.D({queue:this})}static get v(){return v}}return t.BackgroundSyncPlugin=class{constructor(t,e){this.fetchDidFail=async({request:t})=>{await this.j.pushRequest({request:t})},this.j=new A(t,e)}},t.Queue=A,t.QueueStore=E,t.StorableRequest=R,t}({},workbox.core._private,workbox.core._private,workbox.core._private);
//# sourceMappingURL=workbox-background-sync.prod.js.map