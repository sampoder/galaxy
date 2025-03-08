const G = 6.67e-11
const SCALE = 0.001
let particles = []
let stars = []

let socket = io();

function setup () {
  createCanvas(windowWidth, windowHeight);
  particles.push(createParticle(999)) // used by the physical controller
  // creates some stars for the background
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)  // Random size for each star
    });
  }
}

function draw () {
  background(22, 22, 22)
  
  noStroke();
  fill(255, 255, 255, 150); // Slight transparency for stars
  for (const star of stars) { // draw all stars
    ellipse(star.x, star.y, star.size, star.size);
  }

  // calculate the interactions of every particle
  for (const particleA of particles)
    for (const particleB of particles)
      if (particleA !== particleB) particleA.physics(particleB)

  for (const particle of particles) { // draw the particles
    particle.update()
    particle.draw()
  }
}

function createParticle (id, pos, mass) {
  let x = pos?.x || random(0, width)
  let y = pos?.y || random(0, height)
  mass = mass || random(2e9, 1e10)

  return new Particle(x, y, mass, id)
}

socket.on('newParticle', function(msg) {
  particles.push(createParticle(msg.id))
});

socket.on('toggleRepel', function(msg) {
  for(let i = 0; i < particles.length; i++){
    if(particles[i].id == msg.id){ // loop through every particle and check if this is a target particle
      particles[i].mass = -1 * particles[i].mass
    }
  }
});

socket.on('updateMass', function(msg) {
  for(let i = 0; i < particles.length; i++){
    if(particles[i].id == msg.id){
      particles[i].massMultiplier = (msg.massMultiplier % 11) // mod math to cap it at 10
      particles[i].setMass(particles[i].mass)
    }
  }
});

socket.on('triggerSplit', function(msg) {
  let newParticles = []
  for(let i = 0; i < particles.length; i++){
    if(particles[i].id == msg.id){
      particles[i].setMass((1/2) * particles[i].mass) // half the size of the particle being split
      newParticles.push(createParticle(msg.id, null, particles[i].mass))
    }
  }
  particles = particles.concat(newParticles)
});
