FROM browserless/base:1.2.0


# Set the working directory
# RUN mkdir /usr/src/app
#WORKDIR /usr/src/app

# Run the command inside your image filesystem
RUN apt-get install software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get install python3.6
RUN apt-get install --yes --force-yes python-pip
RUN apt-get install --yes python-pil python-yaml libproj12
RUN python -m pip install MapProxy pyproj

RUN groupadd -g 1999 appuser && \
    useradd -r -u 1999 -g appuser appuser
USER appuser

# Inform Docker that the container is listening on the specified port at runtime.

## Run the specified command within the container.
#CMD [ "npm", "start" ]

# Copy the rest of your app's source code from your host to your image filesystem.
COPY ./mapconfig.yaml .
CMD ["mapproxy-util",  "serve-develop", "mapconfig.yaml"]
EXPOSE 8080
