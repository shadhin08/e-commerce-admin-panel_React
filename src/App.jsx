import { RouterProvider } from "react-router-dom"
import router from "./Routes/Routes"
// import $ from 'jquery';

// Bootstrap CSS
import './assets/css/bootstrap.min.css';
import './assets/css/fonts.css';
import './assets/css/app.css';
import './assets/css/icons.css';

// loader
import './assets/css/pace.min.css';
import './assets/js/pace.min.js';

// plugins
import './assets/plugins/vectormap/jquery-jvectormap-2.0.2.css';
import './assets/plugins/simplebar/css/simplebar.css';
import './assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css';
// import './assets/plugins/metismenu/css/metismenu.min.css';

// Theme Style CSS
import './assets/css/dark-theme.css';
import './assets/css/semi-dark.css';
import './assets/css/header-colors.css';

// JS
import './assets/js/bootstrap.bundle.min.js';
import './assets/js/jquery.min.js';
import './assets/plugins/simplebar/js/simplebar.min.js';
// import './assets/plugins/metismenu/js/metisMenu.min.js';
// import './assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js';
import './assets/plugins/vectormap/jquery-jvectormap-2.0.2.min.js';
import './assets/plugins/vectormap/jquery-jvectormap-world-mill-en.js';
// // import './assets/plugins/chartjs/js/Chart.min.js';
// // import './assets/plugins/chartjs/js/Chart.extension.js';
import './assets/js/index.js';
import './assets/js/app.js';
import 'react-photo-view/dist/react-photo-view.css';
function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
