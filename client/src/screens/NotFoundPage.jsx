const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen p-6 text-center bg-gray-100'>
      <h1 className='text-6xl font-bold text-gray-800'>404</h1>
      <h2 className='mt-2 text-2xl font-semibold text-gray-600'>
        Page Not Found
      </h2>
      <p className='mt-4 text-gray-500'>
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => router.push('/')}
        className='px-6 py-3 mt-6 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700'
      >
        Go Back Home
      </button>
    </div>
  )
}

export default NotFoundPage
