# Welcome to the Maven Full-Stack Engineer Take-Home Project!

The goal of this project is to build an auto-suggest REST api for a music application. There is a data file (./service/data.json) that contains 10,000 album entries from discogs.com. 

There should be four endpoints in the the service:

1. `http://service/suggest/tracks?prefix=:prefix`
2. `http://service/suggest/artists?prefix=:prefix`
3. `http://service/suggest/releases?prefix=:prefix`
4. `http://service/suggest/all?prefix=:prefix`

With outputs shaped as follows:

## `http://service/suggest/tracks?prefix=:prefix`
```
{
  "suggestions": [
    {
      "title": <track_title>,
      "duration": <duration>,
      "release": {
        "id": <release_id>,
        "title": <release_title>,
        "notes": <release_notes>
      }
    }
  ]
}
```

## `http://service/suggest/artists?prefix=:prefix`
```
{
  "suggestions": [
    {
      "id": <artist_id>,
      "name": <artist_name>,
      "releases": [
        {
          "id": <release_id>,
          "title": <release_title>,
          "notes": <release_notes>
        }
      ]
    }
  ]
}
```

## `http://service/suggest/releases?prefix=:prefix`
```
{
  "suggestions": [
    {
      "id": <release_id>,
      "title": <release_title>,
      "notes": <release_notes>,
      "artist": [
        {
          "id": <artist_id>,
          "name": <artist_name>
        }
      ]
    }
  ]
}
```

## `http://service/suggest/all?prefix=:prefix`
```
{
  "artists": [
    {
      "id": <artist_id>,
      "name": <artist_name>,
      "releases": [
        "id": <release_id>,
        "title": <release_title>,
        "notes": <release_notes>
      ]
    }
  ],
  "tracks": [
    {
      "title": <track_title>,
      "duration": <duration>,
      "release": {
        "id": <release_id>,
        "title": <release_title>,
        "notes": <release_notes>
    }
  ],
  "releases": [
    {
      "id": <release_id>,
      "title": <release_title>,
      "notes": <release_notes>,
      "artist": [
        {
          "id": <artist_id>,
          "name": <artist_name>
        }
      ]
    }
  ]
}
```

Each suggestion collection should return no more than 5 entries.

There is a docker-compose file that contains two docker compose services: "service" and "test". Images for these two services are built from the "service" and "test" directory.

The test code is a node.js project.

To build the test docker image:

```
cd <repository_root>
docker-compose build test
```

To run the test image:

```
cd <repository_root>
docker-compose run test
```

To build the service image:

```
cd <repository_root>
docker-compose build service
```

To start the service:

```
cd <repository_root>
docker-compose up service
```

Currently the service is simply the starting docker hello-world image, thus causing the four test to fail.

Your project is to build a service in the './service' directory, configure the Dockerfile to initialize your application on port 80 such that the test docker container can successfully connect to it and valdiate the output of the API.

Please do not spend more than 4 hours on this project. It's okay to not finish the project in within 4 hours, in which case plan on coming to the presentation prepared to share what you would have done to complete the project.

You are welcome to open a PR with your Maven project partner to solicit feedback, or reach out via email with any questions.

It's okay to change the shape of the API if either a) you think the shape of the API would look better if it were different or b) if the shape of the API is problematic for your implementation. However, if you do change the shape of the data, please update the tests accordingly.

Similarly, while the data itself is deterministic, if your implementation prefers different results for the test cases, please update the tests to properly validate your implementation.

Please be prepared to discuss the run-time performance of your solution during the presentation.

The service directory is empty to give you as much freedom as possible in what you create. You are free to use any language, framework, or service you wish. There are a couple of services commented out in the docker-compose file you can play with to see if they are helpful for the solution. Also, we do have a couple of starting frameworks (C#, Swift and Typescript as of now) that we can provide if you would like a little head start.

All the best.
