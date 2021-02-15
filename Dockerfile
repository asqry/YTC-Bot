FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/ytcbot
WORKDIR /usr/src/ytcbot

# Copy and Install
COPY package.json /usr/src/ytcbot
RUN npm install
COPY . /usr/src/ytcbot

# Start
CMD ["node", "index.js"]