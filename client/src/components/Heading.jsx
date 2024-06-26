const Heading = () => {
  const date = new Date()

  const greeting = () => {
    const hours = date.getHours()
    const minutes = date.getMinutes()

    if (hours >= 0 && hours < 12) {
      if (hours < 11 || (hours === 11 && minutes < 30)) {
        return 'Good Morning!'
      } else {
        return 'Almost Noon!'
      }
    } else if (hours >= 12 && hours < 18) {
      if (hours < 17 || (hours === 17 && minutes < 30)) {
        return 'Good Afternoon!'
      } else {
        return 'Almost Evening!'
      }
    } else if (hours >= 18 && hours < 21) {
      if (hours < 20 || (hours === 20 && minutes < 30)) {
        return 'Good Evening!'
      } else {
        return 'Almost Night!'
      }
    } else {
      return 'Good Night!'
    }
  }

  const dateValue =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    '/' +
    date.getFullYear()

  return (
    <section className='flex flex-col justify-between w-full gap-4 lg:items-center lg:flex-row lg:gap-0 '>
      <div className='flex flex-col'>
        <h3 className='text-base opacity-50'>{dateValue}</h3>
        <h2 className='text-2xl font-semibold '>{greeting()}</h2>
      </div>
      {/* <div className='flex overflow-x-scroll scrollbar-hide '>
        <StockBox />
        <StockBox />
        <StockBox />
        <StockBox />
      </div> */}
    </section>
  )
}

export default Heading
