import AxiosApp from './AxiosApp.js';

const root = ReactDOM.createRoot(document.getElementById('axios-root'));
root.render(
  React.createElement(React.StrictMode, null, 
    React.createElement(AxiosApp)
  )
);