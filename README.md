# 🌌 Galaxy

TLDR: it's a physics simulation where everyone in the room is a planet; as the planets interact with each other, the viewers of the piece can change the mass of their planet, split their planet into mini-planets (and then split it again!), and choose whether their planet's gravity is attractive (what gravity normally is) or repulsive (in another universe, maybe?). Every viewer gets to **make their mark** on the galaxy!

<img width="781" alt="Screenshot 2025-03-07 at 4 50 17 PM" src="https://github.com/user-attachments/assets/963abe8f-ecbe-4142-8236-e2ca063c20e9" />

## Showcase / Description of Finished Piece

I love learning things and I like to do that by getting my hands dirty... that can be pretty hard at a galactic scale. At the same time, I also really enjoy creating things where people use my creation / interact with my creation. That's what I feel like what I've been working on so far has been missing and I wanted to experiment with that concept in this project.

I built an interactive art display that's a particle physics simulation. You have a collection of planets / particles (circles on the screen) that are orbiting around one another. Each particle has its own gravitational field. What makes it special is that every planet represents a person viewing the art piece and they have control over this planet through a physical controller or a mobile website.

Here's what it looked like:

![screenrecoridng](https://github.com/user-attachments/assets/bcd2f041-cfa2-4eb9-a834-39a52d3e7f45)

And here are what the mobile and physical controllers look like:

<img src="https://github.com/user-attachments/assets/dde19e1f-f8a6-4b19-b44e-25529f1d033a" width="300px" />
<img src="https://github.com/user-attachments/assets/b7267152-09af-4934-9387-1b81d5d37533" width="300px" />

The physical controller is very much a prototype. It's an ESP32 with two buttons for triggers and a potentiometer for changing the mass of its associated particle. It uses the _arduinoWebSockets_ library to connect to the Node.js / express server running an instance of _socket.io_. This server takes incoming events and emits them to the display client. The display client is an art piece built in _p5.js_ and it handles those incoming events through JavaScript. The mobile controller is a HTML, CSS & JS website that uses socket.io to communicate with the display via the server.

<img width="600px" src="https://github.com/user-attachments/assets/03a07059-1a23-4c7a-94e9-d64f2a2f35e9" />

The earliest version of this piece was a motion-based piece that tracked people's motion over time and displayed their silhouette on the screen (it would fade over time). I might return to this idea at some point, my concern about it was that very few people could interact with it at once.

<img width="600px" alt="Screenshot 2025-03-08 at 1 15 09 AM" src="https://github.com/user-attachments/assets/c23ca4d8-61d8-4fe2-b9fc-cdeac8b7d34b" />

Then I started working towards this idea of tracking people's motion from a birds eye view. Once someone entered the classroom we'd track their motion through it (like an Amazon self-checkout store... ugh now that sounds creepy). I couldn't figure out the camera setup for this but I'd like to return to the idea of distributing out where people can interact with the art.

<img width="600px" alt="Screenshot 2025-03-08 at 1 15 44 AM" src="https://github.com/user-attachments/assets/83dd9c13-2cec-487a-bb6d-8f6faf35341d" />

I started building the project by building the physics simulation. I used [an old workshop](https://github.com/hackclub/hackclub/tree/main/workshops/particle_physics) that I had seen / helped make at hackathon as the base for my work; it had described most of the physics logic but I expanded it to make it more "displayable" (splitting, repelling, and wrap around movement).

From there I start scaffolding out what the websocket server would look like. I made a list of events that it would need to be able to handle and the events that it would need to emit. Then I returned to my p5.js code for the display and implemented the handling of these events (eg. `massChanged`). At this point I was just simulating the event triggers.

Afterwards, I built the mobile control website. It was mainly an emitter of events based on when buttons were clicked. I did my best to make sure that the styling was mobile-friendly, as a result everything looks a bit big in the desktop version.

Lastly, it was time to make the physical controller! I'd left this part until last because I wanted to get a feel of whether the project was viable before doing the highest commitment piece. Here's the circuit I design:

<img width="661" alt="Screenshot 2025-03-07 at 9 48 21 PM" src="https://github.com/user-attachments/assets/f8cfe0c4-4b46-4176-b9e3-eb634d929d7b" />

(Red wires for power, blue for GND, and green for GPIO)

Working with the ESP32 was a bit of a nightmare; for example, the datasheets online all had different GPIO pin mappings and trying to figure out the right one for my model was difficult. Until I noticed this in my backpack...

<img width="600" alt="Screenshot 2025-03-08 at 1 17 45 AM" src="https://github.com/user-attachments/assets/870f3733-1cab-4c84-bc05-e9355807d65e" />

It was that sort of evening. But anyways, once I had finally gotten readings from my buttons and potentiometers, it was time to code this up! I used a library that handles WebSockets on the Arduino and hooked it into the server.

## Reflection

This project didn't quite go to plan as much - I think the end product was alright but the process was frustrating. A lot of the time, I was feeling fairly uncreative and stuck. I guess this stemmed from me struggling to come up with an idea originally.

What I'm submitting (this) is also my second project I built for this assignment. My first one (a replica of the SF cable car system) didn't quite go to plan. I'd built out the box but I left designing the motor / pulley system too late and with the limited resources I had, I couldn't figure out a clean way of doing it. I was also left feeling pretty uninspired by the project at that point (Wednesday night), I think this was largely because I couldn't see what its wow factor was. There wasn't like a golden moment when viewing it; it just felt like something that you'd run in the background and it'd go unnoticed.

But! I did make a fair bit of progress making it:

<img width="689" alt="Screenshot 2025-03-07 at 9 59 24 PM" src="https://github.com/user-attachments/assets/f50f2e5d-02d0-4c17-a8b9-527e577db5e3" />

Here's me trying to make pencils work as pillars (by cutting them to height with our kitchen knife), my roommates were amused lets say:

<img width="372" alt="Screenshot 2025-03-07 at 9 59 11 PM" src="https://github.com/user-attachments/assets/facbbac7-de11-4a77-8d17-fbd527c49ad5" />

So that's that. Back to my end project! I was pretty happy with how the demo had gone, though it did crash which (re)taught me the importance of stress-testing before demoing something. I think this project showed me that the idea of interactive art is one worth pursuing but I think my implementation was a bit lacking here. Some things that come to mind here are:

* Better way to identify your particle
* A way to interact with others through the article - imagine battling with your particle?

I want to do more of this because I saw the joy in people's faces for the first ten seconds - I just need to hold that joy / give them a reason to keep engaging with the project.

If I was to make the project again, there'd be a couple of things I'd change:

* Designing a case for the controller and including a battery in it (this was something I'd hoped to do but time got the better of me)
* Adding more depth to the shapes, the planets had no texture so they just looked like circles on a screen
* Implementing more maths / physics to make it more of a learning experience.
  * This is something I'd like to explore more in this class; art is a great way to learn.
 
I am pretty proud that of my three "next times" from the last project, I've done them all either in this project or through my half-done tram system:

> * Designing joints for my laser cut pieces so I wouldn't have had to hot glue the piece together.
> * Modelling the train in CAD - this would have allowed me to properly create the diagonal shape of a BART train. Plus I want to improve my CAD skills so I can do more.
> * Using an ESP32. That would have allowed me to make API calls from my Arduino code directly and not have to run a separate Python script.

Neither project is going to waste - I'm reusing the electronics from the controller and the box I created for the tram system is now on the mantlepiece at my place. Even though this project was a bit rough to get to the finish line with, I'm thankful for my friends who stayed up late helping me / lent me parts and everyone who gave me advice.

## Sources

Thanks to these sources for helping me:

esp32_SocketIO: https://github.com/Valgueiro/esp32_SocketIO

@SquarePear's workshop: https://github.com/hackclub/hackclub/tree/main/workshops/particle_physics

Socket.io's documentation: https://socket.io/get-started/chat
