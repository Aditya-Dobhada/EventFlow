import { Calendar } from './components/Calendar';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-4xl font-bold text-primary">EventFlow</h1>
          <p className="text-muted-foreground">Streamline your schedule with ease</p>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <Calendar />
      </main>
    </div>
  );
}

export default App;