import React from "react";
import { BookUser } from "lucide-react";

// Define the type for each testimonial card
interface Card {
  image: string;
  name: string;
  handle: string;
  testimonial: string;
}

// Type for CreateCard props
interface CreateCardProps {
  card: Card;
}

// Title Component
const Title: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="text-center max-w-3xl mx-auto mt-6 mb-8">
    <h2 className="text-3xl font-bold mb-3">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Testimonial: React.FC = () => {
const cardsData: Card[] = [
    {
      image: "/assets/img/testimonials-1.png",
      name: "Priya Sharma",
      handle: "Marketing Specialist",
      testimonial: "The resume was perfect and matched my style. The LinkedIn update worked quickly—got positive responses fast. Truly grateful to Career Blueprint!"
    },
    {
      image: "/assets/img/testimonials-2.png",
      name: "Aarav Patel",
      handle: "Software Engineer",
      testimonial: "The resume was professional and effective. Thanks to Career Blueprint, I landed a job at Hexaware Technologies. Truly grateful for their support!"
    },
    {
      image: "/assets/img/testimonials-3.png",
      name: "Aisha Kapoor",
      handle: "Graphic Designer",
      testimonial: "Career Blueprint updated my resume perfectly. Professional and communicative, it boosted my responses fast. LinkedIn and cover letter services were also great!"
    },
    {
      image: "/assets/img/testimonials-4.jpg",
      name: "Riya Nair",
      handle: "Content Writer",
      testimonial: "My experience with Career Blueprint was excellent. They handled everything professionally and delivered great results. Truly happy with their services!"
    },
    {
      image: "/assets/img/testimonials-5.png",
      name: "Karan Mehta",
      handle: "Business Analyst",
      testimonial: "Career Blueprint crafted a resume that truly stood out. I received interview calls within a week. Their attention to detail and quick turnaround impressed me a lot!"
    },
    {
      image: "/assets/img/testimonials-6.jpg",
      name: "Sneha Reddy",
      handle: "HR Executive",
      testimonial: "Fantastic service from Career Blueprint! My resume looked polished and professional. The cover letter they wrote helped me land my dream job at a top MNC."
    },
    {
      image: "/assets/img/testimonials-7.jpg",
      name: "Vikram Joshi",
      handle: "Data Analyst",
      testimonial: "I was struggling to get callbacks until Career Blueprint revamped my resume. The ATS-friendly format made a huge difference and interviews started coming in fast!"
    },
    {
      image: "/assets/img/testimonials-8.jpg",
      name: "Ananya Singh",
      handle: "Product Manager",
      testimonial: "Career Blueprint transformed my resume completely. The LinkedIn optimization was spot on and I got recruiter messages almost immediately. Highly recommend their services!"
    },
    {
      image: "/assets/img/testimonials-9.jpg",
      name: "Rohit Verma",
      handle: "Financial Analyst",
      testimonial: "Outstanding work by Career Blueprint. They understood my career goals and built a resume that reflected my strengths perfectly. Got placed within two weeks of applying!"
    },
    {
      image: "/assets/img/testimonials-10.jpg",
      name: "Divya Menon",
      handle: "UI/UX Designer",
      testimonial: "Career Blueprint gave my resume a complete makeover. The design was clean and the content was sharp. I got shortlisted by three companies in just ten days!"
    },
  ];
  // Card component
const CreateCard: React.FC<CreateCardProps> = ({ card }) => (
    <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white">
      <div className="flex gap-2">
        <img className="size-11 rounded-full object-cover object-center" src={card.image} alt="User Image" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold">{card.name}</p>
            <svg
              className="mt-0.5 fill-green-500"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>
      <p className="text-sm py-4 text-gray-800">
        {card.testimonial}
      </p>
    </div>
  );

  return (
    <>
      <div id="testimonials" className="flex flex-col items-center my-5 scroll-mt-7">
        {/* Updated button colors */}
        <div
          className="flex items-center gap-2 text-sm font-bold rounded-full px-6 py-1.5"
          style={{ backgroundColor: "rgb(237, 201, 175)", color: "rgb(44, 42, 99)" }}
        >
          <BookUser className="size-5" style={{ stroke: "rgb(44, 42, 99)" }} />
          <span>Testimonials</span>
        </div>

        <Title
          title="Don't just take our words"
          description="Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review."
        />
      </div>

  <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-3 pb-3">
          {[...cardsData.slice(0, 5), ...cardsData.slice(0, 5)].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData.slice(5, 10), ...cardsData.slice(5, 10)].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </>
  );
};

export default Testimonial;