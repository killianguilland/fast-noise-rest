# fast-noise-rest

A lightweight REST wrapper around FastNoiseLite that exposes **all noise configuration options dynamically** via HTTP.

The API automatically maps query parameters to FastNoiseLite setters, so **new features are supported without modifying the server**.

## Features

* Full support for FastNoiseLite configuration
* Automatic parameter mapping (`Set*` methods)
* 2D / 3D noise
* Grid generation
* Domain warp
* OpenAPI specification
* Interactive API docs

## Installation

```bash
npm install
node server.js 3000 # or specify any port you like
```

Server starts at:

```
http://localhost:3000
```

## API Endpoints

### Get a single noise value

```
GET /noise/value
```

Example:

```
/noise/value?x=10&y=20&NoiseType=OpenSimplex2&Seed=42
```

Response:

```json
{
  "value": 0.3481
}
```

### Generate a noise grid

```
GET /noise/grid
```

Example:

```
/noise/grid?width=128&height=128&scale=0.02&NoiseType=Perlin&FractalOctaves=4
```

Response:

```json
{
  "width": 128,
  "height": 128,
  "data": [[...]]
}
```

### List available parameters

```
GET /schema
```

Returns all FastNoiseLite parameters supported by the API.

## API Documentation

OpenAPI spec:

```
/openapi.json
```

Interactive documentation:

```
/
```

## Parameter Mapping

Query parameters correspond to FastNoiseLite setters:

```
Seed → SetSeed
Frequency → SetFrequency
NoiseType → SetNoiseType
FractalOctaves → SetFractalOctaves
DomainWarpAmp → SetDomainWarpAmp
```

Example:

```
/noise/value?Seed=42&Frequency=0.01&NoiseType=Perlin
```

## License

MIT
