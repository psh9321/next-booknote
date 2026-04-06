export const dynamic = 'force-dynamic';

import { BookInfoServerWidget } from "@/widgets/book-info/BookInfoServerWidget";

const BookInfoParallelPageServer = async ({ params } : BOOK_INFO_PAGE_PARAMS) => <BookInfoServerWidget params={params} />

export default BookInfoParallelPageServer