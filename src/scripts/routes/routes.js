// Import halaman-halaman
import Login from '../views/pages/login.js';
import Register from '../views/pages/register.js';
import Stories from '../views/pages/stories.js';
import AddStory from '../views/pages/add-story.js';
import Favorites from '../views/pages/favorites.js';

const routes = {
  '/': Login,
  '/login': Login,
  '/register': Register,
  '/stories': Stories,
  '/add-story': AddStory,
  '/favorites': Favorites,
};

export default routes;