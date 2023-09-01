import "./App.css";
import Form from "./assets/components/Form";

function App() {
  return (
    <div className="main-cotnainer">
      <div className="container">
        <h3 style={{ textAlign: "center" }}>
          Drag and Drop Not using any Package
        </h3>
        <div style={{ marginTop: "50px" }}>
          <Form></Form>
        </div>
      </div>
    </div>
  );
}

export default App;
