const yaml = require('yaml')

const httpRequest = require('./httpRequest.js')

let data

let zoom = 20

function locToXY (c, d) {
  return [
    500 + Math.sin(c / 30 * Math.PI) * d * zoom,
    500 - Math.cos(c / 30 * Math.PI) * d * zoom
  ]
}

function locToPath (c) {
  let [x, y] = locToXY(c[0], c[1])
  let d = 'M ' + x + ' ' + y

  for (let i = 2; i < c.length; i += 2) {
    let [x, y] = locToXY(c[i], c[i + 1])

    if (c[i - 1] === c[i + 1]) {
      d += ' A ' + (c[i + 1] * zoom) + ' ' + (c[i + 1] * zoom) + ' 0 ' +
        (c[i] - c[i - 2] <= 30 ? '0' : '1') +
        '1' + // (c[i] - c[i - 2] > 30 ? '1' : '0') +
        ' ' + x + ' ' + y
    } else {
      d += ' L ' + x + ' ' + y
    }
  }

  return d
}

function render () {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('height', 1000)
  svg.setAttribute('width', 1000)
  svg.setAttribute('style', 'overflow: auto;')

  data.routes.forEach(route => {
    let arc = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    arc.setAttribute('d', locToPath(route.loc))
    arc.setAttribute('stroke', route.color || 'red')
    arc.setAttribute('stroke-width', 3)
    arc.setAttribute('fill', 'none')
    arc.onclick = function () {
      alert(route.name)
    }
    svg.appendChild(arc)
  })

  data.nodes.forEach(node => {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    let [x, y] = locToXY(node.loc[0], node.loc[1])
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', 5)
    circle.onclick = function () {
      alert(node.name)
    }

    svg.appendChild(circle)
  })

  document.body.appendChild(svg)
}

window.onload = function () {
  httpRequest('data.yaml', {}, (err, result) => {
    data = yaml.parse(result.body)
    render()
  })
}
