function createPhotosDB() {
  return new Promise((resolve, reject) => {
    const dbOpenRequest = indexedDB.open('photos')
    dbOpenRequest.onsuccess = () => {
      resolve(dbOpenRequest.result)
    }
    dbOpenRequest.onerror = () => {
      reject()
    }
    dbOpenRequest.onupgradeneeded = () => {
      // This should only executes if there's a need to
      // create/update db.
      dbOpenRequest.result.createObjectStore('photos', {
        autoIncrement: true,
        keyPath: 'id'
      })
      resolve(dbOpenRequest.result)
    }
  })
}

const CACHE_NAME = 'photos'
const urlsToCache = ['/photo']
let photo

self.addEventListener('install', function(event) {
  console.log('install')
  event.waitUntil(
    createPhotosDB()
  )
})

self.addEventListener('fetch', function(event) {
  if (event.request.clone().method === 'GET') {
    event.respondWith(
      // check all the caches in the browser and find
      // out whether our request is in any of them
      caches.match(event.request.clone()).then(function(response) {
        if (response) {
          // if we are here, that means there's a match
          //return the response stored in browser
          return response
        }
        // no match in cache, use the network instead
        return fetch(event.request.clone())
      })
    )
  } else if (event.request.clone().method === 'POST') {
    // attempt to send request normally
    console.log("attempt to send request normally", event.request)
    event.respondWith(
      fetch(event.request.clone()).catch((error) => {
        // only save post requests in browser, if an error occurs
        console.log('save post request')
        savePostRequests(event.request.clone().url, photo)
      })
    )
  }
})

self.addEventListener('message', function(event) {
  console.log('got a message', event.data)
  if (event.data.hasOwnProperty('photo')) {
    // receives photo from script.js upon submission
    photo = event.data.photo
  }
})

async function getObjectStore(storeName, mode) {
  // retrieve our object store
  const db = await createPhotosDB()
  return db.transaction(storeName, mode).objectStore(storeName)
}

async function savePostRequests(url, payload) {
  // get object_store and save our payload inside it
  const store = await getObjectStore('photos', 'readwrite')
  var request = store.add({
    url: url,
    payload: payload,
    method: 'POST'
  })
  request.onsuccess = function(event) {
    console.log('a new post request has been added to indexedb')
  }
  request.onerror = function(error) {
    console.error(error)
  }
}
