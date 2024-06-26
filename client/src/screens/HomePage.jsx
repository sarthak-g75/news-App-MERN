import GenreBar from '../components/GenreBar'
import Heading from '../components/Heading'
import Hero from '../components/Hero'
const NewsPage = () => {
  return (
    <section className='flex flex-col justify-between gap-4 px-6 pt-5 lg:pt-10 lg:px-20 '>
      {/* Genre Buttons */}
      {/* <GenreBar /> */}
      {/* Heading */}
      <Heading />
      {/* Hero section */}
      <Hero
        type='news'
        url={'http://localhost:5000/api/news/getNews?limit=5&'}
      />
    </section>
  )
}

export default NewsPage
