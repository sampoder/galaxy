function setup() {
  let canvas = createCanvas(100, 100)
  canvas.parent('canvas-wrapper');
}
function draw () {
  randomSeed(id * 9 / 3)
  fill(color(random(0, 255), random(0, 255), random(0, 255)))
  ellipse(50, 50, 100)
}