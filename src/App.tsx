import './App.css'
import { Login } from './components'
import { Toaster } from "@/components/ui/sonner"

function App() {
  
  return (
    <>
    <div className='w-full flex justify-center items-center h-[90vh] p-0 m-0'>
    <Login />
    </div>
    <Toaster richColors />
    </>
  ) 
}

export default App
