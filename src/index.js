const yaml = require('yaml')

const httpRequest = require('./httpRequest.js')

let data

let zoom = 20
let svg

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
  if (svg) {
    document.body.removeChild(svg)
  }

  let maxPrio = zoom > 20 ? 2 : 1

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('height', 1500)
  svg.setAttribute('width', 1500)
  svg.setAttribute('style', 'overflow: auto;')

  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs)
  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif; font-size: 10pt; fill: red;')

  data.routes.forEach((route, i) => {
    if ((route.prio || 1) > maxPrio) {
      return
    }

    let arc = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    arc.setAttribute('id', 'route' + i)
    arc.setAttribute('d', locToPath(route.loc))
    defs.appendChild(arc)

    let use = document.createElementNS("http://www.w3.org/2000/svg", 'use')
    use.setAttribute('href', '#route' + i)
    use.setAttribute('stroke', route.color || 'red')
    use.setAttribute('stroke-width', route.prio === 2 ? 1 : 3)
    use.setAttribute('fill', 'none')
    use.onclick = function () {
      alert(route.name)
    }
    svg.appendChild(use)

    let textpath = document.createElementNS("http://www.w3.org/2000/svg", 'textPath')
    textpath.setAttribute('href', '#route' + i)
    textpath.setAttribute('text-anchor', 'middle')
    textpath.setAttribute('startOffset', '50%')
    textpath.setAttribute('side', route.loc[1] === route.loc[3] || route.loc[0] > 30 ? 'right' : 'left')
    textpath.setAttribute('dy', '5')
    textpath.appendChild(document.createTextNode(route.name || ''))
    text.appendChild(textpath)
  })

  data.nodes.forEach(node => {
    if ((node.prio || 1) > maxPrio) {
      return
    }

    let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    let [x, y] = locToXY(node.loc[0], node.loc[1])
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', 5)
    svg.appendChild(circle)
    circle.onclick = function () {
      alert(node.name)
    }

    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text')
    text.setAttribute('x', x)
    text.setAttribute('y', y)
    text.setAttribute('dy', 15)
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif; font-size: 10pt;')
    text.appendChild(document.createTextNode(node.name || ''))
    svg.appendChild(text)
  })

  svg.appendChild(text)
  document.body.appendChild(svg)
}

window.onload = function () {
  httpRequest('data.yaml', {}, (err, result) => {
    data = yaml.parse(result.body)
    render()
  })

  let input = document.getElementById('zoom-in')
  input.onclick = () => {
    zoom = Math.min(zoom + 5, 60)
    render()
  }

  input = document.getElementById('zoom-out')
  input.onclick = () => {
    zoom = Math.max(zoom - 5, 10)
    render()
  }
}
