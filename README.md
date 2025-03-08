# 🌌 Galaxy

TLDR: it's a physics simulation where everyone in the room is a planet; as the planets interact with each other, the viewers of the piece can change the mass of their planet, split their planet into mini-planets (and then split it again!), and choose whether their planet's gravity is attractive (what gravity normally is) or repulsive (in another universe, maybe?). Every viewer gets to **make their mark** on the galaxy!

<img width="781" alt="Screenshot 2025-03-07 at 4 50 17 PM" src="https://github.com/user-attachments/assets/963abe8f-ecbe-4142-8236-e2ca063c20e9" />

## Showcase / Description of Finished Piece

I love learning things and I like to do that by getting my hands dirty... that can be pretty hard at a galactic scale. At the same time, I also really enjoy creating things where people use my creation / interact with my creation. That's what I feel like what I've been working on so far has been missing and I wanted to experiment with that concept in this project.

I built an interactive art display that's at it's core is a basic particle physics simulation. You have a collection of planets / particles (circles on the screen) that are orbiting around one another. Each particle has its own gravitational field. What makes it special is that every planet represents a person viewing the art piece and they have control over this planet through a physical controller or a mobile website.

Here's what it looked like:

![screenrecoridng](https://github.com/user-attachments/assets/bcd2f041-cfa2-4eb9-a834-39a52d3e7f45)

And here are what the mobile and physical controllers look like:

<img src="https://github.com/user-attachments/assets/dde19e1f-f8a6-4b19-b44e-25529f1d033a" width="300px" />
<img src="https://github.com/user-attachments/assets/b7267152-09af-4934-9387-1b81d5d37533" width="300px" />

The physical controller is very much a prototype. It's an ESP32 with two buttons for triggers and a potentiometer for changing the mass of it's associated particle. It uses the _arduinoWebSockets_ library to connect to the Node.js / express server running an instance of _socket.io_. This server takes incoming events and emits them to the display client. The display client is an art piece built in _p5.js_ and it handles those incoming events through JavaScript. The mobile controller is a HTML, CSS & JS website that uses socket.io to communicate with the display via the server.

<img width="600px" src="https://github.com/user-attachments/assets/03a07059-1a23-4c7a-94e9-d64f2a2f35e9" />

The earliest version of this piece was a motion-based piece that tracked people's motion over time and displayed their silhouette on the screen (it would fade over time). I might return to this idea at some point, my concern about it was that very few people could interact with it at once.

Then I started working towards this idea of tracking people's motion from a birds eye view. Once someone entered the classroom we'd track their motion through it (like an Amazon self-checkout store... ugh now that sound creepy). I couldn't figure out the camera setup for this but I'd like to return to the idea of distributing out where people can interact with the art.

I started building the 

To create the shell for the project, I designed a couple of pieces I could laser cut using Figma. Figma probably isn't the best software for this - but it's something I'm very comfortable with and that I knew could do the job. With more time, I would have CAD-ed it.

Here's my Figma setup:

<img width="600" alt="Screenshot 2025-02-21 at 6 28 43 PM" src="https://github.com/user-attachments/assets/6a1e16cc-caa9-44cc-bf45-9338ee658e4b" />

I then exported this as an SVG and set it up in Adobe Illustrator to be laser cut. I did this all at the [Jacobs Hall Makerspace](https://jacobsinstitute.berkeley.edu/making-at-jacobs/).

The first laser cut had a slight problem, the engraving was too faint so it was hard to distinguish the train design (I was engraving most of the acrylic and leaving the outline of train un-engraved):

<img width="600" src="https://github.com/user-attachments/assets/841f2f24-9a86-47bc-8b55-f44e0a48e0d8" />

(you can see how it's a bit patchy)

This was because the laser cutter / engraver is stronger in the centre. Going forward, I did my future engraving from the centre of the bed.

So now I had the shell of it! I hot-glued all the pieces together to make the full train. Next step was wiring, here's what the circuit looked like:

<img width="600" alt="Screenshot 2025-02-21 at 6 46 00 PM" src="https://github.com/user-attachments/assets/236564f9-3857-4f54-9d41-047e129eee6a" />

Last thing to do was to program it! As I mentioned earlier I'm running a Python script on my laptop and communicating with Arduino using serial. I originally used the [Transit App's API](https://transitapp.com/apis) but it was probably overkill for this purpose. Though using this knowledge, I built this little menu bar app to help me keep track of transit nearby:

<img width="401" alt="Screenshot 2025-02-21 at 6 52 58 PM" src="https://github.com/user-attachments/assets/6fa3454e-8984-4b03-8489-a8fe6f893d57" />

But anyways! With it coded up, I now had a working thing. Just imagine if there was a purple BART line:

<img width="600px" alt="Screenshot 2025-02-14 at 12 00 52 AM" src="https://github.com/user-attachments/assets/337af8bd-26f2-4a38-8a45-2d2378e87b7d" />

And here's the noise it makes if the train is leaving:

https://github.com/user-attachments/assets/8d63fbfe-5397-4607-a32a-b0ea8b4b94a8

## Reflection

I had a lot of fun making this! I don't think I'd used a laser cutter since high school before this (sadly) and it was great to try out some new APIs I hadn't used either. Plus BART makes me happy so seeing this thing on my mantlepiece everyday makes me happy (I had to use the Arduino for more projects)!

<img width="600px" alt="Screenshot 2025-02-21 at 7 01 02 PM" src="https://github.com/user-attachments/assets/0cdc0c37-27f0-40e3-a97f-7d44894fde3c" />

This project started with me building something practical but over time it morphed into having a different message. Not missing the train became less important to the story because as I showed it people, it became clear to me that people enjoyed it because it reminded them of fond memories using BART. BART is critical infrastructure for me and my peers - only a few of us have cars and the logistics of driving in the Bay Area is a nightmare. So we use BART for everything and anything; I think that's why this made people smile when I showed it to them. Plus anything that lights up is cool! Waiting for the train is also a universal experience, so in a way, this piece highlights the importance of funding BART so it can have more frequent schedules / they can reduce the wait times. [That's a relevant topic at the moment.](https://www.bart.gov/about/financials/crisis)

If I was to make the project again, there'd be a couple of things I'd change:

* Designing joints for my laser cut pieces so I wouldn't have had to hot glue the piece together.
* Modelling the train in CAD - this would have allowed me to properly create the diagonal shape of a BART train. Plus I want to improve my CAD skills so I can do more.
* Using an ESP32. That would have allowed me to make API calls from my Arduino code directly and not have to run a separate Python script.

This project isn't going to waste. I'm using my electronics for future projects and keeping the structure as an ornament on my mantlepiece.

But at the end of the day, the most fun part of this project was showing it to friends and seeing them smile as it lit up. So thanks to everyone who said nice things about it and gave me helpful feedback!

## Sources

Thanks to these sources for helping me:

Dr. Sudhu's Arduino Tutorial: https://github.com/loopstick/ArduinoTutorial

BART's API documentation: https://api.bart.gov/docs/overview/index.aspx

Taylor S. Marks' playsound module: https://github.com/TaylorSMarks/playsound

[^1]: https://api.bart.gov/docs/stn/stns.aspx
