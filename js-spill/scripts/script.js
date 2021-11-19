// module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
Composite = Matter.Composite;
Common = Matter.Common;
Composites = Matter.Composites;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
element: document.body,
engine: engine,
options: {
    width: 1600,
    height: 800,
    wireframes: false,
    background: "sprites/bg.png"
}
});

var maxVertical = 10; // max antall vertikale blokker
var maxHoriz = 10; // max antall horisontale blokker
var maxBird = 3; // max fugler

var shouldSpawn;

var keys = [];

document.body.addEventListener("keydown", function (e) { // Registrer at en knapp trykkes og gjør det mulig å legge til blokker
keys[e.keyCode] = true;
shouldSpawn = true;
});

document.body.addEventListener("keyup", function (e) {
keys[e.keyCode] = false;
});

var pig1 = Bodies.rectangle(150, 100, 80, 80, { // Kode får å legge til grisene. Setter posisjon samt en tekstur til rendering.
render: {
    sprite: {
        texture: 'sprites/pig.png'
    }
}
});

var pig2 = Bodies.rectangle(250, 100, 80, 80, {
render: {
    sprite: {
        texture: 'sprites/pig.png'
    }
}
});

var ground = Bodies.rectangle(1300, 600, 500, 30, { isStatic: true }); // Kode for bakkene. Satt til statisk slik at de ikke beveges.
var ground2 = Bodies.rectangle(200, 150, 200, 10, { isStatic: true });

let mouse = Matter.Mouse.create(render.canvas); // Innstillinger og oppretting av mus. Ikke synlig.
let mouseConstraint = Matter.MouseConstraint.create(engine, {
mouse: mouse,
constraint: {
    render: { visible: false }
}
});
render.mouse = mouse;

let ball = Matter.Bodies.circle(400, 500, 30, { // Kode for visning av fugl.
render: {
    sprite: {
        texture: 'sprites/bird.png'
    }
}
});

let sling = Matter.Constraint.create({ // Kode for slynge-mekanismen
pointA: { x: 400, y: 500 },
bodyB: ball,
stiffness: 0.05
})

let firing = false;
Matter.Events.on(mouseConstraint, "enddrag", function (e) {
if (e.body === ball) firing = true;
});
Matter.Events.on(engine, "afterUpdate", function () { // Sjekker hvis brukeren trykker og drar fuglen. Skyter fuglen avgårde når brukeren slipper.
if (firing && Math.abs(ball.position.x - 400) < 20 && Math.abs(ball.position.y - 500) < 20 && maxBird > 0) { //Hvis brukeren holder på fuglen og drar den fra startposisjonen, skap en ny med fart og retning
    ball = Matter.Bodies.circle(400, 500, 30, {
        render: {
            sprite: {
                texture: 'sprites/bird.png'
            }
        }
    });
    Matter.World.add(engine.world, ball);
    sling.bodyB = ball;
    firing = false;
    maxBird--;
}

if(ball.position.x > 600){
    ball.position.x = 600;
}

});

var mousePos;

Matter.Events.on(mouseConstraint, "mousedown", function (event){mousePos = event.mouse.position;}) // Lagring av museposisjonen til en variabel.

const vertValsX = []; // Array for koordinater til blokkene.
const vertValsY = [];
const horizValsX = [];
const horizValsY = [];

Matter.Events.on(engine, "beforeUpdate", function(event){
if (keys[90] && shouldSpawn && maxVertical > 0) { // Legger til en vertikal blokk når man trykker X. 
    let vert = Bodies.rectangle(mousePos.x, mousePos.y, 50, 100, {
        render: {
            sprite: {
                texture: "sprites/plank.png"
            }
        }
    });
    
    Composite.add(engine.world, [vert]);
    shouldSpawn = false;
    maxVertical--; // Oppdaterer antall blokker.
    vertValsX.push(vert.position.x);
    vertValsY.push(vert.position.y);
};

if (keys[88] && shouldSpawn && maxHoriz > 0) {
    let horiz = Bodies.rectangle(mousePos.x, mousePos.y, 150, 50, { // Samme som over men for horisontale blokker.
        render: {
            sprite: {
                texture: "sprites/plate.png"
            }
        }
    }); 
    Composite.add(engine.world, [horiz]);
    shouldSpawn = false ;
    maxHoriz--; 
    horizValsX.push(horiz.position.x);
    horizValsY.push(horiz.position.y);
};

document.getElementById("antallVertikale").innerHTML = "Antall vertikale blokker igjen (Z): " + maxVertical; // Referanser til HTML-filen.
document.getElementById("antallHoris").innerHTML = "Antall horisontale blokker igjen (X): " + maxHoriz;
document.getElementById("antallFugler").innerHTML = "Antall fugler igjen: " + maxBird;

if(pig1.position.y > 800 && pig2.position.y > 800){
    document.getElementById("vant").innerHTML = "Fuglene vant";
}
else if((pig1.position.y < 800 || pig2.position.y < 800) && maxBird === 0) {
    document.getElementById("vant").innerHTML = "Grisene vant";
}
});

document.getElementById("lagreniva").onclick = sendTilTekst; // Logikk for å lagre koordinater til en fil.

function sendTilTekst() {
    var vertX = vertValsX.toString();
    var vertY = vertValsY.toString();
    var horizX = horizValsX.toString();
    var horizY = horizValsY.toString();
    var c = document.createElement("a");
    c.download = "user-text.txt";
    
    var t = new Blob([vertX, " ", vertY, " ", horizX, " ", horizY], {
    type: "text/plain"
    });
    c.href = window.URL.createObjectURL(t);
    c.click();
}

// add all of the bodies to the world
Composite.add(engine.world, [pig1, pig2, ground, ground2, mouseConstraint, ball, sling]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create({
    isFixed: true
});

// run the engine
Runner.run(runner, engine);