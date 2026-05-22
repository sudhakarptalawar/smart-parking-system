let slots =
[false,false,false,false,false,false,false,false,false,false];

let records = {};

greetUser();

function greetUser(){

let hour = new Date().getHours();

let greet="";

if(hour<12){

greet="Good Morning";

}

else if(hour<17){

greet="Good Afternoon";

}

else if(hour<21){

greet="Good Evening";

}

else{

greet="Good Night";

}

document.getElementById("greeting").innerHTML=
greet;

speak(greet +
" Welcome to Smart Parking System");

}

function speak(message){

let speech =
new SpeechSynthesisUtterance(message);

speech.lang="en-US";

window.speechSynthesis.speak(speech);

}

function beep(){

let audio = new Audio(
"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

audio.play();

}

function parkCar(){

let name =
document.getElementById("name").value;

let age =
document.getElementById("age").value;

let vehicle =
document.getElementById("vehicle").value;

let hours =
document.getElementById("hours").value;

let slot =
document.getElementById("slotSelect").value;

if(name=="" || age=="" || vehicle=="" || hours=="" || slot==""){

alert("Please fill all details");

return;

}

if(slots[slot]==true){

alert("Slot already occupied");

return;

}

slots[slot]=true;

document.getElementById("available").innerHTML=
"Available : "+
slots.filter(x=>x==false).length;

let movingCar =
document.getElementById("movingCar");

movingCar.style.display="block";

movingCar.style.left="45%";

beep();

let slotPosition =
document.getElementById("slot"+slot)
.offsetLeft;

setTimeout(function(){

movingCar.style.left=
slotPosition+"px";

},200);

setTimeout(function(){

movingCar.style.display="none";

let parkingSlot =
document.getElementById("slot"+slot);

parkingSlot.classList.add("occupied");

parkingSlot.innerHTML="🚗";

},3200);

let entryTime = new Date();

let exitLimit =
new Date(entryTime.getTime() +
hours*60*60*1000);

records[vehicle]={
name:name,
age:age,
slot:slot,
entry:entryTime,
allowed:exitLimit
};

speak(
"Car parked successfully in slot "+
(parseInt(slot)+1)
);

alert(
"Exit before "+
exitLimit.toLocaleTimeString()
);

let row=`

<tr id="${vehicle}">

<td>${name}</td>

<td>${age}</td>

<td>${vehicle}</td>

<td>${parseInt(slot)+1}</td>

<td>${entryTime.toLocaleTimeString()}</td>

<td id="exit${vehicle}">--</td>

<td id="charge${vehicle}">₹0</td>

<td id="penalty${vehicle}">₹0</td>

</tr>

`;

document.getElementById("tableBody").innerHTML+=row;

document.getElementById("token").innerHTML=

`

SMART PARKING TOKEN

<br><br>

Name : ${name}<br>

Age : ${age}<br>

Vehicle : ${vehicle}<br>

Slot : ${parseInt(slot)+1}<br>

Entry Time :
${entryTime.toLocaleTimeString()}<br>

Exit Before :
${exitLimit.toLocaleTimeString()}

`;

setTimeout(function(){

if(records[vehicle]){

speak(
"Parking time ended. Penalty started."
);

alert(
"Penalty started for "+
vehicle
);

}

},hours*60*60*1000);

}

function exitCar(){

let vehicle =
prompt("Enter Vehicle Number");

if(records[vehicle]==undefined){

alert("Vehicle not found");

return;

}

let data = records[vehicle];

let exitTime = new Date();

let totalMinutes =
Math.floor((exitTime-data.entry)/60000);

let charge =
totalMinutes*2;

let penalty=0;

if(exitTime > data.allowed){

penalty=100;

}

document.getElementById("exit"+vehicle).innerHTML=
exitTime.toLocaleTimeString();

document.getElementById("charge"+vehicle).innerHTML=
"₹"+charge;

document.getElementById("penalty"+vehicle).innerHTML=
"₹"+penalty;

let movingCar =
document.getElementById("movingCar");

let slotDiv =
document.getElementById("slot"+data.slot);

slotDiv.classList.remove("occupied");

slotDiv.innerHTML=
"Slot "+(parseInt(data.slot)+1);

movingCar.style.display="block";

movingCar.style.left=
slotDiv.offsetLeft+"px";

beep();

setTimeout(function(){

movingCar.style.left="45%";

},200);

slots[data.slot]=false;

document.getElementById("available").innerHTML=
"Available : "+
slots.filter(x=>x==false).length;

speak(
"Thank you for using our smart parking system"
);

alert(
"Charges : ₹"+charge+
"\nPenalty : ₹"+penalty
);

delete records[vehicle];

}