import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "The ATS score feature helped me optimize my resume. I got callbacks from 5 companies within two weeks!",
    author: "Priya Sharma",
    role: "Software Engineer @ Google",
  },
  {
    quote:
      "Interview prep questions were spot-on for my Amazon SDE interview. The AI-generated hints were incredibly helpful.",
    author: "Rahul Verma",
    role: "SDE @ Amazon",
  },
  {
    quote:
      "The career roadmap gave me clarity on what to learn. I went from confused to confident in my placement prep.",
    author: "Ananya Patel",
    role: "Full Stack Developer @ Microsoft",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by Students
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            See what students say about their placement success with PlacementAI.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card key={item.author}>
              <CardContent>
                <p className="text-slate-300">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <p className="font-medium text-white">{item.author}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
