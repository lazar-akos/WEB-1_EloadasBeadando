import ReactApp from './ReactApp.js';

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(
  React.createElement(React.StrictMode, null, 
    React.createElement(ReactApp)
  )
);