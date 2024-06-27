const EditContent = () => {
  return (
    <div className='flex flex-col gap-10 px-4 pt-10'>
      <h1 className='text-3xl font-bold'>Submit Form</h1>
      <FileUploader
        onFileChange={handleFileChange}
        reset={false}
      />
      <div className='flex flex-wrap gap-4 mt-6'>
        {formData.imageUrl.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Uploaded Image ${index}`}
            className='object-cover w-32 h-32 border border-gray-300 rounded'
          />
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center lg:w-[50%] gap-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white'
      >
        {formFields.map((elem) => (
          <div
            key={elem.name}
            className='flex flex-col gap-2'
          >
            <label
              htmlFor={elem.name}
              className='font-semibold'
            >
              {elem.label}
            </label>
            {elem.name !== 'news' && elem.name !== 'description' ? (
              <input
                className='p-2 border border-gray-300 rounded'
                name={elem.name}
                onChange={handleChange}
                type='text'
                value={formData[elem.name]}
                placeholder={elem.placeholder}
              />
            ) : (
              <TextEditor change={handleDescChange} />
            )}
          </div>
        ))}

        <button
          type='submit'
          className='px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default EditContent
