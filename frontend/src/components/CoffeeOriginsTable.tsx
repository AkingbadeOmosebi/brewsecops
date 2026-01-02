import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const coffeeOrigins = [
  {
    origin: "Ethiopia Yirgacheffe",
    region: "Africa",
    altitude: "1,700 - 2,200m",
    process: "Washed",
    flavor: "Floral, Citrus, Tea-like",
    roast: "Light",
  },
  {
    origin: "Colombia Huila",
    region: "South America",
    altitude: "1,500 - 2,000m",
    process: "Washed",
    flavor: "Caramel, Red Apple, Chocolate",
    roast: "Medium",
  },
  {
    origin: "Brazil Cerrado",
    region: "South America",
    altitude: "900 - 1,200m",
    process: "Natural",
    flavor: "Nutty, Chocolate, Low Acidity",
    roast: "Medium-Dark",
  },
  {
    origin: "Guatemala Antigua",
    region: "Central America",
    altitude: "1,500 - 1,700m",
    process: "Washed",
    flavor: "Chocolate, Spice, Smoky",
    roast: "Medium",
  },
  {
    origin: "Indonesia Sumatra",
    region: "Asia-Pacific",
    altitude: "1,000 - 1,500m",
    process: "Wet-Hulled",
    flavor: "Earthy, Herbal, Full Body",
    roast: "Dark",
  },
  {
    origin: "Kenya AA",
    region: "Africa",
    altitude: "1,400 - 2,000m",
    process: "Washed",
    flavor: "Berry, Wine, Bright Acidity",
    roast: "Light-Medium",
  },
];

const roastColors: Record<string, string> = {
  Light: "bg-amber-glow/20 text-amber-glow border-amber-glow/30",
  "Light-Medium": "bg-amber/20 text-amber border-amber/30",
  Medium: "bg-mocha/20 text-mocha border-mocha/30",
  "Medium-Dark": "bg-espresso-light/20 text-espresso-light border-espresso-light/30",
  Dark: "bg-espresso/20 text-foreground border-espresso/30",
};

export function CoffeeOriginsTable() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium mb-2 block">Bean Origins</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Single Origins
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Sourced directly from the world's finest coffee-growing regions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-xl shadow-elevated overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5 hover:bg-primary/5">
                  <TableHead className="font-display font-semibold text-foreground">Origin</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Region</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Altitude</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Process</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Flavor Notes</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Roast Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coffeeOrigins.map((coffee, index) => (
                  <TableRow
                    key={coffee.origin}
                    className="transition-colors hover:bg-accent/5"
                  >
                    <TableCell className="font-semibold text-foreground">{coffee.origin}</TableCell>
                    <TableCell className="text-muted-foreground">{coffee.region}</TableCell>
                    <TableCell className="text-muted-foreground">{coffee.altitude}</TableCell>
                    <TableCell className="text-muted-foreground">{coffee.process}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs">{coffee.flavor}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${roastColors[coffee.roast]} border`}
                      >
                        {coffee.roast}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
