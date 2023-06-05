library("ggplot2")


# Load data
# Create plot object
gapminder <- read.csv(file = "data/uk.csv", stringsAsFactors = TRUE)

lifeExp.plot <- ggplot(data = gapminder, 
  mapping = aes(x = year, y = gdpPercap)) +
  geom_point() +
  scale_y_log10() +
  geom_line() +
  geom_quantile()

# Draw plot
print(lifeExp.plot) 
ggsave("C:/Users/sking/violin.png", plot = lifeExp.plot, width = 10, height = 10, dpi = 300)