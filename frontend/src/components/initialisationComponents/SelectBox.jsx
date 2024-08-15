import React,{ useState }  from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { applicantsSchemaColumnNames } from './columnNames';

function SelectBox(props) {
    const [selectedValue,setSelectedValue]=useState(props.predictedColumnName);
    const handleChangeSelectedValue=(e)=>{
        setSelectedValue(e.target.value);
        props.changeState(props.uploadedColumnName,e.target.value);
    }
    return (
        <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={selectedValue}
            onChange={handleChangeSelectedValue}
            autoWidth
        >
            {applicantsSchemaColumnNames.map((columnName)=>{
                return(<MenuItem value={columnName}>{columnName}</MenuItem>)
            })}
            <MenuItem value="ignore">ignore</MenuItem>
        </Select>
    );
}

export default SelectBox;