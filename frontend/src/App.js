import { BrowserRouter } from "react-router-dom";
import WrappedApp from "./docs/wrappedApp";

function App() {

  return (
    <BrowserRouter>
      <WrappedApp />
    </BrowserRouter>
  );
}

export default App;
