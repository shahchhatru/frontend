export type Option = {
    value: string;
    label: string;
}


const options: Option[] = [
    { value: 'nagarpalika', label: 'nagarpalika' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },

]

const municipalrolesOptions: Option[] = [
    { value: "projectViewer", label: "projectViewer" },


    {
        label: "projectEntry",

        value: "projectEntry",
    },
    {
        label: "projectVerifier",

        value: "projectVerifier",
    },
    {
        label: "projectApprover",

        value: "projectApprover",
    },
    {
        label: "projectEvaluator",

        value: "projectEvaluator",
    },
    {
        label: "admin",

        value: "admin",
    },
]

const wardrolesoption:Option[]=[
        {
            label: "projectEntry",
    
            value: "projectEntry",
        },
        {
            label: "projectViewer",
    
            value: "projectViewer",
        },
    
]

export { options, municipalrolesOptions,wardrolesoption }