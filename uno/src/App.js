import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Mainboard from './components/mainboard';

function App() {
  return (

    <ChakraProvider>
         <Mainboard />

    </ChakraProvider>
  );
}

export default App;
