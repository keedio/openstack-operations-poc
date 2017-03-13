FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/openstack-poc
WORKDIR /usr/src/openstack-poc

# Install app dependencies
COPY . /usr/src/openstack-poc
RUN npm install
RUN npm install --global bower
RUN bower install --allow-root
# Bundle app source


EXPOSE 3000
CMD [ "node", "server.js" ]