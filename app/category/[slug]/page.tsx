import { notFound } from 'next/navigation';
import { categories } from '@/lib/data';
import { getProductsByCategory, getCategoryFilters } from '@/lib/categoryData';
import { ProductGrid } from '@/components/category/ProductGrid';
import { CategoryFilters } from '@/components/category/CategoryFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid2x2 as Grid, List, Import as SortAsc, Dessert as SortDesc } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = categories.find((cat) => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - SIBN Ecommerce`,
    description: `Browse ${category.name} on SIBN Ecommerce. Find the best deals and latest listings.`,
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = categories.find((cat) => cat.slug === params.slug);
  const products = getProductsByCategory(params.slug, searchParams);
  const filters = getCategoryFilters(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Find the best {category.name.toLowerCase()} deals in Sri Lanka
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {products.length} Products Available
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Verified Sellers
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Best Prices Guaranteed
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <CategoryFilters
              categorySlug={params.slug}
              filters={filters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {products.length} {category.name} Found
                  </h2>
                  <p className="text-sm text-gray-600">
                    Showing results for {category.name.toLowerCase()} in Sri Lanka
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-r-none border-r"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort Dropdown */}
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} />

            {/* Load More */}
            {products.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" className="px-8">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}