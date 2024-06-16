const appUrl = 'http://localhost:3000';

self.addEventListener('push', function (event) {
    let data;
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.error('Push event data error:', e);
        data = {};
    }

    const title = data.title || 'Notification';
    const options = {
        body: data.message || 'Default body content',
        icon: './rasops.png',
        data: {
            url: `${appUrl}/${data.path || ''}`
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const notificationData = event.notification.data;

    event.waitUntil(
        // eslint-disable-next-line no-undef
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if the URL is already open
            for (const client of clientList) {
                if (client.url === notificationData.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open a new window if the URL is not already open
            // eslint-disable-next-line no-undef
            if (clients.openWindow) {
                // eslint-disable-next-line no-undef
                return clients.openWindow(notificationData.url);
            }
        })
    );
});
