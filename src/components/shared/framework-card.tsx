import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { FrameworkInfo } from "@/types/frameworks";

interface FrameworkCardProps {
  framework: FrameworkInfo;
}

export function FrameworkCard({ framework }: FrameworkCardProps) {
  const Icon = framework.icon;

  return (
    <Link href={`/${framework.slug}`}>
      <Card className="group cursor-pointer h-full transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
        <CardHeader className="space-y-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${framework.color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color: framework.color }} />
          </div>
          <CardTitle className="text-lg">{framework.name}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {framework.description}
          </CardDescription>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {framework.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
