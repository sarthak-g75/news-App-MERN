import React from 'react'

const AuthorBar = ({ image, author }) => {
  return (
    <div className='flex items-center gap-2'>
      <img
        className='object-cover w-6 h-6 rounded-full'
        src={image}
        alt=''
      />
      <h2 className='text-sm font-medium opacity-60'>{author}</h2>
    </div>
  )
}
export const AuthorBarBig = ({ image, author }) => {
  return (
    <div className='flex items-center gap-2'>
      <img
        className='object-cover w-8 h-8 rounded-full'
        src={image}
        alt=''
      />
      <h2 className='text-base font-medium opacity-60'>{author}</h2>
    </div>
  )
}

export default AuthorBar
