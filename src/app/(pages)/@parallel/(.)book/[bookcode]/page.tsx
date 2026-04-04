import { BookInfoServerWidget } from "@/widgets/BookInfoServerWidget";

const BookInfoParallelPageServer = async ({ params } : BOOK_INFO_PAGE_PARAMS) => <BookInfoServerWidget params={params} />

export default BookInfoParallelPageServer