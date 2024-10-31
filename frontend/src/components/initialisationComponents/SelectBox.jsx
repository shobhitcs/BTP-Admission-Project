import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import { applicantsSchemaColumnNames } from './columnNames';

function SelectBox(props) {
    const [selectedValue, setSelectedValue] = useState(props.predictedColumnName);
    const handleChangeSelectedValue = (e) => {
        setSelectedValue(e.target.value);
        props.changeState(props.uploadedColumnName, e.target.value);
    }
    return (
        <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={selectedValue}
            onChange={handleChangeSelectedValue}
            fullWidth
            sx={{ fontWeight: '600', fontFamily: 'Maven Pro, sans serif' }}
        >
            <MenuItem value="ignore" sx={{ backgroundColor: '#F05A7E', fontWeight: '600', fontFamily: 'Maven Pro, sans serif' }}>ignore</MenuItem>
            {props.options.map((columnName) => {
                return (<MenuItem value={columnName} sx={{ fontWeight: '400', fontFamily: 'Maven Pro, sans serif' }} key={columnName}>
                    {columnName}
                </MenuItem>)
            })}
        </Select>
    );
}

export default SelectBox;