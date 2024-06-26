import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { genreAtom } from '../recoil/atoms/genreAtom'
const data = [
  'Home',
  'Sports',
  'Science',
  'Opinion',
  'Investigative',
  'Celebrity',
]

const GenreBar = () => {
  const [selected, setSelected] = useState(0)
  const setGenre = useSetRecoilState(genreAtom)

  const handleClick = (index, elem) => {
    setSelected(index)
    setGenre(elem)
  }

  return (
    <div className='flex w-full gap-2 overflow-x-scroll lg:gap-4 scrollbar-hide '>
      {data.map((elem, i) => {
        return (
          <div
            className={`lg:px-4 px-2 py-1 rounded-full cursor-pointer text-sm lg:text-base ${
              selected === i
                ? 'bg-primary bg-opacity-15 text-primary font-semibold'
                : 'opacity-50'
            }`}
            key={i}
            onClick={() => handleClick(i, elem)}
          >
            {elem}
          </div>
        )
      })}
    </div>
  )
}

export default GenreBar
