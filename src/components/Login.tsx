import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";


const Login = ()=>{
    return (
        <div className="flex flex-col gap-5 w-2/5">
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light">Please enter your username</Label>
                <Input placeholder="Enter username" />
            </div>
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light">Enter your password</Label>
                <Input placeholder="password please" />
            </div>
            <div className="flex flex-col items-start">
                <Label  className="text-left w-full mb-2 p-2 text-light">Municipality code</Label>
                <Input placeholder="municipality code" />
            </div>
            <Button type="submit">Login</Button>
        </div>
    )
}

export default Login;