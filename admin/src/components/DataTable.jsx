import React from 'react'

const DataTable = ({
  data,
  loading,
  page,
  handleNextPage,
  handlePreviousPage,
  handleEdit,
  handleDelete,
  hasMore,
}) => {
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='container w-full p-4 mx-auto'>
      <h1 className='mb-4 text-2xl font-bold text-center'>Table</h1>
      <div className='overflow-x-auto lg:overflow-x-visible'>
        <table className='w-full min-w-full bg-white'>
          <thead>
            <tr>
              <th className='px-4 py-2 text-left border-b'>Image</th>
              <th className='px-4 py-2 text-left border-b'>Title</th>
              <th className='px-4 py-2 text-left border-b'>Author</th>
              <th className='px-4 py-2 text-left border-b'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.data._id}>
                <td className='px-4 py-2 border-b'>
                  <img
                    src={item.data.imageUrl[0]}
                    alt='News'
                    className='object-cover w-20 h-20'
                  />
                </td>
                <td className='px-4 py-2 border-b'>
                  {item.data.title.length > 50
                    ? `${item.data.title.slice(0, 50)} ...`
                    : item.data.title}
                </td>
                <td className='px-4 py-2 border-b'>{item.user.name}</td>
                <td className='px-4 py-2 border-b'>
                  <button
                    className='px-2 py-1 mr-2 text-white bg-green-500 rounded'
                    onClick={() => handleEdit(item.data._id)}
                  >
                    Edit
                  </button>
                  <button
                    className='px-2 py-1 text-white bg-red-500 rounded'
                    onClick={() =>
                      handleDelete(item.data._id, item.data.imageUrl)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between mt-4'>
        <button
          className='px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50'
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className='px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50'
          onClick={handleNextPage}
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default DataTable
