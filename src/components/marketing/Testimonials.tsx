
export function Testimonials() {
  const testimonials = [
    {
      quote: "Pula Pay has completely changed how I manage my finances. Sending money to my family in Maun is now instant and costs much less than before.",
      author: "Mpho Kgosi",
      role: "Teacher, Gaborone"
    },
    {
      quote: "As a small business owner, Pula Pay helps me receive payments from customers quickly and easily. The dashboard makes tracking all transactions simple.",
      author: "Tebogo Molosiwa",
      role: "Shop Owner, Francistown"
    },
    {
      quote: "No more standing in line to pay bills! I can pay my BPC and water bills right from my phone in seconds with Pula Pay.",
      author: "Grace Selelo",
      role: "Nurse, Mahalapye"
    }
  ];
  
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Loved Across Botswana</h2>
          <p className="mt-4 text-gray-500 md:text-xl">
            Join thousands of satisfied customers using Pula Pay every day.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <blockquote 
              key={index}
              className="rounded-xl border bg-white p-6 shadow"
            >
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <svg
                    className="absolute -left-2 -top-2 h-8 w-8 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  <p className="text-base/relaxed text-gray-600 z-10 relative">
                    {testimonial.quote}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
