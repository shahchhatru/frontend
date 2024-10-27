import Select from 'react-select';
import { Option } from '@/types/SelectWardOptions';
import { useState } from 'react';


interface SelectWardsProps {
  options: Option[];
}

const SelectRoles = ({ options }: SelectWardsProps) => {  
  const [value, setValue] = useState<Option | null>(null);

  const handleChange = (selectedOption: Option | null) => {
    setValue(selectedOption);
    console.log(value);
  };

  return (
    <div className="w-full">
      <Select 
        options={options} 
        value={value} 
        onChange={handleChange} 
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />
    </div>
  );
}

export default SelectRoles;
