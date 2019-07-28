const bookStats = (books, categories) => {
  console.log('bookstats called', books)
  let stats = {
    count: 0,
    pages: 0,
    readPages: 0,
    unread: 0,
    started: 0,
    finished: 0,
    categoryCounts: {}
  }
  stats = books.reduce((stats, book) => {
    // adds to the category counters based on the (unique) main categories attached to the book
    let newCatCount = { ...stats.categoryCounts }
    const catArr = book.categories.map(c =>
      c.code.split('.').length > 0 ? c.code.split('.')[0] : c.code)
    const catSet = new Set(catArr)
    for (const cat of catSet) {
      newCatCount = { ...newCatCount, [cat.toString()]: newCatCount[cat.toString()] ? newCatCount[cat.toString()] + 1 : 1 }
    }

    return {
      count: stats.count + 1,
      pages: stats.pages + book.pages,
      readPages: stats.readPages + book.readPages,
      unread: book.readPages === 0 ? stats.unread + 1 : stats.unread,
      started: (book.readPages > 0 && book.readPages < book.pages) ? stats.started + 1 : stats.started,
      finished: book.readPages === book.pages ? stats.finished + 1 : stats.finished,
      categoryCounts: newCatCount
    }
  },
    {
      count: 0,
      pages: 0,
      readPages: 0,
      unread: 0,
      started: 0,
      finished: 0,
      categoryCounts: {}
    }
  )

  // replacing category codes with their names
  const categoryCounts = []
  for (let [key, value] of Object.entries(stats.categoryCounts)) {
    const name = categories.find(c => c.code === key).name
    categoryCounts.push({ name: name, count: value })
  }
  stats.categoryCounts = categoryCounts
  console.log('book stats', stats)
  return stats
}

export { bookStats }