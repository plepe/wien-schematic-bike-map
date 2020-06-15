function render () {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('height', 1000)
  svg.setAttribute('width', 1000)
  svg.setAttribute('style', 'overflow: auto;')

  let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
  circle.setAttribute('cx', 500)
  circle.setAttribute('cy', 500)
  circle.setAttribute('r', 200)
  circle.setAttribute('stroke', 'red')
  circle.setAttribute('stroke-width', 3)
  circle.setAttribute('fill', 'none')
  svg.appendChild(circle)

  document.body.appendChild(svg)
}

window.onload = function () {
  render()
}
