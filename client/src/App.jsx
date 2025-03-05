import React from "react";
import "./App.css";
import { Button } from "./components/ui/button";
function App() {
  return (
    <>
      <div className="bg-blue-700 w-full h-100vh">App</div>{" "}
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
      </div>
    </>
  );
}

export default App;
