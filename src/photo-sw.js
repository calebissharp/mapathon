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
  event.waitUntil(createPhotosDB())
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
    console.log('attempt to send request normally', event.request)
    event.respondWith(
      fetch(event.request.clone()).catch(error => {
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
    photo = event.data
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

self.addEventListener('sync', function(event) {
  console.log('now online')
  if (event.tag === 'photos') {
    // event.tag name checked
    // here must be the same as the one used while registering
    // sync
    event.waitUntil(
      // Send our POST request to the server, now that the user is
      // online
      sendPostToServer()
    )
  }
})

async function sendPostToServer() {
  var savedRequests = []
  const store = await getObjectStore('photos')
  var req = store.openCursor()
  req.onsuccess = async function(event) {
    console.log('cursor opened')
    var cursor = event.target.result
    if (cursor) {
      // Keep moving the cursor forward and collecting saved
      // requests.
      savedRequests.push(cursor.value)
      cursor.continue()
    } else {
      // At this point, we have collected all the post requests in
      // indexedb.
      for (let savedRequest of savedRequests) {
        // send them to the server one after the other
        console.log('saved request', savedRequest)
        var requestUrl = savedRequest.url
        var payload = JSON.stringify(savedRequest.payload)
        var method = savedRequest.method
        var headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        } // if you have any other headers put them here
        fetch(requestUrl, {
          headers: headers,
          method: method,
          body: payload
        })
          .then(async function(response) {
            console.log('server response', response)
            if (response.status < 400) {
              // If sending the POST request was successful, then
              // remove it from the IndexedDB.
              const rwStore = await getObjectStore('photos', 'readwrite')
              rwStore.delete(savedRequest.id)
            }
          })
          .catch(function(error) {
            // This will be triggered if the network is still down.
            // The request will be replayed again
            // the next time the service worker starts up.
            console.error('Send to Server failed:', error)
            // since we are in a catch, it is important an error is
            //thrown,so the background sync knows to keep retrying
            // the send to server
            throw error
          })
      }
    }
  }
}
