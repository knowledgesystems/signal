// This is to unregister Service Workers registered by previous versions of SignalDB.
// Simply clearing the cache is not enough to unregister service workers.
// That's why we need an explicit code to unregister them.
if (window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}
