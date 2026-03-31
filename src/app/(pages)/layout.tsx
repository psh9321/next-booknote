interface PAGE_ROOT_LAYOUT extends LAYOUT_CHILD {
    parallel : React.ReactNode,
}

const PageRootLayout = ({ children, parallel }  : PAGE_ROOT_LAYOUT) => {
    return (
        <>
            {children}
            {parallel}
        </>
    )
}

export default PageRootLayout