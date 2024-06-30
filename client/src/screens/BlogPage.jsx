// import { Link } from 'react-router-dom'

import GenreBar from '../components/GenreBar'
import Hero from '../components/Hero'

const BlogPage = () => {
  const mainUrl = import.meta.env.VITE_URL
  return (
    <section className='flex flex-col justify-between gap-12 px-6 pt-5 lg:pt-10 lg:px-20 '>
      {/* Genre Buttons */}
      {/* <GenreBar /> */}
      {/* Hero of Blog page */}
      <Hero
        url={`${mainUrl}/blog/getAllBlogs?limit=5&`}
        type='blog'
      />
    </section>
  )
}

export default BlogPage
