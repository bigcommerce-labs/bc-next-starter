
export default function PageContent({
  page,
}) {
  return (
    <div className="container px-6 mx-auto text-gray-800 w-4/5">
      <div
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  )
}
