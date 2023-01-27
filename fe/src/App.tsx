import { Route, Routes, Link } from 'react-router-dom';
import Login from './features/auth/Login';
import { Counter } from './features/counter/Counter';

function App() {
  return (
    <>
      Application
      <Link to="/login">Login</Link>
      <Counter />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
