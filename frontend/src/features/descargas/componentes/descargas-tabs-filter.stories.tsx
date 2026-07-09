import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescargasTabsFilter } from "./descargas-tabs-filter";

const meta: Meta<typeof DescargasTabsFilter> = {
  title: "Features/Descargas/DescargasTabsFilter",
  component: DescargasTabsFilter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeTab: "Todos",
    onTabChange: (tab) => console.log("Tab", tab),
    ageFilter: "Todas las edades",
    onAgeChange: (age) => console.log("Age", age),
    sortOrder: "Más recientes",
    onSortChange: (sort) => console.log("Sort", sort),
    searchQuery: "",
    onSearchChange: (search) => console.log("Search", search),
  },
};
