import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './components/page/Product/Product';
import Footer from './components/Footer/Footer';
import Nav from './components/Nav/Nav';
import Swipe from './components/swipe/Swipe'


function App() {
  return (
    <div>
      <Nav/>

      <Router>
        <Routes>
          <Route path="/" element={<Swipe/>} /> 
          <Route path="/product/:id" element={<Product />} /> 
        </Routes>
      </Router>

      <Footer/>
     
    </div>
  );
}

export default App;
