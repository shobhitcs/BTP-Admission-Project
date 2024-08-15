import React from 'react';
import FilteredCandidatesTableRow from './FilteredCandidatesTableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import noresults from "../../images/noresults.jpg"
function FilteredCandidatesTable(props) {
    return (
        <div className='mt-[50px] w-full flex justify-center'>
            {props.data.length!==0 && 
            <TableContainer component={Paper} sx={{ width: "90%" }}>
                <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead className='bg-[#1B3058] '>
                    <TableRow>
                        <TableCell align="center" style={{color:'white'}}>COAP ID</TableCell>
                        <TableCell align="center" style={{color:'white'}}>Application Number</TableCell>
                        <TableCell align="center" style={{color:'white'}}>Category</TableCell>
                        <TableCell align="center" style={{color:'white'}}>Gender</TableCell>
                        <TableCell align="center" style={{color:'white'}}>Max Gate Score</TableCell>
                        <TableCell align="center" style={{color:'white'}}>PWD</TableCell>
                        <TableCell align="center" style={{color:'white'}}>EWS</TableCell>
                        <TableCell align="center" style={{color:'white'}}>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map(({category,gender,coap,ews,pwd,maxgatescore,appno})=>{
                        return (
                            <FilteredCandidatesTableRow category={category} gender={gender} coap={coap} ews={ews} pwd={pwd} appno={appno} maxgatescore={maxgatescore}/>
                        )
                    })}
                </TableBody>

                </Table>
            </TableContainer>
            }
            {props.data.length===0 &&
                <div className='w-full flex flex-col justify-center items-center'>
                    <img src={noresults} alt='error' className='w-[100px] height-[100px]'></img>
                    <p className='text-2xl text-gray-800'>No Results Found</p>
                </div>
            }
        </div>
    );
}

export default FilteredCandidatesTable;