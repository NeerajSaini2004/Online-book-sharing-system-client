// Google Books API utility
export const fetchBookImages = async (bookName) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}`);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const book = data.items[0].volumeInfo;
      const imageLinks = book.imageLinks;
      
      if (imageLinks) {
        // Get only the best quality image (fixed)
        const bestImage = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
        return bestImage ? [bestImage.replace('http:', 'https:')] : [];
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching book images:', error);
    return [];
  }
};