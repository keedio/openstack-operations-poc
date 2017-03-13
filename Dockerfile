FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/openstack-poc
WORKDIR /usr/src/openstack-poc

# Install app dependencies
COPY . /usr/src/openstack-poc


EXPOSE 3000
CMD [ "node", "server.js" ]