import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/components/Home';
import Product from './assets/components/page/Product/Product';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Use 'element' instead of 'component' */}
          <Route path="/product/:id" element={<Product />} /> {/* Use 'element' instead of 'component' */}
        </Routes>
      </Router>

    </div>
  );
}

export default App;
