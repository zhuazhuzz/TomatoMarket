# Tomato Market

This project uses MongoDB, you should create an `.env` in each backend service directory, `listings` , `checkout` , `reviews`, and include the `URI` to your database collection in it. 

You should install [Docker](https://www.docker.com/products/docker-desktop/) if you have not already

Each service runs in its own container, a docker compose file is included in the root directory, no need for any `npm`, simply just run `docker-compose up` in the root and wait for dependencies and packages to be installed. 

Launches at [http://localhost:5173](http://localhost:5173) 

## Notes
This market listing application was geared towards small scale use such as local farms and foodbanks so that products could be listed and browsed before hand. In the future I plan to add proper authentication and login as well as allowing users to upload their own custom images instead of needing to use cloud URLs.


## Main Page Example
https://github.com/user-attachments/assets/c050162b-b239-40f7-9588-005dfe40a82c

