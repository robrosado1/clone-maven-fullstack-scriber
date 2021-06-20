FROM node
COPY . /code
WORKDIR /code
RUN cd /code; npm i
EXPOSE 80
CMD ["npm", "start"]

# CMD npm run test
