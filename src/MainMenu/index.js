const menu = document.getElementById('main-menu');
const startButton = document.getElementById('game-start');
const game = document.getElementById('root');
const description = document.getElementById('main-menu-message');

const MainMenu = {
  menu: menu,
  startButton,
  show() {
    menu.style.display = 'flex';
    game.style.display = 'none';
  },
  hide() {
    menu.style.display = 'none';
    game.style.display = 'block';
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
  menu.style.display = 'none';
  MainMenu.onclick();
});

export default MainMenu;
