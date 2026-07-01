import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { Hero } from "./sections/Hero";
import { Atuacao } from "./sections/Atuacao";
import { Servicos } from "./sections/Servicos";
import { Equipe } from "./sections/Equipe";
import { Clientes } from "./sections/Clientes";
import { Contato } from "./sections/Contato";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Atuacao />
        <Servicos />
        <Equipe />
        <Clientes />
        <Contato />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export default App;
