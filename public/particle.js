class Particle {
  constructor(x, y, mass, id) {
    this.position = createVector(x, y)
    this.acceleration = createVector(0, 0)
    this.velocity = createVector(0, 0)
    this.setMassMultiplier(5)
    this.setMass(mass)
    this.id = id

    randomSeed(id * 9 / 3)
    this.color = color(random(0, 255), random(0, 255), random(0, 255))
    randomSeed((new Date()).getTime())
  }

  draw() {
    if(this.mass >= 0) {
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
    let force = p5.Vector.sub(this.position, particle.position)
      .setMag(G * mass  / (distance ** 2))


    particle.applyForce(force)
  }

  update() {
    let deltaVelocity = p5.Vector.mult(this.acceleration, deltaTime)

    this.velocity.set(this.velocity.add(deltaVelocity))

    this.position.set(this.position.add(p5.Vector.mult(this.velocity, deltaTime)))
    
    this.position = createVector(this.position.x % windowWidth, this.position.y % windowWidth)

    this.acceleration.set(0, 0)
  }
  
  setMassMultiplier(multiplier) {
    this.massMultiplier = multiplier
  }
  
  setMass(mass) {
    this.mass = mass
    this.radius = Math.sqrt(this.massMultiplier * abs(this.mass) / PI) * SCALE
  }
}