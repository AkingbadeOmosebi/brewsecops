import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Coffee, Star } from "lucide-react";

const plans = [
  {
    name: "Coffee Lover",
    price: "$29",
    period: "/month",
    description: "Perfect for casual coffee enthusiasts",
    features: [
      "4 bags of single-origin beans",
      "Free shipping",
      "Access to brewing guides",
      "Monthly flavor notes card",
    ],
    popular: false,
  },
  {
    name: "Barista Pro",
    price: "$49",
    period: "/month",
    description: "For the true coffee connoisseur",
    features: [
      "6 bags of premium beans",
      "Free priority shipping",
      "Exclusive blend access",
      "Virtual barista sessions",
      "Brewing equipment discounts",
    ],
    popular: true,
  },
  {
    name: "Café Owner",
    price: "$99",
    period: "/month",
    description: "Bulk orders for businesses",
    features: [
      "12 bags of wholesale beans",
      "Same-day delivery",
      "Custom blend creation",
      "Staff training sessions",
      "Equipment maintenance",
      "Priority support",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium mb-2 block">Subscription Plans</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Coffee Delivered Monthly
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join our coffee club and never run out of your favorite beans.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full shadow-glow">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}
              <Card
                className={`h-full transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-accent shadow-glow scale-105"
                    : "border border-border shadow-soft hover:shadow-elevated"
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <span className="font-display text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "accent" : "outline"}
                    className="w-full"
                    size="lg"
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
