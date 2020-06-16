# wien-schematic-bike-map
An attempt to create a schematic bike map of the Viennese bike routes, which is easy to understand.

## INSTALL
```sh
git clone https://github.com/plepe/wien-schematic-bike-map
cd wien-schematic-bike-map
npm install
npm start
```

Point your browser to http://localhost:8080

## MODIFY DATA
Data is defined in the file `data.yaml`. [YAML](https://en.wikipedia.org/wiki/YAML) is a simple structured data format.

There are two parts, 'nodes' and 'routes'.

### Nodes
Each node has: a name `name`, a location `loc` (in Coordinates, see below) and a priority `prio` (1 = top priority, default).

### Routes
Each route has: a name `name`, a list of locations `loc` (in Coordinates, see below; alternating radial angle and distance from center and a priority `prio` (1 = top priority, default).

### Coordinates
Coordinates are a radial angle (based on the clock minutes with 0 = North, 15 = East, 30 = South, 45 = West) and distance from center.
