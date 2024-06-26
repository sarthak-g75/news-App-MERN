import { Link } from 'react-router-dom'
import AuthorBar, { AuthorBarBig } from './AuthorBar'
import { useFetchAll } from '../hooks/usefetchAllData'
import { convert } from 'html-to-text'
import SearchBar from './SearchBar'

const Hero = ({ url, type }) => {
  const { loading, data, setSearchQuery } = useFetchAll(url)

  const truncateHtml = (html, length) => {
    const text = convert(html, { wordwrap: false })
    const truncatedText =
      text.length > length ? text.slice(0, length) + '...' : text
    return truncatedText
  }

  const getContent = (elem) => {
    if (type === 'blog') {
      return elem.data.description
    } else if (type === 'news') {
      return elem.data.news
    }
    return ''
  }

  return (
    <section className='flex flex-col items-center w-full h-full gap-4 pb-6'>
      <SearchBar
        onSearch={setSearchQuery}
        name={type}
      />
      {/* mobile */}
      {data.length > 0 ? (
        <div className='flex flex-col w-full gap-12 lg:hidden'>
          {data.map((elem) => (
            <div
              className='flex flex-col items-start justify-center gap-2'
              key={elem.data._id}
            >
              <img
                className='object-cover w-full h-64 rounded-xl'
                src={elem.data.imageUrl[0]}
                alt='news img'
              />
              <h2 className='text-3xl font-semibold'>{elem.data.title}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: truncateHtml(getContent(elem), 50),
                }}
              />
              <div className='flex justify-between w-full pt-4'>
                <div className='flex items-center gap-2'>
                  <img
                    className='object-cover w-8 h-8 rounded-full'
                    src={elem.user.pfp}
                    alt=''
                  />
                  <h3 className='text-sm font-medium opacity-60'>
                    {elem.user.name}
                  </h3>
                </div>
                <Link
                  className='flex items-center gap-3 px-6 text-base text-white rounded-full lg:py-2 lg:text-md bg-primary opacity-80 hover:opacity-100 lg:font-medium '
                  to={`/news/${elem.data._id}`}
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className=' lg:hidden'>loading</h1>
      )}
      {/* desktop */}
      {data.length > 0 ? (
        <div className='flex-col hidden w-full gap-16 lg:flex'>
          <div className='flex w-full h-full gap-6'>
            <div className='w-2/3 h-full'>
              <img
                className='object-cover w-full h-96 rounded-xl'
                src={data[0].data.imageUrl[0]}
                alt='news image'
              />
              <div className='flex flex-col gap-2 pt-4'>
                <h1 className='text-3xl font-semibold'>{data[0].data.title}</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: truncateHtml(getContent(data[0]), 50),
                  }}
                />
                <div className='flex items-center justify-between gap-2'>
                  <AuthorBarBig
                    image={data[0].user.pfp}
                    author={data[0].user.name}
                  />
                  <Link
                    className='flex items-center gap-3 px-6 text-base text-white rounded-full lg:py-2 lg:text-md bg-primary opacity-80 hover:opacity-100 lg:font-medium '
                    to={`/news/${data[0].data._id}`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-between w-1/2 gap-4 h-96 '>
              {data.slice(1).map(
                (elem, index) =>
                  index < 3 && (
                    <div
                      className='flex gap-6 '
                      key={elem.data._id}
                    >
                      <img
                        className='object-cover w-40 h-28 rounded-xl'
                        src={elem.data.imageUrl[0]}
                        alt='News Photo'
                      />
                      <div className='flex flex-col justify-between w-full'>
                        <h2 className='text-xl font-semibold'>
                          {elem.data.title}
                        </h2>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncateHtml(getContent(elem), 50),
                          }}
                        />
                        <div className='flex items-center justify-between w-full '>
                          <AuthorBar
                            image={elem.user.pfp}
                            author={elem.user.name}
                          />
                          <Link
                            className='flex items-center gap-3 px-4 py-1 text-base text-white rounded-full lg:text-base bg-primary opacity-80 hover:opacity-100 lg:font-medium '
                            to={`/news/${elem.data._id}`}
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          <div className='grid-cols-1 gap-6 lg:grid lg:grid-cols-3'>
            {data.slice(4).map((elem) => (
              <div
                key={elem.data._id}
                className='flex flex-col'
              >
                <div className='p-4 bg-white rounded-lg shadow-md'>
                  <img
                    className='object-cover w-full h-40 rounded-t-lg'
                    src={elem.data.imageUrl[0]}
                    alt='News Image'
                  />
                  <div className='flex flex-col justify-between flex-grow mt-4'>
                    <h2 className='text-lg font-semibold'>{elem.data.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: truncateHtml(getContent(elem), 50),
                      }}
                    />
                    <div className='flex items-center justify-between mt-2'>
                      <AuthorBarBig
                        image={elem.user.pfp}
                        author={elem.user.name}
                      />
                      <Link
                        className='flex items-center gap-3 px-4 py-1 text-base text-white rounded-full lg:text-base bg-primary opacity-80 hover:opacity-100 lg:font-medium '
                        to={`/news/${elem.data._id}`}
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </section>
  )
}

export default Hero
