import React from "react";


const testimonials = [
  { author: "Alex", text: "The fastest messaging app I’ve used. Love it!" },
  { author: "Grace", text: "Private, simple, and clean. 5/5." },
  { author: "Wachira", text: "The app is very easy to use and lightning fast." },
  { author: "Lerato", text: "Why didn't I discover this app earlier?" },
  { author: "Keisha", text: "Very intuitive and minimalistic in a positive way ;-)" },
  { author: "Ben", text: "A truly refreshing and modern experience." },
];

const Testimonials = () => {
  const extendedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">What Our Users Say</h2>

      <div className="testimonial-mask">
        <div className="testimonial-fade-left" />
        <div className="testimonial-fade-right" />

        <div className="testimonial-track">
          {extendedTestimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">“{testimonial.text}”</p>
              <p className="testimonial-author">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Testimonials;
