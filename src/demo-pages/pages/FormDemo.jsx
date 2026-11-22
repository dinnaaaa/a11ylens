
import axe from 'axe-core'

window.axe = axe

function FormDemo() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <main className="container py-5">
      <section className="mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="mb-3">Contact Form Demo</h1>

        <p
          className="mb-4"
          style={{ color: '#a3a3a3' }}
        >
          This demo page is used to test web accessibility.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="full-name" className="form-label">
              Full Name
            </label>

            <input
              id="full-name"
              name="fullName"
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              autoComplete="name"
              required
              aria-required="true"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              autoComplete="email"
              required
              aria-required="true"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>

            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="4"
              placeholder="Write your message"
              required
              aria-required="true"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>
    </main>
  )
}

export default FormDemo
