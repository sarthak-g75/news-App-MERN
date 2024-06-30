import React from 'react'
import AuthorBar, { AuthorBarBig } from '../components/AuthorBar'
import { FaShareAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useFetchSingle } from '../hooks/usefetchSingleData'

const Blog = () => {
  const mainUrl = import.meta.VITE_URL
  const date = new Date()
  const dateValue =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    '/' +
    date.getFullYear()
  // console.log(date.getMonth() + 1)
  const { id } = useParams()
  const { loading, data } = useFetchSingle(`${mainUrl}/blog/getBlog/${id}`)
  console.log(loading, data)

  if (loading) {
    return <h1>Loading</h1>
  } else {
    return (
      <section className='flex flex-col-reverse w-full gap-2 px-2 pt-10 lg:flex-row'>
        <div className='flex flex-col gap-4 pb-4 lg:w-5/6'>
          <div className='relative'>
            <img
              className='h-[50vh] w-full object-cover rounded-xl'
              src={data.data.imageUrl[0]}
              alt='blog img'
            />
            <h1 className='absolute w-1/2 px-2 py-2 text-lg font-bold text-center whitespace-normal transform -translate-x-1/2 bg-white lg:text-2xl lg:-bottom-2 -bottom-10 left-1/2 rounded-xl'>
              {data.data.title}
            </h1>
            <h2 className='absolute px-4 py-1 text-sm font-medium text-white -bottom-2 -right-2 bg-primary rounded-2xl'>
              {data.data.genre}
            </h2>
          </div>
          <div className='flex flex-col gap-8 px-4'>
            <div className='flex items-center justify-between'>
              <div className='hidden lg:block'>
                <AuthorBarBig
                  image={data.user.pfp}
                  author={data.user.name}
                />
              </div>
              <div className='block lg:hidden'>
                <AuthorBar
                  image={data.user.pfp}
                  author={data.user.name}
                />
              </div>
              <div className='flex items-center gap-4'>
                <h2 className='text-sm font-medium lg:text-base opacity-45'>
                  {dateValue}
                </h2>
                <FaShareAlt className='text-xl cursor-pointer opacity-70' />
              </div>
            </div>
            <div
              className='pb-4 pl-8 border-l-2 border-black'
              dangerouslySetInnerHTML={{ __html: data.data.description }}
            />
          </div>
        </div>
        <div className='bg-gray-300 h-[15vh] lg:h-auto lg:w-1/6'></div>
      </section>
    )
  }
}

export default Blog
