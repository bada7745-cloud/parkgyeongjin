/* Offline renderer test: executes the actual Canvas renderer without a browser. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
try{GlobalFonts.registerFromPath('C:/Windows/Fonts/malgun.ttf','sans-serif')}catch{}
const Critters=require('../dist/engine.js');
for(const [width,height,name] of [[1440,900,'desktop'],[844,390,'mobile-landscape'],[390,844,'mobile-portrait']]){
 const canvas=createCanvas(width,height),box={Critters,document:{createElement(){return createCanvas(1600,900)}},innerWidth:width,innerHeight:height,devicePixelRatio:1,matchMedia(){return{matches:false}},Math,console};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/renderer.js'),'utf8'),box);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/gamefx.js'),'utf8'),box);box.canvas=canvas;vm.runInContext('var r=new CritterRenderer(canvas);var g=new Critters.Game({seed:4817,mode:"local"});r.setGame(g,false);r.focus(g.active);',box);for(let n=0;n<200;n++)vm.runInContext('g.step(1/60);r.render(1/60)',box);fs.writeFileSync(path.join(__dirname,`../../work/v3-render-${name}.png`),canvas.toBuffer('image/png'));console.log('Rendered',name,width,height);
 if(name==='desktop'){vm.runInContext('r.setGame(g,true);r.render(1/60)',box);fs.writeFileSync(path.join(__dirname,'../../work/v3-render-lobby.png'),canvas.toBuffer('image/png'));}
}
const sharp=require('sharp');const icon=fs.readFileSync(path.join(__dirname,'../dist/icon.svg'));
Promise.all([192,512].map(size=>sharp(icon).resize(size,size).png().toFile(path.join(__dirname,`../dist/icon-${size}.png`)))).then(()=>console.log('PNG app icons generated'));

