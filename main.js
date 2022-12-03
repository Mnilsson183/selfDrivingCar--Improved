const carCanvas = document.getElementById("carcanvas")
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkcanvas")
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width * 0.9);


if(localStorage.getItem("vary")){
    vary = JSON.parse(localStorage.getItem("vary"));
}
else if(localStorage.getItem("N")){
    N = JSON.parse(localStorage.getItem("N"));
}
else{
    var N = 1000;
    var vary = 0.1;
}
N = 100;

const cars = generateCars(N - 1);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length;i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain,vary);
        }
    }
}


const traffic = [];
for(let i = 0;i < 100;i++){
    y = i * -200 - 200;
    for(let j = 0;j < 2;j++){
        x = parseInt(Math.random() * (2 - 0));
        let l;
        if(x !== l){
            traffic.push(new Car(road.getLaneCenter(x),y,30,50,"DUMMY",2));
        }
        else{
            l = x;
        }
    }
}

animate();

function setVary(i){
    localStorage.setItem("vary",
    JSON.stringify(i));
    location.reload();
}
function setN(i){
    localStorage.setItem("N",
    JSON.stringify(i));
    location.reload();
}

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain")
}

function generateCars(N){
    const cars = [];
    for(let i = 0;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars
}
function animate(time){
    for(let i = 0; i < traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i = 0;i < cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar = cars.find(
        c=>c.y == Math.min(
            ...cars.map(c=>c.y)
        ));

    networkCanvas.height = window.innerHeight;
    carCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.5)

    road.draw(carCtx);
    for(let i = 0;i < traffic.length;i++){
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length;i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"blue",true)

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    carCtx.restore();
    requestAnimationFrame(animate);
}