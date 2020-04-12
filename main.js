export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`
# Heatmap of the Rhetoric, Composition, and Technical Communication Job Market Data (2012-13 — 2018-19)

See repo for more information: [lingeringcode/rctc-heatmap](https://github.com/lingeringcode/rctc-heatmap)`
    )
  });

  main.variable(observer("container")).define("container", ["html"], function (html) {
    return (
      html`<div style="height:600px"></div>`
    )
  });
  main.variable(observer("data")).define("data", ["d3"], function (d3) {
    return d3.csv('https://raw.githubusercontent.com/lingeringcode/rhetmap-heatmap/gh-pages/data/geocodes-1213-1819.csv', row => {
      return { lng: +row.lng, lat: +row.lat };
    });
  }
  );
  main.variable(observer("radiusSlider")).define("radiusSlider", ["html"], function (html) {
    return (
      html`<input type=range min="1000" max="20000" value="14000">`
    )
  });
  main.variable(observer("radius")).define("radius", ["Generators", "radiusSlider"], function (Generators, radiusSlider) {
    return (
      Generators.input(radiusSlider, 1000)
    )
  });
  main.variable(observer("upperPercentileSlider")).define("upperPercentileSlider", ["html"], function (html) {
    return (
      html`<input type=range min="90" max="100" value="100">`
    )
  });
  main.variable(observer("upperPercentile")).define("upperPercentile", ["Generators", "upperPercentileSlider"], function (Generators, upperPercentileSlider) {
    return (
      Generators.input(upperPercentileSlider, 1000)
    )
  });
  main.variable(observer("colorRange")).define("colorRange", function () {
    return [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78]
    ];
  }
  );
  main.variable(observer("deckgl")).define("deckgl", ["deck", "container", "mapboxgl"], function (deck, container, mapboxgl) {
    return new deck.DeckGL({
      container,
      map: mapboxgl,
      mapboxAccessToken: '',
      // This token is for demo-purpose only and rotated regularly. Get your token at https://www.mapbox.com
      mapboxApiAccessToken: 'pk.eyJ1IjoiY2xuZGdybiIsImEiOiJjanp0dTdsOWcwOTd3M2NvMXY2b2w5bzJ5In0.nxlNsusWBpUVDjIus2_RxA',
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      longitude: -95.712891,
      latitude: 37.090240,
      zoom: 4,
      minZoom: 3,
      maxZoom: 15,
      pitch: 55.5
    });
  }
  );
  main.variable(observer()).define(["deck", "colorRange", "data", "radius", "upperPercentile", "deckgl"], function (deck, colorRange, data, radius, upperPercentile, deckgl) {
    const hexagonLayer = new deck.HexagonLayer({
      id: 'heatmap',
      colorRange,
      data,
      elevationRange: [0, 1000],
      elevationScale: 250,
      extruded: true,
      getPosition: d => [d.lng, d.lat],
      opacity: 1,
      radius,
      upperPercentile
    });

    deckgl.setProps({ layers: [hexagonLayer] });

    return hexagonLayer;
  }
  );
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], function (require) {
    return (
      require('mapbox-gl@^0.53.1/dist/mapbox-gl.js')
    )
  });
  main.variable(observer("deck")).define("deck", ["require"], function (require) {
    return (
      require.alias({
        // optional dependencies
        h3: {},
        S2: {}
      })('deck.gl@~7.0.0/dist.min.js')
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("https://d3js.org/d3.v5.min.js")
    )
  });
  main.variable(observer()).define(["html"], function (html) {
    return (
      html`<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css' rel='stylesheet' />`
    )
  });
  return main;
}
