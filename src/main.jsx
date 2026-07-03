import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Note: StrictMode intentionally omitted — several games use imperative
// requestAnimationFrame / canvas loops that don't play well with StrictMode's
// dev-only double-invocation.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

