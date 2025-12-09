import { DollarSign, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "+50K",
    label: "URLs Scanned",
  },
  {
    icon: Users,
    value: "+12K",
    label: "Active users",
  },
  {
    icon: TrendingUp,
    value: "+98%",
    label: "Accuracy",
  },
];

export const StatsBar = () => {
  return (
    <div className="flex items-center gap-8 pt-12">
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-icon">
            <stat.icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
          {index < stats.length - 1 && (
            <div className="hidden md:block w-px h-10 bg-border/50 ml-8" />
          )}
        </div>
      ))}
    </div>
  );
};
