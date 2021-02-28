import mp3 from './mainmenu.mp3';
const menu = document.getElementById('main-menu');
const startButton = document.getElementById('game-start');
const game = document.getElementById('root');
const description = document.getElementById('main-menu-message');
const music = new Audio(mp3);
music.volume = 0.05;
music.autoplay = true;

const MainMenu = {
  menu: menu,
  startButton,
  show() {
    menu.style.display = 'flex';
    game.style.display = 'none';
    music.currentTime = 0;
    music.play();
  },
  hide() {
    menu.style.display = 'none';
    game.style.display = 'block';
    music.pause();
  },
  setHeader(text) {
    menu.querySelector('h1').innerHTML = text;
  },
  setDescription(html) {
    description.innerHTML = html;
  },
  setButtonText(text) {
    startButton.innerHTML = text;
  },
};

startButton.addEventListener('click', () => {
  MainMenu.hide();
  MainMenu.onclick();
});

export default MainMenu;
