const yaml = require('yaml')

const httpRequest = require('./httpRequest.js')

let data

function render () {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('height', 1000)
  svg.setAttribute('width', 1000)
  svg.setAttribute('style', 'overflow: auto;')

  data.forEach(route => {
    let arc = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    arc.setAttribute('d', 'M 85 350 A 150 180 0 0 0  280 79')
    arc.setAttribute('stroke', 'red')
    arc.setAttribute('stroke-width', 3)
    arc.setAttribute('fill', 'none')
    arc.onclick = function () {
      alert(route.name)
    }
    svg.appendChild(arc)
  })

  document.body.appendChild(svg)
}

window.onload = function () {
  httpRequest('routes.yaml', {}, (err, result) => {
    data = yaml.parse(result.body)
    render()
  })
}
