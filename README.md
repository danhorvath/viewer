# 3D image viewer

This app implements a simplified version of the Cylindo 3D image viewer https://www.cylindo.com/solutions/360-product-viewer/.

## Installation & start
I used `create-react-app` so you can run the app with `yarn start` after installing the dependencies with `yarn`. I tested the app on Google Chrome.

## Some considerations
* I noticed that on the example website the image rotation works even when the cursor leaves the page - I'm not sure if that's intentional or not but I also tried to reproduce that behavior
* To make the user experience a bit more seamless I pre-cache the images for all feature variation of the "Archibald chair"
* I tried to focus on the performance of the image rotation component, so I use memoization to opt out of renders. I also tried to move some computations away from the main process to avoid blocking the painting (and so framedrops). Screenshots of my own measurements against the cylindo implementation can be found at `./performance`. I did the measurements with a 6x cpu throttling.