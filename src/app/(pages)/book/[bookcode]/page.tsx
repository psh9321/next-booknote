import { BookInfoServerWidget } from "@/widgets/book-info/BookInfoServerWidget";

const BookInfoPageServer = async ({ params } : BOOK_INFO_PAGE_PARAMS) => <BookInfoServerWidget params={params} />

export default BookInfoPageServer