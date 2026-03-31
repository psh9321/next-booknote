import { BookInfoPrefetch } from "@/widgets/BookInfoPrefetch"

const BookInfoParallelPageServer = ({ params } : BOOK_INFO_PAGE_PARAMS) => <BookInfoPrefetch params={params} />;

export default BookInfoParallelPageServer