import React from 'react';
import FilteredCandidatesTableRow from './FilteredCandidatesTableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import noresults from "../../images/noresults.jpg";

function FilteredCandidatesTable({ data }) {
  return (
    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {data.length !== 0 ? (
        <TableContainer component={Paper} sx={{ width: '90%', maxWidth: '1200px' }}>
          <Table aria-label="candidates table">
            <TableHead sx={{ backgroundColor: '#1B3058' }}>
              <TableRow>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>COAP ID</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Application Number</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Gender</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Max Gate Score</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>PWD</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>EWS</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <FilteredCandidatesTableRow key={row.coap} {...row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={noresults} alt="No Results" style={{ width: '100px', height: '100px' }} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary', fontFamily: 'Ubuntu,  sans serif' }}>No Results Found</Typography>
        </Box>
      )}
    </Box>
  );
}

export default FilteredCandidatesTable;
