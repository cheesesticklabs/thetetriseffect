(()=>{'use strict';
const $=s=>document.querySelector(s),game=window.LESSON_GAMES[decodeURIComponent(location.hash.slice(1))],es=new URLSearchParams(location.search).get('lang')==='es',t=(a,b)=>es?b:a;
const status=(s)=>$('#status').textContent=s;let started=false,timer;
if(!game){status(t('Game not found. Reopen it from the lesson.','No se encontró el juego. Ábrelo desde la lección.'));return}
document.title=game.title+' · '+game.platform;$('#title').textContent=game.title+' · '+game.platform;$('#start').textContent=t('Start game','Iniciar juego');$('#return').textContent=t('Return to lesson','Volver a la lección');
$('#return').onclick=()=>parent===window?history.back():parent.postMessage({type:'close-game'},location.origin);
function fail(e){clearTimeout(timer);status(t('Could not load: ','No se pudo cargar: ')+(e?.message||e));$('#retry').hidden=false}
$('#retry').onclick=()=>location.reload();addEventListener('error',e=>fail(e.message));addEventListener('unhandledrejection',e=>fail(e.reason));
$('#start').onclick=()=>{if(started)return;started=true;$('#start').disabled=true;$('#cover').hidden=true;status(t('Loading the bundled emulator…','Cargando el emulador incluido…'));
try{
window.EJS_player='#emulator';window.EJS_core=game.engine==='nes'?'nes':game.engine;window.EJS_controlScheme=game.engine;window.EJS_forceLegacyCores=true;window.EJS_threads=false;window.EJS_startOnLoaded=true;window.EJS_disableLocalStorage=true;window.EJS_language=es?'es-ES':'en-US';window.EJS_gameName=game.rom.split('/').pop();window.EJS_color='#487dc8';window.EJS_volume=.5;
window.EJS_pathtodata=new URL('vendor/emulatorjs/',location.href).href;
window.EJS_gameUrl=game.romBase64?URL.createObjectURL(new Blob([Uint8Array.from(atob(game.romBase64),c=>c.charCodeAt(0))],{type:'application/octet-stream'})):new URL(game.rom,location.href).href;
const keys=Object.fromEntries(Array.from({length:30},(_,i)=>[i,{value:'',value2:''}]));for(const [i,key] of [[0,'j'],[8,'k'],[2,'f'],[3,'enter'],[4,'w'],[5,'s'],[6,'a'],[7,'d']])keys[i]={value:key,value2:''};window.EJS_defaultControls={0:keys,1:{},2:{},3:{}};
window.EJS_ready=()=>status(t('Emulator ready. Loading game…','Emulador listo. Cargando juego…'));
window.EJS_onGameStart=()=>{clearTimeout(timer);status(t('Playing. Enter = Start · W A S D = move · J / K = buttons.','Jugando. Enter = Inicio · W A S D = mover · J / K = botones.'));$('#emulator').focus();parent.postMessage({type:'game-loaded'},location.origin)};
window.EJS_Buttons={playPause:true,restart:true,mute:true,fullscreen:true,settings:true,saveState:false,loadState:false,gamepad:true,cheat:false,volume:true,saveSavFiles:false,loadSavFiles:false,quickSave:false,quickLoad:false,screenshot:true,cacheManager:false,exitEmulation:false,screenRecord:false};
const script=document.createElement('script');script.src=window.EJS_pathtodata+'loader.js';script.onerror=()=>fail('The vendor/emulatorjs folder is missing from the uploaded site.');document.body.append(script);timer=setTimeout(()=>fail(t('Loading timed out. Open the game in a separate tab or check that the full vendor folder was uploaded.','La carga tardó demasiado. Abre el juego en otra pestaña o comprueba la carpeta vendor.')),60000);
}catch(e){fail(e)}};
})();
