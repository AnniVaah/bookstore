import { useState, useEffect } from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddBook from './AddBook';

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    {field: 'title', sortable:true, filter:true},
    {field: 'author', sortable:true, filter:true},
    {field: 'year', sortable:true, filter:true},
    {field: 'isbn', sortable:true, filter:true},
    {field: 'price', sortable:true, filter:true},
    {
      headerName:'', 
      field:'id', 
      //width:50, 
      cellRenderer: params =>
      <button onClick={() => deleteBook(params.value)} size="small" color="error">
      Delete
      </button>
    }
  ]
  
  useEffect(()=> {
    fetchBooks();
  },[])

  const fetchBooks = () => {
    fetch('https://bookstore-3a62c-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-3a62c-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method:'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-3a62c-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response =>fetchBooks())
    .catch(err => console.error(err))
  }
  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5'>
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook}/>
      <div className="ag-theme-material" style={{height: 400, width: 1150}}>
      <AgGridReact
        rowData={books}
        columnDefs={columnDefs}/>
      </div>
    </div>
  )
}

export default App
