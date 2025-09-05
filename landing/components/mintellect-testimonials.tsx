import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function MintellectTestimonials() {
  const testimonials = [
    {
      quote:
        "Mintellect has a lot of potential to grow, as it operates in the niche yet essential and ever-growing domain of Blockchain and AI research. In today's world, where data is abundant, its core purpose is to empower people to conduct meaningful research. Once that happens, Mintellect will truly shine. Their focus on self-research, community support, and real incentives is just the cherry on top.",
      name: "Shibam Mandal",
      designation: "Research Undergrad at Sister Nivedita University",
      src: "https://ik.imagekit.io/0whwkbkhd/Generated%20Image%20September%2005,%202025%20-%206_40PM.jpeg?updatedAt=1757077841678",
    },
    {
      quote:
        "Mintellect is a truly impactful project with immense potential. In the future, I see its community element growing stronger and creating a collaborative space for knowledge exchange. Most importantly, it will inspire undergraduate researchers who may lack opportunities or motivation to pursue meaningful research. By bringing in fresh talent and fostering curiosity, Mintellect can make research a top priority for students alongside industry opportunities.",
      name: "Soumedhik Bharati",
      designation: "R&D Developer and ML Engineer at Strategic Intelligence Firm | Research Fellow at IIT Kharagpur",
      src: "https://ik.imagekit.io/0whwkbkhd/Generated%20Image%20September%2005,%202025%20-%207_04PM.jpeg?updatedAt=1757079424023",
    },
    {
      quote:
        "Mintellect is creating a trusted ecosystem where researchers can confidently share their work. The verification standards are rigorous yet fair, building genuine trust in academic publishing.",
      name: "Abhirup Banerjee",
      designation: "Founder at Axicov | Solana Researcher",
      src: "https://ik.imagekit.io/0whwkbkhd/WhatsApp%20Image%202025-08-10%20at%2017.59.20_f81710db.jpg?updatedAt=1757083050528",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}
