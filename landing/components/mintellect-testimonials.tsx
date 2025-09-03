import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function MintellectTestimonials() {
  const testimonials = [
    {
      quote:
        "Mintellect's peer review system has revolutionized how we verify research. The OCI badges provide clear recognition for quality work, and the decentralized approach ensures transparency.",
      name: "Dr. Sarah Chen",
      designation: "Research Director at Stanford University",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The plagiarism detection and citation verification features are game-changers. Our research integrity has improved significantly since implementing Mintellect's verification system.",
      name: "Prof. Michael Rodriguez",
      designation: "Head of Research at MIT",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Mintellect's workflow automation has streamlined our research process. The AI systems handle routine verification tasks, allowing our team to focus on breakthrough discoveries.",
      name: "Dr. Emily Watson",
      designation: "Chief Scientist at DeepMind",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The decentralized peer review model ensures unbiased evaluation. As a reviewer, I appreciate the fair compensation through OCI tokens and the transparent review process.",
      name: "Dr. James Kim",
      designation: "Senior Researcher at Google AI",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Mintellect has created a trusted ecosystem where researchers can confidently share their work. The verification standards are rigorous yet fair, building genuine trust in academic publishing.",
      name: "Dr. Lisa Thompson",
      designation: "Editor-in-Chief at Nature Research",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}
