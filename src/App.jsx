
import {useState, useEffect} from 'react'
import './App.css'

const initialBooks = [
  {
    id: 1,
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    genre: 'Biography',
    status: 'Read',
    image: 'https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg',
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    status: 'Unread',
    image: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-help',
    status: 'Read',
    image: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  },
  {
    id: 4,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Technology',
    status: 'Unread',
    image: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
  },
  {
    id: 5,
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    genre: 'Science',
    status: 'Read',
    image: 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg',
  },
]

const App = () => {
  // Book list state
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books')
    return savedBooks ? JSON.parse(savedBooks) : initialBooks
  })

  // Form states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [status, setStatus] = useState('Unread')
  const [image, setImage] = useState('')

  // Search and filter states
  const [searchInput, setSearchInput] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Edit state
  const [editId, setEditId] = useState(null)

  // Save books to localStorage
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books))
  }, [books])

  // Add and update book
  const handleSubmit = event => {
    event.preventDefault()

    if (
      title.trim() === '' ||
      author.trim() === '' ||
      genre === ''
    ) {
      alert('Please fill all the fields')
      return
    }

    if (editId !== null) {
      const updatedBooks = books.map(book => {
        if (book.id === editId) {
          return {
            ...book,
            title: title.trim(),
            author: author.trim(),
            genre,
            status,
            image,
          }
        }
        return book
      })
      
      setBooks(updatedBooks)
      setEditId(null)
    } else {
      const newBook = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        genre,
        status,
        image,
      }

      setBooks([...books, newBook])
    }

    clearForm()
  }

  // Clear form
  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setGenre('')
    setStatus('Unread')
    setImage('')
    setEditId(null)
  }

  // Edit book
  const handleEdit = book => {
    setTitle(book.title)
    setAuthor(book.author)
    setGenre(book.genre)
    setStatus(book.status)
    setImage(book.image || '')
    setEditId(book.id)
  }

  // Delete book
  const handleDelete = id => {
    const updatedBooks = books.filter(book => book.id !== id)
    setBooks(updatedBooks)

    if (editId === id) {
      clearForm()
    }
  }

  // Search and filter
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      book.author.toLowerCase().includes(searchInput.toLowerCase())

    const matchesGenre =
      genreFilter === 'All' || book.genre === genreFilter

    const matchesStatus =
      statusFilter === 'All' || book.status === statusFilter

    return matchesSearch && matchesGenre && matchesStatus
  })

  // Read and unread counts
  const readCount = books.filter(
    book => book.status === 'Read',
  ).length

  const unreadCount = books.filter(
    book => book.status === 'Unread',
  ).length

  return (
    <div className="app-container">

      {/* Header */}
      <header className="header">
        <h1>📚 Book Library</h1>
        <p>Manage Your Personal Book Collection</p>
      </header>

      {/* Book Counts */}
      <div className="count-container">
        <div className="count-card read-card">
          <h2>Books Read</h2>
          <h1>{readCount}</h1>
        </div>

        <div className="count-card unread-card">
          <h2>Books Unread</h2>
          <h1>{unreadCount}</h1>
        </div>
      </div>

      {/* Add and Edit Form */}
      <form className="book-form" onSubmit={handleSubmit}>
        <h2>
          {editId !== null ? 'Edit Book' : 'Add New Book'}
        </h2>

        <input
          type="text"
          placeholder="Enter Book Title"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Author Name"
          value={author}
          onChange={event => setAuthor(event.target.value)}
        />

        <select
          value={genre}
          onChange={event => setGenre(event.target.value)}
        >
          <option value="">Select Genre</option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Technology">Technology</option>
          <option value="Biography">Biography</option>
          <option value="Self-help">Self-help</option>
        </select>

        <select
          value={status}
          onChange={event => setStatus(event.target.value)}
        >
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>

        {/* New Book Image URL Field */}
        <input
          type="url"
          placeholder="Enter Book Cover Image URL"
          value={image}
          onChange={event => setImage(event.target.value)}
        />

        <button type="submit" className="add-button">
          {editId !== null ? 'Update Book' : '+ Add Book'}
        </button>

        {editId !== null && (
          <button
            type="button"
            className="cancel-button"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Search and Filters */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
        />

        <select
          value={genreFilter}
          onChange={event => setGenreFilter(event.target.value)}
        >
          <option value="All">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Technology">Technology</option>
          <option value="Biography">Biography</option>
          <option value="Self-help">Self-help</option>
        </select>

        <select
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Read">Read</option>
          <option value="Unread">Unread</option>
        </select>
      </div>

      {/* Books List */}
      <h2 className="list-heading">
        My Books ({filteredBooks.length})
      </h2>

      <div className="book-list">
        {filteredBooks.length === 0 ? (
          <p className="empty-message">
            No books found!
          </p>
        ) : (
          filteredBooks.map(book => (
            <div className="book-card" key={book.id}>

              {/* Book Cover Image */}
              <img
                src={
                  book.image ||
                  'https://placehold.co/200x280?text=No+Cover'
                }
                alt={book.title}
                className="book-image"
                onError={event => {
                  event.target.src =
                    'https://placehold.co/200x280?text=No+Cover'
                }}
              />

              <h3>{book.title}</h3>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Genre:</strong> {book.genre}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    book.status === 'Read' ? 'read' : 'unread'
                  }
                >
                  {book.status}
                </span>
              </p>

              <div className="button-container">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
