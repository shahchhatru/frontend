import './App.css'
import AddUserForm from './components/Form'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
    <div className='w-full flex justify-center items-center h-[90vh] p-0 m-0'>
    {/* <Login /> */}
    <AddUserForm />
    </div>
    <Toaster richColors />
    </>
  ) 
}

export default App;
