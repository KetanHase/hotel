import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Container, Button, Typography, Modal, Select, MenuItem } from '@mui/material';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AddPro from './AddBook';
import { Book } from '../interfaces/Book';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ViewBookDialog from './ViewBookDialog';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
  

   useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(response => setBooks(response.data))
      .catch(error => console.error("There was an error fetching the books!", error));
  }, []);

const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - books.length) : 0;

const handleOpen = (book?: Partial<Book>) => {
  setSelectedBook(book || null);
  setOpen(true);
};

const handleClose = () => setOpen(false);

const handleViewDialogOpen = (book: Partial<Book>) => {
  setSelectedBook(book);
  setViewDialogOpen(true);
};

const handleViewDialogClose = () => setViewDialogOpen(false);

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`http://localhost:8081/delete/${id}`);
    window.location.reload();  
  } catch (err) {
    console.error('Error deleting the book:', err);
  }
};



const handleChangePage = (
  event: React.MouseEvent<HTMLButtonElement> | null,
  newPage: number,
) => {
  setPage(newPage);
};

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBooks = filterCategory
    ? books.filter(book => book.price_category === filterCategory)
    : books;
  
    const sortedBooks = [...filteredBooks].sort((a, b) => a.price_category.localeCompare(b.price_category));

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Menu</Typography>
        <Button variant="contained" size="small" color="primary" onClick={() => handleOpen()}>
          <ControlPointOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
          Menu
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 4,
              borderRadius: 2,
              boxShadow: 24,
              width: 800,
            }}
          >
            <AddPro book={selectedBook} handleClose={handleClose}  />
          </Box>
        </Modal>
      </Box>

      {/* Filter Dropdown */}
      <Box mb={2} mr={2} display="flex" justifyContent="flex-end">
        <Select
           size="small" 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          sx={{ width: 150 , mr:2}}
        >
          <MenuItem value="">Sort By Price</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>

        
      </Box>


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Stock</TableCell>
              
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? sortedBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedBooks
            ).map((book: any) => (
              <TableRow key={book.id}>
                <TableCell component="th" style={{ width: 160 }} scope="row">
                {book.name} 
                </TableCell>
                <TableCell style={{ width: 100 }}>
                {book.price}
                  </TableCell>
                <TableCell style={{ width: 100 }}>
                {book.author}
                  </TableCell>
                <TableCell style={{ width: 100 }}>
                {book.stock}
                  </TableCell>
                 
                  <TableCell style={{ width: 100,color: book.status === 'Available' ? 'green' : 'red' }}>
                  {book.status}
                  </TableCell>
                <TableCell  >
                <Button variant="outlined" size="small" color="secondary"   onClick={() => handleOpen(book)}
                  sx={{mr:2}}>
                    Update
                  </Button>
                  <Button
                    variant="outlined" color="error" size="small" 
                    onClick={() => handleDelete(book.id)} sx={{mr:2}}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined" color="success" size="small" 
                    onClick={() => handleViewDialogOpen(book)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {open && (
                <AddPro book={selectedBook} handleClose={handleClose} />
               )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25,50,100, { label: 'All', value: -1 }]}
                colSpan={6}
                count={books.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <ViewBookDialog open={viewDialogOpen} book={selectedBook} onClose={handleViewDialogClose} />
    </Container>
  );
}


export default BookList;