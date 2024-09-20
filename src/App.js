import BGBlur from "./Components/BGBlur";
import PokemonComponent from "./Components/PokemonComponent/PokemonComponent";
import BGComponent from './Components/BGComponent'

function App() {
  
  return (
    <div className="App relative">
        <BGComponent></BGComponent>
        <BGBlur></BGBlur>
        <PokemonComponent></PokemonComponent>
    </div>
  );
}

export default App;
