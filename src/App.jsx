
import DESVisualizer from './DESVisualizer.jsx'
import './index.css'


const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <DESVisualizer />
      </main>
      <footer className="bg-gray-100 text-center py-4">
        <a
          href="https://github.com/your-username/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View this project on GitHub
        </a>
      </footer>
    </div>
  );
};


export default App;
