const path = require('path');
const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
  name: 'TwitchBot', // Service name
  description: 'Twitch Bot', // Description
  script: path.join(__dirname, 'server.js'), // Path to the loadBalancer.js script
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ] // Node options (optional) - adjust as needed
});

// Listen for the "install" event, which indicates the service is installed
svc.on('install', function() {
  svc.start();
  console.log('Service installed and started successfully');
});

// Install the service
svc.install();

// Error handling
svc.on('error', function(err){
  console.log('Error:', err);
});