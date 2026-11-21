
function PagePlaceholder({ title, description }) {
  return (
    <main className="container py-5">
      <h1 className="fw-bold mb-3">{title}</h1>

      <p className="text-secondary">
        {description}
      </p>
    </main>
  )
}

export default PagePlaceholder
