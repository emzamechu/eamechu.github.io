const cacheName = 'version2';

//Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
});

//Call Activate Event
self.addEventListener('activate',(e) => {
    console.log('Service Worker: Activated');

    //Remove unwanted Caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    )
});

//Call Fetch Event
self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
        .then(res => {
            //Make Copy Clone of Reponse
            const resClone = res.clone();

            caches
            .open(cacheName)
            .then(cache => {
                //Add Response to Cache
                cache.put(e.request, resClone)
            })

            return res;
        })
        .catch(err => caches.match(e.request).then(res => res))
    )
});