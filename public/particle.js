class Particle {
  constructor(x, y, mass, id) {
    this.position = createVector(x, y) // refer to https://p5js.org/reference/p5/createVector/
    this.acceleration = createVector(0, 0)
    this.velocity = createVector(0, 0)
    this.setMassMultiplier(5) // mass always stays the same but the "mass" slider changes this variable which artifically changes the mass. 
    this.setMass(mass)
    this.id = id // unique ID used to identify particle

    randomSeed(id * 9 / 3) // this way we can always get the right colour in our previews
    this.color = color(random(0, 255), random(0, 255), random(0, 255))
    randomSeed((new Date()).getTime()) // for other random-ness we don't repeat
  }

  draw() {
    if(this.mass >= 0) { // "repeling" particles have a negative mass and our outlined
      noStroke()
      fill(this.color)
    } else {
      noFill()
      strokeWeight(6);
      stroke(this.color)
    }
    
    ellipse(this.position.x, this.position.y, this.radius * 2)
  }

  applyForce(force) {
    // acceleration = Force / mass
    this.acceleration.add(p5.Vector.div(force, this.massMultiplier * this.mass))
  }

  physics(particle) {
    if (this === particle) return

    let mass = this.massMultiplier * this.mass * particle.mass
    let radius = this.radius + particle.radius
    let distance = this.position.dist(particle.position)

    if (distance <= radius) return

    // force = G * mass1 * mass2 / distance ** 2
    let force = p5.Vector.sub(this.position, particle.position).setMag(G * mass  / (distance ** 2))


    particle.applyForce(force)
  }

  update() {
    // deltaTime, refer to https://p5js.org/reference/p5/deltaTime/

    
    let deltaVelocity = p5.Vector.mult(this.acceleration, deltaTime) // vector multiplication, velocity will be used to change the position

    this.velocity.set(this.velocity.add(deltaVelocity))

    this.position.set(this.position.add(p5.Vector.mult(this.velocity, deltaTime)))
    
    this.position = createVector(this.position.x % windowWidth, this.position.y % windowWidth)

    this.acceleration.set(0, 0)
  }
  
  setMassMultiplier(multiplier) {
    this.massMultiplier = multiplier // used to change the mass but indirect
  }
  
  setMass(mass) {
    this.mass = mass
    this.radius = Math.sqrt(this.massMultiplier * abs(this.mass) / PI) * SCALE
  }
}
