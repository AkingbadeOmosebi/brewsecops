import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import latteArt from "@/assets/latte-art.jpg";
import pourOver from "@/assets/pour-over.jpg";
import espresso from "@/assets/espresso.jpg";
import coldBrew from "@/assets/cold-brew.jpg";

const menuItems = [
  {
    name: "Classic Latte",
    description: "Silky steamed milk with a double shot of espresso, finished with beautiful latte art.",
    price: "$5.50",
    image: latteArt,
    category: "Hot",
  },
  {
    name: "Pour Over",
    description: "Single-origin beans brewed to perfection, highlighting delicate flavor notes.",
    price: "$6.00",
    image: pourOver,
    category: "Hot",
  },
  {
    name: "Espresso",
    description: "Bold and rich double shot with a beautiful golden crema.",
    price: "$3.50",
    image: espresso,
    category: "Hot",
  },
  {
    name: "Cold Brew",
    description: "Smooth, slow-steeped coffee served over ice for a refreshing finish.",
    price: "$5.00",
    image: coldBrew,
    category: "Cold",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function MenuSection() {
  return (
    <section id="menu" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium mb-2 block">Our Offerings</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Signature Drinks
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every cup tells a story. Explore our carefully curated menu of specialty coffees.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {menuItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Card className="group overflow-hidden bg-card border-0 shadow-soft hover:shadow-elevated transition-all duration-500 h-full">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <span className="text-accent font-bold text-lg">{item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
