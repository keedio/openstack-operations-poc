FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/openstack-poc


# Install app dependencies
ADD ./ /usr/src/openstack-poc/

WORKDIR /usr/src/openstack-poc
