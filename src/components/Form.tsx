import SelectRoles from "./SelectRoles";
import SelectWards from "./SelectWards";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { options,municipalrolesOptions,wardrolesoption } from "@/types/SelectWardOptions";


const AddUserForm = ()=>{
    return(
        <div className="w-4/5 grid grid-cols-2 gap-2">
           
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light capitalize">username</Label>
                <Input placeholder="Enter username" />
            </div>
            <div className="flex flex-col items-start">
            <Label className="text-left w-full mb-2 p-2 text-light capitalize">email</Label>
            <Input placeholder="Enter username" />
            </div>
            <div className="flex flex-col items-start">
            <Label className="text-left w-full mb-2 p-2 text-light capitalize">Ward No</Label>
            <SelectWards options={options} />
            </div>
            <div className="flex flex-col items-start">
            <Label className="text-left w-full mb-2 p-2 text-light capitalize">Roles</Label>
            <SelectRoles options={false?municipalrolesOptions:wardrolesoption} />
            </div>
        </div>
    )
}

export default AddUserForm;