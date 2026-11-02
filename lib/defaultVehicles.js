export const defaultVehicles = [
 {name:'Subaru Crosstrek 4x4',description:'',images:['/images/photo-099.jpg','/images/photo-100.jpg','/images/photo-101.jpg'],passengers:4},
 {name:'Jeep Wrangler',description:'',images:Array.from({length:6},(_,i)=>`/images/photo-${String(102+i).padStart(3,'0')}.jpg`),passengers:4},
 {name:'Minivan',description:'',images:Array.from({length:6},(_,i)=>`/images/photo-${String(108+i).padStart(3,'0')}.jpg`),passengers:7},
 {name:'Mercedes Luxury',description:'',images:[],passengers:4},
 {name:'Classic Mercedes Charlotte',description:'',images:[],passengers:4}
];
export const carIcon = name => /minivan/i.test(name)?'🚐':/mercedes/i.test(name)?'🚘':'🚙';
